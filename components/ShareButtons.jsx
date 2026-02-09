"use client";

export default function ShareButtons({ text }) {
  const enc = encodeURIComponent(text);
  const btnBase = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 20, border: "none",
    color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
    textDecoration: "none", transition: "transform 0.2s",
  };
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
      <a href={`https://twitter.com/intent/tweet?text=${enc}`} target="_blank" rel="noopener noreferrer"
        style={{ ...btnBase, background: "#1DA1F2" }}>X ポスト</a>
      <a href={`https://line.me/R/msg/text/?${enc}`} target="_blank" rel="noopener noreferrer"
        style={{ ...btnBase, background: "#06C755" }}>LINE</a>
      <button onClick={() => { navigator.clipboard?.writeText(text); alert("コピーしました！"); }}
        style={{ ...btnBase, background: "rgba(255,255,255,0.15)" }}>📋 コピー</button>
    </div>
  );
}
