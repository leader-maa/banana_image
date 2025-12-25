
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateSvgViaApi } from './services/apiClient';
import { GeneratedAsset, GenerationStatus, ApiError } from './types';
import { AlertCircle, Box, ShieldCheck, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = async (prompt: string, modelId: string) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentAsset(null);

    try {
      const response: any = await generateSvgViaApi(prompt, modelId);
      
      const newAsset: GeneratedAsset = {
        id: crypto.randomUUID(),
        type: response.type,
        content: response.content,
        prompt: prompt,
        timestamp: Date.now(),
        modelId: modelId
      };
      
      setCurrentAsset(newAsset);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error("Frontend Error:", err);
      setStatus(GenerationStatus.ERROR);
      setError({
        message: "生成请求失败",
        details: err.message || "无法从云端获取生成结果。"
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 pt-8">      
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-indigo-500/80 font-bold bg-indigo-500/5 py-1 px-3 rounded-full border border-indigo-500/10 w-fit mx-auto">
          <Zap className="w-3 h-3" /> 
          AI Creative Hub Active
        </div>
      </div>

      <main className="pb-20">
        <InputSection onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="max-w-2xl mx-auto mt-8 px-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-400">{error.message}</h4>
                  <p className="text-sm text-red-300/80 mt-1">{error.details}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === GenerationStatus.SUCCESS && currentAsset && (
          <SvgPreview 
            data={currentAsset} 
          />
        )}
        
        {status === GenerationStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-16 text-center px-4 opacity-20">
             <Box className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
             <p className="text-zinc-600 text-xs font-bold tracking-[0.3em] uppercase">Ready for Input</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
