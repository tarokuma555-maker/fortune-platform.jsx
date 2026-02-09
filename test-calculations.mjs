// ============================================================
// 全計算ロジックの検証スクリプト
// ============================================================

// --- データをインラインでインポート相当 ---
const JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const GOGYO = { "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水" };

const ZODIAC_SIGNS = [
  { name: "牡羊座" }, { name: "牡牛座" }, { name: "双子座" }, { name: "蟹座" },
  { name: "獅子座" }, { name: "乙女座" }, { name: "天秤座" }, { name: "蠍座" },
  { name: "射手座" }, { name: "山羊座" }, { name: "水瓶座" }, { name: "魚座" },
];

const KYUSEI = [
  { name: "一白水星" }, { name: "二黒土星" }, { name: "三碧木星" }, { name: "四緑木星" },
  { name: "五黄土星" }, { name: "六白金星" }, { name: "七赤金星" }, { name: "八白土星" },
  { name: "九紫火星" },
];

const NUMEROLOGY = {
  1: { title: "リーダー" }, 2: { title: "調和の人" }, 3: { title: "表現者" },
  4: { title: "建設者" }, 5: { title: "冒険家" }, 6: { title: "奉仕者" },
  7: { title: "探究者" }, 8: { title: "実業家" }, 9: { title: "賢者" },
  11: { title: "直感者" }, 22: { title: "大建設者" }, 33: { title: "大教師" },
};

// --- 関数定義 ---
function calcLifePathNumber(y, m, d) {
  const sum = String(y) + String(m) + String(d);
  let total = sum.split("").reduce((a, b) => a + parseInt(b), 0);
  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return total;
}

function calcShichusuimei(y, m, d) {
  const yearKan = JIKKAN[(y - 4) % 10];
  const yearShi = JUNISHI[(y - 4) % 12];
  const yearStemIdx = (y - 4) % 10;
  const monthKan = JIKKAN[((yearStemIdx % 5) * 2 + m + 1) % 10];
  const monthShi = JUNISHI[(m + 1) % 12];
  const baseDay = Math.floor((y - 1900) * 365.25 + (m - 1) * 30.44 + d);
  const dayKan = JIKKAN[Math.abs(baseDay) % 10];
  const dayShi = JUNISHI[Math.abs(baseDay) % 12];
  const gogyo = GOGYO[dayKan];
  return { yearKan, yearShi, monthKan, monthShi, dayKan, dayShi, gogyo };
}

function calcZodiac(m, d) {
  const cutoffs = [19, 18, 20, 19, 20, 21, 22, 22, 22, 23, 22, 21];
  const idx = d <= cutoffs[m - 1] ? (m + 8) % 12 : (m + 9) % 12;
  return ZODIAC_SIGNS[idx];
}

function calcKyusei(y) {
  let digitSum = String(y).split("").reduce((a, b) => a + parseInt(b), 0);
  while (digitSum > 9) {
    digitSum = String(digitSum).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  let star = 11 - digitSum;
  if (star > 9) star -= 9;
  return KYUSEI[star - 1];
}

// ============================================================
// 1. 数秘術 - ライフパスナンバー検証
// ============================================================
console.log("=== 1. 数秘術 (calcLifePathNumber) ===");
// 既知の計算例で検証
// 1990/5/15 → 1+9+9+0+5+1+5 = 30 → 3+0 = 3
console.log(`1990/5/15 → ${calcLifePathNumber(1990, 5, 15)} (期待: 3)`);
// 1985/12/25 → 1+9+8+5+1+2+2+5 = 33 (マスターナンバー)
console.log(`1985/12/25 → ${calcLifePathNumber(1985, 12, 25)} (期待: 33)`);
// 2000/1/1 → 2+0+0+0+1+1 = 4
console.log(`2000/1/1 → ${calcLifePathNumber(2000, 1, 1)} (期待: 4)`);
// 1994/8/15 → 1+9+9+4+8+1+5 = 37 → 3+7 = 10 → 1+0 = 1
console.log(`1994/8/15 → ${calcLifePathNumber(1994, 8, 15)} (期待: 1)`);
// 1977/11/29 → 1+9+7+7+1+1+2+9 = 37 → 10 → 1
console.log(`1977/11/29 → ${calcLifePathNumber(1977, 11, 29)} (期待: 1)`);

// ============================================================
// 2. 星座占い - 全12境界の検証
// ============================================================
console.log("\n=== 2. 星座占い (calcZodiac) ===");
const zodiacTests = [
  [1, 1, "山羊座"], [1, 19, "山羊座"], [1, 20, "水瓶座"], [1, 31, "水瓶座"],
  [2, 18, "水瓶座"], [2, 19, "魚座"],
  [3, 20, "魚座"], [3, 21, "牡羊座"],
  [4, 19, "牡羊座"], [4, 20, "牡牛座"],
  [5, 20, "牡牛座"], [5, 21, "双子座"],
  [6, 21, "双子座"], [6, 22, "蟹座"],
  [7, 22, "蟹座"], [7, 23, "獅子座"],
  [8, 15, "獅子座"], [8, 22, "獅子座"], [8, 23, "乙女座"],
  [9, 22, "乙女座"], [9, 23, "天秤座"],
  [10, 23, "天秤座"], [10, 24, "蠍座"],
  [11, 22, "蠍座"], [11, 23, "射手座"],
  [12, 21, "射手座"], [12, 22, "山羊座"],
];
let zodiacPass = 0;
for (const [m, d, expected] of zodiacTests) {
  const result = calcZodiac(m, d).name;
  const ok = result === expected;
  if (!ok) console.log(`  ✗ ${m}/${d} → ${result} (期待: ${expected})`);
  else zodiacPass++;
}
console.log(`  結果: ${zodiacPass}/${zodiacTests.length} 通過`);

// ============================================================
// 3. 四柱推命 - 年柱の検証（十干十二支は60年周期）
// ============================================================
console.log("\n=== 3. 四柱推命 - 年柱 (calcShichusuimei) ===");
// 既知の年柱:
// 1984年 = 甲子, 1985年 = 乙丑, 2000年 = 庚辰, 2024年 = 甲辰
const yearTests = [
  [1984, "甲", "子"], [1985, "乙", "丑"], [1986, "丙", "寅"],
  [2000, "庚", "辰"], [2023, "癸", "卯"], [2024, "甲", "辰"],
  [1960, "庚", "子"], [1990, "庚", "午"],
];
let yearPass = 0;
for (const [y, expectedKan, expectedShi] of yearTests) {
  const r = calcShichusuimei(y, 1, 1);
  const ok = r.yearKan === expectedKan && r.yearShi === expectedShi;
  if (!ok) console.log(`  ✗ ${y}年 → ${r.yearKan}${r.yearShi} (期待: ${expectedKan}${expectedShi})`);
  else yearPass++;
}
console.log(`  結果: ${yearPass}/${yearTests.length} 通過`);

// ============================================================
// 4. 四柱推命 - 月柱の検証
// ============================================================
console.log("\n=== 4. 四柱推命 - 月柱 ===");
// 甲・己年の1月 → 丙寅, 2月 → 丁卯, ... (年上起月法)
// 甲年(2024)の月干: 1月=丙(寅), 2月=丁(卯), 3月=戊(辰)...
// 年上起月法: 甲己年は丙から始まる
// 乙庚年は戊から始まる
// 丙辛年は庚から始まる
// 丁壬年は壬から始まる
// 戊癸年は甲から始まる
// 2024年=甲辰年 → 1月の天干は丙
const monthTests = [
  // [year, month, expectedMonthKan]
  // 甲年(2024): 丙寅(1月), 丁卯(2月), 戊辰(3月)
  [2024, 1, "丙"], [2024, 2, "丁"], [2024, 3, "戊"],
  // 乙年(2025): 戊寅(1月), 己卯(2月)
  [2025, 1, "戊"], [2025, 2, "己"],
  // 丙年(2026): 庚寅(1月)
  [2026, 1, "庚"],
];
let monthPass = 0;
for (const [y, m, expectedKan] of monthTests) {
  const r = calcShichusuimei(y, m, 1);
  const ok = r.monthKan === expectedKan;
  if (!ok) console.log(`  ✗ ${y}年${m}月 → ${r.monthKan} (期待: ${expectedKan})`);
  else monthPass++;
}
console.log(`  結果: ${monthPass}/${monthTests.length} 通過`);

// 月支の検証: 1月=寅, 2月=卯, 3月=辰, ...
console.log("\n=== 5. 四柱推命 - 月支 ===");
const expectedMonthShi = ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
let monthShiPass = 0;
for (let m = 1; m <= 12; m++) {
  const r = calcShichusuimei(2024, m, 1);
  const expected = expectedMonthShi[m - 1];
  const ok = r.monthShi === expected;
  if (!ok) console.log(`  ✗ ${m}月 → ${r.monthShi} (期待: ${expected})`);
  else monthShiPass++;
}
console.log(`  結果: ${monthShiPass}/12 通過`);

// ============================================================
// 6. 九星気学の検証
// ============================================================
console.log("\n=== 6. 九星気学 (calcKyusei) ===");
// 既知: 1964年=一白水星, 1965年=九紫火星, 1966年=八白土星
// 2024年=三碧木星, 2023年=四緑木星
// 法則: (11 - (y-3)%9) %9 → 0は9に
const kyuseiTests = [
  [1964, "九紫火星"], [1965, "八白土星"], [1966, "七赤金星"],
  [2023, "四緑木星"], [2024, "三碧木星"], [2025, "二黒土星"],
  [1990, "一白水星"], [2000, "九紫火星"],
];
let kyuseiPass = 0;
for (const [y, expected] of kyuseiTests) {
  const result = calcKyusei(y).name;
  const ok = result === expected;
  if (!ok) console.log(`  ✗ ${y}年 → ${result} (期待: ${expected})`);
  else kyuseiPass++;
}
console.log(`  結果: ${kyuseiPass}/${kyuseiTests.length} 通過`);

// ============================================================
// 7. 数秘術のマスターナンバー検証
// ============================================================
console.log("\n=== 7. 数秘術 - マスターナンバー ===");
const allResults = new Set();
for (let y = 1950; y <= 2025; y++) {
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 28; d++) {
      allResults.add(calcLifePathNumber(y, m, d));
    }
  }
}
const validNumbers = [1,2,3,4,5,6,7,8,9,11,22,33];
const invalidResults = [...allResults].filter(n => !validNumbers.includes(n));
console.log(`  出現した値: ${[...allResults].sort((a,b) => a-b).join(", ")}`);
console.log(`  不正な値: ${invalidResults.length === 0 ? "なし ✓" : invalidResults.join(", ")}`);

// ============================================================
// SUMMARY
// ============================================================
console.log("\n=== 総合サマリー ===");
console.log(`星座占い: ${zodiacPass}/${zodiacTests.length}`);
console.log(`年柱: ${yearPass}/${yearTests.length}`);
console.log(`月干: ${monthPass}/${monthTests.length}`);
console.log(`月支: ${monthShiPass}/12`);
console.log(`九星気学: ${kyuseiPass}/${kyuseiTests.length}`);
