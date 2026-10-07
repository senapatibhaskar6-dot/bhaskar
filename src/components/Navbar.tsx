import React from 'react';
import {
  PlusCircle,
  Key,
  Database,
  Download,
  CheckCircle2,
  Star,
  Briefcase,
  ShieldCheck,
  Home
} from 'lucide-react';
import { TenantUser } from '../types';
import { NestFinderLogo } from './NestFinderLogo';

interface NavbarProps {
  activeTab: 'explore' | 'owner' | 'jobs' | 'police' | 'admin';
  setActiveTab: (tab: 'explore' | 'owner' | 'jobs' | 'police' | 'admin') => void;
  tenantPass: TenantUser | null;
  onOpenPassModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenExportModal: () => void;
  onOpenReviewModal: () => void;
  reviewCount?: number;
  currentUserRole?: 'customer' | 'owner' | 'job_seeker' | 'admin' | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tenantPass,
  onOpenPassModal,
  onOpenSupabaseModal,
  onOpenExportModal,
  onOpenReviewModal,
  reviewCount = 5,
  currentUserRole,
  onOpenAuthModal,
  onLogout
}) => {
  const isPassActive = tenantPass?.hasPaidPass;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Vibrant Announcement Banner */}
      <div className="bg-[#222222] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="truncate">
          100% Free Owner Listings • Zero Brokerage • Jobs Portal • Automated Tenant Police Verification • Instant ₹49 Pass
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('explore')}
          className="cursor-pointer group select-none transition-transform hover:scale-[1.02] shrink-0"
        >
          <NestFinderLogo size="md" variant="horizontal" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          {/* Explore Properties Tab */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'explore'
                ? 'bg-[#FF5A5F]/10 text-[#FF5A5F] shadow-xs'
                : 'text-[#222222] hover:text-[#FF5A5F] hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Stays</span>
          </button>

          {/* Jobs Portal Tab */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-xs'
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
            }`}
            title="Private Job Vacancies for Students & Tenants"
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>Jobs</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black inline-flex items-center gap-1 border border-emerald-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available</span>
            </span>
          </button>

          {/* Police Verification Tab */}
          <button
            onClick={() => setActiveTab('police')}
            className={`px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'police'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-xs'
                : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="Automated Tenant Police Verification Form"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span className="hidden sm:inline">Police Verification</span>
            <span className="sm:hidden">Verify</span>
          </button>

          {/* App Reviews Button */}
          <button
            onClick={onOpenReviewModal}
            className="px-2 sm:px-2.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1 bg-amber-50/90 hover:bg-amber-100 text-amber-900 border border-amber-200/90 shadow-2xs shrink-0"
            title="NestFinder App Community Reviews & Rating"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
            <span className="text-[10px] sm:text-xs font-black text-amber-950">
              4.9★
            </span>
          </button>

          {/* Admin Dashboard Tab (Exclusively for Admin Role or switch) */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2 sm:px-2.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1 shrink-0 ${
              activeTab === 'admin'
                ? 'bg-purple-700 text-white shadow-xs ring-2 ring-purple-400/40'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
            title="Admin Management & Metrics Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">Admin</span>
            {currentUserRole === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            )}
          </button>

          {/* Owner Listing Button */}
          <button
            onClick={() => setActiveTab('owner')}
            className={`px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1 border shadow-xs shrink-0 ${
              activeTab === 'owner'
                ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-sm shadow-[#FF5A5F]/30 ring-2 ring-[#FF5A5F]/30'
                : 'bg-rose-50 hover:bg-rose-100/90 text-[#FF5A5F] border-rose-200 hover:border-rose-300'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline font-bold">Owner Listing</span>
            <span className="md:hidden font-bold">List</span>
          </button>

          {/* Tenant Aadhaar Button */}
          <button
            onClick={onOpenPassModal}
            className={`px-2 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-1 transition shrink-0 ${
              isPassActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/25'
                : 'bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-black ring-2 ring-[#FF5A5F]/40'
            }`}
          >
            {isPassActive ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Active Pass ✓</span>
                <span className="sm:hidden">Pass ✓</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span className="hidden md:inline">Entry Pass (₹49)</span>
                <span className="md:hidden">Pass (₹49)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

