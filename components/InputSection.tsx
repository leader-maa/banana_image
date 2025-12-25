
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { Send, Loader2, Wand2, Cpu, Zap, Box, Sparkles } from 'lucide-react';
import { GenerationStatus, ModelOption } from '../types';

const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gemini-3-pro-preview', name: 'Gemini Pro', description: 'Google 最强模型', provider: 'gemini', icon: 'Cpu' },
  { id: 'qwen-plus', name: '通义千问', description: '阿里开源旗舰模型', provider: 'custom', icon: 'Sparkles' },
  { id: 'gemini-3-flash-preview', name: 'Gemini Flash', description: '速度与质量平衡', provider: 'gemini', icon: 'Zap' },
];

interface InputSectionProps {
  onGenerate: (prompt: string, modelId: string) => void;
  status: GenerationStatus;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim(), selectedModel.id);
    }
  }, [input, status, selectedModel, onGenerate]);

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-3 tracking-tight">
          矢量工坊 <span className="text-indigo-500">2.0</span>
        </h2>
        <p className="text-zinc-400 text-lg italic">
          自由选择 AI 大脑，开启您的创意之旅。
        </p>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 mb-6 gap-1">
        {MODEL_OPTIONS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`
              flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200
              ${selectedModel.id === model.id 
                ? 'bg-zinc-800 text-white shadow-lg border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}
            `}
          >
            <div className="flex items-center gap-2 mb-0.5">
              {model.icon === 'Cpu' && <Cpu className="w-4 h-4" />}
              {model.icon === 'Zap' && <Zap className="w-4 h-4" />}
              {model.icon === 'Box' && <Box className="w-4 h-4" />}
              {model.icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
              <span className="text-xs font-bold uppercase tracking-wider">{model.name}</span>
            </div>
            <span className="text-[10px] opacity-60 hidden sm:block">{model.description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-10 group-focus-within:opacity-30 transition duration-500 blur-lg"></div>
        <div className="relative flex items-center bg-zinc-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden p-2">
          <div className="pl-4 text-zinc-500">
            <Wand2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`描述你想生成的矢量图... (当前使用: ${selectedModel.name})`}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 px-4 py-3 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${!input.trim() || isLoading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 shadow-lg'}
            `}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['赛博朋克猫', '简约风山脉', '实验室烧瓶', '部落风格太阳'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-500 bg-zinc-900/40 border border-white/5 rounded-full hover:bg-zinc-800 hover:text-white transition-all"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
