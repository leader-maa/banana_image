
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Code, Maximize2, Share2, LayoutGrid } from 'lucide-react';
import { GeneratedAsset } from '../types';

interface SvgPreviewProps { data: GeneratedAsset | null; }

export const SvgPreview: React.FC<SvgPreviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setReveal(true), 150);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) return null;
  const isSvg = data.type === 'svg';

  const handleCopyCode = () => {
    if (isSvg) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = isSvg 
      ? new Blob([data.content], { type: 'image/svg+xml' })
      : null;
    
    if (isSvg && blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `创意工厂-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      window.open(data.content, '_blank');
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto mt-20 px-4 transition-all duration-1000 transform ${reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)]">
        
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-10 py-7 bg-zinc-900/30 border-b border-white/5">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <LayoutGrid className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{isSvg ? '矢量资产生成完毕' : '视觉影像渲染完毕'}</h3>
              <p className="text-xs text-zinc-500 font-medium tracking-widest mt-0.5">唯一识别码: {data.id.substring(0,12).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-4">
            {isSvg && (
              <button onClick={handleCopyCode} title="复制代码" className="p-4 text-zinc-400 hover:text-white bg-white/5 rounded-2xl transition-all">
                {copied ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Code className="w-6 h-6" />}
              </button>
            )}
            <button onClick={handleDownload} className="flex items-center gap-3 px-10 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-xl active:scale-95">
              <Download className="w-5 h-5" />
              <span>下载{isSvg ? '矢量文件' : '原始图片'}</span>
            </button>
          </div>
        </div>

        {/* 画布区 */}
        <div className="relative p-16 md:p-24 flex items-center justify-center bg-[#020202] min-h-[550px] group">
          {/* 设计网格背景 */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 w-full flex items-center justify-center max-w-3xl">
            {isSvg ? (
              <div 
                className="w-full drop-shadow-[0_0_50px_rgba(99,102,241,0.25)] svg-render-container"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            ) : (
              <div className="relative">
                <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                <img 
                  src={data.content} 
                  className="relative max-w-full max-h-[65vh] rounded-3xl shadow-2xl border border-white/5 object-contain"
                  alt="generated" 
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-10 right-10 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <button className="p-3 bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-white/10 text-zinc-400 hover:text-white"><Maximize2 className="w-5 h-5"/></button>
             <button className="p-3 bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-white/10 text-zinc-400 hover:text-white"><Share2 className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="px-10 py-5 bg-zinc-900/50 border-t border-white/5 flex items-center gap-8 overflow-hidden">
           <div className="text-xs font-bold text-indigo-500 shrink-0">状态：已提交本地存储</div>
           <div className="h-4 w-[1px] bg-white/10 shrink-0"></div>
           <div className="text-xs font-medium text-zinc-500 truncate italic">核心提示词："{data.prompt}"</div>
        </div>
      </div>

      <style>{`
        .svg-render-container svg {
          width: 100%;
          height: auto;
          display: block;
          max-height: 500px;
        }
      `}</style>
    </div>
  );
};
