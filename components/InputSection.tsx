
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Send, Loader2, Cpu, Image as ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import { GenerationStatus, ModelOption } from '../types';

const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gemini-3-pro-preview', name: '矢量构建引擎', description: '生成高精 SVG 源代码', type: 'svg', icon: 'Cpu' },
  { id: 'wanx-v1', name: '视觉渲染引擎', description: '生成 4K 质感位图', type: 'image', icon: 'ImageIcon' },
];

const EXAMPLE_PROMPTS = [
  "极简主义科技 Logo",
  "赛博朋克霓虹光影插画",
  "流体渐变质感背景",
  "现代风格移动端界面"
];

interface InputSectionProps {
  onGenerate: (prompt: string, modelId: string) => void;
  status: GenerationStatus;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim(), selectedModel.id);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      onGenerate(prompt, selectedModel.id);
    }, 400);
  };

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-black tracking-tight text-white mb-6">
          创意工厂 <span className="text-indigo-500">实验室</span>
        </h2>
        <div className="flex items-center justify-center gap-4 text-zinc-400 text-lg font-medium">
          <Sparkles className="w-5 h-5 text-amber-400" />
          驱动您的数字化创意构想
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 mb-10 shadow-2xl flex gap-2">
        {MODEL_OPTIONS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`
              flex-1 flex flex-col items-center py-5 px-4 rounded-[1.8rem] transition-all duration-300
              ${selectedModel.id === model.id 
                ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/10 scale-[1.02]' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
            `}
          >
            <div className="flex items-center gap-3 mb-1">
              {model.icon === 'Cpu' ? <Cpu className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              <span className="text-lg font-bold">{model.name}</span>
            </div>
            <span className="text-xs opacity-50">{model.description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative group mb-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[2rem] opacity-20 group-focus-within:opacity-50 transition duration-700 blur-2xl"></div>
        <div className="relative flex items-center bg-[#0a0a0a] rounded-[1.8rem] border border-white/10 shadow-2xl p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`在此键入您的创意描述...`}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-700 px-6 py-5 text-xl font-bold"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold transition-all duration-500
              ${!input.trim() || isLoading 
                ? 'bg-zinc-900 text-zinc-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-xl'}
            `}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
            <span className="text-lg">立即生成</span>
          </button>
        </div>
      </form>

      {/* 热门示例词库 */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest">
           灵感词推荐
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-sm px-6 py-2.5 rounded-full border border-white/5 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-all hover:bg-indigo-500/5"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
