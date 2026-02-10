"use client";

import { useState } from "react";
import Card from "./Card";

const SQUARE_CHECKOUT_URL = "https://square.link/u/8NFtf79J?src=embd";

export default function PaywallScreen({ onSubscribed }) {
  const [step, setStep] = useState("initial"); // initial | confirm
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const openSquareCheckout = () => {
    window.open(SQUARE_CHECKOUT_URL, "_blank");
    setStep("confirm");
  };

  const handleSubmitOrder = () => {
    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("注文番号を入力してください");
      return;
    }
    if (trimmed.length < 6) {
      setError("正しい注文番号を入力してください");
      return;
    }
    if (onSubscribed) {
      onSubscribed(trimmed);
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <Card delay={0.1}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
          <h3 style={{
            color: "#E8D5B7", fontSize: 20,
            fontFamily: "'Noto Serif JP', serif", marginBottom: 8,
          }}>
            AI占い相談（プレミアム機能）
          </h3>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}>
            10種類の占い結果をもとに、AIがあなた専用の<br />
            アドバイスをリアルタイムでお届けします。
          </p>
        </div>

        <div style={{
          padding: 16, background: "rgba(206,147,216,0.08)",
          borderRadius: 12, border: "1px solid rgba(206,147,216,0.2)", marginBottom: 20,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#E8D5B7", fontFamily: "'Noto Serif JP', serif" }}>
              ¥980<span style={{ fontSize: 14, fontWeight: 400, color: "#aaa" }}>/月</span>
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>いつでもキャンセル可能</div>
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
          {[
            "無制限のAI占い相談",
            "10種類の鑑定結果に基づく個別アドバイス",
            "恋愛・仕事・金運の深掘り質問OK",
            "具体的な開運アクション提案",
          ].map((text, i) => (
            <li key={i} style={{
              padding: "8px 0", color: "#ccc", fontSize: 14,
              display: "flex", alignItems: "center", gap: 8,
              borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <span style={{ color: "#CE93D8" }}>✓</span> {text}
            </li>
          ))}
        </ul>

        {step === "initial" ? (
          <button
            onClick={openSquareCheckout}
            style={{
              width: "100%", padding: 16,
              background: "linear-gradient(135deg, #7B1FA2, #4527A0)",
              border: "none", borderRadius: 14, color: "white",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Noto Serif JP', serif", letterSpacing: 1,
              transition: "all 0.2s",
            }}
          >
            🔮 月額プランに登録する
          </button>
        ) : (
          <div>
            <div style={{
              padding: 14, marginBottom: 14,
              background: "rgba(206,147,216,0.08)",
              borderRadius: 10, border: "1px solid rgba(206,147,216,0.15)",
            }}>
              <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 8 }}>
                決済完了後の手順
              </div>
              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                1. Squareで決済を完了してください<br />
                2. メールで届く注文確認番号を入力<br />
                3. 「有効化する」ボタンをクリック
              </p>
            </div>

            <button
              onClick={openSquareCheckout}
              style={{
                width: "100%", padding: 12, marginBottom: 12,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
                color: "#aaa", fontSize: 14, cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              決済画面を再度開く
            </button>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>
                注文確認番号（メールに記載）
              </label>
              <input
                value={orderId}
                onChange={e => { setOrderId(e.target.value); setError(""); }}
                placeholder="例: ABCD-1234-EFGH"
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${error ? "#FF5252" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 10, color: "white", fontSize: 14, outline: "none",
                  boxSizing: "border-box", fontFamily: "'Noto Sans JP', sans-serif",
                }}
              />
              {error && <div style={{ color: "#FF5252", fontSize: 11, marginTop: 4 }}>{error}</div>}
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={!orderId.trim()}
              style={{
                width: "100%", padding: 16,
                background: orderId.trim()
                  ? "linear-gradient(135deg, #2E7D32, #1B5E20)"
                  : "rgba(255,255,255,0.1)",
                border: "none", borderRadius: 14, color: "white",
                fontSize: 16, fontWeight: 700,
                cursor: orderId.trim() ? "pointer" : "default",
                fontFamily: "'Noto Serif JP', serif", letterSpacing: 1,
                transition: "all 0.2s",
              }}
            >
              ✅ 有効化する
            </button>
          </div>
        )}

        <p style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 12 }}>
          ※ Squareによる安全な決済処理
        </p>
      </Card>
    </div>
  );
}
