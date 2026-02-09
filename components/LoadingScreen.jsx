"use client";

import { useState, useEffect } from "react";
import StarParticles from "./StarParticles";
import { BG_GRADIENT } from "@/lib/constants";

export default function LoadingScreen() {
  const msgs = [
    "星の配置を読み取っています...",
    "命式を計算しています...",
    "タロットカードをシャッフル中...",
    "九星気学の方位を鑑定中...",
    "姓名の画数を解析中...",
    "AIが詳細な鑑定文を生成しています...",
    "運命の糸を紡いでいます...",
    "10種類の占いを総合鑑定中...",
    "鑑定結果をまとめています...",
  ];
  const [mi, setMi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMi(i => (i + 1) % msgs.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: BG_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
      <StarParticles />
      <div style={{ textAlign: "center", zIndex: 1, padding: 32 }}>
        <div style={{ fontSize: 64, animation: "spin 3s linear infinite", marginBottom: 24 }}>🔮</div>
        <div style={{ width: 200, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, margin: "0 auto 16px", overflow: "hidden" }}>
          <div style={{
            width: "40%", height: "100%",
            background: "linear-gradient(90deg, transparent, #CE93D8, #64B5F6, transparent)",
            borderRadius: 2,
            animation: "shimmer 1.5s ease-in-out infinite",
          }} />
        </div>
        <p style={{ color: "#ccc", fontSize: 14, fontFamily: "'Noto Serif JP', serif", transition: "opacity 0.3s", minHeight: 24 }}>{msgs[mi]}</p>
        <p style={{ color: "#666", fontSize: 11, marginTop: 12 }}>AIが10種類の詳細鑑定を生成中です</p>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-250%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
