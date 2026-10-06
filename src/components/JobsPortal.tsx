import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  GraduationCap,
  Clock,
  Phone,
  MessageCircle,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Filter,
  DollarSign,
  Share2,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobVacancy, SupabaseConfig } from '../types';
import { syncJobToSupabase } from '../services/supabase';

interface JobsPortalProps {
  jobs: JobVacancy[];
  onAddJob: (newJob: JobVacancy) => void;
  supabaseConfig: SupabaseConfig;
}

export const JobsPortal: React.FC<JobsPortalProps> = ({
  jobs,
  onAddJob,
  supabaseConfig
}) => {
  const [activeTab, setActiveTab] = useState<'seeker' | 'employer'>('seeker');

  // Search & Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Employer Form States
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [education, setEducation] = useState('Graduate (Any Stream) or 12th Pass');
  const [experience, setExperience] = useState('Fresher to 1 Year');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship'>('Full-time');
  const [employerName, setEmployerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Filtering
  const filteredJobs = jobs.filter((job) => {
    const matchesTitle =
      !searchTitle.trim() ||
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTitle.toLowerCase());

    const matchesLocation =
      !searchLocation.trim() ||
      job.location.toLowerCase().includes(searchLocation.toLowerCase());

    const matchesCompany =
      !searchCompany.trim() ||
      job.company.toLowerCase().includes(searchCompany.toLowerCase());

    const matchesType = selectedType === 'ALL' || job.jobType === selectedType;

    return matchesTitle && matchesLocation && matchesCompany && matchesType;
  });

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !company.trim() || !location.trim() || !salary.trim() || !phone.trim() || !description.trim()) {
      setFormError('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit contact phone number.');
      return;
    }

    setIsSubmitting(true);

    const newJob: JobVacancy = {
      id: `job_${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      salary: salary.trim(),
      education: education.trim(),
      experience: experience.trim(),
      phone: cleanPhone,
      description: description.trim(),
      jobType,
      employerName: employerName.trim() || company.trim(),
      postedAt: new Date().toISOString()
    };

    onAddJob(newJob);

    if (supabaseConfig.isConnected) {
      await syncJobToSupabase(newJob, supabaseConfig);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    // Reset Form
    setTitle('');
    setCompany('');
    setLocation('');
    setSalary('');
    setPhone('');
    setDescription('');
    setEmployerName('');

    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('seeker');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-8 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A5F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Student & Tenant Employment Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Private Job <span className="text-[#FF5A5F]">Vacancy Portal</span>
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Find verified local jobs near your PG, hostel, or rental home in coaching institutes, offices, retail, hospitality, and tech hubs with zero recruitment brokerage.
            </p>
          </div>

          {/* Navigation Pill Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-md shrink-0">
            <button
              onClick={() => setActiveTab('seeker')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                activeTab === 'seeker'
                  ? 'bg-[#FF5A5F] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Seeker View</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('employer')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                activeTab === 'employer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Vacancy</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'seeker' ? (
        /* ================== JOB SEEKER VIEW ================== */
        <div className="space-y-6">
          
          {/* Search & Filtering Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Search by Title */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Filter by Job Title or Skill..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Search by Location */}
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Filter by Location (e.g. G.S. Road, Jalukbari)..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Search by Company */}
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                  placeholder="Filter by Company Name..."
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Quick Type Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Type:
                </span>
                {['ALL', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedType === type
                        ? 'bg-[#FF5A5F] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {(searchTitle || searchLocation || searchCompany || selectedType !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTitle('');
                    setSearchLocation('');
                    setSearchCompany('');
                    setSelectedType('ALL');
                  }}
                  className="text-xs font-bold text-[#FF5A5F] hover:underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Job Listings Grid */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No Job Vacancies Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active jobs match your search criteria. Try modifying your location, company, or title filter, or be the first to post a new opening!
              </p>
              <button
                onClick={() => setActiveTab('employer')}
                className="mt-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                Post a Job Vacancy Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-[#FF5A5F]/40 shadow-xs hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    {/* Header: Company & Job Type */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center font-black text-sm text-indigo-700">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800 tracking-tight leading-tight line-clamp-1">
                            {job.company}
                          </h4>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Direct Employer
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#FF5A5F] transition-colors leading-snug">
                      {job.title}
                    </h3>

                    {/* Location & Salary Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        <span className="truncate max-w-[160px]">{job.location}</span>
                      </span>

                      <span className="flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.salary}</span>
                      </span>
                    </div>

                    {/* Education & Experience Specifications */}
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          <strong className="text-slate-800">Education:</strong> {job.education}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          <strong className="text-slate-800">Experience:</strong> {job.experience}
                        </span>
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${job.phone}`}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Employer</span>
                    </a>

                    <a
                      href={`https://wa.me/91${job.phone}?text=Hi%20${encodeURIComponent(
                        job.company
                      )},%20I%20saw%20your%20job%20vacancy%20"${encodeURIComponent(
                        job.title
                      )}"%20on%20NestFinder.%20I%20would%20like%20to%20apply.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition shadow-sm"
                      title="Apply via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      ) : (
        /* ================== EMPLOYER VIEW (POST JOB FORM) ================== */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-10 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Post a Job Vacancy
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reach thousands of active students and job seekers living in NestFinder PGs and rental houses.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('seeker')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-black text-sm">Job Vacancy Published Successfully!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your listing is now live on the NestFinder Jobs Portal for all applicants.
                </p>
              </div>
            </div>
          )}

          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handlePostJob} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Job Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Job Title *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Front Desk Executive / Accounts Assistant / PG Manager"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Company / Organization Name *
                </label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Coaching / Royal Stay PG"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Job Location (Area / City) *
                </label>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Guwahati (G.S. Road / Jalukbari)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Monthly Salary / Compensation *
                </label>
                <input
                  required
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹18,000 - ₹25,000 / month"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract / Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Education Qualification */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Education Qualification *
                </label>
                <input
                  required
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. 10th / 12th Pass / Graduate / Any"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Experience Required */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Experience Required *
                </label>
                <input
                  required
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. Fresher / 1-2 Years / 3+ Years"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Employer / HR Phone */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Direct Contact Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9864012345 (Candidates will call here)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Employer / Recruiter Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Contact Person Name (Optional)
                </label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  placeholder="e.g. Bhaskar Senapati (Manager)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-1">
                  Job Description & Roles *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe day-to-day duties, working hours, benefits (e.g. food/stay included), and required skills..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>

            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing Vacancy to Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Publish Job Vacancy (100% Free)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Zero recruitment commission. Job seekers will directly call or message your phone number.
            </p>

          </form>

        </div>
      )}

    </div>
  );
};
