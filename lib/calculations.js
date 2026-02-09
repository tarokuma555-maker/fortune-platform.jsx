import { TAROT_CARDS } from "@/data/tarot";
import { ANIMALS } from "@/data/animals";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { KYUSEI } from "@/data/kyusei";
import { ROKUSEI_TYPES } from "@/data/rokusei";
import { JIKKAN, JUNISHI, GOGYO, GOGYO_DESC } from "@/data/shichusuimei";
import { KANJI_STROKES } from "@/data/kanji-strokes";

export function calcLifePathNumber(y, m, d) {
  const sum = String(y) + String(m) + String(d);
  let total = sum.split("").reduce((a, b) => a + parseInt(b), 0);
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return total;
}

function getStrokes(char) {
  return KANJI_STROKES[char] || (char.charCodeAt(0) % 15 + 3);
}

export function calcSeimei(sei, mei) {
  const seiStrokes = sei.split("").map(getStrokes);
  const meiStrokes = mei.split("").map(getStrokes);
  const totalSei = seiStrokes.reduce((a, b) => a + b, 0);
  const totalMei = meiStrokes.reduce((a, b) => a + b, 0);
  const tenkaku = totalSei;
  const chikaku = totalMei;
  const jinkaku = (seiStrokes[seiStrokes.length - 1] || 0) + (meiStrokes[0] || 0);
  const gaikaku = (seiStrokes[0] || 0) + (meiStrokes[meiStrokes.length - 1] || 0);
  const soukaku = totalSei + totalMei;
  function judge(n) {
    const lucky = [1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,38,39,41,45,47,48,52,57,58,61,63,65,67,68];
    if (lucky.includes(n)) return { luck: "大吉", color: "#FFD700" };
    return n % 2 === 1 ? { luck: "吉", color: "#4CAF50" } : { luck: "凶", color: "#FF5252" };
  }
  return {
    tenkaku: { value: tenkaku, ...judge(tenkaku), label: "天格", desc: "家系の運勢。先祖から受け継いだ運命。" },
    chikaku: { value: chikaku, ...judge(chikaku), label: "地格", desc: "幼少〜青年期の運勢。基本的な性格。" },
    jinkaku: { value: jinkaku, ...judge(jinkaku), label: "人格", desc: "人生の中心運。性格と対人関係の最重要格。" },
    gaikaku: { value: gaikaku, ...judge(gaikaku), label: "外格", desc: "社会運。他者からの評価を表します。" },
    soukaku: { value: soukaku, ...judge(soukaku), label: "総格", desc: "人生全体の運勢。晩年運を表す総合運。" },
  };
}

export function calcShichusuimei(y, m, d) {
  const yearKan = JIKKAN[(y - 4) % 10];
  const yearShi = JUNISHI[(y - 4) % 12];
  // 年上起月法: 甲己→丙, 乙庚→戊, 丙辛→庚, 丁壬→壬, 戊癸→甲
  const yearStemIdx = (y - 4) % 10;
  const monthKan = JIKKAN[((yearStemIdx % 5) * 2 + m + 1) % 10];
  const monthShi = JUNISHI[(m + 1) % 12];
  const baseDay = Math.floor((y - 1900) * 365.25 + (m - 1) * 30.44 + d);
  const dayKan = JIKKAN[Math.abs(baseDay) % 10];
  const dayShi = JUNISHI[Math.abs(baseDay) % 12];
  const gogyo = GOGYO[dayKan];
  return { yearKan, yearShi, monthKan, monthShi, dayKan, dayShi, gogyo, gogyoDesc: GOGYO_DESC[gogyo] };
}

export function calcAnimal(y, m, d) {
  const base = new Date(y, m - 1, d);
  const ref = new Date(2000, 0, 1);
  const diff = Math.floor((base - ref) / (1000 * 60 * 60 * 24));
  return ANIMALS[((diff % 12) + 12) % 12];
}

export function calcZodiac(m, d) {
  // 各月の「前の星座」の最終日
  // 1月19日まで山羊座、1月20日から水瓶座 ...
  const cutoffs = [19, 18, 20, 19, 20, 21, 22, 22, 22, 23, 22, 21];
  const idx = d <= cutoffs[m - 1] ? (m + 8) % 12 : (m + 9) % 12;
  return ZODIAC_SIGNS[idx];
}

export function calcKyusei(y) {
  // 年の各桁の合計を一桁になるまで繰り返し、11から引く
  let digitSum = String(y).split("").reduce((a, b) => a + parseInt(b), 0);
  while (digitSum > 9) {
    digitSum = String(digitSum).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  let star = 11 - digitSum;
  if (star > 9) star -= 9;
  return KYUSEI[star - 1];
}

export function calcRokusei(y, m, d) {
  const total = (y + m + d) % 6;
  const isYin = (y + d) % 2 === 0;
  return { ...ROKUSEI_TYPES[total], polarity: isYin ? "陰（−）" : "陽（＋）" };
}

export function drawTarot(mood) {
  const seed = mood ? mood.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + Date.now() % 1000 : Date.now() % 10000;
  const shuffled = [...TAROT_CARDS].sort(() => Math.sin(seed * Math.random()) - 0.5);
  return {
    past: { ...shuffled[0], reversed: seed % 3 === 0 },
    present: { ...shuffled[1], reversed: seed % 5 === 0 },
    future: { ...shuffled[2], reversed: seed % 7 === 0 },
  };
}

export function buildFortuneSummary(results) {
  const r = results;
  const lines = [];
  lines.push(`【四柱推命】日柱：${r.shichusuimei.dayKan}${r.shichusuimei.dayShi}、五行：${r.shichusuimei.gogyo}。${r.shichusuimei.gogyoDesc}`);
  lines.push(`【姓名判断】総格${r.seimei.soukaku.value}画（${r.seimei.soukaku.luck}）、人格${r.seimei.jinkaku.value}画（${r.seimei.jinkaku.luck}）`);
  lines.push(`【タロット】過去：${r.tarot.past.name}${r.tarot.past.reversed?"(逆)":""}、現在：${r.tarot.present.name}${r.tarot.present.reversed?"(逆)":""}、未来：${r.tarot.future.name}${r.tarot.future.reversed?"(逆)":""}`);
  lines.push(`【動物占い】${r.animal.name}。${r.animal.personality}`);
  lines.push(`【数秘術】ライフパスナンバー${r.numerology.number}「${r.numerology.data.title}」。${r.numerology.data.desc}`);
  lines.push(`【九星気学】${r.kyusei.name}。${r.kyusei.personality}`);
  lines.push(`【西洋占星術】${r.zodiac.name}（${r.zodiac.element}のエレメント）。${r.zodiac.personality}`);
  lines.push(`【血液型】${r.blood.type}型。${r.blood.data.personality}`);
  lines.push(`【六星占術】${r.rokusei.name}（${r.rokusei.polarity}）。${r.rokusei.personality}`);
  lines.push(`【誕生花】${r.birthday.flower}（${r.birthday.flowerMeaning}）【誕生石】${r.birthday.stone}（${r.birthday.stoneMeaning}）`);
  return lines.join("\n");
}

export function buildFortuneSummaryWithAI(results) {
  const r = results;
  const sections = [
    { key: "shichusuimei", label: "四柱推命", base: `日柱：${r.shichusuimei.dayKan}${r.shichusuimei.dayShi}、五行：${r.shichusuimei.gogyo}。${r.shichusuimei.gogyoDesc}` },
    { key: "seimei", label: "姓名判断", base: `総格${r.seimei.soukaku.value}画（${r.seimei.soukaku.luck}）、人格${r.seimei.jinkaku.value}画（${r.seimei.jinkaku.luck}）` },
    { key: "tarot", label: "タロット", base: `過去：${r.tarot.past.name}${r.tarot.past.reversed?"(逆)":""}、現在：${r.tarot.present.name}${r.tarot.present.reversed?"(逆)":""}、未来：${r.tarot.future.name}${r.tarot.future.reversed?"(逆)":""}` },
    { key: "animal", label: "動物占い", base: `${r.animal.name}。${r.animal.personality}` },
    { key: "numerology", label: "数秘術", base: `ライフパスナンバー${r.numerology.number}「${r.numerology.data.title}」。${r.numerology.data.desc}` },
    { key: "kyusei", label: "九星気学", base: `${r.kyusei.name}。${r.kyusei.personality}` },
    { key: "zodiac", label: "西洋占星術", base: `${r.zodiac.name}（${r.zodiac.element}のエレメント）。${r.zodiac.personality}` },
    { key: "blood", label: "血液型", base: `${r.blood.type}型。${r.blood.data.personality}` },
    { key: "rokusei", label: "六星占術", base: `${r.rokusei.name}（${r.rokusei.polarity}）。${r.rokusei.personality}` },
    { key: "birthday", label: "誕生花・誕生石", base: `${r.birthday.flower}（${r.birthday.flowerMeaning}）/ ${r.birthday.stone}（${r.birthday.stoneMeaning}）` },
  ];
  return sections.map(s => {
    const ai = r[s.key]?.aiReading;
    return `【${s.label}】${s.base}${ai ? `\n${ai}` : ""}`;
  }).join("\n\n");
}
