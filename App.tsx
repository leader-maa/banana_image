
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateSvgViaApi } from './services/apiClient';
import { GeneratedSvg, GenerationStatus, ApiError } from './types';
import { AlertCircle, Box, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentSvg, setCurrentSvg] = useState<GeneratedSvg | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = async (prompt: string, modelId: string) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentSvg(null);

    try {
      // 现在调用的是我们自己的后端接口，Key 不会暴露
      const svgContent = await generateSvgViaApi(prompt, modelId);
      
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
      console.error("Frontend Error Catch:", err);
      setStatus(GenerationStatus.ERROR);
      setError({
        message: "后端响应异常",
        details: err.message || "无法完成生成任务。"
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 pt-8">      
      {/* 安全提醒 - 告知用户当前为后端安全调用 */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold bg-emerald-500/5 py-1 px-3 rounded-full border border-emerald-500/10 w-fit mx-auto">
          <ShieldCheck className="w-3 h-3" /> 
          Server-Side Protected Mode
        </div>
      </div>

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
