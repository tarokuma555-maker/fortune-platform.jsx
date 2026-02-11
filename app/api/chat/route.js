import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    // サーバーサイドセッション検証
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "認証が必要です。ログインしてください。" },
        { status: 401 }
      );
    }

    const { system, messages, subscriptionId } = await request.json();

    // サブスクリプション検証（PayPal Secretが設定されている場合）
    const paypalSecret = process.env.PAYPAL_SECRET;
    const paypalClientId = process.env.PAYPAL_CLIENT_ID || "AZfVV9yX7ICCelbYfJyHO7kV5bk026HXlBIxWnZk1E4yCZ6tBf7Fya6QeokmqWX8w1wquZW9FXpBj6G7";
    const paypalApi = process.env.PAYPAL_API_URL || "https://api-m.paypal.com";

    if (paypalSecret && subscriptionId) {
      try {
        const tokenRes = await fetch(`${paypalApi}/v1/oauth2/token`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });
        const tokenData = await tokenRes.json();

        const subRes = await fetch(`${paypalApi}/v1/billing/subscriptions/${subscriptionId}`, {
          headers: { "Authorization": `Bearer ${tokenData.access_token}` },
        });
        const sub = await subRes.json();

        if (sub.status !== "ACTIVE" && sub.status !== "APPROVED") {
          return NextResponse.json(
            { error: "有効なサブスクリプションが見つかりません" },
            { status: 403 }
          );
        }
      } catch {
        // PayPal検証失敗時はアクセスを許可（fail-open）
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, detail: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: err.message },
      { status: 500 }
    );
  }
}
