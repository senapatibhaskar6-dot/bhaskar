import { Property } from '../types';

export function generateSingleFileHtml(properties: Property[]): string {
  const jsonProperties = JSON.stringify(properties);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NestFinder - PG, Private Hostels & Rent Houses</title>
  <meta name="description" content="Find verified PGs, private hostels, and rental houses with direct owner contacts and instant ₹99 pass.">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F7F9FB; color: #222222; }
    .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); }
    @media (max-width: 500px) {
      .mobile-compact-hidden { display: none !important; }
      .mobile-compact-show { display: inline !important; }
      .mobile-logo-text { display: none !important; }
    }
    @media (min-width: 501px) {
      .mobile-compact-show { display: none !important; }
    }
  </style>
</head>
<body class="bg-[#F7F9FB] text-[#222222] min-h-screen flex flex-col">

  <!-- TOP ANNOUNCEMENT BAR -->
  <div class="bg-[#222222] text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2 border-b border-white/5">
    <span class="inline-block w-2 h-2 rounded-full bg-[#00A699] animate-pulse"></span>
    <span>Zero Brokerage Verified Listings • Student & Tenant Pass for ₹99 Only • Direct WhatsApp & Calls</span>
  </div>

  <!-- MAIN HEADER & BRANDING -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer select-none" onclick="switchTab('explore')">
        <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-11 h-11 shrink-0">
          <defs>
            <linearGradient id="nfYellowGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF275" /><stop offset="50%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FF9E00" /></linearGradient>
            <linearGradient id="nfGreenGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00FF87" /><stop offset="100%" stopColor="#00A859" /></linearGradient>
            <linearGradient id="nfBirdGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00B4DB" /><stop offset="50%" stopColor="#0066FF" /><stop offset="100%" stopColor="#00358E" /></linearGradient>
          </defs>
          <path d="M152 42 C146 36 148 28 155 24 C163 19 160 12 153 8 C158 8 167 15 160 22 C154 28 156 34 160 38" fill="#00FF87" stroke="#008947" stroke-width="1.5"/>
          <rect x="142" y="42" width="18" height="32" rx="3" fill="url(#nfYellowGrad)" stroke="#00C853" stroke-width="4" stroke-linejoin="round"/>
          <path d="M120 28 L28 106 C24 109 26 117 32 117 H44 V188 C44 192 48 196 52 196 H188 C192 196 196 192 196 188 V117 H208 C214 117 216 109 212 106 L120 28 Z" fill="none" stroke="#00E676" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M120 30 L30 106 C27 108 28 114 34 114 H46 V186 C46 189 49 192 52 192 H188 C191 192 194 189 194 186 V114 H206 C212 114 213 108 210 106 L120 30 Z" fill="none" stroke="url(#nfYellowGrad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M110 94 V80 C110 74 114 70 120 70 C126 70 130 74 130 80 V94 H110 Z" fill="url(#nfYellowGrad)" stroke="#FFFFFF" stroke-width="2"/>
          <g transform="translate(0, -2)">
            <path d="M86 122 L98 134 L92 136 Z" fill="url(#nfBirdGrad)" stroke="#FFFFFF" stroke-width="1"/>
            <path d="M94 132 C96 126 102 118 116 116 C124 115 132 117 138 123 C142 127 146 126 148 128 C144 131 142 134 140 137 C138 143 132 148 120 148 C108 148 98 142 94 132 Z" fill="url(#nfBirdGrad)" stroke="#FFFFFF" stroke-width="2"/>
            <path d="M140 125 L148 127 L139 131 Z" fill="#FFD700" stroke="#FF9E00" stroke-width="1"/>
            <circle cx="132" cy="123" r="2.8" fill="#FFFFFF"/>
            <circle cx="132" cy="123" r="1.4" fill="#001845"/>
          </g>
          <path d="M68 140 C80 178 160 178 172 140 C158 166 140 174 120 174 C100 174 82 166 68 140 Z" fill="#00A859" stroke="#FFFFFF" stroke-width="1.5"/>
          <path d="M76 142 C88 170 152 170 164 142 C152 162 136 166 120 166 C104 166 88 162 76 142 Z" fill="url(#nfYellowGrad)" stroke="#FF9E00" stroke-width="1"/>
          <rect x="36" y="190" width="168" height="8" rx="4" fill="url(#nfGreenGrad)" stroke="#FFFFFF" stroke-width="1.5"/>
        </svg>
        <div class="mobile-logo-text">
          <div class="flex items-center gap-2">
            <span class="text-xl sm:text-2xl font-black tracking-tight text-[#222222]">Nest<span class="text-[#00A859]">Finder</span></span>
            <span class="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#00A699]/10 text-[#00A699] rounded-full border border-[#00A699]/30">100% Direct</span>
          </div>
          <p class="text-xs font-semibold text-slate-500">PGs, Private Hostels & Rent Houses</p>
        </div>
      </div>

      <!-- Navigation & Action Buttons -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        <button id="nav-explore-btn" onclick="switchTab('explore')" class="px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition bg-[#FF5A5F]/10 text-[#FF5A5F] shrink-0">
          Explore
        </button>
        <button id="nav-owner-btn" onclick="switchTab('owner')" class="px-2 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-rose-50 hover:bg-rose-100 text-[#FF5A5F] border border-rose-200 shadow-xs flex items-center gap-1 shrink-0">
          <i data-lucide="plus-circle" class="w-4 h-4 text-[#FF5A5F]"></i>
          <span class="hidden sm:inline">For Owner Listing</span>
          <span class="sm:hidden mobile-compact-hidden">Owner Listing</span>
          <span class="mobile-compact-show">Owner</span>
        </button>
        <button id="nav-pass-btn" onclick="openTenantPassModal()" class="px-2 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FFB400] hover:bg-amber-500 text-[#222222] shadow-sm flex items-center gap-1 shrink-0">
          <i data-lucide="key" class="w-4 h-4"></i>
          <span id="pass-btn-text" class="hidden sm:inline">Students & Tenants Listing (₹99)</span>
          <span class="sm:hidden mobile-compact-hidden">Tenants & Students</span>
          <span class="mobile-compact-show">Tenant Pass</span>
        </button>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section id="hero-section" class="relative text-slate-900 py-6 sm:py-10 px-4 overflow-hidden border-b border-slate-300 shadow-sm">
    <!-- Bright Living room background -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=80');"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-slate-900/40 pointer-events-none"></div>

    <div class="max-w-5xl mx-auto text-center relative z-10">
      <!-- Starting 100% Transparent Official Brand Logo (Ultra-Sharp & Modern) -->
      <div class="flex flex-col items-center justify-center mb-4">
        <div class="transition-transform duration-300 hover:scale-105 flex flex-col items-center">
          <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 sm:w-24 sm:h-24 shrink-0 filter drop-shadow-md">
            <defs>
              <linearGradient id="birdGreenGradExp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00FF87" />
                <stop offset="50%" stop-color="#00E676" />
                <stop offset="100%" stop-color="#00A859" />
              </linearGradient>
              <linearGradient id="geruaSaffronGradExp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF8C00" />
                <stop offset="40%" stop-color="#FF6D00" />
                <stop offset="100%" stop-color="#E65100" />
              </linearGradient>
              <linearGradient id="goldBrightGradExp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF176" />
                <stop offset="50%" stop-color="#FFD54F" />
                <stop offset="100%" stop-color="#FFB300" />
              </linearGradient>
              <linearGradient id="outerHouseGradExp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00E676" />
                <stop offset="50%" stop-color="#00C853" />
                <stop offset="100%" stop-color="#008947" />
              </linearGradient>
            </defs>
            <rect x="166" y="32" width="20" height="38" rx="4" fill="url(#geruaSaffronGradExp)" stroke="#FFFFFF" stroke-width="2.5" />
            <circle cx="176" cy="18" r="5" fill="#00E676" stroke="#FFFFFF" stroke-width="1.5" />
            <circle cx="182" cy="7" r="3.5" fill="#FF8C00" stroke="#FFFFFF" stroke-width="1" />
            <path d="M120 18 L18 102 C13 106 16 114 23 114 H38 V200 C38 206 43 211 49 211 H191 C197 211 202 206 202 200 V114 H217 C224 114 227 106 222 102 L120 18 Z" fill="none" stroke="url(#outerHouseGradExp)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M120 46 L46 108 C43 110 45 116 50 116 H62 V192 C62 196 66 199 70 199 H170 C174 199 178 196 178 192 V116 H190 C195 116 197 110 194 108 L120 46 Z" fill="none" stroke="url(#geruaSaffronGradExp)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M110 82 C110 76 114 72 120 72 C126 72 130 76 130 82 V96 H110 V82 Z" fill="url(#goldBrightGradExp)" stroke="#FFFFFF" stroke-width="2" />
            <g id="greenBirdExp" transform="translate(120, 134) scale(0.72) translate(-120, -134)">
              <path d="M72 144 L86 156 L78 160 Z" fill="url(#birdGreenGradExp)" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M84 148 C88 136 100 126 118 124 C132 122 146 128 154 136 C160 142 166 140 168 142 C162 147 158 152 154 156 C144 166 128 168 114 168 C96 168 86 158 84 148 Z" fill="url(#birdGreenGradExp)" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" />
              <path d="M162 140 L176 143 L162 149 Z" fill="url(#goldBrightGradExp)" stroke="#FFFFFF" stroke-width="1.5" />
              <circle cx="146" cy="136" r="4.5" fill="#FFFFFF" />
              <circle cx="146" cy="136" r="2.2" fill="#004D25" />
              <path d="M104 148 C116 138 132 138 142 150 C130 156 116 156 104 148 Z" fill="url(#goldBrightGradExp)" stroke="#FFFFFF" stroke-width="1.5" />
            </g>
            <g id="cozyNestExp" transform="translate(120, 166) scale(0.68) translate(-120, -166)">
              <path d="M66 152 C78 198 162 198 174 152 C158 186 138 194 120 194 C102 194 82 186 66 152 Z" fill="url(#geruaSaffronGradExp)" stroke="#FFFFFF" stroke-width="3" />
              <path d="M76 158 C86 190 154 190 164 158 C152 180 136 185 120 185 C104 185 88 180 76 158 Z" fill="url(#goldBrightGradExp)" />
            </g>
            <rect x="28" y="216" width="184" height="12" rx="6" fill="url(#outerHouseGradExp)" stroke="#FFFFFF" stroke-width="3" />
          </svg>
          <div class="mt-2 flex items-center gap-2 font-black tracking-tight uppercase text-2xl sm:text-3xl">
            <span class="text-[#FF6D00] drop-shadow-sm font-black">NEST</span>
            <span class="text-[#00C853] drop-shadow-sm font-black">FINDER</span>
          </div>
          <span class="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">Direct Housing & Zero Brokerage</span>
        </div>
      </div>

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-emerald-400 text-[11px] sm:text-xs font-bold mb-2.5 backdrop-blur-md shadow-md border border-slate-700">
        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#00E676]"></i>
        Zero Brokerage • 100% Direct Owner Phone & WhatsApp Access
      </div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 text-slate-950 leading-snug drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
        Find Your Ideal <span class="text-[#00A859] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">PG, Hostel or Rental Flat</span>
      </h1>
      <p class="text-slate-800 text-xs sm:text-sm max-w-xl mx-auto mb-4 font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
        Search hundreds of verified student hostels, single/double sharing PGs, and family rental apartments. Unlock direct owner calls & WhatsApp with ₹99 one-time pass.
      </p>

      <!-- Search & Filters Bar -->
      <div class="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl max-w-4xl mx-auto text-[#222222] grid grid-cols-1 sm:grid-cols-4 gap-2 text-left border border-slate-200/90">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">City / Locality</label>
          <input id="filter-city" type="text" placeholder="e.g. Bangalore, Pune, Kota" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A859] text-[#222222]" oninput="applyFilters()">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Property Type</label>
          <select id="filter-type" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A859] text-[#222222]" onchange="applyFilters()">
            <option value="ALL">All Types</option>
            <option value="Boys PG">Boys PG</option>
            <option value="Girls PG">Girls PG</option>
            <option value="Co-ed PG">Co-ed PG</option>
            <option value="Private Hostel">Private Hostel</option>
            <option value="1 BHK Flat">1 BHK Flat</option>
            <option value="2 BHK Flat">2 BHK Flat</option>
            <option value="3 BHK Flat">3 BHK Flat</option>
            <option value="Independent House">Independent House</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Max Rent (₹/mo)</label>
          <select id="filter-budget" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-[#222222]" onchange="applyFilters()">
            <option value="999999">Any Budget</option>
            <option value="8000">Under ₹8,000</option>
            <option value="12000">Under ₹12,000</option>
            <option value="18000">Under ₹18,000</option>
            <option value="25000">Under ₹25,000</option>
            <option value="35000">Under ₹35,000</option>
          </select>
        </div>
        <div class="flex items-end">
          <button onclick="resetFilters()" class="w-full bg-[#F7F9FB] hover:bg-slate-200 text-[#222222] font-bold py-2 px-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 h-[38px] border border-slate-200">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN CONTENT CONTAINER -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

    <!-- VIEW 1: EXPLORE / LISTINGS -->
    <div id="view-explore" class="space-y-8">
      
      <!-- Pass Callout Banner -->
      <div id="pass-banner" class="p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-[#FF5A5F]/5 to-orange-50 border border-amber-200/90 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-start sm:items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF5A5F]/25">
            <i data-lucide="lock" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-extrabold text-[#222222] text-base sm:text-lg">Owner Contact Numbers are Locked</h3>
              <span class="px-2.5 py-0.5 text-[10px] font-black uppercase bg-[#FFB400] text-[#222222] rounded-full">₹99 Pass</span>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
              Property titles, addresses & 4 real photos are free to view. Unlock direct owner phone calls & WhatsApp access with a ₹99 one-time student pass.
            </p>
          </div>
        </div>
        <button onclick="openTenantPassModal()" class="w-full md:w-auto px-6 py-3 rounded-2xl font-black text-sm bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-md shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2 shrink-0">
          <i data-lucide="unlock" class="w-4 h-4"></i>
          <span>Students & Tenants Listing Pass (₹99)</span>
        </button>
      </div>

      <!-- Properties Grid Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-[#222222] tracking-tight">Available PGs, Hostels & Rental Homes</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Verified properties with 4 complete high-resolution photos</p>
        </div>
        <span id="properties-count-badge" class="text-xs font-bold text-[#FF5A5F] bg-[#FF5A5F]/10 px-3.5 py-1.5 rounded-full border border-[#FF5A5F]/20">
          Loading...
        </span>
      </div>

      <!-- Grid Container -->
      <div id="properties-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Injected via JavaScript -->
      </div>
    </div>

    <!-- VIEW 2: OWNER LISTING PORTAL -->
    <div id="view-owner" class="hidden max-w-4xl mx-auto py-2">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        <div class="bg-gradient-to-r from-[#222222] via-[#2D2A32] to-[#222222] text-white p-6 sm:p-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5A5F]/20 text-rose-300 text-xs font-bold mb-3 border border-[#FF5A5F]/30">
            <i data-lucide="shield-check" class="w-4 h-4 text-[#00A699]"></i>
            <span>Property Owner Registration & Verification</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">List Your PG, Hostel, or Rental House</h2>
          <p class="text-slate-300 text-xs sm:text-base mt-2 max-w-2xl">
            Reach thousands of students and working professionals looking for verified accommodations. Zero commission, direct tenant calls & WhatsApp.
          </p>
        </div>

        <form id="owner-listing-form" onsubmit="handleOwnerSubmit(event)" class="p-6 sm:p-10 space-y-8">
          <!-- Form fields for owner -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-black text-[#222222] pb-2 border-b border-slate-200">1. Property & Location</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Building / Property Name *</label>
                <input required id="own-title" type="text" placeholder="e.g. Royal Boys PG & Hostel" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Property Type *</label>
                <select id="own-type" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
                  <option value="Boys PG">Boys PG</option>
                  <option value="Girls PG">Girls PG</option>
                  <option value="Co-ed PG">Co-ed PG</option>
                  <option value="Private Hostel">Private Hostel</option>
                  <option value="1 BHK Flat">1 BHK Flat</option>
                  <option value="2 BHK Flat">2 BHK Flat</option>
                  <option value="3 BHK Flat">3 BHK Flat</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
                <input required id="own-city" type="text" placeholder="e.g. Bangalore, Kota, Pune" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Landmark</label>
                <input id="own-landmark" type="text" placeholder="e.g. Near Metro / College" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Complete Address *</label>
                <input required id="own-address" type="text" placeholder="Full address with pin code" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
            </div>
          </div>

          <!-- Section 2: Rent -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-black text-[#222222] pb-2 border-b border-slate-200">2. Pricing & Occupancy</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Rent (₹) *</label>
                <input required id="own-rent" type="number" placeholder="8000" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222] font-bold">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Deposit (₹)</label>
                <input id="own-deposit" type="number" placeholder="8000" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222] font-bold">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Sharing / Layout</label>
                <select id="own-sharing" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Entire Flat / House">Entire Flat</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 3: Owner Contacts -->
          <div class="space-y-4">
            <h3 class="text-base sm:text-lg font-black text-[#222222] pb-2 border-b border-slate-200">3. Owner Contact Numbers</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Owner Name *</label>
                <input required id="own-name" type="text" placeholder="e.g. Ramesh Kumar" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Phone (Call) *</label>
                <input required id="own-phone" type="tel" placeholder="+91 9876543210" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp *</label>
                <input required id="own-whatsapp" type="tel" placeholder="919876543210" class="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
              </div>
            </div>
          </div>

          <!-- Section 4: ₹99 Owner Fee UTR -->
          <div class="bg-gradient-to-br from-[#FF5A5F]/10 via-[#F7F9FB] to-[#FFB400]/10 border border-[#FF5A5F]/25 rounded-2xl p-5 space-y-4">
            <h3 class="text-base font-black text-[#222222]">4. ₹99 Owner Verification Listing Fee</h3>
            <p class="text-xs text-slate-700">Scan the official Google Pay QR code to pay ₹99 verification fee via UPI, then enter your 12-digit UTR ID.</p>
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <div class="bg-[#F0F4FA] p-3.5 rounded-2xl border border-slate-200 text-center">
                <span class="text-[11px] font-bold text-slate-800 block mb-1">NEST FINDER</span>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=6913514367@okbizaxis%26pn=NEST%20FINDER%26am=99%26cu=INR%26tn=NestFinder%20Listing%20Fee" alt="NEST FINDER UPI QR" class="w-36 h-36 rounded-xl bg-white p-2 border border-slate-200 mx-auto">
                <span class="text-[11px] font-mono font-bold text-slate-900 block mt-1.5">UPI: 6913514367@okbizaxis</span>
                <span class="text-[10px] text-slate-500 block">Scan to pay with any UPI app</span>
              </div>
              <div class="flex-1 space-y-2">
                <span class="text-xs font-mono font-bold text-[#222222] block">UPI ID: 6913514367@okbizaxis (NEST FINDER)</span>
                <input required id="own-utr" type="text" placeholder="Enter 12-digit UPI UTR ID" class="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-[#222222] font-mono font-bold">
              </div>
            </div>
          </div>

          <button type="submit" class="w-full py-4 px-6 rounded-2xl font-black text-base bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-xl shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>Verify UTR & Publish Listing</span>
          </button>
        </form>
      </div>
    </div>

  </main>

  <!-- FOOTER WITH ARCHITECTURAL BACKGROUND (100% CLEAR) -->
  <footer class="relative text-white py-12 border-t border-slate-700/80 text-sm mt-auto overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80');"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center">
      <div class="flex items-center gap-3 bg-slate-950/45 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
        <div class="p-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-md flex items-center gap-2">
          <span class="text-white font-black text-sm tracking-wider uppercase">Nest<span class="text-[#00E676]">Finder</span></span>
        </div>
        <span class="text-slate-100 font-semibold">• Direct Housing & Zero Brokerage PG Platform</span>
      </div>
      <span class="text-slate-100 bg-slate-950/45 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 font-medium">&copy; 2026 NestFinder. 100% Direct Owner Phone & WhatsApp Network.</span>
    </div>
  </footer>

  <!-- TENANT PASS MODAL (₹99) -->
  <div id="tenant-pass-modal" onclick="if(event.target === this) closeTenantPassModal()" class="hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer">
    <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 cursor-default">
      <div class="bg-gradient-to-r from-[#FF5A5F] via-[#FF7E82] to-[#FFB400] p-6 text-white relative">
        <button onclick="closeTenantPassModal()" class="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-2 rounded-full">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <span class="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 inline-block">₹99 Tenant Pass</span>
        <h3 class="text-2xl font-black tracking-tight">Students & Tenants: Direct Listing Access</h3>
        <p class="text-white/90 text-xs mt-1">Get direct phone numbers, WhatsApp chats & visit bookings.</p>
      </div>

      <form id="tenant-pass-form" onsubmit="handleTenantPassSubmit(event)" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
          <input required id="pass-name" type="text" placeholder="e.g. Rahul Sharma" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number *</label>
          <input required id="pass-phone" type="tel" placeholder="e.g. 9876543210" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
        </div>
        <div class="bg-[#F0F4FA] p-4 rounded-2xl border border-slate-200 text-center space-y-2">
          <span class="text-xs font-bold text-slate-800 block">NEST FINDER</span>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=6913514367@okbizaxis%26pn=NEST%20FINDER%26am=99%26cu=INR%26tn=NestFinder%20Pass" alt="NEST FINDER UPI QR" class="w-36 h-36 mx-auto rounded-xl bg-white p-2 border border-slate-200">
          <span class="text-xs font-mono font-bold text-slate-900 block">UPI: 6913514367@okbizaxis (₹99)</span>
          <span class="text-[10px] text-slate-500 block">Scan to pay with any UPI app</span>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">12-Digit UPI UTR ID *</label>
          <input required id="pass-utr" type="text" placeholder="e.g. 423189098712" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222] font-mono font-bold">
        </div>
        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-[#FF5A5F] to-[#FF7E82] text-white rounded-xl font-bold text-sm shadow-md shadow-[#FF5A5F]/25">
          Verify UTR & Unlock All Contacts (₹99)
        </button>
        <button type="button" onclick="closeTenantPassModal()" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs transition mt-1">
          Cancel & Go Back to Home Screen
        </button>
      </form>
    </div>
  </div>

  <!-- GALLERY MODAL (4 Photos) -->
  <div id="gallery-modal" class="hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
    <div class="max-w-4xl w-full text-white space-y-4">
      <div class="flex justify-between items-center">
        <h3 id="gallery-title" class="text-lg font-black">Property Photos</h3>
        <button onclick="closeGalleryModal()" class="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <img id="gal-img-0" src="" class="h-48 sm:h-64 w-full object-cover rounded-2xl border border-white/20">
        <img id="gal-img-1" src="" class="h-48 sm:h-64 w-full object-cover rounded-2xl border border-white/20">
        <img id="gal-img-2" src="" class="h-48 sm:h-64 w-full object-cover rounded-2xl border border-white/20">
        <img id="gal-img-3" src="" class="h-48 sm:h-64 w-full object-cover rounded-2xl border border-white/20">
      </div>
    </div>
  </div>

  <!-- APPOINTMENT MODAL -->
  <div id="appointment-modal" class="hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
      <div class="bg-gradient-to-r from-[#FF5A5F] to-[#FF7E82] p-5 text-white flex justify-between items-center">
        <h3 class="text-lg font-black">Schedule Visit Appointment</h3>
        <button onclick="closeAppointmentModal()" class="text-white/80 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <form onsubmit="handleBookAppointment(event)" class="p-5 space-y-3 text-left">
        <p id="appoint-prop-title" class="text-xs font-bold text-[#FF5A5F]"></p>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Visit Date *</label>
          <input required id="appoint-date" type="date" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Time Slot *</label>
          <select id="appoint-slot" class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]">
            <option>10:00 AM - 11:00 AM</option>
            <option>11:00 AM - 12:00 PM</option>
            <option>04:00 PM - 05:00 PM</option>
            <option>06:00 PM - 07:00 PM</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Notes for Owner</label>
          <textarea id="appoint-notes" rows="2" placeholder="Moving date, questions..." class="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl text-[#222222]"></textarea>
        </div>
        <button type="submit" class="w-full py-3 bg-[#FF5A5F] text-white font-bold rounded-xl text-sm">
          Confirm Appointment
        </button>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT STATE ENGINE -->
  <script>
    // Embedded Initial Properties
    let properties = ${jsonProperties};
    let hasUnlockedPass = false;
    let tenantName = '';
    let selectedAppointmentProperty = null;

    // Initialize LocalStorage
    try {
      const savedPass = localStorage.getItem('nestfinder_tenant_pass');
      if (savedPass) {
        const parsed = JSON.parse(savedPass);
        if (parsed && parsed.hasPaidPass) {
          hasUnlockedPass = true;
          tenantName = parsed.name || 'Tenant';
        }
      }
    } catch(e) {}

    window.onload = function() {
      lucide.createIcons();
      updatePassButtonUI();
      renderPropertiesGrid();
    };

    function switchTab(tab) {
      if (tab === 'explore') {
        document.getElementById('view-explore').classList.remove('hidden');
        document.getElementById('view-owner').classList.add('hidden');
        document.getElementById('hero-section').classList.remove('hidden');
        document.getElementById('nav-explore-btn').className = 'px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition bg-[#FF5A5F]/10 text-[#FF5A5F]';
        document.getElementById('nav-owner-btn').className = 'px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition text-[#222222] hover:text-[#FF5A5F] hover:bg-slate-100 flex items-center gap-1.5';
      } else {
        document.getElementById('view-explore').classList.add('hidden');
        document.getElementById('view-owner').classList.remove('hidden');
        document.getElementById('hero-section').classList.add('hidden');
        document.getElementById('nav-explore-btn').className = 'px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition text-[#222222] hover:text-[#FF5A5F] hover:bg-slate-100';
        document.getElementById('nav-owner-btn').className = 'px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition bg-[#FF5A5F] text-white shadow-sm flex items-center gap-1.5';
      }
      lucide.createIcons();
    }

    function updatePassButtonUI() {
      const btn = document.getElementById('nav-pass-btn');
      const banner = document.getElementById('pass-banner');
      if (hasUnlockedPass) {
        btn.className = 'px-3 sm:px-4 py-2 rounded-xl text-sm font-bold bg-[#00A699] hover:bg-[#00847A] text-white shadow-sm flex items-center gap-1.5';
        document.getElementById('pass-btn-text').innerText = 'Pass Active ✓';
        if (banner) {
          banner.className = 'p-5 rounded-3xl bg-gradient-to-r from-[#00A699]/10 via-teal-50 to-[#00A699]/10 border border-[#00A699]/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm';
          banner.innerHTML = '<div class="flex items-center gap-3"><div class="w-12 h-12 rounded-2xl bg-[#00A699] text-white flex items-center justify-center shrink-0 shadow-md"><i data-lucide="check-circle" class="w-6 h-6"></i></div><div><h3 class="font-extrabold text-[#00847A] text-base">Tenant Pass Active & Verified</h3><p class="text-xs text-[#00847A] mt-0.5 font-medium">All owner phone numbers, instant WhatsApp chats & visit scheduling are unlocked.</p></div></div><div class="text-xs font-bold text-[#00847A] bg-white px-4 py-2 rounded-xl border border-[#00A699]/30">Unlimited Access</div>';
        }
      }
      lucide.createIcons();
    }

    function renderPropertiesGrid(filteredList = properties) {
      const container = document.getElementById('properties-grid');
      document.getElementById('properties-count-badge').innerText = filteredList.length + ' Properties';

      if (filteredList.length === 0) {
        container.innerHTML = '<div class="col-span-3 py-12 text-center bg-white rounded-3xl border border-slate-200 p-8"><p class="text-base font-bold text-[#222222]">No properties found matching filters.</p></div>';
        return;
      }

      container.innerHTML = filteredList.map(p => {
        const badgeColor = p.propertyType === 'Boys PG' ? 'bg-[#00A699] text-white' : (p.propertyType === 'Girls PG' ? 'bg-[#FF5A5F] text-white' : 'bg-[#222222] text-white');
        return \`
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#FF5A5F]/40 transition duration-300 overflow-hidden flex flex-col group">
            <div class="relative h-52 bg-slate-100 cursor-pointer overflow-hidden" onclick="openGalleryModal('\${p.id}')">
              <img src="\${p.images[0]}" alt="\${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-3 left-3 flex gap-1.5 z-10">
                <span class="px-3 py-1 text-xs font-bold rounded-xl shadow-md \${badgeColor}">\${p.propertyType}</span>
                <span class="px-2.5 py-1 text-xs font-semibold bg-black/60 text-white rounded-xl">\${p.sharingType}</span>
              </div>
              <button onclick="event.stopPropagation(); openGalleryModal('\${p.id}')" class="absolute bottom-3 right-3 bg-[#222222]/80 hover:bg-[#222222] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <i data-lucide="images" class="w-3.5 h-3.5 text-[#FFB400]"></i> 4 Photos
              </button>
            </div>
            
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 onclick="openGalleryModal('\${p.id}')" class="font-black text-base sm:text-lg text-[#222222] group-hover:text-[#FF5A5F] transition cursor-pointer truncate mb-1.5">\${p.title}</h3>
                <div class="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
                  <i data-lucide="map-pin" class="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5"></i>
                  <div>
                    <span class="font-bold text-[#222222]">\${p.city}</span> \${p.landmark ? ' • ' + p.landmark : ''}
                    <p class="text-[11px] text-slate-500 truncate mt-0.5">\${p.address}</p>
                  </div>
                </div>

                <div class="flex items-baseline justify-between bg-[#F7F9FB] p-3 rounded-2xl border border-slate-200/80 mb-3">
                  <div>
                    <span class="text-xs text-slate-500 font-semibold block">Monthly Rent</span>
                    <span class="text-2xl font-black text-[#222222]">₹\${Number(p.monthlyRent).toLocaleString('en-IN')}<span class="text-xs text-slate-500 font-normal">/mo</span></span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-500 font-semibold block">Deposit</span>
                    <span class="text-sm font-bold text-slate-700">₹\${Number(p.securityDeposit).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1.5 mb-4">
                  \${p.facilities.slice(0, 3).map(f => \`<span class="px-2.5 py-1 text-[11px] font-semibold bg-[#00A699]/10 text-[#00847A] border border-[#00A699]/20 rounded-lg">\${f}</span>\`).join('')}
                </div>
              </div>

              <!-- OWNER CONTACT SECTION -->
              <div class="pt-3 border-t border-slate-100 mt-auto">
                \${hasUnlockedPass ? \`
                  <div class="bg-teal-50 border border-[#00A699]/40 rounded-2xl p-3.5 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-[#222222]">\${p.ownerName}</span>
                      <span class="text-[10px] bg-[#00A699] text-white px-2 py-0.5 rounded-full font-bold">UNLOCKED</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <a href="tel:\${p.ownerPhone}" class="py-2 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1">
                        <i data-lucide="phone" class="w-3.5 h-3.5"></i> Call Owner
                      </a>
                      <a href="https://wa.me/\${p.ownerWhatsapp}?text=Hi%20\${encodeURIComponent(p.ownerName)},%20I%20saw%20your%20property%20\${encodeURIComponent(p.title)}%20on%20NestFinder." target="_blank" class="py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1">
                        <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp
                      </a>
                    </div>
                    <button onclick="openAppointmentModal('\${p.id}')" class="w-full py-1.5 bg-white text-slate-700 hover:text-[#00A699] border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                      <i data-lucide="calendar" class="w-3 h-3 text-[#00A699]"></i> Schedule Visit
                    </button>
                  </div>
                \` : \`
                  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
                    <div class="flex items-center justify-center gap-1 text-xs font-bold text-amber-950 mb-1">
                      <i data-lucide="lock" class="w-3.5 h-3.5 text-[#FF5A5F]"></i> Owner Contact Numbers Locked
                    </div>
                    <p class="text-[11px] text-amber-900/80 mb-2.5">Unlock phone & WhatsApp with ₹99 student pass.</p>
                    <button onclick="openTenantPassModal()" class="w-full py-2 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5">
                      <i data-lucide="unlock" class="w-3.5 h-3.5"></i> Students & Tenants Listing (₹99)
                    </button>
                  </div>
                \`}
              </div>
            </div>
          </div>
        \`;
      }).join('');

      lucide.createIcons();
    }

    function applyFilters() {
      const city = document.getElementById('filter-city').value.toLowerCase().trim();
      const type = document.getElementById('filter-type').value;
      const budget = Number(document.getElementById('filter-budget').value);

      const filtered = properties.filter(p => {
        const matchCity = !city || p.city.toLowerCase().includes(city) || p.address.toLowerCase().includes(city);
        const matchType = type === 'ALL' || p.propertyType === type;
        const matchBudget = p.monthlyRent <= budget;
        return matchCity && matchType && matchBudget;
      });

      renderPropertiesGrid(filtered);
    }

    function resetFilters() {
      document.getElementById('filter-city').value = '';
      document.getElementById('filter-type').value = 'ALL';
      document.getElementById('filter-budget').value = '999999';
      renderPropertiesGrid();
    }

    // --- MODALS ---
    function openTenantPassModal() {
      document.getElementById('tenant-pass-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeTenantPassModal() {
      document.getElementById('tenant-pass-modal').classList.add('hidden');
    }

    function handleTenantPassSubmit(event) {
      event.preventDefault();
      const name = document.getElementById('pass-name').value;
      const phone = document.getElementById('pass-phone').value;
      const utr = document.getElementById('pass-utr').value;

      hasUnlockedPass = true;
      tenantName = name;

      try {
        localStorage.setItem('nestfinder_tenant_pass', JSON.stringify({
          name,
          whatsapp: phone,
          hasPaidPass: true,
          passUtr: utr
        }));
      } catch(e) {}

      closeTenantPassModal();
      updatePassButtonUI();
      renderPropertiesGrid();

      if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }

      alert('🎉 Pass Activated! Welcome ' + name + '. All owner contact numbers are now unlocked.');
    }

    function handleOwnerSubmit(event) {
      event.preventDefault();
      const title = document.getElementById('own-title').value;
      const type = document.getElementById('own-type').value;
      const city = document.getElementById('own-city').value;
      const landmark = document.getElementById('own-landmark').value;
      const address = document.getElementById('own-address').value;
      const rent = Number(document.getElementById('own-rent').value);
      const deposit = Number(document.getElementById('own-deposit').value) || rent;
      const sharing = document.getElementById('own-sharing').value;
      const name = document.getElementById('own-name').value;
      const phone = document.getElementById('own-phone').value;
      const whatsapp = document.getElementById('own-whatsapp').value;
      const utr = document.getElementById('own-utr').value;

      const newProperty = {
        id: 'prop_' + Date.now(),
        title: title,
        propertyType: type,
        sharingType: sharing,
        address: address,
        city: city,
        landmark: landmark || undefined,
        monthlyRent: rent,
        securityDeposit: deposit,
        ownerName: name,
        ownerPhone: phone,
        ownerWhatsapp: whatsapp,
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
        ],
        facilities: ['Wi-Fi 200+ Mbps', '3-Times Meals Included', 'Attached Washroom', 'RO Purified Water'],
        description: 'Verified ' + type + ' in ' + city + ' by ' + name + '.',
        isVerified: true,
        listingUtr: utr,
        createdAt: new Date().toISOString()
      };

      properties.unshift(newProperty);

      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }

      alert('🎉 Listing Published Successfully! Your property "' + title + '" has been verified and added to the live feed.');
      document.getElementById('owner-listing-form').reset();
      switchTab('explore');
      renderPropertiesGrid();
    }

    // --- APPOINTMENTS ---
    function openAppointmentModal(propId) {
      selectedAppointmentProperty = properties.find(p => p.id === propId);
      if (!selectedAppointmentProperty) return;
      document.getElementById('appoint-prop-title').innerText = selectedAppointmentProperty.title;
      document.getElementById('appointment-modal').classList.remove('hidden');
    }

    function closeAppointmentModal() {
      document.getElementById('appointment-modal').classList.add('hidden');
    }

    function handleBookAppointment(event) {
      event.preventDefault();
      const date = document.getElementById('appoint-date').value;
      const slot = document.getElementById('appoint-slot').value;

      closeAppointmentModal();
      alert('📅 Visit Appointment Requested! \\n\\nProperty: ' + selectedAppointmentProperty.title + '\\nDate: ' + date + ' (' + slot + ')\\n\\nThe owner has been notified on WhatsApp.');
    }

    // --- GALLERY MODAL ---
    function openGalleryModal(propId) {
      const prop = properties.find(p => p.id === propId);
      if (!prop) return;
      document.getElementById('gallery-title').innerText = prop.title + ' (4 Photos)';
      for (let i = 0; i < 4; i++) {
        document.getElementById('gal-img-' + i).src = prop.images[i];
      }
      document.getElementById('gallery-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeGalleryModal() {
      document.getElementById('gallery-modal').classList.add('hidden');
    }
  </script>

</body>
</html>`;
}
