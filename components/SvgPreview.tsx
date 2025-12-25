
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Code, ImageIcon, ExternalLink } from 'lucide-react';
import { GeneratedAsset } from '../types';

interface SvgPreviewProps {
  data: GeneratedAsset | null;
}

export const SvgPreview: React.FC<SvgPreviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [data]);

  if (!data) return null;

  const isSvg = data.type === 'svg';

  const handleDownload = () => {
    if (isSvg) {
      const blob = new Blob([data.content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vector-art-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open(data.content, '_blank');
    }
  };

  const handleCopyCode = () => {
    if (isSvg) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isSvg ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">
              {data.type} Asset
            </span>
          </div>
          <div className="flex gap-2">
            {isSvg && (
              <button
                onClick={handleCopyCode}
                title="复制代码"
                className="p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Code className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 active:scale-95 transition-all shadow-lg"
            >
              {isSvg ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
              <span>{isSvg ? '保存 SVG' : '查看原图'}</span>
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12 flex items-center justify-center bg-[#050505] min-h-[450px]">
          {isSvg ? (
            <div 
              className="w-full flex items-center justify-center svg-container"
              dangerouslySetInnerHTML={{ __html: data.content }}
              style={{
                // 确保 SVG 能够根据容器宽度自适应，且不溢出
                maxWidth: '100%',
                maxHeight: '60vh'
              }}
            />
          ) : (
            <div className="relative group">
               <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
               <img 
                src={data.content} 
                alt={data.prompt}
                className="relative max-w-full max-h-[60vh] rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-700"
              />
            </div>
          )}
        </div>
        
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex flex-col md:flex-row justify-between gap-2 text-[10px] text-zinc-500">
          <div className="flex gap-4">
            <span className="font-mono opacity-50 uppercase">Model: {data.modelId}</span>
            <span className="font-mono opacity-50">Prompt: {data.prompt.substring(0, 50)}{data.prompt.length > 50 ? '...' : ''}</span>
          </div>
          <span className="font-mono opacity-50 uppercase">{new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      <style>{`
        .svg-container svg {
          width: 100%;
          height: auto;
          display: block;
          max-height: 400px;
        }
      `}</style>
    </div>
  );
};
