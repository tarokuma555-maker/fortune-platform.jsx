import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ active: true, reason: "stripe_not_configured" });
  }

  try {
    const { sessionId, email } = await request.json();
    const stripe = getStripe();

    if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        if (subscription.status === "active" || subscription.status === "trialing") {
          const customer = await stripe.customers.retrieve(session.customer);
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
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        const subscriptions = await stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: "active",
          limit: 1,
        });
        if (subscriptions.data.length > 0) {
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
