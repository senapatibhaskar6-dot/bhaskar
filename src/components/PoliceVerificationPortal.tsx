import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Send,
  MessageCircle,
  Mail,
  Printer,
  Copy,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Home,
  Phone,
  Lock,
  Download,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  PlusCircle,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PoliceVerification, SupabaseConfig } from '../types';
import { syncPoliceVerificationToSupabase } from '../services/supabase';

interface PoliceVerificationPortalProps {
  verifications: PoliceVerification[];
  onAddVerification: (verification: PoliceVerification) => void;
  supabaseConfig: SupabaseConfig;
  currentOwnerName?: string;
  currentOwnerPhone?: string;
}

export const PoliceVerificationPortal: React.FC<PoliceVerificationPortalProps> = ({
  verifications,
  onAddVerification,
  supabaseConfig,
  currentOwnerName = '',
  currentOwnerPhone = ''
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'statement' | 'records'>('form');

  // Form States
  const [tenantName, setTenantName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [idProofType, setIdProofType] = useState<'Aadhaar Card' | 'Voter ID' | 'Passport' | 'Driving License'>('Aadhaar Card');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [propertyName, setPropertyName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [ownerName, setOwnerName] = useState(currentOwnerName || '');
  const [ownerPhone, setOwnerPhone] = useState(currentOwnerPhone || '');
  const [policeStationName, setPoliceStationName] = useState('Dispur Police Station');
  const [policeStationPhone, setPoliceStationPhone] = useState('9435012345');
  const [policeStationEmail, setPoliceStationEmail] = useState('oc.dispurps@assampolice.gov.in');
  const [purposeOfStay, setPurposeOfStay] = useState('Student / Coaching Studies');
  const [workOrCollegeName, setWorkOrCollegeName] = useState('');

  const [activeStatement, setActiveStatement] = useState<PoliceVerification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Form Submit Handler
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !tenantName.trim() ||
      !dob.trim() ||
      !phone.trim() ||
      !permanentAddress.trim() ||
      !idProofNumber.trim() ||
      !arrivalDate.trim() ||
      !propertyName.trim() ||
      !roomNumber.trim() ||
      !propertyAddress.trim() ||
      !ownerName.trim() ||
      !ownerPhone.trim() ||
      !policeStationName.trim()
    ) {
      setFormError('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    const refNum = `PV-NF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: PoliceVerification = {
      id: `pv_${Date.now()}`,
      referenceNumber: refNum,
      tenantName: tenantName.trim(),
      guardianName: guardianName.trim() || undefined,
      dob: dob.trim(),
      phone: phone.trim().replace(/\D/g, ''),
      whatsapp: whatsapp.trim() ? whatsapp.trim().replace(/\D/g, '') : phone.trim().replace(/\D/g, ''),
      permanentAddress: permanentAddress.trim(),
      idProofType,
      idProofNumber: idProofNumber.trim(),
      arrivalDate: arrivalDate.trim(),
      propertyName: propertyName.trim(),
      roomNumber: roomNumber.trim(),
      propertyAddress: propertyAddress.trim(),
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim().replace(/\D/g, ''),
      policeStationName: policeStationName.trim(),
      policeStationPhone: policeStationPhone.trim() || undefined,
      policeStationEmail: policeStationEmail.trim() || undefined,
      purposeOfStay: purposeOfStay.trim(),
      workOrCollegeName: workOrCollegeName.trim() || undefined,
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    onAddVerification(newRecord);

    if (supabaseConfig.isConnected) {
      await syncPoliceVerificationToSupabase(newRecord, supabaseConfig);
    }

    setIsSubmitting(false);
    setActiveStatement(newRecord);
    setActiveTab('statement');

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {}
  };

  // Generate official plain text summary for WhatsApp and Email
  const getVerificationReportText = (v: PoliceVerification) => {
    return `*TENANT / PG INMATE POLICE VERIFICATION REPORT*
Ref No: ${v.referenceNumber}
Date: ${new Date(v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Police Station: ${v.policeStationName}

--- TENANT PARTICULARS ---
• Full Name: ${v.tenantName}
• Father / Guardian: ${v.guardianName || 'N/A'}
• Date of Birth: ${v.dob}
• Contact Phone: +91 ${v.phone}
• Permanent Address: ${v.permanentAddress}
• ID Proof Type: ${v.idProofType}
• ID Proof Number: ${v.idProofNumber}
• Purpose of Stay: ${v.purposeOfStay}
• College / Office: ${v.workOrCollegeName || 'N/A'}

--- ACCOMMODATION DETAILS ---
• Property / PG Name: ${v.propertyName}
• Room / Bed No: ${v.roomNumber}
• Address: ${v.propertyAddress}
• Date of Arrival / Move-in: ${v.arrivalDate}

--- PROPERTY OWNER / MANAGER ---
• Owner Name: ${v.ownerName}
• Owner Contact: +91 ${v.ownerPhone}

DECLARATION:
I hereby certify that the above tenant details have been verified against their valid identity proof and are true to the best of my knowledge. Submitted via NestFinder Verified Platform.`;
  };

  const handleShareWhatsApp = (v: PoliceVerification) => {
    const text = encodeURIComponent(getVerificationReportText(v));
    const targetPhone = v.policeStationPhone ? v.policeStationPhone.replace(/\D/g, '') : '';
    const url = targetPhone
      ? `https://wa.me/91${targetPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = (v: PoliceVerification) => {
    const subject = encodeURIComponent(
      `Tenant Police Verification Report - ${v.tenantName} (${v.propertyName}) - Ref: ${v.referenceNumber}`
    );
    const body = encodeURIComponent(getVerificationReportText(v));
    const targetEmail = v.policeStationEmail || '';
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const handleCopyText = (v: PoliceVerification) => {
    navigator.clipboard.writeText(getVerificationReportText(v));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-8 relative overflow-hidden border border-blue-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 mb-3 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Official Safety & Legal Compliance Module</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Automated Tenant <span className="text-[#00E676]">Police Verification</span>
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Generate standardized tenant police verification certificates with one-click direct dispatch to local police stations via official WhatsApp & Email.
            </p>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-md shrink-0">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                activeTab === 'form'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Verification</span>
            </button>

            {activeStatement && (
              <button
                onClick={() => setActiveTab('statement')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                  activeTab === 'statement'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Generated Statement</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                activeTab === 'records'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Records ({verifications.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: FORM ================= */}
      {activeTab === 'form' && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="pb-4 border-b border-slate-100 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tenant Police Verification Registration Form
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                To be filled by PG owners, hostel managers, or landlords upon onboarding a new tenant.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Official Format
            </span>
          </div>

          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-6">
            
            {/* SECTION 1: TENANT PARTICULARS */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>1. Tenant Personal Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Tenant Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Rahul Senapati"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Father's / Guardian's Name
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="e.g. Biren Senapati"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Date of Birth *
                  </label>
                  <input
                    required
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Tenant Phone / Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Permanent Address (Village/Town, District, State, PIN) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    placeholder="e.g. House No. 42, Ward No. 3, Tezpur, Sonitpur, Assam - 784001"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    ID Proof Document Type *
                  </label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (12 Digits)</option>
                    <option value="Voter ID">Voter ID Card (EPIC)</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    ID Proof Number *
                  </label>
                  <input
                    required
                    type="text"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="e.g. 5432 9876 1234 or AS01-2023-..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Purpose of Stay *
                  </label>
                  <select
                    value={purposeOfStay}
                    onChange={(e) => setPurposeOfStay(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="Student / Coaching Studies">Student (Coaching / College)</option>
                    <option value="Private Sector Job">Private Sector Employment</option>
                    <option value="Government Service">Government Service / Exam Prep</option>
                    <option value="Medical Treatment">Medical Treatment / Relative Visit</option>
                    <option value="Business / Other">Business / Freelancing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Workplace / College / Coaching Center Name
                  </label>
                  <input
                    type="text"
                    value={workOrCollegeName}
                    onChange={(e) => setWorkOrCollegeName(e.target.value)}
                    placeholder="e.g. Cotton University / TCS Guwahati"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: ACCOMMODATION & OWNER DETAILS */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span>2. Property & Owner Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Property / PG / Hostel Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g. GreenView Boys PG"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Room / Flat / Bed Number *
                  </label>
                  <input
                    required
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Room 204 (Bed B)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Date of Arrival (Move-in) *
                  </label>
                  <input
                    required
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Property Street Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. By-lane 4, G.S. Road, Christian Basti, Guwahati - 781005"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Owner / Manager Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Pranab Das"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Owner Phone / WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9435012345"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: LOCAL POLICE JURISDICTION */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>3. Local Police Station Jurisdiction</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Local Police Station Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={policeStationName}
                    onChange={(e) => setPoliceStationName(e.target.value)}
                    placeholder="e.g. Dispur Police Station / Jalukbari PS"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    PS WhatsApp / Helpline Number
                  </label>
                  <input
                    type="tel"
                    value={policeStationPhone}
                    onChange={(e) => setPoliceStationPhone(e.target.value)}
                    placeholder="e.g. 9435012345"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                    Police Station Official Email
                  </label>
                  <input
                    type="email"
                    value={policeStationEmail}
                    onChange={(e) => setPoliceStationEmail(e.target.value)}
                    placeholder="e.g. oc.dispurps@assampolice.gov.in"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating Verification Statement...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Generate & Send Police Verification Report</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Data is formatted into an official verification certificate and saved to the Supabase database.
            </p>

          </form>

        </div>
      )}

      {/* ================= TAB 2: OFFICIAL GENERATED STATEMENT PREVIEW & DIRECT SHARING ================= */}
      {activeTab === 'statement' && activeStatement && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Quick Action Top Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-800">
                Ref No: <span className="font-mono text-blue-600">{activeStatement.referenceNumber}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleShareWhatsApp(activeStatement)}
                className="py-2 px-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp to Police</span>
              </button>

              <button
                onClick={() => handleShareEmail(activeStatement)}
                className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Mail className="w-4 h-4" />
                <span>Email to Police</span>
              </button>

              <button
                onClick={() => handleCopyText(activeStatement)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                title="Copy verification report"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-1 transition"
                title="Print official statement"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Official Verification Statement Layout (Printable) */}
          <div
            id="police-verification-printable"
            className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl p-8 sm:p-12 space-y-6 text-slate-800 font-sans relative"
          >
            {/* Official Header */}
            <div className="text-center pb-6 border-b-2 border-slate-200 space-y-1.5">
              <div className="w-14 h-14 bg-blue-900 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-xl shadow-md mb-2">
                <ShieldCheck className="w-8 h-8 text-blue-200" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                Tenant / PG Inmate Information Sheet
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Submitted Under Legal Verification Regulations to {activeStatement.policeStationName}
              </p>
              <div className="inline-block mt-1 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full text-xs font-mono font-black text-slate-700">
                Official Reference ID: {activeStatement.referenceNumber}
              </div>
            </div>

            {/* Two-Column Grid of Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              
              {/* Column 1: Tenant Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-blue-950 uppercase text-xs tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Tenant Details</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Full Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{activeStatement.tenantName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Father / Guardian</span>
                    <span className="font-semibold text-slate-800">{activeStatement.guardianName || 'N/A'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Date of Birth</span>
                      <span className="font-semibold text-slate-800">{activeStatement.dob}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Mobile Number</span>
                      <span className="font-semibold text-slate-800 font-mono">+91 {activeStatement.phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Permanent Address</span>
                    <span className="font-medium text-slate-800 leading-snug">{activeStatement.permanentAddress}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">{activeStatement.idProofType} Number</span>
                    <span className="font-mono font-black text-slate-900 text-sm tracking-wide bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                      {activeStatement.idProofNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Purpose of Stay</span>
                    <span className="font-semibold text-slate-800">{activeStatement.purposeOfStay}</span>
                    {activeStatement.workOrCollegeName && (
                      <span className="text-slate-500 block text-xs">({activeStatement.workOrCollegeName})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Accommodation & Landlord Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-black text-blue-950 uppercase text-xs tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Stay & Landlord Particulars</span>
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Stay Facility Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{activeStatement.propertyName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Room / Bed No</span>
                      <span className="font-black text-slate-800 font-mono">{activeStatement.roomNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Date of Arrival</span>
                      <span className="font-semibold text-slate-800">{activeStatement.arrivalDate}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Rental Premises Address</span>
                    <span className="font-medium text-slate-800 leading-snug">{activeStatement.propertyAddress}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Owner / Landlord Name</span>
                    <span className="font-extrabold text-slate-900">{activeStatement.ownerName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Owner Contact</span>
                    <span className="font-semibold text-slate-800 font-mono">+91 {activeStatement.ownerPhone}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Target Police Station</span>
                    <span className="font-bold text-blue-900">{activeStatement.policeStationName}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Official Legal Declaration Statement */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-2">
              <h5 className="font-black text-slate-900 uppercase text-[10px] tracking-wider">
                Landlord / Owner Declaration:
              </h5>
              <p className="leading-relaxed">
                I hereby declare that the tenant information submitted above has been cross-checked with the original {activeStatement.idProofType} and permanent address records provided by the tenant. This digital report is maintained for security, public safety, and official police record purposes.
              </p>
              <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                <span>Timestamp: {new Date(activeStatement.createdAt).toLocaleString('en-IN')}</span>
                <span>Verified via NestFinder Platform</span>
              </div>
            </div>

            {/* Signatures Block */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-300"></div>
                <span className="font-bold text-slate-600 block mt-1">Tenant Signature</span>
                <span className="text-[10px] text-slate-400">({activeStatement.tenantName})</span>
              </div>
              <div className="space-y-1">
                <div className="h-10 border-b border-dashed border-slate-300"></div>
                <span className="font-bold text-slate-600 block mt-1">Owner / Manager Signature</span>
                <span className="text-[10px] text-slate-400">({activeStatement.ownerName})</span>
              </div>
            </div>

          </div>

          {/* Action Callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950">Ready to Dispatch to Local Police</h4>
                <p className="text-[11px] text-emerald-800">
                  Click below to immediately send this statement via WhatsApp or Email to {activeStatement.policeStationName}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleShareWhatsApp(activeStatement)}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp</span>
              </button>

              <button
                onClick={() => handleShareEmail(activeStatement)}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: RECORDS HISTORY ================= */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Submitted Tenant Verifications ({verifications.length})
            </h3>
            <button
              onClick={() => setActiveTab('form')}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Tenant Form</span>
            </button>
          </div>

          {verifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No Verification Records Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill out the verification form whenever a new student or tenant moves into your PG or rental property.
              </p>
              <button
                onClick={() => setActiveTab('form')}
                className="mt-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
              >
                Create First Tenant Verification
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {v.referenceNumber}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {v.status}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {v.tenantName}
                    </h4>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        Stay: <span className="font-normal">{v.propertyName} ({v.roomNumber})</span>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Address: {v.permanentAddress}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        PS: {v.policeStationName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">
                        Date: {new Date(v.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveStatement(v);
                        setActiveTab('statement');
                      }}
                      className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Share</span>
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(v)}
                      className="p-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl transition"
                      title="Send via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
