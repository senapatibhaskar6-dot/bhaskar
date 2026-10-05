import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Smartphone,
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { getRazorpayConfig, saveRazorpayKey } from '../services/razorpay';

interface RazorpayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestPayment?: () => void;
}

export const RazorpayConfigModal: React.FC<RazorpayConfigModalProps> = ({
  isOpen,
  onClose,
  onTestPayment
}) => {
  if (!isOpen) return null;

  const [currentConfig, setCurrentConfig] = useState(getRazorpayConfig());
  const [customKey, setCustomKey] = useState(currentConfig.keyId);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const config = getRazorpayConfig();
    setCurrentConfig(config);
    setCustomKey(config.keyId);

    try {
      const records = JSON.parse(localStorage.getItem('nestfinder_payment_records') || '[]');
      const rzpRecords = records.filter((r: any) => r.paymentMethod === 'Razorpay' || (r.razorpayPaymentId && r.razorpayPaymentId.startsWith('pay_')));
      setTransactions(rzpRecords.slice(0, 5));
    } catch (e) {
      setTransactions([]);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveRazorpayKey(customKey);
    const updated = getRazorpayConfig();
    setCurrentConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToTest = () => {
    saveRazorpayKey('');
    const updated = getRazorpayConfig();
    setCurrentConfig(updated);
    setCustomKey(updated.keyId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C2340] to-[#1E3A8A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B83EA] flex items-center justify-center text-white shadow-md">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M14 2L2 14h8l-2 8 12-12h-8l2-8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Razorpay Gateway</h3>
                <span className="text-[10px] uppercase font-black tracking-wider bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-blue-200">Payment Gateway Settings & Key Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Status Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2B83EA] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700">
              <p className="font-extrabold text-slate-900">Razorpay Payment Integration Ready</p>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                Supports instant ₹49 Tenant Pass activations with UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, and Wallets.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 font-bold text-[11px]">
                <span className="bg-white border border-blue-200 px-2 py-0.5 rounded-md text-slate-700">UPI Instant</span>
                <span className="bg-white border border-blue-200 px-2 py-0.5 rounded-md text-slate-700">All Cards</span>
                <span className="bg-white border border-blue-200 px-2 py-0.5 rounded-md text-slate-700">NetBanking</span>
                <span className="bg-white border border-blue-200 px-2 py-0.5 rounded-md text-slate-700">Wallets</span>
              </div>
            </div>
          </div>

          {/* Key Configuration Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#2B83EA]" />
                  <span>Razorpay Key ID</span>
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  currentConfig.isTestMode
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {currentConfig.isTestMode ? '⚡ Test Mode' : '🟢 Live Production'}
                </span>
              </div>

              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="rzp_test_... or rzp_live_..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold bg-[#F8FAFC] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B83EA] focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                You can get your Key ID from{' '}
                <a
                  href="https://dashboard.razorpay.com/#/access/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2B83EA] hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  Razorpay Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Razorpay Gateway credentials saved successfully!</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-[#2B83EA] hover:bg-[#1E6BCE] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Key</span>
              </button>

              <button
                type="button"
                onClick={handleResetToTest}
                className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                title="Reset to default developer test mode"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>
          </form>

          {/* Quick Test Option */}
          {onTestPayment && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Test Razorpay Checkout</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Preview how the ₹49 Tenant Pass payment looks and behaves.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTestPayment();
                }}
                className="py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-xs transition shrink-0"
              >
                Run Test (₹49)
              </button>
            </div>
          )}

          {/* Recent Razorpay Payments Log */}
          {transactions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent Razorpay Payments
              </span>
              <div className="space-y-2">
                {transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{tx.name}</p>
                      <p className="font-mono text-[10px] text-slate-400">ID: {tx.razorpayPaymentId || tx.utr}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600">₹{tx.amount}</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm font-bold">
                        Captured
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
