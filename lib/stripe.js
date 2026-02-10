import Stripe from "stripe";

let stripe = null;

export function getStripe() {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_test_placeholder")) {
    return null;
  }
  stripe = new Stripe(key);
  return stripe;
}

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && !key.startsWith("sk_test_placeholder");
}
