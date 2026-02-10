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

    const { system, messages } = await request.json();
    const email = session.user.email;

    // サーバーサイドのサブスクリプション検証（Stripe設定済みの場合のみ）
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.startsWith("sk_test_placeholder")) {
      try {
        const custRes = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
          headers: { "Authorization": `Bearer ${stripeKey}` },
        });
        const customers = await custRes.json();
        if (!customers.data || customers.data.length === 0) {
          return NextResponse.json({ error: "有効なサブスクリプションが見つかりません" }, { status: 403 });
        }
        const subsRes = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${customers.data[0].id}&status=active&limit=1`, {
          headers: { "Authorization": `Bearer ${stripeKey}` },
        });
        const subs = await subsRes.json();
        if (!subs.data || subs.data.length === 0) {
          return NextResponse.json({ error: "有効なサブスクリプションが見つかりません" }, { status: 403 });
        }
      } catch {
        // Stripe検証失敗時はアクセスを許可（fail-open）
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
