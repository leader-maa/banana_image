import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai'; // ✅ 正确导入

const ALIBABA_API_KEY = process.env.ALIBABA_API_KEY || "sk-7ed35f5d66a947a8acf1e2b0438a658d";
// 阿里万相提交接口
const WANX_SUBMIT_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
// 任务查询接口
const TASK_QUERY_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/tasks/";

/**
 * 强化版 SVG 提取器
 * 1. 移除 markdown 标记
 * 2. 提取 <svg> 标签及其内容
 * 3. 移除 XML 声明头
 */
const extractSvg = (text: string): string => {
  if (!text) return "";
  
  // 移除 markdown 代码块包裹
  let cleanText = text
    .replace(/```svg[\s\S]*?/gi, '')
    .replace(/```xml[\s\S]*?/gi, '')
    .replace(/```html[\s\S]*?/gi, '')
    .replace(/```/g, '')
    .trim();
  
  // 正则匹配完整的 <svg ... </svg>
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = cleanText.match(svgRegex);
  
  if (match) {
    let svg = match[0];
    // 移除可能存在的 XML 声明
    svg = svg.replace(/<\?xml[\s\S]*?\?>/i, '');
    return svg.trim();
  }
  return "";
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelId } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: '缺少或无效的 prompt' }, { status: 400 });
    }

    console.log(`[API] Starting generation for model: ${modelId}`);

    // --- 1. 阿里万相文生图 (Wanx-V1) ---
    if (modelId === 'wanx-v1') {
      const submitResponse = await fetch(WANX_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ALIBABA_API_KEY}`,
          "Content-Type": "application/json",
          "X-DashScope-Async": "enable" // ✅ 删除多余逗号
        },
        body: JSON.stringify({
          model: "wanx-v1",
          input: { prompt: prompt },
          parameters: { style: "<auto>", size: "1024*1024", n: 1 }
        })
      });

      const responseText = await submitResponse.text();
      let submitData;
      try {
        submitData = JSON.parse(responseText);
      } catch (e) {
        console.error("[Alibaba] Invalid JSON response during submission:", responseText);
        throw new Error("阿里服务器响应异常 (Non-JSON)");
      }

      if (!submitResponse.ok || !submitData.output?.task_id) {
        throw new Error(submitData.message || `阿里任务提交失败: ${submitResponse.status}`);
      }

      const taskId = submitData.output.task_id;
      let imageUrl = "";
      
      // 轮询逻辑 - 最多等待 60 秒 (20次 * 3秒)
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const queryRes = await fetch(`${TASK_QUERY_ENDPOINT}${taskId}`, {
          headers: { "Authorization": `Bearer ${ALIBABA_API_KEY}` }
        });
        
        const queryText = await queryRes.text();
        let queryData;
        try {
          queryData = JSON.parse(queryText);
        } catch (e) {
          continue; // 忽略解析失败，继续轮询
        }
        
        const status = queryData.output?.task_status;
        console.log(`[Alibaba] Task ${taskId} status: ${status}`);

        if (status === 'SUCCEEDED') {
          imageUrl = queryData.output.results?.[0]?.url || "";
          break;
        } else if (status === 'FAILED') {
          throw new Error("图片生成任务失败: " + (queryData.output?.message || "未知原因"));
        }
      }

      if (!imageUrl) throw new Error("生成超时，请稍后再试。");
      return NextResponse.json({ content: imageUrl, type: 'image' });
    }

    // --- 2. Gemini 矢量图 (SVG) ---
    else if (modelId === 'gemini-svg') {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("[Gemini] Missing API_KEY in environment variables");
        return NextResponse.json({ error: "后端配置错误：未设置 Gemini API 密钥" }, { status: 500 });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // ✅ 正确模型名称

      const result = await model.generateContent([
        {
          role: "user",
          parts: [
            { text: `Create a professional, high-quality SVG graphic for: "${prompt}". 
The SVG should be clean, use modern colors or gradients, and include a proper viewBox.
Return ONLY the raw <svg> code without any explanations or markdown.` }
          ],
        },
      ]);

      const response = result.response;
      const rawText = response.text() || "";

      const svg = extractSvg(rawText);

      if (!svg) {
        console.error("[Gemini] No SVG found in response:", rawText);
        throw new Error("模型返回的内容不包含有效的 SVG 代码。");
      }

      return NextResponse.json({ content: svg, type: 'svg' });
    }

    // --- 未知 modelId ---
    else {
      return NextResponse.json({ error: '不支持的模型 ID' }, { status: 400 });
    }

  } catch (error: any) {
    console.error("[Backend Error]", error);
    return NextResponse.json({ 
      error: error.message || "生成过程出现未知错误" 
    }, { status: 500 });
  }
}

// ✅ 添加 OPTIONS 处理以支持 CORS（可选）
export function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
