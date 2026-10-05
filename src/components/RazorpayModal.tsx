import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  AlertCircle,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number; // e.g. 49
  customerName: string;
  customerPhone: string;
  description?: string;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  amount = 49,
  customerName,
  customerPhone,
  description = 'NestFinder 30-Day Tenant Pass',
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('upi');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // Netbanking states
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallet states
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ id: string; time: string } | null>(null);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay Secure Gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing payment with bank server...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Payment captured successfully!');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedId = `pay_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setPaymentSuccessData({
        id: generatedId,
        time: new Date().toLocaleTimeString()
      });

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 }
        });
      } catch (err) {}

      setTimeout(() => {
        onSuccess(generatedId);
      }, 1500);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Razorpay Brand Header (Official Navy & Blue theme) */}
        <div className="bg-[#0C2340] text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-[#2B83EA] px-2.5 py-1 rounded-lg text-white font-black text-xs tracking-wider">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M14 2L2 14h8l-2 8 12-12h-8l2-8z" />
              </svg>
              <span>Razorpay</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 bg-white/10 px-2 py-0.5 rounded-md">
              Secure Gateway
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-3">
            <div>
              <p className="text-xs text-blue-200 font-medium">Paying to NestFinder</p>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">₹{amount}.00</h3>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-300 font-medium">{customerName}</p>
              <p className="text-[10px] text-blue-200 font-mono">+91 {customerPhone}</p>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
            <span className="truncate">{description}</span>
            <span className="font-mono text-emerald-400 font-bold shrink-0">100% Encrypted</span>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="w-16 h-16 border-4 border-[#2B83EA]/20 border-t-[#2B83EA] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#2B83EA]" />
              </div>
            </div>
            <h4 className="text-base font-black text-slate-900">Processing Razorpay Payment</h4>
            <p className="text-xs text-slate-500 font-medium max-w-xs">{processingStep}</p>
            <div className="text-[10px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              Please do not close this window or press Back
            </div>
          </div>
        ) : paymentSuccessData ? (
          /* Success Receipt State */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">Payment Successful!</h4>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">
                Razorpay ID: <span className="font-mono">{paymentSuccessData.id}</span>
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full text-left space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900">₹{amount}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Gateway:</span>
                <span className="font-bold text-[#2B83EA]">Razorpay Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">Captured & Verified ✓</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-mono">{paymentSuccessData.time}</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-500">Unlocking your NestFinder Tenant Pass now...</p>
          </div>
        ) : (
          /* Payment Options Selector */
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            
            {/* Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'upi'
                    ? 'bg-white text-[#2B83EA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[10px]">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'card'
                    ? 'bg-white text-[#2B83EA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px]">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'netbanking'
                    ? 'bg-white text-[#2B83EA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[10px]">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col items-center gap-1 transition ${
                  selectedMethod === 'wallet'
                    ? 'bg-white text-[#2B83EA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[10px]">Wallet</span>
              </button>
            </div>

            {/* Sub-options for UPI */}
            {selectedMethod === 'upi' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Select UPI Application
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUpiOption('gpay')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      upiOption === 'gpay'
                        ? 'border-[#2B83EA] bg-blue-50/50 ring-2 ring-[#2B83EA]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center font-black text-xs text-blue-600">
                      G
                    </div>
                    <span className="text-xs font-bold text-slate-800">Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpiOption('phonepe')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      upiOption === 'phonepe'
                        ? 'border-[#2B83EA] bg-blue-50/50 ring-2 ring-[#2B83EA]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#5f259f] shadow-xs flex items-center justify-center font-black text-xs text-white">
                      Pe
                    </div>
                    <span className="text-xs font-bold text-slate-800">PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUpiOption('paytm')}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      upiOption === 'paytm'
                        ? 'border-[#2B83EA] bg-blue-50/50 ring-2 ring-[#2B83EA]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#002e6e] shadow-xs flex items-center justify-center font-black text-xs text-[#00b9f5]">
                      Pay
                    </div>
                    <span className="text-xs font-bold text-slate-800">Paytm UPI</span>
                  </button>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">Or Enter Any UPI ID (VPA)</span>
                    <span className="text-[10px] text-slate-400">e.g. mobile@upi</span>
                  </div>
                  <input
                    type="text"
                    value={customUpiId}
                    onChange={(e) => {
                      setCustomUpiId(e.target.value);
                      setUpiOption('id');
                    }}
                    placeholder="e.g. 9876543210@okhdfcbank"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B83EA] focus:outline-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* Sub-options for Card */}
            {selectedMethod === 'card' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Credit / Debit Card (Visa, RuPay, Master)
                </span>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B83EA] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B83EA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#2B83EA] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-options for NetBanking */}
            {selectedMethod === 'netbanking' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Select Your Bank
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        selectedBank === bank
                          ? 'border-[#2B83EA] bg-blue-50/50 text-[#2B83EA]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{bank}</span>
                      {selectedBank === bank && <CheckCircle className="w-3.5 h-3.5 text-[#2B83EA] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-options for Wallet */}
            {selectedMethod === 'wallet' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Select Wallet
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {['Paytm Wallet', 'PhonePe Wallet', 'MobiKwik', 'Freecharge'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        selectedWallet === w
                          ? 'border-[#2B83EA] bg-blue-50/50 text-[#2B83EA]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{w}</span>
                      {selectedWallet === w && <CheckCircle className="w-3.5 h-3.5 text-[#2B83EA] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2B83EA] hover:bg-[#1E6BCE] text-white font-black text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{amount}.00 via Razorpay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust and Compliance Footer */}
            <div className="pt-2 text-center border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secured by Razorpay • PCI-DSS Level 1 Compliant</span>
              </div>
              <p className="text-[9px] text-slate-400">
                Instant Automatic Pass Activation • 100% Refund Protection
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
