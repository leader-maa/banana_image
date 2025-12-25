
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ALIBABA_API_KEY = "sk-c21002c153204a19bdd9759ef619bf97";
// 万相提交接口
const WANX_SUBMIT_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
// 任务查询接口前缀
const TASK_QUERY_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/tasks/";

const extractSvg = (text: string): string => {
  if (!text) return "";
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = text.match(svgRegex);
  return match ? match[0].trim() : "";
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelId } = await req.json();

    // --- 1. 阿里万相文生图逻辑 ---
    if (modelId === 'wanx-v1') {
      console.log("[Backend] Submitting Wanx-V1 Job...");
      const submitResponse = await fetch(WANX_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ALIBABA_API_KEY}`,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable" // 启用异步
        },
        body: JSON.stringify({
          model: "wanx-v1",
          input: { prompt: prompt },
          parameters: { style: "<auto>", size: "1024*1024", n: 1 }
        })
      });

      const submitData = await submitResponse.json();
      if (!submitResponse.ok || !submitData.output?.task_id) {
        throw new Error(submitData.message || "阿里任务提交失败");
      }

      const taskId = submitData.output.task_id;
      let imageUrl = "";
      
      // 轮询任务状态 (简单实现，最多尝试 15 次，每次间隔 3s)
      for (let i = 0; i < 15; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`[Backend] Polling task ${taskId} (Attempt ${i+1})...`);
        
        const queryRes = await fetch(`${TASK_QUERY_ENDPOINT}${taskId}`, {
          headers: { "Authorization": `Bearer ${ALIBABA_API_KEY}` }
        });
        const queryData = await queryRes.json();
        
        if (queryData.output.task_status === 'SUCCEEDED') {
          imageUrl = queryData.output.results[0].url;
          break;
        } else if (queryData.output.task_status === 'FAILED') {
          throw new Error("阿里图片生成任务失败: " + queryData.output.message);
        }
      }

      if (!imageUrl) throw new Error("图片生成超时，请稍后重试。");
      return NextResponse.json({ content: imageUrl, type: 'image' });
    }

    // --- 2. Gemini 生成 SVG 逻辑 ---
    else {
      console.log("[Backend] Calling Gemini for SVG...");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a professional SVG artist. Output ONLY the valid SVG code for the user request. No text, no markdown. Use attractive colors and clean paths.",
          temperature: 0.7,
        },
      });

      const svg = extractSvg(result.text || "");
      if (!svg) throw new Error("模型未能生成有效的矢量图代码。");
      return NextResponse.json({ content: svg, type: 'svg' });
    }

  } catch (error: any) {
    console.error("[Backend Error]", error);
    return NextResponse.json({ error: error.message || "生成过程出错" }, { status: 500 });
  }
}
