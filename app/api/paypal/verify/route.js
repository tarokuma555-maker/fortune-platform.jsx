import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "AZfVV9yX7ICCelbYfJyHO7kV5bk026HXlBIxWnZk1E4yCZ6tBf7Fya6QeokmqWX8w1wquZW9FXpBj6G7";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API_URL || "https://api-m.paypal.com";

async function getPayPalAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const { subscriptionId } = await request.json();
    if (!subscriptionId) {
      return NextResponse.json({ active: false, reason: "no_subscription_id" });
    }

    // PayPal Secretが未設定の場合はサブスクリプションIDがあればアクティブ扱い
    if (!PAYPAL_SECRET) {
      return NextResponse.json({ active: true, reason: "paypal_secret_not_configured" });
    }

    // PayPal APIでサブスクリプションステータスを確認
    const accessToken = await getPayPalAccessToken();
    const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    const subscription = await res.json();

    if (subscription.status === "ACTIVE" || subscription.status === "APPROVED") {
      return NextResponse.json({
        active: true,
        subscriptionId: subscription.id,
        status: subscription.status,
      });
    }

    return NextResponse.json({ active: false, status: subscription.status });
  } catch (err) {
    return NextResponse.json(
      { error: "検証に失敗しました", detail: err.message },
      { status: 500 }
    );
  }
}
