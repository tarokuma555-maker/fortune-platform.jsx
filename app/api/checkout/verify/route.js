import { NextResponse } from "next/server";

const STRIPE_API = "https://api.stripe.com/v1";

async function stripeGet(path, secretKey) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { "Authorization": `Bearer ${secretKey}` },
  });
  return res.json();
}

async function stripeList(path, params, secretKey) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${STRIPE_API}${path}?${qs}`, {
    headers: { "Authorization": `Bearer ${secretKey}` },
  });
  return res.json();
}

export async function POST(request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith("sk_test_placeholder")) {
    return NextResponse.json({ active: true, reason: "stripe_not_configured" });
  }

  try {
    const { sessionId, email } = await request.json();

    if (sessionId) {
      const session = await stripeGet(`/checkout/sessions/${sessionId}`, secretKey);
      if (session.payment_status === "paid" && session.subscription) {
        const subscription = await stripeGet(`/subscriptions/${session.subscription}`, secretKey);
        if (subscription.status === "active" || subscription.status === "trialing") {
          const customer = await stripeGet(`/customers/${session.customer}`, secretKey);
          return NextResponse.json({
            active: true,
            email: customer.email,
            subscriptionId: subscription.id,
          });
        }
      }
      return NextResponse.json({ active: false });
    }

    if (email) {
      const customers = await stripeList("/customers", { email, limit: "1" }, secretKey);
      if (customers.data && customers.data.length > 0) {
        const subscriptions = await stripeList("/subscriptions", {
          customer: customers.data[0].id,
          status: "active",
          limit: "1",
        }, secretKey);
        if (subscriptions.data && subscriptions.data.length > 0) {
          return NextResponse.json({
            active: true,
            email,
            subscriptionId: subscriptions.data[0].id,
          });
        }
      }
      return NextResponse.json({ active: false });
    }

    return NextResponse.json({ active: false, reason: "no_identifier" });
  } catch (err) {
    return NextResponse.json(
      { error: "検証に失敗しました", detail: err.message },
      { status: 500 }
    );
  }
}
