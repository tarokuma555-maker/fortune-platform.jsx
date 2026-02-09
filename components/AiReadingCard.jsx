"use client";

import Card from "./Card";

export default function AiReadingCard({ reading, delay = 0.3 }) {
  if (!reading) return null;
  return (
    <Card delay={delay} style={{ background: "rgba(206,147,216,0.06)", border: "1px solid rgba(206,147,216,0.15)" }}>
      <div style={{ fontSize: 12, color: "#CE93D8", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        🔮 AI詳細鑑定
      </div>
      <p style={{ color: "#ddd", lineHeight: 2, fontSize: 14, whiteSpace: "pre-wrap" }}>{reading}</p>
    </Card>
  );
}
