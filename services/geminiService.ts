
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an SVG string based on the user's prompt.
 */
export const generateSvgFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const systemPrompt = `
      You are a world-class expert in Scalable Vector Graphics (SVG) design and coding. 
      Your task is to generate a high-quality, visually stunning, and detailed SVG based on the user's description.
      
      Guidelines:
      1.  **Output Format**: Return ONLY the raw SVG code. Do not wrap it in markdown code blocks.
      2.  **Quality**: Use gradients, proper pathing, and distinct colors.
      3.  **Technical**: 
          - Always include a \`viewBox\` attribute.
          - Ensure the SVG is self-contained.
          - Default size should be square (512x512).
    `;

    const fullPrompt = `Create an SVG representation of the following object/item: "${prompt}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
      },
    });

    const rawText = response.text || '';
    
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
    
    if (svgMatch && svgMatch[0]) {
      return svgMatch[0];
    } else {
      return rawText.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "生成 SVG 失败。");
  }
};
