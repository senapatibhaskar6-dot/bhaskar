import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Copy,
  Sparkles,
  Lock,
  Unlock,
  Check,
  AlertCircle,
  User,
  Phone,
  KeyRound,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TenantUser } from '../types';
import { UpiPaymentQrCard } from './UpiPaymentQrCard';

interface TenantPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantPass: TenantUser | null;
  onPassPurchased: (pass: TenantUser) => void;
}

export const TenantPassModal: React.FC<TenantPassModalProps> = ({
  isOpen,
  onClose,
  tenantPass,
  onPassPurchased
}) => {
  const [step, setStep] = useState<'profile' | 'payment'>('profile');
  const [name, setName] = useState(tenantPass?.name || '');
  const [whatsapp, setWhatsapp] = useState(tenantPass?.whatsapp || '');
  const [tenantType, setTenantType] = useState<'Student' | 'Working Professional' | 'Family'>(
    tenantPass?.tenantType || 'Student'
  );
  const [preferredCity, setPreferredCity] = useState(tenantPass?.preferredCity || '');
  const [password, setPassword] = useState('');

  // Password Login States
  const [showLogin, setShowLogin] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ₹49 Payment parameters
  const [utr, setUtr] = useState('');
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tenant Password Login handler
  const handleTenantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both WhatsApp Number and Password.');
      return;
    }

    // Default universal tester credential
    if (loginPhone === '9876543210' && loginPassword === 'admin') {
      const demoPass: TenantUser = {
        id: 'tenant_demo',
        name: 'Bhaskar Senapati (Guest)',
        whatsapp: '9876543210',
        tenantType: 'Student',
        preferredCity: 'Guwahati',
        hasPaidPass: true,
        passUtr: 'DEMO-87654321',
        passPurchasedAt: new Date().toISOString(),
        password: 'admin'
      };
      onPassPurchased(demoPass);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (err) {}
      onClose();
      return;
    }

    // Load from local storage registry
    const savedTenants = JSON.parse(localStorage.getItem('nestfinder_tenants_registry') || '[]');
    const matched = savedTenants.find(
      (t: any) => t.whatsapp === loginPhone.trim() && t.password === loginPassword.trim()
    );

    if (matched) {
      const updatedPass: TenantUser = {
        ...matched,
        hasPaidPass: true
      };
      onPassPurchased(updatedPass);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {}
      onClose();
    } else {
      setErrorMsg('Invalid WhatsApp Phone or Password. Try again or register a new pass!');
    }
  };

  // Step 1: Profile Submit -> Proceed to ₹49 Payment
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number');
      return;
    }
    if (!password.trim() || password.trim().length < 4) {
      setErrorMsg('Please create a password of at least 4 characters');
      return;
    }

    setStep('payment');
  };

  // Step 2: ₹49 Payment Submit with UTR
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUtr = utr.replace(/\s/g, '');
    if (!cleanUtr || cleanUtr.length < 8) {
      setErrorMsg('Please enter your valid 12-digit UPI UTR / Reference ID.');
      return;
    }

    setIsPaymentSubmitting(true);
    setTimeout(() => {
      setIsPaymentSubmitting(false);

      const newPass: TenantUser = {
        id: tenantPass?.id || `tenant_${Date.now()}`,
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        tenantType,
        preferredCity: preferredCity.trim() || 'All Cities',
        hasPaidPass: true,
        passUtr: cleanUtr,
        passPurchasedAt: new Date().toISOString(),
        password: password.trim()
      };

      // Also persist to global tenant accounts registry in localStorage for future password logins
      try {
        const savedTenants = JSON.parse(localStorage.getItem('nestfinder_tenants_registry') || '[]');
        const filteredTenants = savedTenants.filter((t: any) => t.whatsapp !== whatsapp.trim());
        filteredTenants.push(newPass);
        localStorage.setItem('nestfinder_tenants_registry', JSON.stringify(filteredTenants));
      } catch (err) {
        console.error('Error saving to tenants registry:', err);
      }

      onPassPurchased(newPass);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 1200);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default">
        
        {/* Header with High-Contrast Gradient */}
        <div className="bg-gradient-to-r from-[#FF5A5F] via-rose-600 to-[#222222] p-6 sm:p-7 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Special Offer: ₹49 Student & Tenant Pass</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tenant & Student Entry Pass
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Unlock all direct owner phone numbers, WhatsApp chats and exact addresses for 30 days.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {tenantPass?.hasPaidPass ? (
            /* Already Verified View */
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00A699] mx-auto flex items-center justify-center shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#222222]">Tenant Registration Active ✓</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome, <span className="font-bold text-[#222222]">{tenantPass.name}</span>. Your 30-Day Tenant Pass is active. All owner phone numbers and WhatsApp chats are unlocked!
                </p>
              </div>

              <div className="bg-[#F7F9FB] border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment UTR Key:</span>
                  <span className="font-mono font-bold text-[#222222]">{tenantPass.passUtr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Pass Type:</span>
                  <span className="font-bold text-emerald-600">30-Day Direct Access (₹49)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Activated Date:</span>
                  <span className="text-slate-700">{new Date(tenantPass.passPurchasedAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
                  <span className="text-slate-500 font-bold">Contact Status:</span>
                  <span className="font-bold text-emerald-600">All Owners & WhatsApp Unlocked</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Continue Contacting Owners
              </button>
            </div>
          ) : showLogin ? (
            /* COMPACT TENANT PASSWORD LOGIN PANEL */
            <form onSubmit={handleTenantLogin} className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}
              
              <div className="text-center pb-2">
                <h4 className="text-base font-black text-slate-800">Returning Tenant Pass Login</h4>
                <p className="text-xs text-slate-500 mt-0.5">Enter your registered WhatsApp number & password</p>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit registered number"
                    className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  required
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your pass password"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-black text-xs shadow-md shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Verify & Login Tenant Pass</span>
              </button>

              <div className="pt-2 text-center flex flex-col gap-1.5 border-t border-slate-100 mt-4">
                <span className="text-[10px] text-slate-400 font-bold">
                  Testing? Use Phone <span className="text-slate-600 font-mono font-black">9876543210</span> & Password <span className="text-slate-600 font-mono font-black">admin</span>
                </span>
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setErrorMsg(''); }}
                  className="text-xs text-[#00A699] font-black hover:underline mt-2"
                >
                  Create New Pass Registration (₹49)
                </button>
              </div>
            </form>
          ) : (
            /* 2-STEP QUICK REGISTRATION (NO AADHAAR HESITATION) */
            <div className="space-y-4">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-500">
                <div className={`flex items-center gap-1.5 ${step === 'profile' ? 'text-[#FF5A5F]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'profile' ? 'bg-[#FF5A5F] text-white font-black' : 'bg-slate-100 text-slate-500'}`}>1</span>
                  <span>Your Details</span>
                </div>
                <div className="w-12 h-px bg-slate-200"></div>
                <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#FF5A5F]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-[#FF5A5F] text-white font-black' : 'bg-slate-100 text-slate-500'}`}>2</span>
                  <span>Pay ₹49 Fee</span>
                </div>
              </div>

              {step === 'profile' ? (
                /* STEP 1: Quick Profile Details & Password */
                <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Quick 30-Second Registration:</span>
                    <button
                      type="button"
                      onClick={() => { setShowLogin(true); setErrorMsg(''); }}
                      className="text-xs font-extrabold text-[#00A699] hover:underline"
                    >
                      Already bought a Pass? Login
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Your Full Name *
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahul Senapati"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          WhatsApp Mobile Number *
                        </label>
                        <input
                          required
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9876543210"
                          maxLength={10}
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          You Are A
                        </label>
                        <select
                          value={tenantType}
                          onChange={(e) => setTenantType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                        >
                          <option value="Student">Student (Coaching/College)</option>
                          <option value="Working Professional">Working Professional</option>
                          <option value="Family">Family / Couple</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Preferred City / Area
                        </label>
                        <input
                          type="text"
                          value={preferredCity}
                          onChange={(e) => setPreferredCity(e.target.value)}
                          placeholder="e.g. Guwahati, Bangalore, Delhi, Pune"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Set a Pass Password (for future logins) *
                        </label>
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create password (at least 4 characters)"
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-lg shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-2"
                  >
                    <span>Continue to ₹49 UPI Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 px-6 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    Cancel & Return to Listings
                  </button>
                </form>
              ) : (
                /* STEP 2: ₹49 UPI QR Payment */
                <form onSubmit={handlePaymentSubmit} className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-emerald-950">Almost done, {name}!</p>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Scan the QR code below to pay the one-time **₹49 Pass Fee** via Google Pay, PhonePe or Paytm.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-1">
                    <UpiPaymentQrCard amount={49} note={`${name} NestFinder Pass`} showCopyButton={true} />
                  </div>

                  <div className="space-y-2 bg-[#F7F9FB] p-4 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      Enter 12-Digit Transaction UTR / Ref No *
                    </label>
                    <input
                      required
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').substring(0, 12))}
                      placeholder="e.g. 423189098712"
                      maxLength={12}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-center font-mono font-black text-base text-[#222222] tracking-wider"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-400">
                        Found in your GPay / PhonePe / Paytm receipt.
                      </p>
                      <button
                        type="button"
                        onClick={() => setUtr('423189098712')}
                        className="text-[10px] font-black text-[#00A699] hover:underline bg-emerald-50 px-2 py-0.5 rounded-md"
                      >
                        ⚡ Tester Auto-fill UTR
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPaymentSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-[#00A699] hover:bg-[#00847A] text-white shadow-lg shadow-[#00A699]/25 transition flex items-center justify-center gap-2"
                  >
                    {isPaymentSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Activating Your 30-Day Pass...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Activate 30-Day Pass (₹49)</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('profile')}
                      className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2.5 px-4 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Trust Badge */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> 100% Direct Owner Contacts • Zero Brokerage
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
