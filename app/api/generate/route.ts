
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// 阿里 API 配置 (仅存在于后端，不会泄露给前端)
const ALIBABA_API_KEY = "sk-c21002c153204a19bdd9759ef619bf97";
const ALIBABA_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

/**
 * 提取并清洗字符串中的 SVG 内容
 */
const cleanSvgOutput = (text: string): string => {
  if (!text) return "";
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch && svgMatch[0]) {
    return svgMatch[0];
  }
  return text.replace(/```(xml|svg)?/gi, '').replace(/```/g, '').trim();
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelId } = await req.json();

    const systemInstruction = `
      You are a world-class expert in Scalable Vector Graphics (SVG) design. 
      Return ONLY raw SVG code for: "${prompt}".
      Rules: self-contained, viewBox included, gradients used, no markdown backticks.
    `;

    // 1. 阿里通义千问逻辑 (服务端调用)
    if (modelId === 'qwen-plus') {
      const response = await fetch(ALIBABA_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ALIBABA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-plus",
          input: {
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: `Generate SVG for: ${prompt}` }
            ]
          },
          parameters: { result_format: "message" }
        })
      });

      if (!response.ok) {
        const err = await response.json();
        return NextResponse.json({ error: err.message || "Alibaba API Error" }, { status: response.status });
      }

      const data = await response.json();
      const content = data.output.choices[0].message.content || '';
      return NextResponse.json({ svg: cleanSvgOutput(content) });
    } 

    // 2. Google Gemini 逻辑 (服务端调用)
    else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return NextResponse.json({ svg: cleanSvgOutput(response.text || "") });
    }

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
