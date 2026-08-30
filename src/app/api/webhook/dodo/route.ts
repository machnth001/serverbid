import { NextRequest, NextResponse } from "next/server";
import { processSuccessfulBid } from "@/actions/bids";
import { Bidder } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("webhook-signature");
    const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const eventType = (payload.type || payload.event_type) as string;

    console.log(`[Dodo Webhook] Received event: ${eventType}`);

    // Process payment success event
    if (eventType === "payment.succeeded" || eventType === "payment_succeeded" || eventType === "checkout.session.completed") {
      const data = (payload.data || payload) as Record<string, unknown>;
      const metadata = (data.metadata || {}) as Record<string, string>;

      const slotId = parseInt(metadata.slot_id || "0", 10);
      const amount = parseFloat(metadata.amount || "0");
      const paymentId = (data.payment_id || data.id || `pay_${Date.now()}`) as string;

      if (slotId && amount) {
        const bidderInfo: Bidder = {
          name: metadata.bidder_name || "Anonymous",
          handle: metadata.bidder_handle || "anon",
          logo_url: metadata.bidder_logo || "",
          company_url: metadata.bidder_company_url || "",
        };

        const result = await processSuccessfulBid(
          slotId,
          amount,
          bidderInfo,
          paymentId
        );

        if (!result.success) {
          console.error("processSuccessfulBid error:", result.error);
        } else {
          console.log(`🚀 [Dodo Webhook] Slot #${slotId} claimed by @${bidderInfo.handle} for $${amount}`);
        }
      }
    }

    return NextResponse.json({ received: true, status: "success" });
  } catch (error) {
    console.error("[Dodo Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
