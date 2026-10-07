import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Briefcase,
  Home,
  CheckCircle2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'customer'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || (role === 'admin' ? 'System Admin' : role === 'owner' ? 'Property Owner' : role === 'job_seeker' ? 'Job Seeker' : 'Verified Tenant'),
      phone: cleanPhone,
      email: email.trim() || undefined,
      role,
      hasPaidPass: role === 'customer' ? false : true,
      registeredAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
    onClose();
  };

  // 1-Click Demo Persona Login for seamless testing
  const handleDemoLogin = (selectedRole: UserRole) => {
    const demoUser: UserProfile = {
      id: `usr_demo_${selectedRole}_${Date.now()}`,
      name:
        selectedRole === 'admin'
          ? 'Bhaskar (Administrator)'
          : selectedRole === 'owner'
          ? 'Bhaskar Senapati (Owner)'
          : selectedRole === 'job_seeker'
          ? 'Rahul Bora (Job Seeker)'
          : 'Priya Sharma (Tenant)',
      phone: '9876543210',
      email: `${selectedRole}@nestfinder.in`,
      role: selectedRole,
      hasPaidPass: true,
      registeredAt: new Date().toISOString()
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-purple-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold mb-2 border border-purple-400/20">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Role-Based Authentication</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' ? 'Sign In to NestFinder' : 'Create an Account'}
          </h3>
          <p className="text-xs text-purple-200 mt-1">
            Dynamic routing will direct you to your personalized dashboard based on your role.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick 1-Click Demo Login Bar */}
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
            <span className="text-[11px] font-black uppercase text-purple-900 tracking-wider block">
              ⚡ Instant 1-Click Test Login (RBAC):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('owner')}
                className="py-1.5 px-2 bg-white hover:bg-rose-50 text-[#FF5A5F] border border-rose-200 rounded-xl text-[11px] font-black shadow-2xs transition flex items-center justify-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Owner Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('job_seeker')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-black shadow-2xs transition flex items-center justify-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-black shadow-2xs transition flex items-center justify-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer / Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-[11px] font-black shadow-2xs transition flex items-center justify-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1.5">
                Select Your Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
                    role === 'customer'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer (Tenant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-2.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
                    role === 'owner'
                      ? 'border-[#FF5A5F] bg-rose-50 text-[#FF5A5F] ring-2 ring-[#FF5A5F]/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Property Owner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('job_seeker')}
                  className={`p-2.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
                    role === 'job_seeker'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 ${
                    role === 'admin'
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Platform Admin</span>
                </button>
              </div>
            </div>

            {/* Name (if signup) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bhaskar Senapati"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-black text-sm text-white bg-purple-700 hover:bg-purple-800 shadow-md shadow-purple-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Sign In & Route to Dashboard' : 'Register & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              {mode === 'login'
                ? "Don't have an account yet? Create one"
                : 'Already registered? Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
