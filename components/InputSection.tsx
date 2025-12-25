
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { Send, Loader2, Wand2, Cpu, Image as ImageIcon } from 'lucide-react';
import { GenerationStatus, ModelOption } from '../types';

const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gemini-3-pro-preview', name: 'Gemini (矢量)', description: '生成可编辑 SVG 代码', type: 'svg', icon: 'Cpu' },
  { id: 'wanx-v1', name: '阿里万相 (图片)', description: '生成高质量位图图像', type: 'image', icon: 'ImageIcon' },
];

interface InputSectionProps {
  onGenerate: (prompt: string, modelId: string) => void;
  status: GenerationStatus;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim(), selectedModel.id);
    }
  };

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-3 tracking-tight">
          创意工厂 <span className="text-indigo-500">Dual</span>
        </h2>
        <p className="text-zinc-400 text-lg">
          左手矢量，右手光影。
        </p>
      </div>

      <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5 mb-6 gap-1">
        {MODEL_OPTIONS.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`
              flex-1 flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200
              ${selectedModel.id === model.id 
                ? 'bg-zinc-800 text-white shadow-lg border border-white/10' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              {model.icon === 'Cpu' ? <Cpu className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              <span className="text-sm font-bold uppercase tracking-wider">{model.name}</span>
            </div>
            <span className="text-[10px] opacity-60">{model.description}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-10 group-focus-within:opacity-20 transition duration-500 blur-lg"></div>
        <div className="relative flex items-center bg-zinc-900 rounded-xl border border-white/10 shadow-2xl p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`描述您的创意方案...`}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 px-4 py-3 text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
              ${!input.trim() || isLoading 
                ? 'bg-zinc-800 text-zinc-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-lg'}
            `}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};
