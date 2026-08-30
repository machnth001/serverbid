import { NextRequest, NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateBidAmount } from "@/actions/bids";
import { BidFormData } from "@/types";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment:
    process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
});

export async function POST(request: NextRequest) {
  try {
    const body: BidFormData = await request.json();
    const { slot_id, amount, bidder_info } = body;

    // Validate inputs
    if (!slot_id || !amount || !bidder_info?.name || !bidder_info?.handle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side bid validation
    const validation = await validateBidAmount(slot_id, amount);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: validation.error,
          minimumBid: validation.minimumBid,
        },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const slotLabel = slot_id === 1 ? "Master Node" : `Blade Slot #${String(slot_id).padStart(2, "0")}`;
    const productId =
      slot_id === 1
        ? process.env.DODO_SLOT1_PRODUCT_ID!
        : process.env.DODO_BLADE_PRODUCT_ID!;

    // Create Dodo Payments checkout session
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      payment_link: true,
      success_url: `${siteUrl}/?payment=success&slot=${slot_id}&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?payment=cancelled&slot=${slot_id}`,
      metadata: {
        slot_id: String(slot_id),
        amount: String(amount),
        bidder_name: bidder_info.name,
        bidder_handle: bidder_info.handle,
        bidder_logo: bidder_info.logo_url || "",
        bidder_company_url: bidder_info.company_url || "",
      },
    } as Parameters<typeof dodo.checkoutSessions.create>[0]);

    // Store pending bid in database
    const admin = createAdminClient();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await admin.from("pending_bids").insert({
      slot_id,
      amount,
      bidder_info,
      checkout_session_id: (session as { payment_link?: string; id?: string }).id || `session_${Date.now()}`,
      expires_at: expiresAt,
      status: "pending",
    });

    return NextResponse.json({
      checkout_url: (session as { payment_link?: string; url?: string }).payment_link || (session as { url?: string }).url,
      session_id: (session as { id?: string }).id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
