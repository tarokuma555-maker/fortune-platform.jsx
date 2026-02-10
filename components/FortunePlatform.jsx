"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import StarParticles from "./StarParticles";
import LoadingScreen from "./LoadingScreen";
import ResultView from "./ResultView";
import { TAB_LIST } from "@/data/tabs";
import { BLOOD_TYPES } from "@/data/blood";
import { NUMEROLOGY } from "@/data/numerology";
import { MONTH_FLOWERS } from "@/data/birthday";
import { BG_GRADIENT } from "@/lib/constants";
import {
  calcLifePathNumber,
  calcSeimei,
  calcShichusuimei,
  calcAnimal,
  calcZodiac,
  calcKyusei,
  calcRokusei,
  drawTarot,
  buildFortuneSummary,
} from "@/lib/calculations";
import { saveSubscriptionData } from "@/lib/subscription";

export default function FortunePlatform() {
  const [page, setPage] = useState("input");
  const [results, setResults] = useState(null);
  const [form, setForm] = useState({ sei: "", mei: "", year: "", month: "", day: "", hour: "", blood: "", mood: "" });
  const [errors, setErrors] = useState({});
  const [loadingProgress, setLoadingProgress] = useState({ percent: 0, stage: "" });

  // Stripe Checkout からのリダイレクト復帰処理
  useEffect(() => {
    async function handleCheckoutReturn() {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      if (!sessionId) return;
      window.history.replaceState({}, "", window.location.pathname);
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const result = await res.json();
        if (result.active) {
          saveSubscriptionData({
            email: result.email,
            subscriptionId: result.subscriptionId,
            verifiedAt: Date.now(),
          });
        }
      } catch {
        // サイレントフェイル
      }
    }
    handleCheckoutReturn();
  }, []);

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.sei.trim()) e.sei = "必須";
    if (!form.mei.trim()) e.mei = "必須";
    if (!form.year || form.year < 1920 || form.year > 2025) e.year = "正しい年を入力";
    if (!form.month || form.month < 1 || form.month > 12) e.month = "正しい月を入力";
    if (!form.day || form.day < 1 || form.day > 31) e.day = "正しい日を入力";
    if (!form.blood) e.blood = "選択してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoadingProgress({ percent: 0, stage: "準備中..." });
    setPage("loading");

    // ステージ1: ローカル計算（5%→15%）
    setLoadingProgress({ percent: 5, stage: "命式を計算しています..." });
    const y = parseInt(form.year), m = parseInt(form.month), d = parseInt(form.day);
    const lpn = calcLifePathNumber(y, m, d);

    const baseResults = {
      shichusuimei: calcShichusuimei(y, m, d),
      seimei: calcSeimei(form.sei, form.mei),
      tarot: drawTarot(form.mood),
      animal: calcAnimal(y, m, d),
      numerology: { number: lpn, data: NUMEROLOGY[lpn] },
      kyusei: calcKyusei(y),
      zodiac: calcZodiac(m, d),
      blood: { type: form.blood, data: BLOOD_TYPES[form.blood] },
      rokusei: calcRokusei(y, m, d),
      birthday: MONTH_FLOWERS[m - 1],
    };
    setLoadingProgress({ percent: 15, stage: "基礎データの計算が完了しました" });

    // ステージ2: AI鑑定文の生成（15%→90%）
    // AI待ち中は徐々にプログレスを進めるタイマー
    let aiPercent = 15;
    const progressTimer = setInterval(() => {
      aiPercent = Math.min(aiPercent + 1, 88);
      const aiStages = [
        [15, "AIに鑑定データを送信中..."],
        [25, "四柱推命・姓名判断を鑑定中..."],
        [35, "タロット・動物占いを鑑定中..."],
        [45, "数秘術・九星気学を鑑定中..."],
        [55, "星座・血液型を鑑定中..."],
        [65, "六星占術・誕生花石を鑑定中..."],
        [75, "恋愛運・仕事運を分析中..."],
        [82, "金運・戦略を生成中..."],
        [88, "鑑定文を最終調整中..."],
      ];
      const stage = [...aiStages].reverse().find(([threshold]) => aiPercent >= threshold);
      setLoadingProgress({ percent: aiPercent, stage: stage ? stage[1] : "" });
    }, 400);

    try {
      const summary = buildFortuneSummary(baseResults);
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          userName: `${form.sei} ${form.mei}`,
        }),
      });
      clearInterval(progressTimer);

      if (res.ok) {
        setLoadingProgress({ percent: 92, stage: "AI鑑定文を処理中..." });
        const { readings } = await res.json();
        const keys = ["shichusuimei", "seimei", "tarot", "animal", "numerology", "kyusei", "zodiac", "blood", "rokusei", "birthday"];
        for (const key of keys) {
          if (readings[key]) {
            const val = readings[key];
            const aiReading = typeof val === "string"
              ? { "恋愛運": val, "仕事運": "", "金運": "", "今年上半期の戦略": "" }
              : val;
            baseResults[key] = { ...baseResults[key], aiReading };
          }
        }
        setLoadingProgress({ percent: 100, stage: "鑑定完了！" });
      } else {
        clearInterval(progressTimer);
        setLoadingProgress({ percent: 100, stage: "鑑定完了" });
      }
    } catch (_) {
      clearInterval(progressTimer);
      setLoadingProgress({ percent: 100, stage: "鑑定完了" });
    }

    // 完了アニメーション用に少し待つ
    await new Promise(r => setTimeout(r, 500));
    setResults(baseResults);
    setPage("result");
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "white",
    fontSize: 16, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box", fontFamily: "'Noto Sans JP', sans-serif",
  };
  const labelStyle = { display: "block", fontSize: 12, color: "#aaa", marginBottom: 6, fontWeight: 500 };

  if (page === "loading") return <LoadingScreen progress={loadingProgress.percent} stage={loadingProgress.stage} />;
  if (page === "result") return <ResultView results={results} onBack={() => setPage("input")} />;

  return (
    <div style={{ minHeight: "100vh", background: BG_GRADIENT, color: "white", position: "relative" }}>
      <StarParticles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeSlideUp 0.8s ease both" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
          <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 26, fontWeight: 700, color: "#E8D5B7", letterSpacing: 2, marginBottom: 8 }}>Fortune Oracle</h1>
          <p style={{ color: "#8888aa", fontSize: 13, lineHeight: 1.6 }}>あなたの運命を10の占術で紐解く</p>
        </div>
        <div style={{ animation: "fadeSlideUp 0.8s ease 0.2s both" }}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 12 }}>👤 お名前</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>姓（漢字）</label>
                  <input style={{ ...inputStyle, borderColor: errors.sei ? "#FF5252" : undefined }} placeholder="占井" value={form.sei} onChange={handleChange("sei")} />
                  {errors.sei && <div style={{ color: "#FF5252", fontSize: 11, marginTop: 4 }}>{errors.sei}</div>}
                </div>
                <div>
                  <label style={labelStyle}>名（漢字）</label>
                  <input style={{ ...inputStyle, borderColor: errors.mei ? "#FF5252" : undefined }} placeholder="一郎" value={form.mei} onChange={handleChange("mei")} />
                  {errors.mei && <div style={{ color: "#FF5252", fontSize: 11, marginTop: 4 }}>{errors.mei}</div>}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 12 }}>📅 生年月日</div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>年</label>
                  <input type="number" style={{ ...inputStyle, borderColor: errors.year ? "#FF5252" : undefined }} placeholder="1994" value={form.year} onChange={handleChange("year")} />
                </div>
                <div>
                  <label style={labelStyle}>月</label>
                  <input type="number" style={{ ...inputStyle, borderColor: errors.month ? "#FF5252" : undefined }} placeholder="8" min="1" max="12" value={form.month} onChange={handleChange("month")} />
                </div>
                <div>
                  <label style={labelStyle}>日</label>
                  <input type="number" style={{ ...inputStyle, borderColor: errors.day ? "#FF5252" : undefined }} placeholder="15" min="1" max="31" value={form.day} onChange={handleChange("day")} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 12 }}>⏰ 生まれた時間</div>
                <label style={labelStyle}>時間帯（任意）</label>
                <select style={inputStyle} value={form.hour} onChange={handleChange("hour")}>
                  <option value="">わからない</option>
                  <option value="子">23〜1時（子）</option>
                  <option value="丑">1〜3時（丑）</option>
                  <option value="寅">3〜5時（寅）</option>
                  <option value="卯">5〜7時（卯）</option>
                  <option value="辰">7〜9時（辰）</option>
                  <option value="巳">9〜11時（巳）</option>
                  <option value="午">11〜13時（午）</option>
                  <option value="未">13〜15時（未）</option>
                  <option value="申">15〜17時（申）</option>
                  <option value="酉">17〜19時（酉）</option>
                  <option value="戌">19〜21時（戌）</option>
                  <option value="亥">21〜23時（亥）</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 12 }}>🩸 血液型</div>
                <label style={labelStyle}>タイプ</label>
                <select style={{ ...inputStyle, borderColor: errors.blood ? "#FF5252" : undefined }} value={form.blood} onChange={handleChange("blood")}>
                  <option value="">選択</option>
                  <option value="A">A型</option>
                  <option value="B">B型</option>
                  <option value="O">O型</option>
                  <option value="AB">AB型</option>
                </select>
                {errors.blood && <div style={{ color: "#FF5252", fontSize: 11, marginTop: 4 }}>{errors.blood}</div>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#CE93D8", fontWeight: 600, marginBottom: 12 }}>💭 今の気分・悩み</div>
              <label style={labelStyle}>タロット占いに反映されます（任意）</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="例：仕事の方向性に迷っている..." value={form.mood} onChange={handleChange("mood")} />
            </div>
          </Card>
          <Card style={{ marginTop: 4 }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>✨ 鑑定される占い（全10種類）</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TAB_LIST.map(t => (
                <span key={t.id} style={{ fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 12, color: "#ccc" }}>{t.emoji} {t.label}</span>
              ))}
            </div>
          </Card>
          <button onClick={handleSubmit} style={{
            width: "100%", padding: 16, marginTop: 20,
            background: "linear-gradient(135deg, #7B1FA2, #4527A0)",
            border: "none", borderRadius: 14, color: "white", fontSize: 17, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Noto Serif JP', serif", letterSpacing: 2,
            animation: "glow 3s ease infinite", transition: "transform 0.2s",
          }}
            onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >🔮 運命を占う</button>
          <p style={{ textAlign: "center", color: "#666", fontSize: 11, marginTop: 16 }}>
            ※ 占い結果はエンターテイメントです。人生の参考としてお楽しみください。
          </p>
        </div>
      </div>
    </div>
  );
}
