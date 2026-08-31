import React from 'react';

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
  theme = 'auto'
}) => {
  // Dimension mapping
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
    '2xl': 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40'
  }[size] || 'w-12 h-12';

  // Crisp, Bold, High-Definition SVG Logo Mark
  const LogoIcon = (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${sizeClasses} transition-transform duration-300`}
    >
      <defs>
        {/* Vibrant Emerald Green Gradient for the Bird */}
        <linearGradient id="birdGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FF87" />
          <stop offset="50%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#00A859" />
        </linearGradient>

        {/* Deep Saffron / Gerua (গেৰুৱা / ওৰাঞ্জ-গোল্ড) Gradient for the Inner Bird House & Nest */}
        <linearGradient id="geruaSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9100" />
          <stop offset="40%" stopColor="#FF6D00" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Bright Golden Yellow for Highlights */}
        <linearGradient id="goldBrightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="50%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>

        {/* Rich Forest Green for Outer Large House */}
        <linearGradient id="outerHouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="50%" stopColor="#00C853" />
          <stop offset="100%" stopColor="#008947" />
        </linearGradient>

        {/* Crisp Shadow */}
        <filter id="nfCrispShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#nfCrispShadow)">
        {/* 1. Chimney on Outer House */}
        <rect x="166" y="32" width="20" height="38" rx="4" fill="url(#geruaSaffronGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
        {/* Chimney Steam Dots */}
        <circle cx="176" cy="18" r="5" fill="#00E676" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="182" cy="7" r="3.5" fill="#FF9100" stroke="#FFFFFF" strokeWidth="1" />

        {/* 2. BIGGER OUTER HOUSE (দাঁঙৰ সেউজীয়া ঘৰটো) */}
        <path
          d="M120 18 L18 102 C13 106 16 114 23 114 H38 V200 C38 206 43 211 49 211 H191 C197 211 202 206 202 200 V114 H217 C224 114 227 106 222 102 L120 18 Z"
          fill="none"
          stroke="url(#outerHouseGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. INNER BIRD HOUSE (গেৰুৱা ৰঙৰ ভিতৰৰ ঘৰটো - ইয়াৰ ভিতৰতেই বাহ আৰু চৰাইটো সুৰক্ষিতভাৱে আছে) */}
        <path
          d="M120 46 L46 108 C43 110 45 116 50 116 H62 V192 C62 196 66 199 70 199 H170 C174 199 178 196 178 192 V116 H190 C195 116 197 110 194 108 L120 46 Z"
          fill="none"
          stroke="url(#geruaSaffronGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arched Attic Window (Gerua & Gold) */}
        <path
          d="M110 80 C110 74 114 70 120 70 C126 70 130 74 130 80 V94 H110 V80 Z"
          fill="url(#goldBrightGrad)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* 4. THE GREEN BIRD (গেৰুৱা ঘৰটোৰ ভিতৰত বাহৰ ওপৰত বহি থকা সেউজীয়া চৰাইটো) */}
        <g id="greenBird" transform="translate(120, 134) scale(0.72) translate(-120, -134)">
          {/* Bird Tail Feather */}
          <path
            d="M72 144 L86 156 L78 160 Z"
            fill="url(#birdGreenGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Main Bird Body & Head */}
          <path
            d="M84 148 C88 136 100 126 118 124 C132 122 146 128 154 136 C160 142 166 140 168 142 C162 147 158 152 154 156 C144 166 128 168 114 168 C96 168 86 158 84 148 Z"
            fill="url(#birdGreenGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Saffron / Golden Beak */}
          <path
            d="M162 140 L176 143 L162 149 Z"
            fill="url(#goldBrightGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          {/* Bird Eye (Clear & Bright) */}
          <circle cx="146" cy="136" r="4.5" fill="#FFFFFF" />
          <circle cx="146" cy="136" r="2.2" fill="#004D25" />

          {/* Wing Feather Line in Golden Glow */}
          <path
            d="M104 148 C116 138 132 138 142 150 C130 156 116 156 104 148 Z"
            fill="url(#goldBrightGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </g>

        {/* 5. NEST INSIDE THE INNER HOUSE (সম্পূৰ্ণৰূপে ভিতৰৰ গেৰুৱা ঘৰটোৰ সীমাৰ ভিতৰত থকা বাহটো) */}
        <g id="cozyNestInside" transform="translate(120, 166) scale(0.68) translate(-120, -166)">
          {/* Outer Nest Bowl */}
          <path
            d="M66 152 C78 198 162 198 174 152 C158 186 138 194 120 194 C102 194 82 186 66 152 Z"
            fill="url(#geruaSaffronGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          {/* Inner Nest Golden Accent */}
          <path
            d="M76 158 C86 190 154 190 164 158 C152 180 136 185 120 185 C104 185 88 180 76 158 Z"
            fill="url(#goldBrightGrad)"
          />
        </g>

        {/* 6. Solid Base Plinth */}
        <rect
          x="28"
          y="216"
          width="184"
          height="12"
          rx="6"
          fill="url(#outerHouseGrad)"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      </g>
    </svg>
  );

  // If icon-only variant
  if (variant === 'icon' || !showText) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  // Full stacked logo variant (Hero & Main Branding, 100% Crisp)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <div className="filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105">
          {LogoIcon}
        </div>
        <div className="mt-2 flex flex-col items-center">
          <div className="flex items-center gap-2 font-black tracking-tight uppercase text-3xl sm:text-4xl">
            {/* NEST in Warm Vibrant Gerua/Saffron Orange paired with Emerald Green FINDER */}
            <span className="text-[#FF6D00] drop-shadow-sm font-black">NEST</span>
            <span className="text-[#00C853] drop-shadow-sm font-black">FINDER</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-gradient-to-r from-transparent to-[#FF6D00]" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider drop-shadow-xs">
              Zero Brokerage PG & Rental Platform
            </span>
            <span className="h-[2px] w-6 bg-gradient-to-l from-transparent to-[#00C853]" />
          </div>
        </div>
      </div>
    );
  }

  // Default: Clean Horizontal Brand Header / Footer Logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0 filter drop-shadow-sm">
        {LogoIcon}
      </div>
      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* NEST in Saffron/Gerua (#FF6D00) and FINDER in Emerald Green (#00C853) */}
          <span className="text-xl sm:text-2xl font-black tracking-tight">
            <span className="text-[#FF6D00]">Nest</span>
            <span className="text-[#00C853]">Finder</span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FF6D00]/15 text-[#E65100] border border-[#FF6D00]/30 rounded-full shadow-sm">
            Zero Brokerage
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 hidden xs:block">
          Direct PGs, Hostels & Rental Homes
        </p>
      </div>
    </div>
  );
};
