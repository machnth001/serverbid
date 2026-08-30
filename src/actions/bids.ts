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
// processSuccessfulBid — Called by webhook or redirect verify after payment confirmed
// ============================================================
export async function processSuccessfulBid(
  slotId: number,
  amount: number,
  bidderInfo: Bidder,
  paymentId: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string; slot?: Slot }> {
  const admin = createAdminClient();

  // 1. Get current slot
  const { data: currentSlot, error: fetchError } = await admin
    .from("slots")
    .select("*")
    .eq("id", slotId)
    .single();

  if (fetchError) {
    console.error("processSuccessfulBid fetch slot error:", fetchError);
  }

  const slot = currentSlot as Slot | null;

  // 2. Validate bid is still valid (only guard against lower bids when slot is already held)
  if (slot && slot.status !== "empty" && Number(slot.current_bid) >= Number(amount)) {
    return {
      success: false,
      error: `Bid amount $${amount} is not higher than current bid $${slot.current_bid}.`,
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

  // 5. Update slot with new holder
  const updatedHolder = {
    ...bidderInfo,
    bid_at: new Date().toISOString(),
  };

  const updatedSlotData = {
    current_bid: amount,
    current_holder: updatedHolder,
    status: "hot" as const,
    bid_deadline: bidDeadline ?? slot?.bid_deadline ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedSlotResult, error: slotError } = await admin
    .from("slots")
    .update(updatedSlotData)
    .eq("id", slotId)
    .select("*")
    .single();

  if (slotError) {
    console.error("processSuccessfulBid slotError:", slotError);
    return { success: false, error: slotError.message };
  }

  // 6. Insert bid history record
  await admin.from("bid_history").insert({
    slot_id: slotId,
    bidder_name: bidderInfo.name,
    bidder_handle: bidderInfo.handle,
    bidder_logo: bidderInfo.logo_url,
    amount,
    payment_id: paymentId,
  });

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
    .eq("slot_id", slotId)
    .eq("status", "pending");

  return {
    success: true,
    slot: (updatedSlotResult as Slot) || {
      id: slotId,
      tier: slotId === 1 ? "master" : "blade",
      ...updatedSlotData,
      created_at: slot?.created_at || new Date().toISOString(),
    },
  };
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
