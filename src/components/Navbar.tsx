import React from 'react';
import { PlusCircle, Key, Database, Download, CheckCircle2 } from 'lucide-react';
import { TenantUser } from '../types';
import { NestFinderLogo } from './NestFinderLogo';

interface NavbarProps {
  activeTab: 'explore' | 'owner';
  setActiveTab: (tab: 'explore' | 'owner') => void;
  tenantPass: TenantUser | null;
  onOpenPassModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tenantPass,
  onOpenPassModal,
  onOpenSupabaseModal,
  onOpenExportModal
}) => {
  const isPassActive = tenantPass?.hasPaidPass;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Vibrant Announcement Banner */}
      <div className="bg-[#222222] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/5">
        <span className="inline-block w-2 h-2 rounded-full bg-[#00A859] animate-pulse shrink-0" />
        <span className="truncate">
          100% Direct Owner Access • Zero Brokerage • ₹99 Student & Tenant Pass • Verified PGs & Flats
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo with exact uploaded NestFinder design */}
        <div
          onClick={() => setActiveTab('explore')}
          className="cursor-pointer group select-none transition-transform hover:scale-[1.02]"
        >
          <NestFinderLogo size="md" variant="horizontal" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'explore'
                ? 'bg-[#FF5A5F]/10 text-[#FF5A5F] shadow-xs'
                : 'text-[#222222] hover:text-[#FF5A5F] hover:bg-slate-100'
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => setActiveTab('owner')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border shadow-xs ${
              activeTab === 'owner'
                ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-sm shadow-[#FF5A5F]/30 ring-2 ring-[#FF5A5F]/30'
                : 'bg-rose-50 hover:bg-rose-100/90 text-[#FF5A5F] border-rose-200 hover:border-rose-300'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline font-bold">For Owner Listing</span>
            <span className="sm:hidden font-bold">Owner Listing</span>
          </button>

          {/* Student Pass Button */}
          <button
            onClick={onOpenPassModal}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1.5 transition ${
              isPassActive
                ? 'bg-[#00A699] hover:bg-[#00847A] text-white shadow-sm shadow-[#00A699]/25'
                : 'bg-[#FFB400] hover:bg-amber-500 text-[#222222] font-black ring-2 ring-[#FFB400]/40'
            }`}
          >
            {isPassActive ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Pass Active</span>
                <span className="sm:hidden">Pass ✓</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Students & Tenants Listing (₹99)</span>
                <span className="sm:hidden">Students & Tenants (₹99)</span>
              </>
            )}
          </button>

          {/* Supabase Config Button */}
          <button
            onClick={onOpenSupabaseModal}
            title="Configure Supabase Database"
            aria-label="Configure Supabase Database"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-[#222222] hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 border border-slate-200"
          >
            <Database className="w-4 h-4 text-[#00A699]" />
            <span className="hidden lg:inline">Supabase</span>
          </button>

          {/* Export Single HTML Modal Button */}
          <button
            onClick={onOpenExportModal}
            title="Download Standalone Single-file HTML for Netlify"
            aria-label="Download Standalone Single-file HTML for Netlify"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-[#FF5A5F] hover:bg-[#FF5A5F]/10 text-xs font-semibold flex items-center gap-1.5 border border-[#FF5A5F]/30"
          >
            <Download className="w-4 h-4 text-[#FF5A5F]" />
            <span className="hidden lg:inline">Netlify HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
