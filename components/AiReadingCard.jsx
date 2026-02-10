"use client";

import Card from "./Card";
import { FORTUNE_CATEGORIES } from "@/data/categories";

export default function AiReadingCard({ reading, delay = 0.3 }) {
  if (!reading) return null;

  const isStructured = typeof reading === "object" && reading !== null;

  return (
    <Card delay={delay} style={{ background: "rgba(206,147,216,0.06)", border: "1px solid rgba(206,147,216,0.15)" }}>
      <div style={{ fontSize: 12, color: "#CE93D8", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        🔮 AI詳細鑑定
      </div>
      {isStructured ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FORTUNE_CATEGORIES.map((cat) => {
            const text = reading[cat.key];
            if (!text) return null;
            return (
              <div key={cat.key}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                  fontSize: 13, fontWeight: 600, color: cat.color,
                }}>
                  {cat.emoji} {cat.label}
                </div>
                <p style={{ color: "#ddd", lineHeight: 2, fontSize: 14, whiteSpace: "pre-wrap", margin: 0 }}>
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ color: "#ddd", lineHeight: 2, fontSize: 14, whiteSpace: "pre-wrap" }}>{reading}</p>
      )}
    </Card>
  );
}
