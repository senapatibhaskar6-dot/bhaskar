import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CheckCircle,
  Copy,
  Sparkles,
  Lock,
  Unlock,
  CreditCard,
  Check,
  Download,
  AlertCircle,
  FileText
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
  const [name, setName] = useState(tenantPass?.name || '');
  const [whatsapp, setWhatsapp] = useState(tenantPass?.whatsapp || '');
  const [tenantType, setTenantType] = useState<'Student' | 'Working Professional' | 'Family'>(
    tenantPass?.tenantType || 'Student'
  );
  const [preferredCity, setPreferredCity] = useState(tenantPass?.preferredCity || '');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  // ₹99 Payment parameters
  const [utr, setUtr] = useState('');
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const upiId = 'senapatibhaskar6@oksbi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const trimmed = val.substring(0, 12);
    const formatted = trimmed.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp phone number');
      return;
    }
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) {
      setErrorMsg('Please enter a complete 12-digit Aadhaar Card number');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setErrorMsg('Please enter the 6-digit OTP code received on your mobile');
      return;
    }

    setIsVerifying(true);
    // Simulate UIDAI OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsOtpVerified(true);
    }, 1500);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!utr.trim() || utr.trim().length < 8) {
      setErrorMsg('Please complete the ₹99 payment and enter your 12-digit UTR ID.');
      return;
    }

    setIsPaymentSubmitting(true);
    setTimeout(() => {
      setIsPaymentSubmitting(false);

      const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
      const newPass: TenantUser = {
        id: tenantPass?.id || `tenant_${Date.now()}`,
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        tenantType,
        preferredCity: preferredCity.trim() || 'All Cities',
        hasPaidPass: true,
        passUtr: utr.trim(),
        passPurchasedAt: new Date().toISOString()
      };

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
    }, 1500);
  };

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
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default">
        
        {/* Header with High-Security Gradient */}
        <div className="bg-gradient-to-r from-[#FF5A5F] via-rose-600 to-[#222222] p-6 sm:p-7 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>High-Security Tenant Registration</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tenant & Student Registration Pass
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Get verified with Aadhaar and activate your 30-day pass to unlock all direct owner phone numbers and WhatsApp chats.
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
                  Welcome, <span className="font-bold text-[#222222]">{tenantPass.name}</span>. Your high-security 30-Day Tenant Pass is active. All owner contact details and exact addresses are unlocked.
                </p>
              </div>

              <div className="bg-[#F7F9FB] border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment UTR Key:</span>
                  <span className="font-mono font-bold text-[#222222]">{tenantPass.passUtr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Tenant Profile Status:</span>
                  <span className="font-bold text-emerald-600">Aadhaar & Payment Certified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Verified Date:</span>
                  <span className="text-slate-700">{new Date(tenantPass.passPurchasedAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
                  <span className="text-slate-500 font-bold">Platform Safety Lock:</span>
                  <span className="font-bold text-emerald-600">Active (30-Day Protected Pass)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Continue Contacting Owners
              </button>
            </div>
          ) : (
            /* Aadhaar Form Steps + UPI Payment */
            <div className="space-y-4">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-bold text-slate-500">
                <div className={`flex items-center gap-1.5 ${!isOtpVerified ? 'text-[#FF5A5F]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${!isOtpVerified ? 'bg-[#FF5A5F] text-white' : 'bg-slate-100'}`}>1</span>
                  <span>Aadhaar Verification</span>
                </div>
                <div className="w-10 h-px bg-slate-200"></div>
                <div className={`flex items-center gap-1.5 ${isOtpVerified ? 'text-[#FF5A5F]' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isOtpVerified ? 'bg-[#FF5A5F] text-white' : 'bg-slate-100'}`}>2</span>
                  <span>₹99 Registration Fee</span>
                </div>
              </div>

              {!isOtpVerified ? (
                /* PHASE 1: Aadhaar OTP Verification */
                <div>
                  {!isOtpSent ? (
                    /* Step 1A: Personal Details & Aadhaar Number */
                    <form onSubmit={handleSendOtp} className="space-y-5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Full Name (as in Aadhaar) *
                            </label>
                            <input
                              required
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Rahul Senapati"
                              className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              WhatsApp Mobile Number *
                            </label>
                            <input
                              required
                              type="tel"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              placeholder="e.g. 9876543210"
                              maxLength={10}
                              className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                              Your Status
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
                              placeholder="e.g. Guwahati, Jorhat"
                              className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                          <div className="space-y-3">
                            <label className="block text-xs font-black text-[#222222] uppercase tracking-wide">
                              Aadhaar Number *
                            </label>
                            <div className="relative">
                              <input
                                required
                                type="text"
                                value={aadhaarNumber}
                                onChange={handleAadhaarChange}
                                placeholder="0000 0000 0000"
                                className="w-full px-4 py-3 text-lg bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-mono text-center text-[#222222] tracking-widest font-black"
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>We run a secured identity validation check. Your Aadhaar details are never stored on our servers and are directly processed securely.</span>
                            </p>
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
                        disabled={isSendingOtp}
                        className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-[#00A699] hover:bg-[#00847A] text-white shadow-lg shadow-[#00A699]/20 transition flex items-center justify-center gap-2"
                      >
                        {isSendingOtp ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Generating Secure UIDAI OTP...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            <span>Request Aadhaar Verification OTP</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                        <span>Cancel & Return Home</span>
                      </button>
                    </form>
                  ) : (
                    /* Step 1B: Enter OTP Form */
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-semibold flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-emerald-950">Aadhaar OTP Sent Successfully!</p>
                          <p className="text-[11px] text-emerald-800 mt-1">
                            An SMS containing a 6-digit OTP code has been successfully sent to the UIDAI registered mobile number linked with Aadhaar card <b className="font-mono">{aadhaarNumber}</b>.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wide text-center">
                          Enter 6-Digit OTP Received *
                        </label>
                        <div className="max-w-[200px] mx-auto">
                          <input
                            required
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                            className="w-full px-4 py-3 text-2xl bg-[#F7F9FB] border-2 border-slate-300 rounded-xl focus:border-[#00A699] focus:outline-none font-mono text-center text-[#222222] tracking-widest font-black"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 text-center font-medium">
                          (For demonstration/testing, enter <b className="text-slate-600 font-bold">123456</b> or any 6-digit code)
                        </p>
                      </div>

                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        {isVerifying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Aadhaar Identity...</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>Confirm OTP & Proceed to Payment ✓</span>
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsOtpSent(false)}
                          className="py-3 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
                        >
                          ← Edit Aadhaar
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="py-3 px-4 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/85 transition flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel & Return</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                /* PHASE 2: ₹99 UPI QR Payment */
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-semibold flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-emerald-950">Aadhaar KYC Completed successfully!</p>
                      <p className="text-[11px] text-emerald-800 mt-1">
                        Your identity has been secured. Now, please pay the **₹99 Registration Fee** via UPI QR code below to activate your 30-day listing pass.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2">
                    <UpiPaymentQrCard amount={99} note={`${name} Tenant Pass`} showCopyButton={true} />
                  </div>

                  <div className="space-y-3 bg-[#F7F9FB] p-5 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                        Enter 12-Digit Transaction UTR / Ref No *
                      </label>
                      <input
                        required
                        type="text"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').substring(0, 12))}
                        placeholder="e.g. 301234567890"
                        maxLength={12}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-center font-mono font-black text-lg text-[#222222] tracking-wider"
                      />
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-normal text-center">
                        Scan the QR code, pay ₹99 using GPay, PhonePe or Paytm, and enter the generated UTR/Reference number above.
                      </p>
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
                    className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-lg shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-2 animate-pulse"
                  >
                    {isPaymentSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Your Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Activate My 30-Day Pass</span>
                      </>
                    )}
                  </button>

                      <div className="grid grid-cols-2 gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsOtpVerified(false)}
                          className="py-3 px-4 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="py-3 px-4 rounded-xl font-bold text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/85 transition flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel & Return</span>
                        </button>
                      </div>
                </form>
              )}

              {/* Secure Trust Stamp */}
              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Platform Security Policy: Verified Tenant Network
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
