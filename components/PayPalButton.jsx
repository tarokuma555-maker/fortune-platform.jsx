"use client";

import { useEffect, useRef, useState } from "react";

const PAYPAL_CLIENT_ID = "AR5MGgYHz7cqm19H_Ihu9eAl7Ub-HYWIrI8d1rWoUf1NUg_jCxrmNYxMbwFPd6imKNx2CzYBCdCpl3a1";
const PAYPAL_PLAN_ID = "P-2LL29542NN558361DNGFZUNI";

export default function PayPalButton({ onApprove }) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const rendered = useRef(false);

  // PayPal SDKスクリプトの読み込み
  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
    return () => {
      // SDKスクリプトはページ全体で1回だけ読み込む
    };
  }, []);

  // ボタンのレンダリング
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
