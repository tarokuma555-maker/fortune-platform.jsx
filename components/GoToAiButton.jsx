"use client";

export default function GoToAiButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", marginTop: 20, padding: "14px 20px",
        background: "linear-gradient(135deg, rgba(206,147,216,0.15), rgba(100,181,246,0.15))",
        border: "1px solid rgba(206,147,216,0.3)",
        borderRadius: 14, color: "#E8D5B7", fontSize: 14, fontWeight: 600,
        cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.3s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "linear-gradient(135deg, rgba(206,147,216,0.25), rgba(100,181,246,0.25))";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "linear-gradient(135deg, rgba(206,147,216,0.15), rgba(100,181,246,0.15))";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      🤖 もっと詳しく占いたい場合はこちら
      <span style={{
        fontSize: 10, padding: "2px 8px",
        background: "rgba(255,215,0,0.2)", borderRadius: 8,
        color: "#FFD700", fontWeight: 700,
      }}>
        🔒 プレミアム
      </span>
    </button>
  );
}
