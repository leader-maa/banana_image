
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";

// 初始化 Gemini 客户端
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 阿里 API 配置 (仅供测试使用)
const ALIBABA_API_KEY = "sk-c21002c153204a19bdd9759ef619bf97";
const ALIBABA_ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

/**
 * 提取并清洗字符串中的 SVG 内容
 */
const cleanSvgOutput = (text: string): string => {
  if (!text) return "";
  
  // 匹配 <svg 到 </svg> 标签及其内容
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
  if (svgMatch && svgMatch[0]) {
    return svgMatch[0];
  }
  
  // 兜底逻辑：去掉可能存在的 markdown 标记
  return text
    .replace(/```(xml|svg)?/gi, '')
    .replace(/```/g, '')
    .trim();
};

/**
 * 通用的 SVG 生成函数
 */
export const generateSvg = async (prompt: string, modelId: string): Promise<string> => {
  const systemInstruction = `
    You are a world-class expert in Scalable Vector Graphics (SVG) design. 
    Return ONLY raw SVG code for: "${prompt}".
    Rules: 
    - Must be self-contained (standalone).
    - viewBox attribute is mandatory.
    - Use gradients and professional shadows.
    - DO NOT include markdown code blocks or any explanation text.
  `;

  try {
    // ---------------------------------------------------------
    // 阿里通义千问模型实现
    // ---------------------------------------------------------
    if (modelId === 'qwen-plus') {
      console.log(`[DEBUG] Calling Alibaba Qwen with prompt: ${prompt}`);
      
      const response = await fetch(ALIBABA_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ALIBABA_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: "qwen-plus",
          input: {
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: `Please generate the SVG code for: ${prompt}. Only output the code.` }
            ]
          },
          parameters: {
            result_format: "message"
          }
        })
      }).catch(err => {
        // 特别处理浏览器 fetch 失败（如 CORS 问题）
        if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          throw new Error("浏览器安全策略拦截 (CORS Error)。阿里 API 默认不支持前端直接调用，请尝试使用 Gemini 模型，或在后端代理调用。");
        }
        throw err;
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.message || errData.code || errorMsg;
        } catch (e) {}
        throw new Error(`阿里 API 报错: ${errorMsg}`);
      }

      const data = await response.json();
      console.log("[DEBUG] Qwen raw response:", data);

      if (data.output && data.output.choices && data.output.choices[0]) {
        const content = data.output.choices[0].message.content || '';
        return cleanSvgOutput(content);
      } else {
        throw new Error("阿里 API 返回数据格式不完整");
      }
    } 

    // ---------------------------------------------------------
    // Google Gemini 模型实现
    // ---------------------------------------------------------
    else {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';
      return cleanSvgOutput(rawText);
    }

  } catch (error: any) {
    console.error(`[CRITICAL] Generation Failed for ${modelId}:`, error);
    throw error; // 抛出错误供 UI 层捕获
  }
};
