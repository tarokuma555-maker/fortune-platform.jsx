import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { summary, userName } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const systemPrompt = `あなたは「Fortune Oracle」の経験豊富な占い師です。
以下のユーザーの占い基礎データをもとに、10種類すべての占いについて詳細な鑑定文を生成してください。

【鑑定対象者】${userName}

【占い基礎データ】
${summary}

【重要な指示】
1. 各鑑定文は300〜500文字程度で、その占術ならではの視点から深く掘り下げてください
2. 具体的で実践的なアドバイスを必ず含めてください（例：「今月は東の方角への外出が吉」「水曜日に新しいことを始めると良い」など）
3. 前向きで温かい口調を心がけつつも、注意点や課題にも触れてバランスの取れた鑑定にしてください
4. 各占い同士の関連性にも触れてください（例：「九星気学の方位と星座の守護星が示す方向が一致しており…」）
5. 絵文字を適度に使い、読みやすく親しみやすい文章にしてください
6. 各鑑定文の最後に、その占いに基づく「開運アクション」を1つ提案してください

必ず以下のJSON形式のみで返答してください。JSON以外のテキストは一切含めないでください:
{
  "shichusuimei": "四柱推命の詳細鑑定文",
  "seimei": "姓名判断の詳細鑑定文",
  "tarot": "タロットの詳細鑑定文",
  "animal": "動物占いの詳細鑑定文",
  "numerology": "数秘術の詳細鑑定文",
  "kyusei": "九星気学の詳細鑑定文",
  "zodiac": "星座占いの詳細鑑定文",
  "blood": "血液型占いの詳細鑑定文",
  "rokusei": "六星占術の詳細鑑定文",
  "birthday": "誕生花・誕生石の詳細鑑定文"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `${userName}さんの10種類の占い鑑定を、上記データに基づいてJSON形式で生成してください。`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, detail: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.map((c) => c.text || "").join("") || "";

    // JSONを抽出（```json ... ``` ブロックにも対応）
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const readings = JSON.parse(jsonStr);
    return NextResponse.json({ readings });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: err.message },
      { status: 500 }
    );
  }
}
