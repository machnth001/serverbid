// ============================================================
// src/types/index.ts — App-level types
// ============================================================

export interface Bidder {
  name: string;
  handle: string; // Twitter handle without @
  logo_url: string;
  company_url: string;
  description?: string; // Startup tagline / pitch
  bid_at?: string; // ISO timestamp
}

export type SlotTier = "master" | "blade";
export type SlotStatus = "empty" | "active" | "hot";

export interface Slot {
  id: number;
  tier: SlotTier;
  current_bid: number;
  current_holder: Bidder | null;
  bid_deadline: string | null;
  status: SlotStatus;
  created_at: string;
  updated_at: string;
}

export interface BidHistoryItem {
  id: string;
  slot_id: number;
  bidder_name: string;
  bidder_handle: string;
  bidder_logo: string | null;
  amount: number;
  payment_id: string;
  outbid_at: string | null;
  created_at: string;
}

export interface PendingBid {
  id: string;
  slot_id: number;
  amount: number;
  bidder_info: Bidder;
  checkout_session_id: string;
  expires_at: string;
  status: "pending" | "paid" | "expired";
  created_at: string;
}

export interface BidFormData {
  slot_id: number;
  amount: number;
  bidder_info: Bidder;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
  error?: string;
}

export interface HotSwapEvent {
  slot_id: number;
  new_slot: Slot;
  previous_holder: Bidder | null;
}

export interface ActivityEvent {
  id: string;
  slot_id: number;
  bidder_name: string;
  bidder_handle: string;
  prev_holder?: string;
  amount: number;
  created_at: string;
}

// Slot configuration constants
export const SLOT_CONFIG = {
  MASTER_STARTING_BID: 10.0,
  BLADE_STARTING_BID: 5.0,
  MASTER_MIN_INCREMENT: 2.0,
  BLADE_MIN_INCREMENT: 1.0,
  ANTI_SNIPE_WINDOW_MINUTES: 5,
  ANTI_SNIPE_EXTENSION_MINUTES: 5,
} as const;

export function getMinimumBid(slot: Slot): number {
  if (slot.status === "empty") {
    return slot.tier === "master"
      ? SLOT_CONFIG.MASTER_STARTING_BID
      : SLOT_CONFIG.BLADE_STARTING_BID;
  }
  const increment =
    slot.tier === "master"
      ? SLOT_CONFIG.MASTER_MIN_INCREMENT
      : SLOT_CONFIG.BLADE_MIN_INCREMENT;
  return slot.current_bid + increment;
}

export function formatBid(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatSlotId(id: number): string {
  return `#${String(id).padStart(2, "0")}`;
}
