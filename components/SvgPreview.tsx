
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Code, ImageIcon } from 'lucide-react';
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
      link.download = `vector-${data.id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // 图片直接跳转新窗口下载
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
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 uppercase">
              {data.type}
            </span>
            <h3 className="text-sm font-medium text-zinc-300 truncate max-w-[200px]">
              {data.prompt}
            </h3>
          </div>
          <div className="flex gap-2">
            {isSvg && (
              <button
                onClick={handleCopyCode}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Code className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-900 bg-white rounded-lg hover:bg-zinc-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>下载文件</span>
            </button>
          </div>
        </div>

        <div className="p-8 flex items-center justify-center bg-zinc-950/50 min-h-[400px] relative">
          {isSvg ? (
            <div 
              className="w-full max-w-[500px] h-auto flex items-center justify-center"
              dangerouslySetInnerHTML={{ 
                __html: data.content.includes('<svg') ? data.content : `<p class="text-red-500">无效的 SVG 代码</p>` 
              }} 
            />
          ) : (
            <img 
              src={data.content} 
              alt={data.prompt}
              className="max-w-full max-h-[600px] rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-500"
            />
          )}
        </div>
        
        <div className="px-4 py-2 bg-zinc-950 border-t border-white/5 flex justify-between text-[10px] text-zinc-600 uppercase tracking-widest">
          <span>AI 生成资产</span>
          <span>{data.modelId}</span>
        </div>
      </div>
    </div>
  );
};
