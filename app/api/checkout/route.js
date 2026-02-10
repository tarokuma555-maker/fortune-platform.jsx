import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripeが設定されていません。STRIPE_SECRET_KEYを設定してください。" },
      { status: 503 }
    );
  }

  try {
    const { returnUrl } = await request.json();
    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId || priceId.startsWith("price_placeholder")) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_IDが設定されていません。" },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました", detail: err.message },
      { status: 500 }
    );
  }
}
