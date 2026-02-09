export const ANIMALS = [
  { name: "ペガサス", emoji: "🦄", personality: "自由奔放で直感的。束縛を嫌い、独創的なアイデアで周囲を驚かせます。", strength: "創造力・直感力", weakness: "飽きっぽい・気分屋" },
  { name: "チータ", emoji: "🐆", personality: "行動力抜群のスピードスター。目標に向かって一直線に突き進みます。", strength: "行動力・決断力", weakness: "せっかち・持続力不足" },
  { name: "ライオン", emoji: "🦁", personality: "堂々とした存在感のリーダータイプ。面倒見が良く頼りにされます。", strength: "統率力・包容力", weakness: "プライドが高い・頑固" },
  { name: "ゾウ", emoji: "🐘", personality: "努力家で忍耐強い。コツコツと積み上げて大きな成果を出します。", strength: "忍耐力・誠実さ", weakness: "融通が利かない" },
  { name: "サル", emoji: "🐒", personality: "頭の回転が速く器用。社交的で場を明るくするムードメーカー。", strength: "知性・社交性", weakness: "落ち着きがない" },
  { name: "オオカミ", emoji: "🐺", personality: "一匹狼的な独立心の持ち主。信念を貫く強さがあります。", strength: "独立心・信念", weakness: "協調性不足" },
  { name: "コアラ", emoji: "🐨", personality: "穏やかでマイペース。人を癒す不思議な魅力の持ち主。", strength: "癒し力・安定感", weakness: "受動的・優柔不断" },
  { name: "虎", emoji: "🐯", personality: "情熱的で正義感が強い。困っている人を放っておけない親分肌。", strength: "正義感・情熱", weakness: "短気・おせっかい" },
  { name: "黒ヒョウ", emoji: "🐈‍⬛", personality: "ミステリアスで感性豊か。独自の美意識を持つアーティストタイプ。", strength: "感性・美意識", weakness: "気難しい" },
  { name: "ひつじ", emoji: "🐑", personality: "協調性があり思いやり深い。チームの潤滑油として活躍します。", strength: "協調性・思いやり", weakness: "自己主張が弱い" },
  { name: "たぬき", emoji: "🦝", personality: "世渡り上手で愛嬌たっぷり。どんな環境にも適応できます。", strength: "適応力・愛嬌", weakness: "本音を隠す" },
  { name: "こじか", emoji: "🦌", personality: "純粋で繊細。人の気持ちに敏感で、深い愛情を持っています。", strength: "純粋さ・共感力", weakness: "傷つきやすい" },
];

// カラー別の性格特性
export const ANIMAL_COLORS = {
  "レッド": { trait: "情熱的で行動力がある", colorCode: "#EF5350" },
  "ブルー": { trait: "冷静で知的、計画的", colorCode: "#42A5F5" },
  "オレンジ": { trait: "社交的で明るく前向き", colorCode: "#FFA726" },
  "ブラウン": { trait: "堅実で誠実、地に足がついている", colorCode: "#8D6E63" },
  "パープル": { trait: "神秘的で感性豊か", colorCode: "#AB47BC" },
  "イエロー": { trait: "楽観的でユーモアがある", colorCode: "#FFEE58" },
  "グリーン": { trait: "協調性があり温和", colorCode: "#66BB6A" },
  "ゴールド": { trait: "華やかで存在感がある", colorCode: "#FFD700" },
  "シルバー": { trait: "洗練されていてクール", colorCode: "#B0BEC5" },
};

// キャラナンバー1〜60の動物×カラー対応表
// index 0 = キャラナンバー1, index 59 = キャラナンバー60
// animalIdx は ANIMALS配列のインデックス
export const ANIMAL_60 = [
  { animalIdx: 0, color: "イエロー" },   // 1: イエローのペガサス
  { animalIdx: 1, color: "レッド" },     // 2: レッドのチータ
  { animalIdx: 4, color: "レッド" },     // 3: レッドのサル
  { animalIdx: 1, color: "ブラウン" },   // 4: ブラウンのチータ
  { animalIdx: 6, color: "ブラウン" },   // 5: ブラウンのコアラ
  { animalIdx: 5, color: "レッド" },     // 6: レッドのオオカミ
  { animalIdx: 11, color: "イエロー" },  // 7: イエローのこじか
  { animalIdx: 10, color: "グリーン" },  // 8: グリーンのたぬき
  { animalIdx: 1, color: "オレンジ" },   // 9: オレンジのチータ
  { animalIdx: 2, color: "イエロー" },   // 10: イエローのライオン
  { animalIdx: 4, color: "ブルー" },     // 11: ブルーのサル
  { animalIdx: 8, color: "イエロー" },   // 12: イエローの黒ヒョウ
  { animalIdx: 9, color: "パープル" },   // 13: パープルのひつじ
  { animalIdx: 10, color: "シルバー" },  // 14: シルバーのたぬき
  { animalIdx: 0, color: "グリーン" },   // 15: グリーンのペガサス
  { animalIdx: 6, color: "ブルー" },     // 16: ブルーのコアラ
  { animalIdx: 7, color: "イエロー" },   // 17: イエローの虎
  { animalIdx: 8, color: "シルバー" },   // 18: シルバーの黒ヒョウ
  { animalIdx: 3, color: "イエロー" },   // 19: イエローのゾウ
  { animalIdx: 2, color: "グリーン" },   // 20: グリーンのライオン
  { animalIdx: 5, color: "ブルー" },     // 21: ブルーのオオカミ
  { animalIdx: 7, color: "オレンジ" },   // 22: オレンジの虎
  { animalIdx: 0, color: "レッド" },     // 23: レッドのペガサス
  { animalIdx: 11, color: "パープル" },  // 24: パープルのこじか
  { animalIdx: 4, color: "オレンジ" },   // 25: オレンジのサル
  { animalIdx: 6, color: "レッド" },     // 26: レッドのコアラ
  { animalIdx: 11, color: "ブルー" },    // 27: ブルーのこじか
  { animalIdx: 8, color: "レッド" },     // 28: レッドの黒ヒョウ
  { animalIdx: 3, color: "グリーン" },   // 29: グリーンのゾウ
  { animalIdx: 3, color: "ブルー" },     // 30: ブルーのゾウ
  { animalIdx: 10, color: "ゴールド" },  // 31: ゴールドのたぬき
  { animalIdx: 9, color: "オレンジ" },   // 32: オレンジのひつじ
  { animalIdx: 5, color: "ブラウン" },   // 33: ブラウンのオオカミ
  { animalIdx: 4, color: "ゴールド" },   // 34: ゴールドのサル
  { animalIdx: 2, color: "ブルー" },     // 35: ブルーのライオン
  { animalIdx: 7, color: "ブルー" },     // 36: ブルーの虎
  { animalIdx: 1, color: "イエロー" },   // 37: イエローのチータ
  { animalIdx: 9, color: "ブルー" },     // 38: ブルーのひつじ
  { animalIdx: 5, color: "パープル" },   // 39: パープルのオオカミ
  { animalIdx: 3, color: "ゴールド" },   // 40: ゴールドのゾウ
  { animalIdx: 6, color: "パープル" },   // 41: パープルのコアラ
  { animalIdx: 2, color: "レッド" },     // 42: レッドのライオン
  { animalIdx: 8, color: "ブルー" },     // 43: ブルーの黒ヒョウ
  { animalIdx: 0, color: "ゴールド" },   // 44: ゴールドのペガサス
  { animalIdx: 10, color: "レッド" },    // 45: レッドのたぬき
  { animalIdx: 11, color: "レッド" },    // 46: レッドのこじか
  { animalIdx: 9, color: "ブラウン" },   // 47: ブラウンのひつじ
  { animalIdx: 7, color: "ブラウン" },   // 48: ブラウンの虎
  { animalIdx: 1, color: "パープル" },   // 49: パープルのチータ
  { animalIdx: 0, color: "シルバー" },   // 50: シルバーのペガサス
  { animalIdx: 9, color: "ゴールド" },   // 51: ゴールドのひつじ
  { animalIdx: 11, color: "オレンジ" },  // 52: オレンジのこじか
  { animalIdx: 4, color: "ブラウン" },   // 53: ブラウンのサル
  { animalIdx: 3, color: "レッド" },     // 54: レッドのゾウ
  { animalIdx: 2, color: "オレンジ" },   // 55: オレンジのライオン
  { animalIdx: 5, color: "オレンジ" },   // 56: オレンジのオオカミ
  { animalIdx: 6, color: "オレンジ" },   // 57: オレンジのコアラ
  { animalIdx: 8, color: "オレンジ" },   // 58: オレンジの黒ヒョウ
  { animalIdx: 7, color: "パープル" },   // 59: パープルの虎
  { animalIdx: 10, color: "パープル" },  // 60: パープルのたぬき
];
