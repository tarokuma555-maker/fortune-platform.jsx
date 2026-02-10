import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith("sk_test_placeholder")) {
    return NextResponse.json(
      { error: "Stripeが設定されていません。STRIPE_SECRET_KEYを設定してください。" },
      { status: 503 }
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId || priceId.startsWith("price_placeholder")) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_IDが設定されていません。" },
      { status: 503 }
    );
  }

  try {
    const { returnUrl, email } = await request.json();
    const session = await auth();
    const customerEmail = session?.user?.email || email;

    const params = {
      mode: "subscription",
      "payment_method_types[0]": "card",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: returnUrl,
    };
    if (customerEmail) {
      params.customer_email = customerEmail;
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: "チェックアウトセッションの作成に失敗しました", detail: data.error?.message || JSON.stringify(data) },
        { status: res.status }
      );
    }

    return NextResponse.json({ url: data.url, sessionId: data.id });
  } catch (err) {
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました", detail: err.message },
      { status: 500 }
    );
  }
}
