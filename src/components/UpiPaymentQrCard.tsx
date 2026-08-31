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
  const upiId = 'senapatibhaskar6@oksbi';
  const payeeName = 'Bhaskar Senapati';

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
      <div className="bg-[#F0F4FA] p-5 sm:p-6 rounded-[28px] shadow-lg border border-slate-200 w-full max-w-[280px] sm:max-w-[300px] text-center flex flex-col items-center">
        
        {/* Top Header: NestFinder Logo + Bhaskar Senapati */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <NestFinderLogo variant="icon" size="sm" className="w-8 h-8 shrink-0" />
          <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {payeeName}
          </span>
        </div>

        {/* White QR Code Container with Center GPay badge */}
        <div className="relative bg-white p-3.5 rounded-[22px] shadow-sm border border-slate-100 flex flex-col items-center justify-center w-full">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            <img
              src={qrImageUrl}
              alt={`UPI QR Code for ${payeeName}`}
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
            {/* Centered GPay Logo Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md border-2 border-slate-100 flex items-center justify-center p-1">
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
          <p className="mt-3 text-xs sm:text-[13px] font-semibold text-slate-700 tracking-tight font-sans">
            UPI ID: <span className="font-mono font-bold text-slate-900">{upiId}</span>
          </p>
        </div>

        {/* Footer: Scan to pay with any UPI app */}
        <p className="mt-4 text-xs font-medium text-slate-600">
          Scan to pay with any UPI app
        </p>
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
