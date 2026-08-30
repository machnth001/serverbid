"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Slot,
  BidHistoryItem,
  Bidder,
  SLOT_CONFIG,
  getMinimumBid,
} from "@/types";

// ============================================================
// getSlots — Fetch all 12 slots (Server Component use)
// ============================================================
export async function getSlots(): Promise<Slot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slots")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("getSlots error:", error);
    return [];
  }

  return data as Slot[];
}

// ============================================================
// getBidHistory — Fetch bid history for a slot
// ============================================================
export async function getBidHistory(
  slotId: number,
  limit = 10
): Promise<BidHistoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bid_history")
    .select("*")
    .eq("slot_id", slotId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getBidHistory error:", error);
    return [];
  }

  return data as BidHistoryItem[];
}

// ============================================================
// getRecentActivity — Last 20 bids across all slots
// ============================================================
export async function getRecentActivity(limit = 20): Promise<BidHistoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bid_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentActivity error:", error);
    return [];
  }

  return data as BidHistoryItem[];
}

// ============================================================
// processSuccessfulBid — Called by webhook after payment confirmed
// ============================================================
export async function processSuccessfulBid(
  slotId: number,
  amount: number,
  bidderInfo: Bidder,
  paymentId: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  const admin = createAdminClient();

  // 0. Check if this payment or session was already processed
  const { data: existingPayment } = await admin
    .from("bid_history")
    .select("id")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (existingPayment) {
    return { success: true };
  }

  // 1. Get current slot to record outbid
  const { data: currentSlot } = await admin
    .from("slots")
    .select("*")
    .eq("id", slotId)
    .single();

  const slot = currentSlot as Slot | null;

  // 2. Validate bid is still valid (race condition guard)
  if (slot && slot.current_bid >= amount) {
    return {
      success: false,
      error: "Bid amount is no longer sufficient — another bid came in faster.",
    };
  }

  // 3. Anti-snipe: extend deadline if in final window
  let bidDeadline: string | null = null;
  if (slot?.bid_deadline) {
    const deadline = new Date(slot.bid_deadline);
    const now = new Date();
    const msToDeadline = deadline.getTime() - now.getTime();
    const snipeWindowMs =
      SLOT_CONFIG.ANTI_SNIPE_WINDOW_MINUTES * 60 * 1000;

    if (msToDeadline > 0 && msToDeadline < snipeWindowMs) {
      // Extend by ANTI_SNIPE_EXTENSION_MINUTES
      const extended = new Date(
        now.getTime() +
          SLOT_CONFIG.ANTI_SNIPE_EXTENSION_MINUTES * 60 * 1000
      );
      bidDeadline = extended.toISOString();
    }
  }

  // 4. Record the outbid on current holder's history entry
  if (slot?.current_holder) {
    await admin
      .from("bid_history")
      .update({ outbid_at: new Date().toISOString() })
      .eq("slot_id", slotId)
      .is("outbid_at", null);
  }

  // 5. Upsert slot with new holder
  const { error: slotError } = await admin
    .from("slots")
    .update({
      current_bid: amount,
      current_holder: {
        ...bidderInfo,
        bid_at: new Date().toISOString(),
      },
      status: "hot",
      bid_deadline: bidDeadline ?? slot?.bid_deadline ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", slotId);

  if (slotError) {
    console.error("processSuccessfulBid slotError:", slotError);
    return { success: false, error: slotError.message };
  }

  // 6. Insert bid history record
  const { error: historyError } = await admin.from("bid_history").insert({
    slot_id: slotId,
    bidder_name: bidderInfo.name,
    bidder_handle: bidderInfo.handle,
    bidder_logo: bidderInfo.logo_url,
    amount,
    payment_id: paymentId,
  });

  if (historyError) {
    console.error("processSuccessfulBid historyError:", historyError);
    // Non-fatal — slot already updated
  }

  // 7. Mark pending bid as paid
  if (sessionId) {
    await admin
      .from("pending_bids")
      .update({ status: "paid" })
      .eq("checkout_session_id", sessionId);
  }
  await admin
    .from("pending_bids")
    .update({ status: "paid" })
    .eq("checkout_session_id", paymentId);

  return { success: true };
}

// ============================================================
// validateBidAmount — Validate min bid server-side
// ============================================================
export async function validateBidAmount(
  slotId: number,
  amount: number
): Promise<{ valid: boolean; minimumBid: number; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slots")
    .select("*")
    .eq("id", slotId)
    .single();

  if (error || !data) {
    return { valid: false, minimumBid: 0, error: "Slot not found" };
  }

  const slot = data as Slot;
  const minimumBid = getMinimumBid(slot);

  if (amount < minimumBid) {
    return {
      valid: false,
      minimumBid,
      error: `Minimum bid is $${minimumBid.toFixed(2)}`,
    };
  }

  return { valid: true, minimumBid };
}
