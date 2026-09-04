import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { NestFinderLogo } from './NestFinderLogo';

interface UpiPaymentQrCardProps {
  amount?: number;
  note?: string;
  className?: string;
  showCopyButton?: boolean;
}

export const UpiPaymentQrCard: React.FC<UpiPaymentQrCardProps> = ({
  amount = 99,
  note = 'NestFinder Pass',
  className = '',
  showCopyButton = true
}) => {
  const [copied, setCopied] = useState(false);
  const upiId = '6913514367@okbizaxis';
  const payeeName = 'NEST FINDER';
  const merchantPhone = '+91 69135 14367';

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    upiUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Phone/Card Frame matching the exact uploaded QR design */}
      <div className="bg-white rounded-[20px] shadow-lg border border-slate-200/80 w-full max-w-[240px] sm:max-w-[260px] text-center flex flex-col items-center overflow-hidden relative pb-4">
        
        {/* Top Google Colors Bar */}
        <div className="w-full grid grid-cols-4 h-1.5">
          <div className="bg-[#4285F4]"></div>
          <div className="bg-[#34A853]"></div>
          <div className="bg-[#FBBC05]"></div>
          <div className="bg-[#EA4335]"></div>
        </div>

        {/* Google Pay Header */}
        <div className="flex flex-col items-center justify-center mt-3.5 mb-2">
          <div className="flex items-center gap-1">
            <svg viewBox="0 0 40 40" className="w-5 h-5">
              <path fill="#ea4335" d="M20 5C11.7 5 5 11.7 5 20s6.7 15 15 15 15-6.7 15-15S28.3 5 20 5zm5 16.5c0 .3-.1.6-.3.8l-4.5 4.5c-.4.4-1.1.4-1.5 0l-4.5-4.5c-.2-.2-.3-.5-.3-.8V15c0-.6.4-1 1-1h9c.6 0 1 .4 1 1v6.5z"/>
              <path fill="#4285f4" d="M19.5 25.5l5.5-5.5V15h-11v5l5.5 5.5z"/>
              <path fill="#34a853" d="M20 5c8.3 0 15 6.7 15 15s-6.7 15-15 15-15-6.7-15-15S11.7 5 20 5z" fillOpacity="0.15"/>
            </svg>
            <span className="text-[11px] font-bold text-slate-500 tracking-wide font-sans">Google Pay</span>
          </div>
          
          <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 tracking-tight">
            {payeeName}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wider">{merchantPhone}</p>
          <span className="text-[8px] font-black uppercase text-[#4285F4] tracking-widest mt-1 bg-blue-50 px-1.5 py-0.5 rounded-full">Scan & pay</span>
        </div>

        {/* White QR Code Container with Center GPay badge */}
        <div className="relative bg-white px-3.5 py-1.5 flex flex-col items-center justify-center w-full">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center border-2 border-slate-100 rounded-2xl p-1.5 shadow-xs">
            <img
              src={qrImageUrl}
              alt={`UPI QR Code for ${payeeName}`}
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
            {/* Centered GPay Logo Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-md border-2 border-slate-100 flex items-center justify-center p-0.5">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* UPI ID Text beneath QR */}
          <p className="mt-2.5 text-[10px] sm:text-xs font-semibold text-slate-700 tracking-tight font-sans bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 w-full">
            UPI ID: <span className="font-mono font-black text-slate-900">{upiId}</span>
          </p>
        </div>

        {/* Footer: Scan to pay with any UPI app */}
        <div className="mt-2 px-3 w-full">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 mb-1.5">
            <span className="h-[1px] bg-slate-200 flex-1"></span>
            <span>Scan with any UPI app</span>
            <span className="h-[1px] bg-slate-200 flex-1"></span>
          </div>
          
          {/* Payment Logos Grid directly matching the design */}
          <div className="flex items-center justify-center gap-2 opacity-80 mt-0.5">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-wider bg-slate-100 px-1 py-0.5 rounded-sm">BHIM</span>
            <span className="text-[8px] font-extrabold text-slate-600 italic border-l border-slate-300 pl-1.5">UPI</span>
            <span className="text-[8px] font-black text-blue-600">G Pay</span>
            <span className="text-[8px] font-black text-cyan-600">Paytm</span>
            <span className="text-[8px] font-black text-purple-600">PhonePe</span>
          </div>
        </div>
      </div>

      {/* Optional Copy UPI ID button */}
      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-xs transition hover:border-slate-300"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00C853]" />
              <span className="text-[#008947]">UPI ID Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy UPI ID ({upiId})</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
