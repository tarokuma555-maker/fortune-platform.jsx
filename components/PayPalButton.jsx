"use client";

import { useEffect, useRef, useState } from "react";

const PAYPAL_CLIENT_ID = "AZfVV9yX7ICCelbYfJyHO7kV5bk026HXlBIxWnZk1E4yCZ6tBf7Fya6QeokmqWX8w1wquZW9FXpBj6G7";
const PAYPAL_PLAN_ID = "P-60J68427SW282353BNGF4SEY";

export default function PayPalButton({ onApprove }) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const rendered = useRef(false);

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&currency=JPY`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !containerRef.current || rendered.current) return;
    rendered.current = true;

    window.paypal.Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "subscribe",
      },
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id: PAYPAL_PLAN_ID,
        });
      },
      onApprove: function (data) {
        if (onApprove) {
          onApprove(data.subscriptionID);
        }
      },
    }).render(containerRef.current);
  }, [sdkReady, onApprove]);

  return (
    <div>
      <div ref={containerRef} />
      {!sdkReady && (
        <div style={{ textAlign: "center", padding: 20, color: "#aaa", fontSize: 13 }}>
          PayPalを読み込み中...
        </div>
      )}
    </div>
  );
}
