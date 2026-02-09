"use client";

export default function Card({ children, delay = 0, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
      borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)",
      padding: 20, marginBottom: 16,
      animation: `fadeSlideUp 0.6s ease ${delay}s both`, ...style,
    }}>
      {children}
    </div>
  );
}
