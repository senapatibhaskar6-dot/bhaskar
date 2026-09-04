import React from 'react';
import { RotateCcw, ShieldCheck, Sparkles, MapPin, Building2, IndianRupee } from 'lucide-react';
import { NestFinderLogo } from './NestFinderLogo';
import heroBg from '../assets/images/living_room_hero_1788144382451.jpg';

interface HeroSectionProps {
  cityFilter: string;
  setCityFilter: (city: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  budgetFilter: number;
  setBudgetFilter: (budget: number) => void;
  onResetFilters: () => void;
  onOpenPassModal: () => void;
  hasPass: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cityFilter,
  setCityFilter,
  typeFilter,
  setTypeFilter,
  budgetFilter,
  setBudgetFilter,
  onResetFilters,
  onOpenPassModal,
  hasPass
}) => {
  return (
    <section className="relative text-slate-900 py-6 sm:py-10 px-4 overflow-hidden border-b border-slate-300 shadow-sm">
      {/* Exact User Uploaded Living Room Background - 100% Bright, Crisp & Natural */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Ultra-subtle soft gradient to preserve 100% room clarity while ensuring pristine readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-slate-900/40 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* 100% Completely Transparent NestFinder Official Brand Logo (Enlarged & Clear) */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <NestFinderLogo size="xl" variant="full" />
          </div>
        </div>

        {/* Verification Guarantee Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-emerald-400 text-[11px] sm:text-xs font-bold mb-2.5 backdrop-blur-md shadow-md border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          Zero Brokerage • 100% Direct Owner Phone & WhatsApp Access
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 text-slate-950 leading-snug drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
          Find Your Ideal{' '}
          <span className="text-[#00A859] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
            PG, Hostel or Rental Flat
          </span>
        </h1>

        <p className="text-slate-800 text-xs sm:text-sm max-w-xl mx-auto mb-4 font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          Explore verified student hostels, single/double sharing PGs, and family apartments.
          Instant direct owner contacts and exact addresses unlocked with the ₹99 Tenant Pass.
        </p>

        {/* Quick Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-[11px] sm:text-xs font-bold text-slate-900">
          <span className="px-2.5 py-1 bg-white/85 border border-slate-200 rounded-lg flex items-center gap-1 backdrop-blur-md shadow-sm text-slate-900">
            <Sparkles className="w-3 h-3 text-amber-500" /> ₹99 Pass + Aadhaar Secure
          </span>
          <span className="px-2.5 py-1 bg-white/85 border border-slate-200 rounded-lg flex items-center gap-1 backdrop-blur-md shadow-sm text-slate-900">
            <MapPin className="w-3 h-3 text-rose-500" /> Exact Map & Landmarks
          </span>
          <span className="px-2.5 py-1 bg-white/85 border border-slate-200 rounded-lg flex items-center gap-1 backdrop-blur-md shadow-sm text-slate-900">
            <Building2 className="w-3 h-3 text-emerald-600" /> 4 Verified Real Photos Each
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl max-w-4xl mx-auto text-[#222222] grid grid-cols-1 sm:grid-cols-4 gap-2 text-left border border-white/60">
          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#FF5A5F]" /> City / Area
            </label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="e.g. Guwahati, Bangalore, Pune"
              className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A859] font-medium placeholder:text-slate-500 text-[#222222]"
            />
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#00A859]" /> Property Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A859] font-medium text-[#222222]"
            >
              <option value="ALL">All Property Types</option>
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

          {/* Budget Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-[#FFB400]" /> Max Rent (₹/mo)
            </label>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] font-medium text-[#222222]"
            >
              <option value={999999}>Any Budget</option>
              <option value={8000}>Under ₹8,000</option>
              <option value={12000}>Under ₹12,000</option>
              <option value={18000}>Under ₹18,000</option>
              <option value={25000}>Under ₹25,000</option>
              <option value={35000}>Under ₹35,000</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={onResetFilters}
              className="w-full bg-[#F7F9FB] hover:bg-slate-200 text-[#222222] font-bold py-2 px-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 h-[38px] border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
