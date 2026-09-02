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
// ============================================================
// processSuccessfulBid — Called by webhook or redirect verify after payment confirmed
// Cascades and shifts companies down in descending order of bid valuation
// ============================================================
export async function processSuccessfulBid(
  slotId: number,
  amount: number,
  bidderInfo: Bidder,
  paymentId: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string; slot?: Slot; slots?: Slot[] }> {
  const admin = createAdminClient();

  // 1. Fetch all 12 slots from the database
  const { data: allSlots, error: fetchError } = await admin
    .from("slots")
    .select("*")
    .order("id", { ascending: true });

  if (fetchError || !allSlots) {
    console.error("processSuccessfulBid fetch slots error:", fetchError);
    return { success: false, error: "Failed to fetch server slots." };
  }

  const currentSlotList = allSlots as Slot[];
  const targetSlot = currentSlotList.find((s) => s.id === slotId);

  // 2. Validate bid is higher than the slot target's current bid (if held)
  if (
    targetSlot &&
    targetSlot.status !== "empty" &&
    Number(targetSlot.current_bid) >= Number(amount)
  ) {
    return {
      success: false,
      error: `Bid amount $${amount} is not higher than current bid $${targetSlot.current_bid}.`,
    };
  }

  // 3. Anti-snipe: extend deadline if in final window
  let bidDeadline: string | null = null;
  if (targetSlot?.bid_deadline) {
    const deadline = new Date(targetSlot.bid_deadline);
    const now = new Date();
    const msToDeadline = deadline.getTime() - now.getTime();
    const snipeWindowMs = SLOT_CONFIG.ANTI_SNIPE_WINDOW_MINUTES * 60 * 1000;

    if (msToDeadline > 0 && msToDeadline < snipeWindowMs) {
      const extended = new Date(
        now.getTime() + SLOT_CONFIG.ANTI_SNIPE_EXTENSION_MINUTES * 60 * 1000
      );
      bidDeadline = extended.toISOString();
    }
  }

  if (!bidDeadline) {
    bidDeadline = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  }

  // 4. Clean handles and build active entries list
  const cleanHandle = (h?: string) =>
    (h || "").toLowerCase().replace(/^@/, "").trim();
  const newCleanHandle = cleanHandle(bidderInfo.handle);

  const updatedHolder: Bidder = {
    ...bidderInfo,
    handle: bidderInfo.handle ? bidderInfo.handle.replace(/^@/, "").trim() : "anon",
    bid_at: new Date().toISOString(),
  };

  interface ActiveEntry {
    holder: Bidder;
    amount: number;
    bid_deadline: string | null;
    isNew?: boolean;
    originalSlotId?: number;
  }

  const activeEntries: ActiveEntry[] = [];

  // Collect all currently active holders (excluding if same company upgrades their bid)
  for (const s of currentSlotList) {
    if (s.status !== "empty" && s.current_holder && Number(s.current_bid) > 0) {
      const existingHandle = cleanHandle(s.current_holder.handle);
      if (existingHandle && existingHandle === newCleanHandle) {
        // Same company upgrading their bid: exclude previous lower entry
        continue;
      }

      activeEntries.push({
        holder: s.current_holder,
        amount: Number(s.current_bid),
        bid_deadline: s.bid_deadline,
        originalSlotId: s.id,
      });
    }
  }

  // Add the newly incoming bid
  activeEntries.push({
    holder: updatedHolder,
    amount: Number(amount),
    bid_deadline: bidDeadline,
    isNew: true,
    originalSlotId: slotId,
  });

  // Sort all entries strictly in DESCENDING order of bid amount
  activeEntries.sort((a, b) => {
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    // Tie breaker: newer bid wins higher rank
    const timeA = a.holder.bid_at ? new Date(a.holder.bid_at).getTime() : 0;
    const timeB = b.holder.bid_at ? new Date(b.holder.bid_at).getTime() : 0;
    return timeB - timeA;
  });

  // 5. Assign entries into Top 12 Slots (cascade & rank down)
  const updatedSlotsToSave: Slot[] = [];
  const displacedEntries: ActiveEntry[] = [];

  if (activeEntries.length > 12) {
    for (let j = 12; j < activeEntries.length; j++) {
      displacedEntries.push(activeEntries[j]);
    }
  }

  let assignedSlotIdForNewBid = slotId;

  for (let i = 0; i < 12; i++) {
    const currentId = i + 1;
    const tier: "master" | "blade" = currentId === 1 ? "master" : "blade";
    const existingSlot = currentSlotList.find((s) => s.id === currentId);

    if (i < activeEntries.length && i < 12) {
      const entry = activeEntries[i];
      if (entry.isNew) {
        assignedSlotIdForNewBid = currentId;
      }

      updatedSlotsToSave.push({
        id: currentId,
        tier,
        current_bid: entry.amount,
        current_holder: entry.holder,
        status: entry.isNew ? "hot" : "active",
        bid_deadline: entry.bid_deadline ?? existingSlot?.bid_deadline ?? null,
        created_at: existingSlot?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      // Empty slot beyond occupied count
      updatedSlotsToSave.push({
        id: currentId,
        tier,
        current_bid: 0,
        current_holder: null,
        status: "empty",
        bid_deadline: null,
        created_at: existingSlot?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  // 6. Update all 12 slots in Supabase
  for (const updatedSlot of updatedSlotsToSave) {
    await admin
      .from("slots")
      .update({
        tier: updatedSlot.tier,
        current_bid: updatedSlot.current_bid,
        current_holder: updatedSlot.current_holder,
        status: updatedSlot.status,
        bid_deadline: updatedSlot.bid_deadline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", updatedSlot.id);
  }

  // 7. Mark displaced entries off the rack as outbid
  for (const displaced of displacedEntries) {
    if (displaced.holder.handle) {
      await admin
        .from("bid_history")
        .update({ outbid_at: new Date().toISOString() })
        .eq("bidder_handle", displaced.holder.handle.replace(/^@/, ""))
        .is("outbid_at", null);
    }
  }

  // Record outbid for target slot previous holder if occupied
  if (targetSlot?.current_holder) {
    await admin
      .from("bid_history")
      .update({ outbid_at: new Date().toISOString() })
      .eq("slot_id", slotId)
      .is("outbid_at", null);
  }

  // 8. Insert bid history record for the new bid
  await admin.from("bid_history").insert({
    slot_id: assignedSlotIdForNewBid,
    bidder_name: bidderInfo.name,
    bidder_handle: updatedHolder.handle,
    bidder_logo: bidderInfo.logo_url || null,
    amount,
    payment_id: paymentId,
  });

  // 9. Mark pending bids as paid
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

  const newlyWonSlot =
    updatedSlotsToSave.find((s) => s.id === assignedSlotIdForNewBid) ||
    updatedSlotsToSave[0];

  console.log(
    `🚀 [Leaderboard Shift] @${updatedHolder.handle} claimed Slot #${assignedSlotIdForNewBid} for $${amount}. Entire rack re-ordered descending.`
  );

  return {
    success: true,
    slot: newlyWonSlot,
    slots: updatedSlotsToSave,
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
