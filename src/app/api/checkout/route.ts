import { NextRequest, NextResponse } from "next/server";
import { getDodoClient } from "@/lib/dodo";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateBidAmount } from "@/actions/bids";
import { BidFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const dodo = getDodoClient();
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

    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    const slot1Product = process.env.DODO_SLOT1_PRODUCT_ID;
    const bladeProduct = process.env.DODO_BLADE_PRODUCT_ID;

    if (
      !apiKey ||
      apiKey === "your_dodo_payments_api_key" ||
      apiKey.includes("your_")
    ) {
      return NextResponse.json(
        {
          error:
            "Dodo Payments API Key is not configured yet. Please add your DODO_PAYMENTS_API_KEY in .env.local / Vercel.",
        },
        { status: 400 }
      );
    }

    const productId = slot_id === 1 ? slot1Product : bladeProduct;

    if (!productId || productId.includes("your_")) {
      return NextResponse.json(
        {
          error: `Dodo Product ID for Slot #${slot_id} is missing in .env.local / Vercel.`,
        },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Dodo Payments limits metadata key/value strings to <= 500 chars.
    // If the bidder uploaded a base64 image or a long URL, do not send it in Dodo metadata.
    // The full bidder_info is stored in the Supabase pending_bids table.
    const safeLogo =
      bidder_info.logo_url &&
      bidder_info.logo_url.length <= 400 &&
      !bidder_info.logo_url.startsWith("data:")
        ? bidder_info.logo_url
        : "";

    // Create Dodo Payments checkout session
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      // Do NOT use payment_link:true — it shows Dodo's own order summary and doesn't redirect.
      // Use a hosted checkout session with success_url instead.
      success_url: `${siteUrl}/?payment=success&slot=${slot_id}&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?payment=cancelled&slot=${slot_id}`,
      metadata: {
        slot_id: String(slot_id),
        amount: String(amount),
        bidder_name: (bidder_info.name || "").slice(0, 100),
        bidder_handle: (bidder_info.handle || "").slice(0, 100),
        bidder_logo: safeLogo,
        bidder_company_url: (bidder_info.company_url || "").slice(0, 400),
      },
    } as Parameters<typeof dodo.checkoutSessions.create>[0]);

    const sessionId =
      session.session_id ||
      (session as { id?: string }).id ||
      `session_${Date.now()}`;

    // Dodo returns checkout_url for hosted checkout sessions
    const checkoutUrl =
      session.checkout_url ||
      (session as { payment_link?: string }).payment_link ||
      (session as { url?: string }).url;

    if (!checkoutUrl) {
      console.error("No checkout URL returned from Dodo. Session response:", JSON.stringify(session));
      return NextResponse.json(
        { error: "Failed to generate checkout URL. Please check Dodo Product ID and API key." },
        { status: 500 }
      );
    }

    // Store pending bid in database
    const admin = createAdminClient();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await admin.from("pending_bids").insert({
      slot_id,
      amount,
      bidder_info,
      checkout_session_id: sessionId,
      expires_at: expiresAt,
      status: "pending",
    });

    console.log(`[Checkout] Created session ${sessionId} for slot #${slot_id}, URL: ${checkoutUrl}`);

    return NextResponse.json({
      checkout_url: checkoutUrl,
      session_id: sessionId,
    });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const errorMessage =
      (error as { message?: string })?.message ||
      "Failed to create checkout session with Dodo Payments. Check your Product ID and API Key.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
