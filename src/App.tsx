import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyCard } from './components/PropertyCard';
import { OwnerPortal } from './components/OwnerPortal';
import { TenantPassModal } from './components/TenantPassModal';
import { AppointmentModal } from './components/AppointmentModal';
import { GalleryModal } from './components/GalleryModal';
import { SupabaseModal } from './components/SupabaseModal';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import { NestFinderLogo } from './components/NestFinderLogo';
import footerBg from './assets/images/footer_architecture_bg_1788145106193.jpg';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { Property, TenantUser, Appointment, SupabaseConfig } from './types';
import {
  syncPropertyToSupabase,
  syncTenantPassToSupabase,
  syncAppointmentToSupabase,
  fetchRemoteProperties
} from './services/supabase';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Sparkles,
  SearchX,
  CheckCircle2,
  Calendar,
  Building,
  Home,
  MessageSquare
} from 'lucide-react';

export default function App() {
  // --- Persistent State ---
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('nestfinder_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [tenantPass, setTenantPass] = useState<TenantUser | null>(() => {
    const saved = localStorage.getItem('nestfinder_tenant_pass');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('nestfinder_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem('nestfinder_supabase_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      url: '',
      anonKey: '',
      isConnected: false
    };
  });

  // --- Navigation & View States ---
  const [activeTab, setActiveTab] = useState<'explore' | 'owner'>('explore');

  // --- Search & Filters ---
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [budgetFilter, setBudgetFilter] = useState(999999);

  // --- Modals ---
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [galleryProperty, setGalleryProperty] = useState<Property | null>(null);
  const [appointmentProperty, setAppointmentProperty] = useState<Property | null>(null);

  // --- Sync to LocalStorage on changes ---
  useEffect(() => {
    localStorage.setItem('nestfinder_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    if (tenantPass) {
      localStorage.setItem('nestfinder_tenant_pass', JSON.stringify(tenantPass));
    }
  }, [tenantPass]);

  useEffect(() => {
    localStorage.setItem('nestfinder_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('nestfinder_supabase_config', JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  // Attempt initial fetch from Supabase if connected
  useEffect(() => {
    if (supabaseConfig.isConnected && supabaseConfig.url && supabaseConfig.anonKey) {
      fetchRemoteProperties(supabaseConfig).then((remoteProps) => {
        if (remoteProps && remoteProps.length > 0) {
          setProperties(remoteProps);
        }
      });
    }
  }, [supabaseConfig.isConnected]);

  // --- Auto-Expiry Check on Load ---
  useEffect(() => {
    if (tenantPass && tenantPass.hasPaidPass && tenantPass.passPurchasedAt) {
      const purchaseTime = new Date(tenantPass.passPurchasedAt).getTime();
      const now = new Date().getTime();
      const diffDays = (now - purchaseTime) / (1000 * 60 * 60 * 24);
      if (diffDays > 30) {
        // Expired after 30 days
        const updatedPass = {
          ...tenantPass,
          hasPaidPass: false,
          isExpired: true
        };
        setTenantPass(updatedPass);
        localStorage.setItem('nestfinder_tenant_pass', JSON.stringify(updatedPass));
      }
    }
  }, []);

  const getTenantPassDaysLeft = () => {
    if (!tenantPass || !tenantPass.passPurchasedAt) return 0;
    const purchaseTime = new Date(tenantPass.passPurchasedAt).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - purchaseTime) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - diffDays);
  };

  // --- Filter Logic ---
  const filteredProperties = properties.filter((p) => {
    const matchesCity =
      !cityFilter.trim() ||
      p.city.toLowerCase().includes(cityFilter.toLowerCase().trim()) ||
      p.address.toLowerCase().includes(cityFilter.toLowerCase().trim()) ||
      (p.landmark && p.landmark.toLowerCase().includes(cityFilter.toLowerCase().trim()));

    const matchesType = typeFilter === 'ALL' || p.propertyType === typeFilter;
    const matchesBudget = p.monthlyRent <= budgetFilter;

    return matchesCity && matchesType && matchesBudget;
  });

  const handleResetFilters = () => {
    setCityFilter('');
    setTypeFilter('ALL');
    setBudgetFilter(999999);
  };

  // --- Actions ---
  const handlePassPurchased = (pass: TenantUser) => {
    setTenantPass(pass);
    setIsPassModalOpen(false);

    // Sync to Supabase if configured
    if (supabaseConfig.isConnected) {
      syncTenantPassToSupabase(pass, supabaseConfig);
    }
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);

    // Sync to Supabase if configured
    if (supabaseConfig.isConnected) {
      syncPropertyToSupabase(newProp, supabaseConfig);
    }
  };

  const handleConfirmAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);

    // Sync to Supabase if configured
    if (supabaseConfig.isConnected) {
      syncAppointmentToSupabase(appointment, supabaseConfig);
    }
  };

  const handleRateProperty = (propertyId: string, rating: number) => {
    setProperties((prevProps) =>
      prevProps.map((p) => {
        if (p.id === propertyId) {
          const currentCount = p.ratingCount || 12;
          const currentVal = p.ratingValue || 4.7;
          const totalSum = currentVal * currentCount;
          const newCount = currentCount + 1;
          const newVal = Number(((totalSum + rating) / newCount).toFixed(1));
          return {
            ...p,
            ratingValue: newVal,
            ratingCount: newCount,
            userRating: rating
          };
        }
        return p;
      })
    );
  };

  const handleSyncAll = async () => {
    if (!supabaseConfig.isConnected) return;
    for (const prop of properties) {
      await syncPropertyToSupabase(prop, supabaseConfig);
    }
    if (tenantPass) {
      await syncTenantPassToSupabase(tenantPass, supabaseConfig);
    }
    for (const appt of appointments) {
      await syncAppointmentToSupabase(appt, supabaseConfig);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-sans text-[#222222] selection:bg-[#FF5A5F] selection:text-white">
      
      {/* Header & Branding */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tenantPass={tenantPass}
        onOpenPassModal={() => setIsPassModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main View Body */}
      {activeTab === 'explore' ? (
        <>
          {/* Hero Banner with Filters */}
          <HeroSection
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            budgetFilter={budgetFilter}
            setBudgetFilter={setBudgetFilter}
            onResetFilters={handleResetFilters}
            onOpenPassModal={() => setIsPassModalOpen(true)}
            hasPass={Boolean(tenantPass?.hasPaidPass)}
          />

          {/* Main Listings Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
            
            {/* Pass Status Callout Banner */}
            {tenantPass?.hasPaidPass ? (
              /* Verified Active Banner */
              <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50/30 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#00A699] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00A699]/25">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#00847A] text-base">
                        Active Tenant & Student Pass
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-[#FF5A5F] text-white rounded-full font-mono">
                        UTR: {tenantPass.passUtr}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-extrabold bg-[#00C853] text-white rounded-full animate-pulse">
                        30 Days Active
                      </span>
                    </div>
                    <p className="text-xs text-[#00847A] mt-0.5 font-medium">
                      Direct owner phone numbers, instant WhatsApp chats & exact addresses are fully unlocked. This pass is valid for 30 days from your registration date.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-700 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-xs shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Safe Tenant</span>
                </div>
              </div>
            ) : (
              /* Locked Banner (First time user or Expired) */
              <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-[#FF5A5F]/5 to-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF5A5F]/25">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-[#222222] text-base sm:text-lg">
                        Addresses & Owner Phone Numbers are Locked
                      </h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-[#FF5A5F] text-white rounded-full">
                        ₹99 Pass
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      Property titles, locations & photos are free to search. Verify your Aadhaar OTP and complete registration to unlock direct owner contacts and exact street addresses with a 30-Day Tenant & Student Pass.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="w-full md:w-auto px-6 py-3 rounded-2xl font-black text-sm bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-md shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2 shrink-0 animate-pulse"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Get Tenant & Student Pass (₹99)</span>
                </button>
              </div>
            )}

            {/* Listings Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#222222] tracking-tight">
                  Available PGs, Hostels & Rental Homes
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Verified properties with 4 complete high-resolution photos
                </p>
              </div>

              <span className="text-xs font-bold text-[#FF5A5F] bg-[#FF5A5F]/10 px-3.5 py-1.5 rounded-full border border-[#FF5A5F]/20">
                {filteredProperties.length} Properties
              </span>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    hasPass={Boolean(tenantPass?.hasPaidPass)}
                    onOpenPassModal={() => setIsPassModalOpen(true)}
                    onOpenGallery={(prop) => setGalleryProperty(prop)}
                    onBookAppointment={(prop) => setAppointmentProperty(prop)}
                    onRateProperty={handleRateProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto p-8">
                <SearchX className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#222222]">No properties match your filters</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Try adjusting the city name, selecting "All Property Types", or increasing your budget.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>
        </>
      ) : (
        /* Owner Listing Portal View */
        <OwnerPortal
          onAddProperty={handleAddProperty}
          onNavigateToExplore={() => setActiveTab('explore')}
        />
      )}

      {/* Footer with 100% Natural Architecture Twilight Background */}
      <footer className="relative text-white py-14 border-t border-slate-700/80 text-sm mt-auto overflow-hidden">
        {/* Background Image Container - 100% Natural, Vivid & Clear */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${footerBg})` }}
        />
        {/* Ultra-subtle tint just to balance highlights without any heavy black overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg inline-block transition-transform duration-300 hover:scale-105 mb-2">
                <NestFinderLogo size="md" variant="horizontal" />
              </div>
              <p className="text-xs text-slate-100 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Direct PG, Private Hostel & Rental House finder. No agents, zero brokerage commission. Direct owner calling & WhatsApp for students and job seekers across India.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>India's Verified Direct Housing Network</span>
            </div>
          </div>

          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#00E676]" />
              For Students & Tenants
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-100 font-medium">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setIsPassModalOpen(true);
                  }}
                  className="hover:text-emerald-300 transition flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Get ₹99 Tenant Pass
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-300 transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Boys & Girls PGs / Hostels
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-300 transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Rental Flats & Single Rooms
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-300 transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Independent Houses
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#00E676]" />
              For Property Owners
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-100 font-medium">
              <li>
                <button onClick={() => setActiveTab('owner')} className="hover:text-emerald-300 transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  List Your Property (100% Free)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('owner')} className="hover:text-emerald-300 transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Upload 4 Property Photos
                </button>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
              Safety & Verification
            </h4>
            <p className="text-xs text-slate-100 leading-relaxed mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Owners list for free. Tenants undergo mandatory secure Aadhaar OTP verification to prevent fake inquiries and spam, keeping the community safe.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-white/15 px-3 py-1.5 rounded-lg border border-white/25 w-fit backdrop-blur-sm shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" />
              <span>100% Secure Verified Platform</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-white/20 text-xs text-center text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">&copy; 2026 NestFinder • Direct Housing Platform. All Rights Reserved.</span>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <TenantPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        tenantPass={tenantPass}
        onPassPurchased={handlePassPurchased}
      />

      <AppointmentModal
        property={appointmentProperty}
        tenantPass={tenantPass}
        onClose={() => setAppointmentProperty(null)}
        onConfirmAppointment={handleConfirmAppointment}
      />

      <GalleryModal
        property={galleryProperty}
        onClose={() => setGalleryProperty(null)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        config={supabaseConfig}
        onSaveConfig={setSupabaseConfig}
        onSyncAll={handleSyncAll}
      />

      <ExportHtmlModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        properties={properties}
      />

    </div>
  );
}
