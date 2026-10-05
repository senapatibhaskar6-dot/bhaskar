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
  ArrowLeft,
  CreditCard,
  Smartphone,
  Settings,
  Zap,
  Building2,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TenantUser } from '../types';
import { UpiPaymentQrCard } from './UpiPaymentQrCard';
import { RazorpayModal } from './RazorpayModal';
import { RazorpayConfigModal } from './RazorpayConfigModal';
import { openRazorpayStandardCheckout, getRazorpayConfig } from '../services/razorpay';

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

  // Payment method & Razorpay States
  const [activePaymentTab, setActivePaymentTab] = useState<'razorpay' | 'manual_qr'>('razorpay');
  const [isOpeningRazorpay, setIsOpeningRazorpay] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isRazorpayConfigOpen, setIsRazorpayConfigOpen] = useState(false);

  // ₹49 Payment parameters
  const [utr, setUtr] = useState('');
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Tenant Forgot Password States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp_reset'>('phone');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('482910');

  // Tenant Password Login handler
  const handleTenantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both WhatsApp Number and Password.');
      return;
    }

    // Default universal tester credential
    const currentDemoPass = localStorage.getItem('nestfinder_demo_tenant_password') || 'admin';
    if (loginPhone === '9876543210' && loginPassword === currentDemoPass) {
      const demoPass: TenantUser = {
        id: 'tenant_demo',
        name: 'Bhaskar Senapati (Guest)',
        whatsapp: '9876543210',
        tenantType: 'Student',
        preferredCity: 'Guwahati',
        hasPaidPass: true,
        passUtr: 'DEMO-87654321',
        passPurchasedAt: new Date().toISOString(),
        password: currentDemoPass
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

  // Handle Tenant Forgot Password - Step 1: Send OTP
  const handleSendTenantForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    const clean = forgotPhone.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setForgotMsg({ type: 'error', text: 'Please enter a valid 10-digit registered WhatsApp number.' });
      return;
    }

    const savedTenants = JSON.parse(localStorage.getItem('nestfinder_tenants_registry') || '[]');
    const exists = clean === '9876543210' || savedTenants.some((t: any) => t.whatsapp === clean);
    if (!exists) {
      setForgotMsg({ type: 'error', text: 'No tenant pass found with this number. Please register for a pass first.' });
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(newOtp);
    setForgotOtp(newOtp);
    setForgotStep('otp_reset');
    setForgotMsg({ type: 'success', text: `6-Digit OTP sent to +91 ${clean}! (Testing OTP: ${newOtp})` });
  };

  // Handle Tenant Forgot Password - Step 2: Verify & Reset
  const handleResetTenantPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    if (forgotOtp.trim() !== generatedDemoOtp && forgotOtp.trim() !== '482910' && forgotOtp.trim() !== '123456') {
      setForgotMsg({ type: 'error', text: 'Invalid 6-digit OTP. Please enter the OTP displayed above.' });
      return;
    }

    if (!forgotNewPass.trim() || forgotNewPass.trim().length < 4) {
      setForgotMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }

    if (forgotNewPass !== forgotConfirmPass) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match. Please re-check.' });
      return;
    }

    const clean = forgotPhone.trim().replace(/\D/g, '');
    if (clean === '9876543210') {
      localStorage.setItem('nestfinder_demo_tenant_password', forgotNewPass.trim());
    }

    const savedTenants = JSON.parse(localStorage.getItem('nestfinder_tenants_registry') || '[]');
    const updated = savedTenants.map((t: any) => {
      if (t.whatsapp === clean) {
        return { ...t, password: forgotNewPass.trim() };
      }
      return t;
    });
    localStorage.setItem('nestfinder_tenants_registry', JSON.stringify(updated));

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    setLoginPhone(clean);
    setLoginPassword(forgotNewPass.trim());
    setErrorMsg('');
    setIsForgotModalOpen(false);
    setForgotStep('phone');
    setForgotPhone('');
    setForgotOtp('');
    setForgotNewPass('');
    setForgotConfirmPass('');
    setForgotMsg(null);
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

  // Common Pass Activation Handler
  const handlePassActivationSuccess = (paymentId: string, method: 'Razorpay' | 'UPI_QR') => {
    setIsPaymentSubmitting(false);
    setIsOpeningRazorpay(false);
    setIsRazorpayModalOpen(false);

    const newPass: TenantUser = {
      id: tenantPass?.id || `tenant_${Date.now()}`,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      tenantType,
      preferredCity: preferredCity.trim() || 'All Cities',
      hasPaidPass: true,
      passUtr: paymentId,
      razorpayPaymentId: method === 'Razorpay' ? paymentId : undefined,
      paymentMethod: method,
      passPurchasedAt: new Date().toISOString(),
      password: password.trim()
    };

    // Also persist to global tenant accounts registry in localStorage for future password logins
    try {
      const savedTenants = JSON.parse(localStorage.getItem('nestfinder_tenants_registry') || '[]');
      const filteredTenants = savedTenants.filter((t: any) => t.whatsapp !== whatsapp.trim());
      filteredTenants.push(newPass);
      localStorage.setItem('nestfinder_tenants_registry', JSON.stringify(filteredTenants));

      // Persist to payment records
      const records = JSON.parse(localStorage.getItem('nestfinder_payment_records') || '[]');
      records.unshift({
        id: `pay_rec_${Date.now()}`,
        userType: 'tenant',
        name: name.trim(),
        phone: whatsapp.trim(),
        amount: 49,
        utr: paymentId,
        razorpayPaymentId: method === 'Razorpay' ? paymentId : undefined,
        paymentMethod: method,
        referenceId: paymentId,
        timestamp: new Date().toISOString(),
        status: 'verified'
      });
      localStorage.setItem('nestfinder_payment_records', JSON.stringify(records));
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
  };

  // Launch Razorpay standard checkout flow
  const handlePayWithRazorpay = async () => {
    setErrorMsg('');
    setIsOpeningRazorpay(true);

    const opened = await openRazorpayStandardCheckout({
      amount: 49,
      name: 'NestFinder',
      description: `30-Day Tenant Pass - ${name}`,
      prefill: {
        name: name.trim(),
        contact: whatsapp.trim()
      },
      onSuccess: (res) => {
        setIsOpeningRazorpay(false);
        handlePassActivationSuccess(res.razorpay_payment_id, 'Razorpay');
      },
      onFailure: (err) => {
        console.warn('Razorpay SDK payment issue:', err);
        setIsOpeningRazorpay(false);
        setIsRazorpayModalOpen(true);
      },
      onDismiss: () => {
        setIsOpeningRazorpay(false);
      }
    });

    if (!opened) {
      setIsOpeningRazorpay(false);
      setIsRazorpayModalOpen(true);
    }
  };

  // Step 2: ₹49 Manual Payment Submit with UTR
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
      handlePassActivationSuccess(cleanUtr, 'UPI_QR');
    }, 1000);
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setForgotPhone(loginPhone || '');
                      setForgotMsg(null);
                      setForgotStep('phone');
                    }}
                    className="text-[11px] font-bold text-[#FF5A5F] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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
                /* STEP 2: ₹49 PAYMENT GATEWAY (RAZORPAY & UPI QR) */
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-emerald-800 text-xs font-semibold flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-emerald-950">Almost done, {name}!</p>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          Pay the one-time **₹49 Pass Fee** to get 30-Day unlimited access to direct owner numbers.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRazorpayConfigOpen(true)}
                      className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-emerald-100 transition shrink-0"
                      title="Razorpay Gateway Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Payment Method Switch Tabs */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('razorpay')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                        activePaymentTab === 'razorpay'
                          ? 'bg-[#0C2340] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Razorpay (Instant)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('manual_qr')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                        activePaymentTab === 'manual_qr'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#00A699]" />
                      <span>Direct UPI QR</span>
                    </button>
                  </div>

                  {activePaymentTab === 'razorpay' ? (
                    /* RAZORPAY GATEWAY CHECKOUT CARD */
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#0C2340] via-[#112E56] to-[#0A192F] text-white p-5 rounded-2xl border border-blue-900 shadow-xl relative overflow-hidden">
                        
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2B83EA]/20 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex items-center justify-between relative z-10 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#2B83EA] px-2.5 py-1 rounded-lg text-white font-black text-xs tracking-wider">
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                                <path d="M14 2L2 14h8l-2 8 12-12h-8l2-8z" />
                              </svg>
                              <span>Razorpay</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 rounded-md">
                              Auto-Verified
                            </span>
                          </div>

                          <span className="text-xl font-black text-white">₹49.00</span>
                        </div>

                        <p className="text-xs text-blue-100 font-medium mb-3 relative z-10">
                          Instant pass unlock with real-time verification. No need to copy or paste 12-digit UTR numbers!
                        </p>

                        {/* Supported Payment Channels */}
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-200 relative z-10 pt-2 border-t border-white/10">
                          <div className="bg-white/10 p-1.5 rounded-lg flex flex-col items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-blue-300" />
                            <span>UPI (GPay/Pe)</span>
                          </div>
                          <div className="bg-white/10 p-1.5 rounded-lg flex flex-col items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Cards</span>
                          </div>
                          <div className="bg-white/10 p-1.5 rounded-lg flex flex-col items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>NetBanking</span>
                          </div>
                          <div className="bg-white/10 p-1.5 rounded-lg flex flex-col items-center gap-1">
                            <Wallet className="w-3.5 h-3.5 text-rose-300" />
                            <span>Wallets</span>
                          </div>
                        </div>
                      </div>

                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {/* Primary Razorpay Action Button */}
                      <button
                        type="button"
                        onClick={handlePayWithRazorpay}
                        disabled={isOpeningRazorpay}
                        className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base bg-[#2B83EA] hover:bg-[#1E6BCE] text-white shadow-xl shadow-blue-500/25 transition flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        {isOpeningRazorpay ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Connecting Razorpay Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-blue-100" />
                            <span>Pay ₹49 with Razorpay</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Instant Demo Quick Unlock for Testing */}
                      <button
                        type="button"
                        onClick={() => handlePassActivationSuccess(`pay_demo_${Date.now()}`, 'Razorpay')}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>⚡ Tester 1-Click Simulated Payment</span>
                      </button>
                    </div>
                  ) : (
                    /* MANUAL UPI QR PAYMENT FALLBACK */
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
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
                    </form>
                  )}

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
                </div>
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

        {/* Tenant Forgot Password Recovery Modal */}
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
              
              {/* Modal Top Gradient Bar */}
              <div className="w-full grid grid-cols-4 h-1.5">
                <div className="bg-[#FF5A5F]"></div>
                <div className="bg-[#222222]"></div>
                <div className="bg-[#00A699]"></div>
                <div className="bg-[#FFB400]"></div>
              </div>

              {/* Modal Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Reset Tenant Pass Password</h4>
                    <p className="text-[11px] text-slate-500">পাছৱৰ্ড পাহৰিলে ইয়াত ৰিছেট কৰক</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {forgotMsg && (
                  <div
                    className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                      forgotMsg.type === 'error'
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {forgotMsg.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    )}
                    <span>{forgotMsg.text}</span>
                  </div>
                )}

                {forgotStep === 'phone' ? (
                  /* Step 1: Enter Phone Number */
                  <form onSubmit={handleSendTenantForgotOtp} className="space-y-4">
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">Enter your registered WhatsApp number:</p>
                      <p className="text-[11px] text-slate-500">
                        We will verify your pass account and allow you to set a new password.
                      </p>
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
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Testing Account: <span className="font-mono font-bold text-slate-600">9876543210</span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-black text-xs shadow-md shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter OTP & Set New Password */
                  <form onSubmit={handleResetTenantPassword} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Enter 6-Digit OTP *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                            setGeneratedDemoOtp(newOtp);
                            setForgotOtp(newOtp);
                            setForgotMsg({ type: 'success', text: `New OTP generated: ${newOtp}` });
                          }}
                          className="text-[10px] font-bold text-[#00A699] hover:underline"
                        >
                          Resend OTP
                        </button>
                      </div>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-center text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                        New Password *
                      </label>
                      <input
                        required
                        type="password"
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        placeholder="Enter new password (min 4 chars)"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        required
                        type="password"
                        value={forgotConfirmPass}
                        onChange={(e) => setForgotConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotStep('phone')}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-black text-xs shadow-md shadow-[#00A699]/20 transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Update Password & Login</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Razorpay Interactive Checkout Modal */}
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          amount={49}
          customerName={name || 'NestFinder Member'}
          customerPhone={whatsapp || '9876543210'}
          description="30-Day Tenant Pass Unlock"
          onClose={() => setIsRazorpayModalOpen(false)}
          onSuccess={(paymentId) => {
            setIsRazorpayModalOpen(false);
            handlePassActivationSuccess(paymentId, 'Razorpay');
          }}
        />

        {/* Razorpay Configuration Settings Modal */}
        <RazorpayConfigModal
          isOpen={isRazorpayConfigOpen}
          onClose={() => setIsRazorpayConfigOpen(false)}
          onTestPayment={() => {
            setIsRazorpayConfigOpen(false);
            setIsRazorpayModalOpen(true);
          }}
        />

      </div>
    </div>
  );
};
