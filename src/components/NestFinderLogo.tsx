import React from 'react';
import logoIcon from '../assets/images/nestfinder_official_logo.jpg';

interface NestFinderLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export const NestFinderLogo: React.FC<NestFinderLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  showText = true,
}) => {
  // Dimension mapping
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
    '2xl': 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40'
  }[size] || 'w-12 h-12';

  const logoUrl = logoIcon;

  const LogoIcon = (
    <img
      src={logoUrl}
      alt="NestFinder Logo"
      referrerPolicy="no-referrer"
      className={`shrink-0 ${sizeClasses} object-contain rounded-xl transition-all duration-300`}
    />
  );

  // If icon-only variant
  if (variant === 'icon' || !showText) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  // Full stacked logo variant (Hero & Main Branding, using the exact user uploaded logo with text)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <div className="p-1 rounded-3xl bg-slate-950/40 backdrop-blur-sm border border-amber-400/20 shadow-2xl shadow-slate-950/60 transition-transform duration-300 hover:scale-105">
          <img
            src={logoUrl}
            alt="NestFinder Logo with Text"
            referrerPolicy="no-referrer"
            className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 object-contain rounded-2xl"
          />
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="h-[2px] w-6 bg-gradient-to-r from-transparent to-[#FFD700]" />
          <span className="text-xs sm:text-sm font-bold text-amber-300/90 uppercase tracking-wider drop-shadow-sm">
            Zero Brokerage PG & Rental Platform
          </span>
          <span className="h-[2px] w-6 bg-gradient-to-l from-transparent to-[#FFD700]" />
        </div>
      </div>
    );
  }

  // Default: Clean Horizontal Brand Header / Footer Logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 filter drop-shadow-sm transition-transform duration-300 hover:scale-105">
        {LogoIcon}
      </div>
      <div className="hidden xs:block">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gold Nest & Green Finder */}
          <span className="text-xl sm:text-2xl font-black tracking-tight">
            <span className="text-[#EAB308]">Nest</span>
            <span className="text-[#00A859]">Finder</span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#00A859]/10 text-[#00A859] border border-[#00A859]/20 rounded-full shadow-sm">
            Zero Brokerage
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          Direct PGs, Hostels & Rental Homes
        </p>
      </div>
    </div>
  );
};
