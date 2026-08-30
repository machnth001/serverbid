import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { createAdminClient } from "@/lib/supabase/admin";
import { processSuccessfulBid } from "@/actions/bids";
import { Bidder } from "@/types";

function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY || "";
  const envMode = process.env.DODO_PAYMENTS_ENVIRONMENT
    ? (process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode")
    : apiKey.startsWith("test_")
    ? "test_mode"
    : process.env.NODE_ENV === "production"
    ? "live_mode"
    : "test_mode";

  return new DodoPayments({
    bearerToken: apiKey,
    environment: envMode,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, slotId } = await request.json();

    if (!sessionId && !slotId) {
      return NextResponse.json(
        { error: "Missing session or slot id" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // 1. Look up pending bid in Supabase
    let pendingBid = null;

    if (sessionId && typeof sessionId === "string" && !sessionId.includes("{")) {
      const { data } = await admin
        .from("pending_bids")
        .select("*")
        .eq("checkout_session_id", sessionId)
        .maybeSingle();
      pendingBid = data;
    }

    if (!pendingBid && slotId) {
      const { data } = await admin
        .from("pending_bids")
        .select("*")
        .eq("slot_id", slotId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      pendingBid = data;
    }

    if (!pendingBid) {
      return NextResponse.json(
        { error: "Pending bid not found" },
        { status: 404 }
      );
    }

    // 2. If sessionId is valid, check with Dodo API
    let paymentId = `pay_${Date.now()}`;
    const targetSessionId =
      (typeof sessionId === "string" && !sessionId.includes("{") ? sessionId : "") ||
      pendingBid.checkout_session_id;

    if (targetSessionId && !targetSessionId.includes("{") && process.env.DODO_PAYMENTS_API_KEY) {
      try {
        const dodo = getDodoClient();
        const sessionStatus = await dodo.checkoutSessions.retrieve(targetSessionId);
        if (
          sessionStatus.payment_status === "succeeded" ||
          sessionStatus.payment_id
        ) {
          if (sessionStatus.payment_id) {
            paymentId = sessionStatus.payment_id;
          }
        }
      } catch (dodoErr) {
        console.warn("Could not retrieve session status from Dodo API directly:", dodoErr);
      }
    }

    const bidderInfo = pendingBid.bidder_info as Bidder;
    const targetSlotId = pendingBid.slot_id;
    const targetAmount = Number(pendingBid.amount);

    const result = await processSuccessfulBid(
      targetSlotId,
      targetAmount,
      bidderInfo,
      paymentId,
      targetSessionId
    );

    if (!result.success && result.error && !result.error.includes("already")) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      slot_id: targetSlotId,
      amount: targetAmount,
      bidder: bidderInfo,
    });
  } catch (error) {
    console.error("Verify checkout error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Verification failed" },
      { status: 500 }
    );
  }
}
