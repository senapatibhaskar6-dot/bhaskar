import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Sparkles, Globe, Terminal } from 'lucide-react';
import { Property } from '../types';
import { generateSingleFileHtml } from '../utils/generateSingleFileHtml';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({
  isOpen,
  onClose,
  properties
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateSingleFileHtml(properties);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF5A5F] via-[#FF7E82] to-[#FFB400] p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>1-Click Deploy Ready</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Export Standalone Single-File HTML
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Download a single, 100% self-contained <code className="bg-white/20 px-1 py-0.5 rounded font-mono">index.html</code> file with complete inline JS & CSS. Drag & drop directly into Netlify Drop, GitHub Pages, or Vercel.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          <div className="bg-[#F7F9FB] rounded-2xl p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="font-bold text-[#222222] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
              <span>What is included in this single-file HTML?</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>All current {properties.length} live listings pre-loaded with all 4 photos</li>
              <li>Fully functional ₹99 Tenant Pass QR & UTR contact unlock system</li>
              <li>Owner property registration portal with 4-photo preview & UTR verification</li>
              <li>Visit appointment booking dialog with instant WhatsApp notification links</li>
              <li>Tailwind CSS styling using the Vibrant Palette theme</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="py-3.5 px-5 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-bold text-sm shadow-md shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download index.html</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3.5 px-5 bg-[#222222] hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-[#00A699]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied HTML!' : 'Copy Entire HTML'}</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-400">
              Tip: Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-[#FF5A5F] underline font-bold">app.netlify.com/drop</a> and drag the downloaded <code className="bg-slate-100 px-1 py-0.5 rounded text-[#222222]">index.html</code> into the browser to deploy live in 5 seconds!
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
