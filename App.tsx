
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateSvg } from './services/geminiService';
import { GeneratedSvg, GenerationStatus, ApiError } from './types';
import { AlertCircle, Box, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentSvg, setCurrentSvg] = useState<GeneratedSvg | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = async (prompt: string, modelId: string) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentSvg(null);

    try {
      const svgContent = await generateSvg(prompt, modelId);
      
      const newSvg: GeneratedSvg = {
        id: crypto.randomUUID(),
        content: svgContent,
        prompt: prompt,
        timestamp: Date.now(),
        modelId: modelId
      };
      
      setCurrentSvg(newSvg);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error("Catch in App.tsx:", err);
      setStatus(GenerationStatus.ERROR);
      setError({
        message: modelId === 'qwen-plus' ? "阿里引擎连接失败" : "引擎响应异常",
        details: err.message || "未知错误，请检查 API Key 或网络环境。"
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 pt-8">      
      <main className="pb-20">
        <InputSection onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="max-w-2xl mx-auto mt-8 px-4 animate-in fade-in duration-300">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col gap-4 text-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-400 text-lg">{error.message}</h4>
                  <p className="text-sm text-red-300/80 mt-2 leading-relaxed">{error.details}</p>
                </div>
              </div>
              
              {error.details?.includes("CORS") && (
                <div className="mt-2 pt-4 border-t border-red-500/20 text-xs text-red-300/60">
                  <p className="mb-2">💡 提示：阿里 API 不允许从浏览器直接访问（跨域限制）。</p>
                  <p>建议：</p>
                  <ul className="list-disc ml-4 space-y-1 mt-1">
                    <li>切换回 <b>Gemini Pro</b> 模型（已配置好后端转发，支持直接使用）。</li>
                    <li>如果您是开发者，请考虑使用中转服务器。</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {status === GenerationStatus.SUCCESS && currentSvg && (
          <SvgPreview 
            data={currentSvg} 
          />
        )}
        
        {status === GenerationStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-16 text-center px-4 opacity-30 select-none">
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900 border border-white/5 mb-4 shadow-inner">
                <Box className="w-10 h-10 text-zinc-700" />
             </div>
             <p className="text-zinc-600 text-sm font-medium tracking-widest uppercase">等待创意输入</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
