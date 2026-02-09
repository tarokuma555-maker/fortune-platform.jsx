"use client";

import { useState } from "react";
import Card from "./Card";
import ShareButtons from "./ShareButtons";
import GoToAiButton from "./GoToAiButton";
import AiChat from "./AiChat";
import AiReadingCard from "./AiReadingCard";
import StarParticles from "./StarParticles";
import { TAB_LIST } from "@/data/tabs";
import { BG_GRADIENT } from "@/lib/constants";

export default function ResultView({ results, onBack }) {
  const [activeTab, setActiveTab] = useState("shichusuimei");

  const renderTab = () => {
    switch (activeTab) {
      case "shichusuimei": {
        const r = results.shichusuimei;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>🌿</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 20, fontFamily: "'Noto Serif JP', serif" }}>あなたの命式</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[{ label: "年柱", kan: r.yearKan, shi: r.yearShi }, { label: "月柱", kan: r.monthKan, shi: r.monthShi }, { label: "日柱", kan: r.dayKan, shi: r.dayShi }].map((p, i) => (
                <div key={i} style={{ textAlign: "center", padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 28, fontFamily: "'Noto Serif JP', serif", color: "#E8D5B7" }}>{p.kan}{p.shi}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card delay={0.2}>
            <div style={{ padding: "4px 12px", background: "rgba(139,195,74,0.15)", borderRadius: 8, display: "inline-block", marginBottom: 12 }}>
              <span style={{ color: "#AED581" }}>五行：{r.gogyo}</span>
            </div>
            <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.gogyoDesc}</p>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【四柱推命】日柱 ${r.dayKan}${r.dayShi}・五行「${r.gogyo}」`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "seimei": {
        const r = results.seimei;
        const kaku = [r.tenkaku, r.jinkaku, r.chikaku, r.gaikaku, r.soukaku];
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>✍️</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 20, fontFamily: "'Noto Serif JP', serif" }}>姓名判断結果</h3>
            </div>
            {kaku.map((k, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${k.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: k.color, flexShrink: 0 }}>{k.value}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: "#E8D5B7" }}>{k.label}</span>
                    <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: `${k.color}22`, color: k.color }}>{k.luck}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{k.desc}</div>
                </div>
              </div>
            ))}
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.2} />
          <ShareButtons text={`【姓名判断】総格${r.soukaku.value}画（${r.soukaku.luck}）/ 人格${r.jinkaku.value}画（${r.jinkaku.luck}）`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "tarot": {
        const r = results.tarot;
        const positions = [{ key: "past", label: "過去", color: "#64B5F6" }, { key: "present", label: "現在", color: "#CE93D8" }, { key: "future", label: "未来", color: "#FFB74D" }];
        return (<div>
          {positions.map((pos, i) => {
            const card = r[pos.key];
            return (
              <Card key={pos.key} delay={0.1 + i * 0.15}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: pos.color, fontWeight: 600, marginBottom: 8, letterSpacing: 2 }}>{pos.label}</div>
                  <div style={{ fontSize: 56, marginBottom: 8, transform: card.reversed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>{card.emoji}</div>
                  <h4 style={{ color: "#E8D5B7", margin: "0 0 4px", fontFamily: "'Noto Serif JP', serif", fontSize: 18 }}>
                    {card.name} {card.reversed && <span style={{ fontSize: 12, color: "#FF8A80" }}>（逆位置）</span>}
                  </h4>
                  <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0" }}>{card.reversed ? card.reverse : card.meaning}</p>
                  <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7 }}>{card.desc}</p>
                </div>
              </Card>
            );
          })}
          <AiReadingCard reading={r.aiReading} delay={0.55} />
          <ShareButtons text={`【タロット】過去：${r.past.name} / 現在：${r.present.name} / 未来：${r.future.name}`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "animal": {
        const r = results.animal;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72, marginBottom: 12, animation: "bounce 2s ease infinite" }}>{r.emoji}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 24, fontFamily: "'Noto Serif JP', serif" }}>{r.name}</h3>
            </div>
          </Card>
          <Card delay={0.2}>
            <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.personality}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div style={{ padding: 12, background: "rgba(76,175,80,0.1)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#81C784", marginBottom: 4 }}>💪 強み</div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{r.strength}</div>
              </div>
              <div style={{ padding: 12, background: "rgba(255,82,82,0.1)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#FF8A80", marginBottom: 4 }}>⚡ 弱み</div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{r.weakness}</div>
              </div>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【動物占い】あなたは「${r.name}」${r.emoji} ${r.personality.substring(0, 50)}...`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "numerology": {
        const r = results.numerology;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#CE93D8", fontFamily: "'Noto Serif JP', serif", marginBottom: 8 }}>{r.number}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 20, fontFamily: "'Noto Serif JP', serif" }}>{r.data.title}</h3>
              <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(206,147,216,0.15)", borderRadius: 8, display: "inline-block", fontSize: 12, color: "#CE93D8" }}>{r.data.keyword}</div>
            </div>
          </Card>
          <Card delay={0.2}><p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.data.desc}</p></Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【数秘術】ライフパスナンバー ${r.number}「${r.data.title}」${r.data.keyword}`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "kyusei": {
        const r = results.kyusei;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>⭐</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 22, fontFamily: "'Noto Serif JP', serif" }}>{r.name}</h3>
              <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>五行：{r.element}</div>
            </div>
          </Card>
          <Card delay={0.2}>
            <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.personality}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              {[{ icon: "🧭", label: "方位", value: r.direction }, { icon: "🎨", label: "ラッキーカラー", value: r.color }].map((item, i) => (
                <div key={i} style={{ padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>{item.icon} {item.label}</div>
                  <div style={{ color: "#E8D5B7", fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>🍀 開運スポット</div>
              <div style={{ color: "#ccc", fontSize: 13 }}>{r.lucky}</div>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【九星気学】${r.name} 方位：${r.direction} カラー：${r.color}`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "zodiac": {
        const r = results.zodiac;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{r.symbol}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 22, fontFamily: "'Noto Serif JP', serif" }}>{r.name}</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#aaa" }}>🔥 {r.element}のエレメント</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>🪐 守護星：{r.ruler}</span>
              </div>
            </div>
          </Card>
          <Card delay={0.2}><p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.personality}</p></Card>
          <Card delay={0.3}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#FF80AB", marginBottom: 4 }}>💕 恋愛運</div>
              <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>{r.love}</p>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#80CBC4", marginBottom: 4 }}>💼 仕事運</div>
              <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>{r.work}</p>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.4} />
          <ShareButtons text={`【西洋占星術】${r.symbol} ${r.name}（${r.element}のエレメント）`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "blood": {
        const r = results.blood;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 56, fontWeight: 900, color: "#EF5350", fontFamily: "'Noto Serif JP', serif" }}>{r.type}型</div>
            </div>
          </Card>
          <Card delay={0.2}>
            <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.data.personality}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div style={{ padding: 12, background: "rgba(76,175,80,0.1)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#81C784", marginBottom: 4 }}>💪 強み</div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{r.data.strength}</div>
              </div>
              <div style={{ padding: 12, background: "rgba(255,82,82,0.1)", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#FF8A80", marginBottom: 4 }}>⚡ 弱み</div>
                <div style={{ color: "#ccc", fontSize: 13 }}>{r.data.weakness}</div>
              </div>
            </div>
          </Card>
          <Card delay={0.3}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#FF80AB", marginBottom: 4 }}>💕 恋愛</div>
              <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>{r.data.love}</p>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#FFD54F", marginBottom: 4 }}>💛 相性</div>
              <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>{r.data.compatibility}</p>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.4} />
          <ShareButtons text={`【血液型占い】${r.type}型 ${r.data.personality.substring(0, 50)}...`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "rokusei": {
        const r = results.rokusei;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 8 }}>{r.color}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 22, fontFamily: "'Noto Serif JP', serif" }}>{r.name}</h3>
              <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 8, display: "inline-block", fontSize: 13, color: "#aaa" }}>{r.polarity}</div>
            </div>
          </Card>
          <Card delay={0.2}>
            <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 14 }}>{r.personality}</p>
            <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>💪 強み</div>
              <div style={{ color: "#E8D5B7", fontSize: 13 }}>{r.strength}</div>
            </div>
            <div style={{ marginTop: 8, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>💼 適職</div>
              <div style={{ color: "#ccc", fontSize: 13 }}>{r.career}</div>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【六星占術】${r.name}（${r.polarity}）${r.personality.substring(0, 50)}...`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "birthday": {
        const r = results.birthday;
        return (<div>
          <Card delay={0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{r.emoji}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 20, fontFamily: "'Noto Serif JP', serif" }}>誕生花：{r.flower}</h3>
              <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(233,30,99,0.12)", borderRadius: 8, display: "inline-block", fontSize: 13, color: "#F48FB1" }}>花言葉：{r.flowerMeaning}</div>
            </div>
          </Card>
          <Card delay={0.2}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{r.stoneEmoji}</div>
              <h3 style={{ color: "#E8D5B7", fontSize: 20, fontFamily: "'Noto Serif JP', serif" }}>誕生石：{r.stone}</h3>
              <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(33,150,243,0.12)", borderRadius: 8, display: "inline-block", fontSize: 13, color: "#90CAF9" }}>石言葉：{r.stoneMeaning}</div>
            </div>
          </Card>
          <AiReadingCard reading={r.aiReading} delay={0.3} />
          <ShareButtons text={`【誕生花・誕生石】🌸${r.flower}（${r.flowerMeaning}）💎${r.stone}（${r.stoneMeaning}）`} />
          <GoToAiButton onClick={() => setActiveTab("aichat")} />
        </div>);
      }
      case "aichat": {
        return <AiChat results={results} />;
      }
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG_GRADIENT, color: "white", position: "relative" }}>
      <StarParticles />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <h2 style={{ margin: 0, fontSize: 16, fontFamily: "'Noto Serif JP', serif", color: "#E8D5B7" }}>鑑定結果</h2>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {TAB_LIST.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flexShrink: 0, padding: "8px 14px", borderRadius: 20,
              border: activeTab === tab.id ? "1px solid rgba(206,147,216,0.5)" : "1px solid rgba(255,255,255,0.1)",
              background: activeTab === tab.id ? "rgba(206,147,216,0.15)" : "rgba(255,255,255,0.05)",
              color: activeTab === tab.id ? "#E8D5B7" : "#888",
              fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{tab.emoji} {tab.label}</button>
          ))}
        </div>
        <div style={{ paddingBottom: 40 }}>{renderTab()}</div>
      </div>
    </div>
  );
}
