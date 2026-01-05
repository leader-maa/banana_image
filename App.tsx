
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateSvgViaApi } from './services/apiClient';
import { GeneratedAsset, GenerationStatus } from './types';
import { Box, Loader2, Cpu, Activity, Globe } from 'lucide-react';

const LOADING_STEPS = [
  "正在链接神经网络计算单元...",
  "正在解析创意核心指令...",
  "正在校准矢量路径权重...",
  "正在优化材质渲染引擎...",
  "正在构建多维空间投影...",
  "正在执行视觉平滑处理...",
  "同步全球节点渲染结果..."
];

const REPAIR_STEPS = [
  "检测到算力波动，正在自动校准...",
  "正在通过备用节点重构数据...",
  "正在优化神经元连接效率...",
  "深度学习模型正在自我进化...",
  "正在应用最终视觉平滑..."
];

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isRepairing, setIsRepairing] = useState(false);

  useEffect(() => {
    let interval: any;
    if (status === GenerationStatus.LOADING) {
      const steps = isRepairing ? REPAIR_STEPS : LOADING_STEPS;
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % steps.length);
      }, 2800);
    }
    return () => clearInterval(interval);
  }, [status, isRepairing]);

  const handleGenerate = async (prompt: string, modelId: string) => {
    setStatus(GenerationStatus.LOADING);
    setLoadingStep(0);
    setIsRepairing(false);
    setCurrentAsset(null);

    try {
      const response: any = await generateSvgViaApi(prompt, modelId);
      
      
      setTimeout(() => {
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
      }, 4500);
    } catch (err: any) {
      console.warn("后台任务进入静默重构阶段...", err);
      // 核心需求：即便报错也不提示，转入“自动修复/重构”的忙碌状态
      setTimeout(() => {
        setIsRepairing(true);
        setLoadingStep(0);
      }, 2000);
    }
  };

  const currentSteps = isRepairing ? REPAIR_STEPS : LOADING_STEPS;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 overflow-x-hidden">      
      {/* 背景光影 */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 pt-10">
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-3 text-[12px] font-bold tracking-widest text-indigo-400 bg-indigo-500/5 py-2 px-5 rounded-full border border-indigo-500/10 w-fit mx-auto shadow-2xl">
            <Activity className="w-4 h-4 animate-pulse" /> 
            全脑神经设计核心：运行中
          </div>
        </div>

        <main className="pb-32">
          <InputSection onGenerate={handleGenerate} status={status} />
          
          {status === GenerationStatus.LOADING && (
            <div className="max-w-xl mx-auto mt-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative inline-block mb-12">
                <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 border-t-2 border-l-2 border-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  {currentSteps[loadingStep]}
                </h3>
                <div className="w-full bg-zinc-900/50 h-2 rounded-full overflow-hidden max-w-sm mx-auto border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                    style={{ width: `${((loadingStep + 1) / currentSteps.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-center gap-8 mt-10">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                    <Globe className="w-4 h-4" /> 全球分布算力
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                    <Activity className="w-4 h-4" /> 延迟: 18ms
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === GenerationStatus.SUCCESS && currentAsset && (
            <SvgPreview data={currentAsset} />
          )}
          
          {status === GenerationStatus.IDLE && (
            <div className="max-w-2xl mx-auto mt-32 text-center px-4 opacity-10">
               <Box className="w-20 h-20 text-zinc-400 mx-auto mb-6" />
               <p className="text-zinc-600 text-sm font-bold tracking-[0.6em] uppercase">等待指令输入</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
