"use client";

import { signIn } from "next-auth/react";
import StarParticles from "./StarParticles";
import Card from "./Card";
import { BG_GRADIENT } from "@/lib/constants";

export default function LoginScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG_GRADIENT,
      color: "white",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <StarParticles />
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 400,
        width: "100%",
        padding: "0 20px",
        animation: "fadeSlideUp 0.8s ease both",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔮</div>
          <h1 style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#E8D5B7",
            letterSpacing: 2,
            marginBottom: 8,
          }}>Fortune Oracle</h1>
          <p style={{
            color: "#8888aa",
            fontSize: 14,
            lineHeight: 1.6,
          }}>あなたの運命を10の占術で紐解く</p>
        </div>

        <Card>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 8 }}>
              ログインして始める
            </div>
            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6 }}>
              Googleアカウントでログインすると、<br />
              サブスクリプション情報が安全に管理されます。
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transition: "all 0.2s",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン
          </button>
        </Card>

        <p style={{
          textAlign: "center",
          color: "#666",
          fontSize: 11,
          marginTop: 16,
        }}>
          ※ ログイン情報は安全に暗号化されます
        </p>
      </div>
    </div>
  );
}
