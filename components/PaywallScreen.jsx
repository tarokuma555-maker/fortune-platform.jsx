"use client";

import Card from "./Card";
import PayPalButton from "./PayPalButton";

export default function PaywallScreen({ onSubscribed }) {
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

        <PayPalButton onApprove={onSubscribed} />

        <p style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 12 }}>
          ※ PayPalによる安全な決済処理
        </p>
      </Card>
    </div>
  );
}
