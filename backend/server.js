const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-insights", async (req, res) => {
  console.log("Received request for /api/generate-insights");

  try {
    const { chartData, settings } = req.body;

    // データが不完全な場合はエラーを返す
    if (!chartData || !settings) {
      return res
        .status(400)
        .json({
          error: "無効なリクエストです。chartDataとsettingsを提供してください。",
        });
    }
    
    const prompt = `
    以下のデータと設定を分析し、専門家としてプレゼンテーションで使えるような、具体的で深い洞察を3つ提供してください。

    **データ:**
    - 特徴量: ${chartData.features.join(", ")}
    - レコード:
    ${chartData.records
      .slice(0, 10)
      .map((row) => `  -[${row.join(", ")}`)
      .join("\n")}
    ${chartData.records.length > 10 ? "  -(他多数...)" : ""}

    **グラフ設定:**
    - グラフの種類: ${settings.chartType}
    - X軸: ${settings.xAxisFeature}
    - Y軸: ${settings.yAxisFeatures.join(", ")}

    **分析のポイント:**
    1.  **主要な傾向:** データ全体で最も顕著な傾向（例: 「売上高は一貫して増加傾向にあり、特に後半に急増」）
    2.  **異常値や特異点:** 他と大きく異なるデータポイント（例: 「4月の利益が著しく低いが、これは特定のイベントによるものか？」）
    3.  **相関関係や因果関係の仮説:** 複数の特徴量間の関係性（例: 「広告費とウェブサイト訪問者数に強い正の相関が見られ、広告が効果的に機能している可能性」）

    上記のポイントに基づき、簡潔なタイトルと、具体的な数値や変化を交えた詳細な説明を生成してください。
    `;
    console.log("Generated prompt for Gemini API");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.time("gemini-api-call");
    const result = await model.generateContent(prompt);
    console.timeEnd("gemini-api-call");
    const response = await result.response;
    const aiText = response.text();

    console.log("Parsing AI response");
    // テキストをパースして示唆の配列に変換
    const insights = aiText
      .split(/\n(?=\d\.|\*|- )/) // 番号付きリスト、アスタリスク、ハイフンで分割
      .map((item) => item.trim())
      .filter((item) => item)
      .map((item) => {
        const match = item.match(/(?:\d\.|\*|- )\s*\*\*(.*?)\*\*\s*:\s*(.*)/);
        if (match) {
          return { title: match[1].trim(), description: match[2].trim() };
        }
        // タイトルがない場合は、最初の部分をタイトルとする
        const lines = item.split("\n");
        const title = lines[0].replace(/(\d\.|\*|- )\s*/, "").trim();
        const description = lines.slice(1).join("\n").trim();
        return { title, description };
      });

    console.log("Sending response");
    res.json({ insights });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "AI API呼び出しに失敗しました",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});