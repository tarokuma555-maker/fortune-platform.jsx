"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Card from "./Card";
import PaywallScreen from "./PaywallScreen";
import { buildFortuneSummaryWithAI } from "@/lib/calculations";
import { getSubscriptionData, saveSubscriptionData, clearSubscriptionData, needsReverification } from "@/lib/subscription";

export default function AiChat({ results }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("checking");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const scrollRef = useRef(null);
  const fortuneSummary = buildFortuneSummaryWithAI(results);

  // サブスクリプション状態の確認
  useEffect(() => {
    async function checkSubscription() {
      const email = session?.user?.email;
      if (!email) {
        setSubscriptionStatus("inactive");
        return;
      }
      // localStorageキャッシュを確認
      const data = getSubscriptionData();
      if (data && data.email === email && !needsReverification(data)) {
        setSubscriptionStatus("active");
        return;
      }
      // サーバーで検証
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result = await res.json();
        if (result.active) {
          saveSubscriptionData({ email, subscriptionId: result.subscriptionId, verifiedAt: Date.now() });
          setSubscriptionStatus("active");
        } else {
          clearSubscriptionData();
          setSubscriptionStatus("inactive");
        }
      } catch {
        setSubscriptionStatus(data?.email ? "active" : "inactive");
      }
    }
    checkSubscription();
  }, [session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubscribe = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.origin, email: session?.user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "チェックアウトの作成に失敗しました");
        setCheckoutLoading(false);
      }
    } catch {
      alert("通信エラーが発生しました");
      setCheckoutLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const systemPrompt = `あなたは「Fortune Oracle」の占い師AIです。ユーザーの占い結果に基づいて、質問に答えたり、アドバイスをしたりしてください。
温かく、前向きで、具体的なアドバイスを心がけてください。占い結果を踏まえた上で、実践的な行動提案も含めてください。
絵文字を適度に使い、親しみやすい口調で話してください。回答は300文字以内で簡潔にまとめてください。

【このユーザーの占い結果】
${fortuneSummary}`;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          messages: apiMessages,
          email: session?.user?.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");
      const reply = data.content?.map(c => c.text || "").join("") || "申し訳ありません、回答を生成できませんでした。もう一度お試しください。";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ 通信エラーが発生しました。しばらく待ってからもう一度お試しください。" }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "今月の運勢を教えて",
    "仕事運を詳しく知りたい",
    "恋愛でアドバイスほしい",
    "自分の強みの活かし方は？",
    "今注意すべきことは？",
    "開運アクションを教えて",
  ];

  // サブスクリプション確認中
  if (subscriptionStatus === "checking") {
    return (
      <Card delay={0.1}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 36, animation: "pulse 2s ease infinite" }}>🔮</div>
          <p style={{ color: "#aaa", fontSize: 14, marginTop: 12 }}>確認中...</p>
        </div>
      </Card>
    );
  }

  // 未購読 → ペイウォール表示
  if (subscriptionStatus === "inactive") {
    return <PaywallScreen onSubscribe={handleSubscribe} loading={checkoutLoading} />;
  }

  // アクティブ → チャットUI
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)", maxHeight: 600 }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" }}>
        {messages.length === 0 && (
          <Card delay={0.1}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 8, animation: "pulse 2s ease infinite" }}>🤖✨</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 18, fontFamily: "'Noto Serif JP', serif", marginBottom: 8 }}>AI占い相談</h3>
              <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7 }}>
                あなたの10種類の占い結果をすべて把握しています。<br />
                気になることを何でも聞いてください！
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); }}
                  style={{
                    padding: "6px 12px", borderRadius: 16,
                    background: "rgba(206,147,216,0.1)", border: "1px solid rgba(206,147,216,0.25)",
                    color: "#CE93D8", fontSize: 12, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.background = "rgba(206,147,216,0.2)"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(206,147,216,0.1)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
              animation: "fadeSlideUp 0.3s ease both",
            }}
          >
            <div style={{
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, #7B1FA2, #4527A0)"
                : "rgba(255,255,255,0.08)",
              border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.1)",
              color: msg.role === "user" ? "white" : "#ddd",
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {msg.role === "assistant" && (
                <div style={{ fontSize: 11, color: "#CE93D8", marginBottom: 4, fontWeight: 600 }}>🔮 Fortune Oracle AI</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div style={{
              padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#CE93D8", fontWeight: 600 }}>🔮 Fortune Oracle AI</div>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#CE93D8",
                    animation: `bounce 1.4s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: "flex", gap: 8, padding: "12px 0",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="占い結果について質問..."
          style={{
            flex: 1, padding: "12px 16px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24, color: "white", fontSize: 14, outline: "none",
            fontFamily: "'Noto Sans JP', sans-serif",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: input.trim() && !loading ? "linear-gradient(135deg, #7B1FA2, #4527A0)" : "rgba(255,255,255,0.08)",
            border: "none", color: "white", fontSize: 18,
            cursor: input.trim() && !loading ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
