"use client";

import { useState } from "react";

export default function StarParticles() {
  const [stars] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5, delay: Math.random() * 4, duration: Math.random() * 3 + 2,
    }))
  );
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%", background: "white",
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`, opacity: 0,
        }} />
      ))}
    </div>
  );
}
