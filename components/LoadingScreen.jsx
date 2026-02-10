"use client";

import StarParticles from "./StarParticles";
import { BG_GRADIENT } from "@/lib/constants";

export default function LoadingScreen({ progress = 0, stage = "" }) {
  const isComplete = progress >= 100;

  return (
    <div style={{ minHeight: "100vh", background: BG_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
      <StarParticles />
      <div style={{ textAlign: "center", zIndex: 1, padding: 32, width: "100%", maxWidth: 360 }}>
        <div style={{
          fontSize: 64,
          marginBottom: 24,
          animation: isComplete ? "none" : "spin 3s linear infinite",
          transition: "transform 0.3s",
          transform: isComplete ? "scale(1.2)" : "scale(1)",
        }}>
          {isComplete ? "✨" : "🔮"}
        </div>

        {/* パーセント表示 */}
        <div style={{
          fontSize: 36, fontWeight: 700,
          fontFamily: "'Noto Serif JP', serif",
          color: isComplete ? "#CE93D8" : "#E8D5B7",
          marginBottom: 16,
          transition: "color 0.3s",
        }}>
          {Math.round(progress)}%
        </div>

        {/* プログレスバー */}
        <div style={{
          width: "100%", height: 6,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 3, margin: "0 auto 16px",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: isComplete
              ? "linear-gradient(90deg, #CE93D8, #64B5F6)"
              : "linear-gradient(90deg, #7B1FA2, #CE93D8, #64B5F6)",
            borderRadius: 3,
            transition: "width 0.4s ease-out",
          }} />
        </div>

        {/* ステージメッセージ */}
        <p style={{
          color: isComplete ? "#CE93D8" : "#ccc",
          fontSize: 14,
          fontFamily: "'Noto Serif JP', serif",
          minHeight: 24,
          transition: "color 0.3s",
        }}>
          {stage}
        </p>

        <p style={{ color: "#666", fontSize: 11, marginTop: 12 }}>
          {isComplete ? "まもなく結果を表示します" : "AIが10種類の詳細鑑定を生成中です"}
        </p>
      </div>
    </div>
  );
}
