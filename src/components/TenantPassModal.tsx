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
  AlertCircle
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
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const upiId = 'senapatibhaskar6@oksbi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number');
      return;
    }
    if (!utr.trim() || utr.trim().length < 8) {
      setErrorMsg('Please enter the 12-digit UPI UTR / Transaction Reference ID from your payment app.');
      return;
    }

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);

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
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Vibrant Gradient */}
        <div className="bg-gradient-to-r from-[#FF5A5F] via-[#FF7E82] to-[#FFB400] p-6 sm:p-7 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#222222]" />
            <span>₹99 One-Time Tenant Pass</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Students & Tenants: Direct Listing Access
          </h3>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Get unlimited direct phone numbers, WhatsApp chats & physical visit booking across all verified PGs & flats.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {tenantPass?.hasPaidPass ? (
            /* Already Verified View */
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#00A699]/15 text-[#00A699] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#222222]">Your ₹99 Pass is Active!</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome, <span className="font-bold text-[#222222]">{tenantPass.name}</span> ({tenantPass.whatsapp}).
                  All owner contacts and WhatsApp buttons across all listings are completely unlocked.
                </p>
              </div>

              <div className="bg-[#F7F9FB] border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment UTR ID:</span>
                  <span className="font-mono font-bold text-[#222222]">{tenantPass.passUtr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Pass Type:</span>
                  <span className="font-bold text-[#FF5A5F]">{tenantPass.tenantType || 'Student Pass'} (Lifetime)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Activation Date:</span>
                  <span className="text-slate-700">{new Date(tenantPass.passPurchasedAt || '').toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Continue Browsing Listings
              </button>
            </div>
          ) : (
            /* Registration & Payment Step Form */
            <form onSubmit={handleVerifyPayment} className="space-y-5">
              
              {/* Step 1: Personal Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#FF5A5F]/15 text-[#FF5A5F] text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-sm font-bold text-[#222222]">Tenant / Student Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      I am a:
                    </label>
                    <select
                      value={tenantType}
                      onChange={(e) => setTenantType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                    >
                      <option value="Student">Student (College / Coaching)</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Family">Family / Couple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Target City (Optional)
                    </label>
                    <input
                      type="text"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      placeholder="e.g. Bangalore, Kota, Pune"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: ₹99 QR Code Payment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#FF5A5F]/15 text-[#FF5A5F] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm font-bold text-[#222222]">Scan & Pay ₹99 (One-Time)</span>
                </div>

                <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-orange-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* Official Branded Google Pay QR Card */}
                    <UpiPaymentQrCard
                      amount={99}
                      note={`NestFinder Pass - ${name || 'Tenant'}`}
                      showCopyButton={false}
                    />

                    {/* Payment Instruction & UPI copy */}
                    <div className="space-y-3 text-center sm:text-left flex-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-800">
                        <CreditCard className="w-4 h-4 text-[#FF5A5F]" />
                        <span>Pay via GPay, PhonePe, Paytm, CRED</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Scan the official QR code above with any UPI app on your phone, or copy the UPI ID below to pay ₹99.
                      </p>

                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200 text-xs shadow-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Payee UPI ID</span>
                          <span className="font-mono font-bold text-[#222222]">{upiId}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#222222] font-bold rounded-lg transition flex items-center gap-1 text-[11px]"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3 h-3 text-[#00C853]" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy UPI
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-white/70 p-2 rounded-lg border border-slate-100">
                        <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0" />
                        <span>Verified Merchant Account: <b>Bhaskar Senapati</b></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Enter UTR / Transaction ID */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-[#FF5A5F]/15 text-[#FF5A5F] text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-sm font-bold text-[#222222]">Enter Payment UTR / Transaction ID</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    12-Digit UPI UTR ID *
                  </label>
                  <input
                    required
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 423189098712"
                    maxLength={16}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-mono text-[#222222]"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Find the 12-digit UTR in your payment details in GPay, PhonePe, or Paytm receipt.
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-[#FF5A5F] to-[#FF7E82] hover:from-[#E0484D] hover:to-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying UTR Reference...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Verify UTR & Activate Students & Tenants Pass (₹99)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
