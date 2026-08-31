import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { SupabaseConfig } from '../types';
import { testSupabaseConnection } from '../services/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onSaveConfig: (config: SupabaseConfig) => void;
  onSyncAll: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onSyncAll
}) => {
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  if (!isOpen) return null;

  const sqlSchema = `-- ==========================================
-- NESTFINDER SUPABASE POSTGRESQL SCHEMA
-- Paste this in Supabase SQL Editor & Run
-- ==========================================

-- 1. Create Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  landmark TEXT,
  monthly_rent NUMERIC NOT NULL,
  security_deposit NUMERIC NOT NULL,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_whatsapp TEXT NOT NULL,
  images JSONB NOT NULL,
  facilities JSONB NOT NULL,
  description TEXT,
  is_verified BOOLEAN DEFAULT true,
  listing_utr TEXT,
  gender_restriction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Tenant Passes Table
CREATE TABLE IF NOT EXISTS public.tenant_passes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  tenant_type TEXT,
  preferred_city TEXT,
  has_paid_pass BOOLEAN DEFAULT true,
  pass_utr TEXT NOT NULL,
  pass_purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  property_title TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visit_date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Allow Anonymous Public Read/Write
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public insert properties" ON public.properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read tenant_passes" ON public.tenant_passes FOR SELECT USING (true);
CREATE POLICY "Allow public insert tenant_passes" ON public.tenant_passes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert appointments" ON public.appointments FOR INSERT WITH CHECK (true);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempConfig: SupabaseConfig = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      isConnected: false
    };

    const isConnected = await testSupabaseConnection(tempConfig);
    setIsTesting(false);

    if (isConnected) {
      setTestResult('success');
      onSaveConfig({
        url: url.trim(),
        anonKey: anonKey.trim(),
        isConnected: true
      });
    } else {
      setTestResult('failed');
    }
  };

  const handleSave = () => {
    onSaveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      isConnected: Boolean(url.trim() && anonKey.trim())
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#222222] via-[#2A2E35] to-[#222222] p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#00A699] text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A699]">
              Backend Database Settings
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Supabase Cloud Sync
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Connect your own free Supabase PostgreSQL project for live database sync across devices.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-[#F7F9FB] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'config'
                ? 'border-[#00A699] text-[#00A699]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. API Credentials & Connection
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-[#00A699] text-[#00A699]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. SQL Schema Generator (Ready to run)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'config' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzabcdef.supabase.co"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00A699] focus:outline-none font-mono text-[#222222]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Supabase anon / public Key
                </label>
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00A699] focus:outline-none font-mono text-[#222222]"
                />
              </div>

              {testResult === 'success' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00A699]" />
                  <span>Connection Successful! Connected to Supabase backend.</span>
                </div>
              )}

              {testResult === 'failed' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800">
                  Could not connect to Supabase. Check your URL, Key, or run the SQL Schema in tab 2.
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !url.trim() || !anonKey.trim()}
                  className="flex-1 py-3 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isTesting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>Test Connection</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#222222] hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
                >
                  Save Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  PostgreSQL Tables & RLS Policies
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1.5 bg-[#00A699]/10 hover:bg-[#00A699]/20 text-[#00A699] font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-xs max-h-72 overflow-y-auto border border-slate-800">
                <pre>{sqlSchema}</pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
