import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Home,
  Briefcase,
  IndianRupee,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Code,
  ShieldAlert,
  ArrowRight,
  Lock,
  Unlock,
  X,
  Check,
  Key
} from 'lucide-react';
import {
  Property,
  JobVacancy,
  PoliceVerification,
  PaymentRecord,
  UserProfile,
  UserRole
} from '../types';

interface AdminDashboardProps {
  currentUserRole: UserRole | null;
  properties: Property[];
  jobs: JobVacancy[];
  verifications: PoliceVerification[];
  payments: PaymentRecord[];
  users: UserProfile[];
  onDeleteUser: (userId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onTogglePropertyStatus: (propertyId: string, isBooked: boolean) => void;
  onToggleJobStatus: (jobId: string, isBooked: boolean) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenAuthModal: () => void;
  onNavigateToExplore?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUserRole,
  properties,
  jobs,
  verifications,
  payments,
  users,
  onDeleteUser,
  onDeleteProperty,
  onDeleteJob,
  onTogglePropertyStatus,
  onToggleJobStatus,
  onSwitchRole,
  onOpenAuthModal,
  onNavigateToExplore
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'jobs' | 'payments' | 'schema'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Security Lock System State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('nestfinder_admin_session_unlocked') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [lockError, setLockError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Change PIN modal state
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState('');

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFailedAttempts(0);
          setLockError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const getMasterPin = () => {
    return localStorage.getItem('nestfinder_admin_master_pin') || '8826';
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setLockError('');
    const actualPin = getMasterPin();

    if (enteredPin.trim() === actualPin) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('nestfinder_admin_session_unlocked', 'true');
      setEnteredPin('');
      setFailedAttempts(0);
      onSwitchRole('admin');
      showToast('Master Admin Dashboard Unlocked');
    } else {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      if (nextCount >= 3) {
        setLockoutTime(30);
        setLockError('Security Lockout: 3 failed attempts. Locked for 30 seconds.');
      } else {
        setLockError(`Incorrect Master PIN / Password. ${3 - nextCount} attempt(s) remaining.`);
      }
    }
  };

  const handleLockPanel = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('nestfinder_admin_session_unlocked');
    setEnteredPin('');
    showToast('Admin Panel Locked');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError('');
    setChangePinSuccess('');

    const actualPin = getMasterPin();
    if (currentPinInput.trim() !== actualPin) {
      setChangePinError('Current Master PIN is incorrect.');
      return;
    }

    if (!newPinInput.trim() || newPinInput.trim().length < 4) {
      setChangePinError('New Master PIN must be at least 4 digits or characters.');
      return;
    }

    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setChangePinError('New PIN and Confirm PIN do not match.');
      return;
    }

    localStorage.setItem('nestfinder_admin_master_pin', newPinInput.trim());
    setChangePinSuccess('Master Admin PIN successfully updated!');
    setTimeout(() => {
      setIsChangePinOpen(false);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setChangePinSuccess('');
      showToast('Master Admin PIN updated');
    }, 1200);
  };

  // ADMIN SECURITY LOCK SCREEN: Displayed whenever panel is locked
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-20 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 border border-purple-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
              <Lock className="w-8 h-8 text-purple-300" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                Locked Administrative Zone
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Admin Panel Security Lock
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                Protected area for platform financials, listings audit & user controls. Enter Master Admin PIN to unlock.
              </p>
            </div>

            <form onSubmit={handleUnlockAdmin} className="space-y-4 pt-2">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wide">
                  Master Admin PIN / Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPin ? 'text' : 'password'}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    disabled={lockoutTime > 0}
                    placeholder="Enter Master PIN / Password"
                    className="w-full px-4 py-3.5 bg-slate-950 border border-purple-800/80 rounded-2xl text-center text-lg font-mono font-black text-white focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest placeholder:text-slate-600 placeholder:text-sm placeholder:tracking-normal placeholder:font-sans"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    title={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Keypad for PIN entry */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto py-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                  <button
                    type="button"
                    key={k}
                    disabled={lockoutTime > 0}
                    onClick={() => {
                      if (k === 'C') setEnteredPin('');
                      else if (k === '⌫') setEnteredPin((p) => p.slice(0, -1));
                      else setEnteredPin((p) => p + k);
                    }}
                    className="py-2.5 bg-slate-800/80 hover:bg-purple-900/40 active:scale-95 text-slate-200 hover:text-white rounded-xl font-mono font-bold text-sm border border-slate-700/60 transition"
                  >
                    {k}
                  </button>
                ))}
              </div>

              {lockError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{lockError}</span>
                </div>
              )}

              {lockoutTime > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold text-center">
                  ⏳ Security Lockout: Try again in {lockoutTime}s
                </div>
              )}

              <button
                type="submit"
                disabled={lockoutTime > 0 || !enteredPin.trim()}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Master Admin Panel</span>
              </button>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Protected Admin Panel</span>
                </span>
                {onNavigateToExplore && (
                  <button
                    type="button"
                    onClick={onNavigateToExplore}
                    className="text-[11px] font-bold text-slate-400 hover:text-white hover:underline"
                  >
                    ← Exit to Explore Listings
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Real-time Metrics Calculations ---
  // a) Total registered Property/PG owners
  const totalOwners = users.filter((u) => u.role === 'owner').length;
  // b) Total employers/owners who posted jobs (unique phone/company or job_seeker/owner posters)
  const uniqueJobPosters = new Set(jobs.map((j) => j.phone || j.company)).size;
  // c) Total customers/tenants joined
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalPaidPassCustomers = users.filter((u) => u.role === 'customer' && u.hasPaidPass).length;
  // Revenue
  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 49), 0);
  const totalAvailableProperties = properties.filter((p) => !p.isBooked).length;
  const totalBookedProperties = properties.filter((p) => p.isBooked).length;
  const totalAvailableJobs = jobs.filter((j) => !j.isBooked).length;
  const totalBookedJobs = jobs.filter((j) => j.isBooked).length;

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Filtered Properties List
  const filteredProperties = properties.filter((p) =>
    !searchQuery.trim() ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Jobs List
  const filteredJobs = jobs.filter((j) =>
    !searchQuery.trim() ||
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-black mb-3 border border-purple-400/30">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Restricted Super Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              NestFinder <span className="text-purple-400">Master Admin Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Real-time platform metrics, role-based user management, listings deletion controls, and ₹49 pass revenue audit.
            </p>
          </div>

          {/* Admin Panel Security Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session Authenticated</span>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePinOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-1.5 shadow-sm"
              title="Change Master Admin PIN"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-300" />
              <span>Change PIN</span>
            </button>
            <button
              type="button"
              onClick={handleLockPanel}
              className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              title="Lock this panel immediately"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* CORE REQUIREMENTS: 3 Real-time Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric a: Registered Property/PG Owners */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered PG Owners
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#FF5A5F] flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalOwners}</span>
            <span className="text-xs font-bold text-slate-500">Property Owners</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {totalAvailableProperties} available • {totalBookedProperties} booked properties
          </p>
        </div>

        {/* Metric b: Employers / Job Posters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Job Posters / Employers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{uniqueJobPosters}</span>
            <span className="text-xs font-bold text-slate-500">Employers</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {totalAvailableJobs} active • {totalBookedJobs} closed vacancies
          </p>
        </div>

        {/* Metric c: Customers / Tenants (with ₹49 pass breakdown) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Customers / Tenants
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalCustomers}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
              {totalPaidPassCustomers} Paid ₹49
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tracking users who completed the ₹49 platform entry pass.
          </p>
        </div>

        {/* Metric d: Platform Fee Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pass Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">Net Platform Fee</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {payments.length} verified transactions recorded
          </p>
        </div>

      </div>

      {/* Navigation Tabs for Admin Management Sub-views */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'properties'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Property Listings ({properties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'jobs'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Vacancies ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'schema'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Supabase RBAC & RLS SQL</span>
        </button>
      </div>

      {/* --- SUBVIEW 1: USERS MANAGEMENT & DELETION --- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">User Management & Privilege Control</h3>
              <p className="text-xs text-slate-500">
                Full authority to view user credentials, verify passes, and delete/remove unauthorized accounts.
              </p>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'owner', 'customer', 'job_seeker', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition uppercase ${
                    roleFilter === r
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, phone or email..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Phone / Contact</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">₹49 Pass Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {user.name}
                      {user.email && <span className="block text-[11px] font-normal text-slate-500">{user.email}</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{user.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'owner'
                          ? 'bg-rose-100 text-[#FF5A5F]'
                          : user.role === 'job_seeker'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.hasPaidPass ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Paid & Active</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Free Access</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user ${user.name}? This will remove all their data.`)) {
                              onDeleteUser(user.id);
                              showToast(`Deleted user ${user.name}`);
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg transition inline-flex items-center gap-1"
                          title="Delete user permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-purple-700">Protected Root</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 2: PROPERTY LISTINGS MANAGEMENT --- */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Property Listings Oversight</h3>
              <p className="text-xs text-slate-500">
                View, toggle room availability status, and remove improper listings from the live feed.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {properties.length} Total Properties
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Owner & Phone</th>
                  <th className="py-3 px-4">Rent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      <span className="text-[11px] text-slate-500">{p.city} • {p.propertyType}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {p.ownerName}
                      <span className="block font-mono text-[11px] text-slate-500">{p.ownerPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{p.monthlyRent}/mo</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          onTogglePropertyStatus(p.id, !p.isBooked);
                          showToast(`Updated status for "${p.title}"`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                          p.isBooked
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Click to toggle Available vs Booked"
                      >
                        {p.isBooked ? '🔴 Booked' : '🟢 Available'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to permanently delete listing "${p.title}"? This document will be completely deleted from the database and will not reappear after page refresh.`)) {
                            onDeleteProperty(p.id);
                            showToast(`Permanently deleted document "${p.title}"`);
                          }
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-lg transition inline-flex items-center gap-1"
                        title="Delete listing and database document permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 3: JOB VACANCIES MANAGEMENT --- */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Job Vacancy Portal Oversight</h3>
              <p className="text-xs text-slate-500">
                Audit employer postings, toggle hiring status, or delete expired/spam vacancies.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {jobs.length} Total Openings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Job Title & Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{j.title}</span>
                      <span className="text-[11px] text-slate-500">{j.company} • {j.salary}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{j.location}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{j.phone}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          onToggleJobStatus(j.id, !j.isBooked);
                          showToast(`Updated job status for "${j.title}"`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                          j.isBooked
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {j.isBooked ? '🔴 Booked' : '🟢 Available'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to permanently delete vacancy "${j.title}"? This document will be completely deleted from the database and will not reappear after page refresh.`)) {
                            onDeleteJob(j.id);
                            showToast(`Permanently deleted job "${j.title}"`);
                          }
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-lg transition inline-flex items-center gap-1"
                        title="Delete vacancy document permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 4: SUPABASE SQL SCHEMA & RLS POLICIES --- */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-purple-400">
                Production-Ready Supabase RBAC & Row-Level Security (RLS) SQL
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Copy and run this SQL query directly in your Supabase SQL Editor to enforce roles and database permissions.
              </p>
            </div>
            <button
              onClick={() => {
                const sql = `-- Supabase SQL Schema for RBAC & Admin Management\n-- Run in Supabase SQL Editor\n...`;
                navigator.clipboard?.writeText(sqlCode);
                showToast('SQL Schema copied to clipboard!');
              }}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Copy SQL</span>
            </button>
          </div>

          <pre className="bg-black/60 p-4 sm:p-5 rounded-2xl overflow-x-auto text-xs font-mono text-purple-200 border border-slate-800 leading-relaxed max-h-[500px]">
            {sqlCode}
          </pre>
        </div>
      )}

      {/* --- OVERVIEW TAB DEFAULT --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Role-Based Access Control Architecture</span>
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <strong className="text-purple-900">🛡️ Admin (`admin`):</strong> Full privileges over platform metrics, listings moderation, user deletion, and payment audits.
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <strong className="text-rose-900">🏢 Owner (`owner`):</strong> Access to Owner Dashboard for creating/editing properties, viewing tenant verification forms, and toggling room availability.
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <strong className="text-indigo-900">💼 Job Seeker (`job_seeker`):</strong> Access to the Jobs Portal with direct employer calling, WhatsApp application, and vacancy filters.
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <strong className="text-emerald-900">🏠 Customer / Tenant (`customer`):</strong> Browse stays, unlock direct owner contact numbers via the ₹49 Pass, and schedule visits.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
            <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security & Verification Audit</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Total Police Verification statements submitted: <strong>{verifications.length}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Total ₹49 Verified Pass transactions: <strong>{payments.length}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Brokerage guaranteed on all direct owner contacts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant toggle prevents owners and employers from receiving spam calls</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('users')}
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Manage Users & Listings Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Master Admin PIN Modal */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-800/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setIsChangePinOpen(false);
                setChangePinError('');
                setChangePinSuccess('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Change Master Admin PIN</h3>
                <p className="text-xs text-slate-400">Update your secret lock screen passcode</p>
              </div>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Current Master PIN *
                </label>
                <input
                  required
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Enter current Master PIN"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  New Master PIN (at least 4 chars) *
                </label>
                <input
                  required
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Enter new secret PIN / Password"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Confirm New Master PIN *
                </label>
                <input
                  required
                  type="password"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {changePinError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{changePinError}</span>
                </div>
              )}

              {changePinSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{changePinSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md transition"
                >
                  Save New PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const sqlCode = `-- ==============================================================
-- NESTFINDER: ROLE-BASED ACCESS CONTROL (RBAC) & ROW-LEVEL SECURITY
-- Roles: 'owner', 'job_seeker', 'customer', 'admin'
-- ==============================================================

-- 1. Create Enum for Roles
CREATE TYPE user_role AS ENUM ('customer', 'owner', 'job_seeker', 'admin');

-- 2. Create User Profiles Table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  has_paid_pass BOOLEAN DEFAULT FALSE,
  pass_purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_verifications ENABLE ROW LEVEL SECURITY;

-- 4. Helper Function: Is User Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Helper Function: Is User Property Owner?
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS Policies: Profiles Table
-- Users can view their own profile; Admins can view and delete all profiles
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- 7. RLS Policies: Properties Table
-- Anyone can view available properties
CREATE POLICY "Anyone can view properties" ON public.properties
  FOR SELECT USING (true);

-- Only owners and admins can insert or update properties
CREATE POLICY "Owners can insert properties" ON public.properties
  FOR INSERT WITH CHECK (public.is_owner());

CREATE POLICY "Owners can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and Admins can delete properties" ON public.properties
  FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

-- 8. RLS Policies: Jobs Table
-- Anyone can read jobs; Job posters & admins can insert/update/delete
CREATE POLICY "Anyone can read jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Employers & Admins can manage jobs" ON public.jobs
  FOR ALL USING (auth.uid() = employer_id OR public.is_admin());

-- 9. Trigger: Automatically insert profile upon Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New Member'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;
