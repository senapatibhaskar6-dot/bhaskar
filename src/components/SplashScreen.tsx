import React, { useEffect, useState } from 'react';
import { NestFinderLogo } from './NestFinderLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 1200
}) => {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, minDurationMs);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, minDurationMs + 400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDurationMs, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-between py-12 px-6 transition-opacity duration-400 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top spacer */}
      <div className="w-full h-8" />

      {/* Center Branding Content */}
      <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-500/10 to-amber-500/10 p-2 shadow-xl shadow-rose-500/10 border border-slate-100 flex items-center justify-center">
            <img
              src="/icon-192.png"
              alt="NestFinder Logo"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Subtle pulse ring */}
          <div className="absolute -inset-2 rounded-[28px] border-2 border-[#FF5A5F]/20 animate-ping pointer-events-none" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
          Nest<span className="text-[#FF5A5F]">Finder</span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-500 max-w-[240px]">
          PG, Private Hostels & Rental House Finder in Assam
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
          <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-[#FF5A5F] rounded-full animate-spin" />
          <span className="text-[11px] font-extrabold text-slate-600">Starting verified listings...</span>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Guwahati • Jorhat • Dibrugarh • Assam
        </p>
      </div>
    </div>
  );
};
