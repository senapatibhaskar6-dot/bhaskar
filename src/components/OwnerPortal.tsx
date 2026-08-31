import React, { useState } from 'react';
import {
  Building,
  Upload,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Home,
  MapPin,
  IndianRupee,
  Phone,
  MessageCircle,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, PropertyType, SharingType } from '../types';
import { AVAILABLE_FACILITIES, SAMPLE_PHOTO_PRESETS } from '../data/initialProperties';
import { UpiPaymentQrCard } from './UpiPaymentQrCard';

interface OwnerPortalProps {
  onAddProperty: (property: Property) => void;
  onNavigateToExplore: () => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  onAddProperty,
  onNavigateToExplore
}) => {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Boys PG');
  const [sharingType, setSharingType] = useState<SharingType>('Double');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [genderRestriction, setGenderRestriction] = useState<'Male only' | 'Female only' | 'Any / Family'>('Male only');
  
  // Exactly 4 Photos
  const [photos, setPhotos] = useState<[string, string, string, string]>([
    SAMPLE_PHOTO_PRESETS[0].url,
    SAMPLE_PHOTO_PRESETS[1].url,
    SAMPLE_PHOTO_PRESETS[2].url,
    SAMPLE_PHOTO_PRESETS[3].url
  ]);

  // Selected facilities
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'Wi-Fi 200+ Mbps',
    '3-Times Meals Included',
    'Attached Washroom',
    'RO Purified Water'
  ]);

  // Listing Fee (₹99) UTR
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const upiId = 'senapatibhaskar6@oksbi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setPhotos((prev) => {
        const next = [...prev] as [string, string, string, string];
        next[index] = result;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleApplySamplePresets = () => {
    setPhotos([
      SAMPLE_PHOTO_PRESETS[0].url,
      SAMPLE_PHOTO_PRESETS[1].url,
      SAMPLE_PHOTO_PRESETS[2].url,
      SAMPLE_PHOTO_PRESETS[3].url
    ]);
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter the Property / Building name.');
      return;
    }
    if (!city.trim() || !address.trim()) {
      setFormError('Please enter the complete address and city.');
      return;
    }
    if (!monthlyRent || Number(monthlyRent) <= 0) {
      setFormError('Please enter a valid monthly rent amount.');
      return;
    }
    if (!ownerName.trim() || !ownerPhone.trim() || !ownerWhatsapp.trim()) {
      setFormError('Please enter owner name and both phone & WhatsApp numbers.');
      return;
    }
    if (!utr.trim() || utr.trim().length < 8) {
      setFormError('Please complete the ₹99 listing fee payment and enter your 12-digit UTR ID.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newProperty: Property = {
        id: `prop_${Date.now()}`,
        title: title.trim(),
        propertyType,
        sharingType,
        address: address.trim(),
        city: city.trim(),
        landmark: landmark.trim() || undefined,
        monthlyRent: Number(monthlyRent),
        securityDeposit: Number(securityDeposit) || Number(monthlyRent),
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerWhatsapp: ownerWhatsapp.trim(),
        images: photos,
        facilities: selectedFacilities.length > 0 ? selectedFacilities : ['Wi-Fi 200+ Mbps'],
        description:
          description.trim() ||
          `Verified ${propertyType} in ${city}. Fully maintained with modern amenities and 24/7 security. Zero brokerage.`,
        isVerified: true,
        listingUtr: utr.trim(),
        genderRestriction,
        createdAt: new Date().toISOString()
      };

      onAddProperty(newProperty);
      setSubmittedSuccess(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-[#00A699]/15 text-[#00A699] mx-auto flex items-center justify-center shadow-lg shadow-[#00A699]/20">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-[#00A699]/10 text-[#00847A] text-xs font-bold rounded-full mb-2 border border-[#00A699]/30">
              Verified & Published (UTR: {utr})
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#222222]">
              Property Successfully Listed!
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Your property <span className="font-bold text-[#222222]">"{title}"</span> is now live in the NestFinder search directory. Verified tenants can now view your listing and contact you directly!
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateToExplore}
              className="px-6 py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-bold text-sm shadow-md shadow-[#FF5A5F]/20 transition"
            >
              View in Live Listings
            </button>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setTitle('');
                setMonthlyRent('');
                setSecurityDeposit('');
                setUtr('');
              }}
              className="px-6 py-3 bg-[#F7F9FB] hover:bg-slate-200 text-[#222222] rounded-xl font-bold text-sm transition border border-slate-200"
            >
              List Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#222222] via-[#2D2A32] to-[#222222] text-white p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5A5F]/20 text-rose-300 text-xs font-bold mb-3 border border-[#FF5A5F]/30">
            <ShieldCheck className="w-4 h-4 text-[#00A699]" />
            <span>Property Owner Registration & Verification</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            List Your PG, Hostel, or Rental House
          </h2>
          <p className="text-slate-300 text-xs sm:text-base mt-2 max-w-2xl leading-relaxed">
            Reach thousands of students and working professionals looking for verified accommodations. Zero commission, direct tenant calls & WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Section 1: Property & Location Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#222222]">
                Property & Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Property / Building Name *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Balaji Luxury Boys PG & Co-Living"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                >
                  <option value="Boys PG">Boys PG</option>
                  <option value="Girls PG">Girls PG</option>
                  <option value="Co-ed PG">Co-ed PG</option>
                  <option value="Private Hostel">Private Hostel</option>
                  <option value="1 BHK Flat">1 BHK Flat</option>
                  <option value="2 BHK Flat">2 BHK Flat</option>
                  <option value="3 BHK Flat">3 BHK Flat</option>
                  <option value="Independent House">Independent House</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City *
                </label>
                <input
                  required
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Hyderabad, Pune, Kota"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Landmark / Famous Spot
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Station / College Gate"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Complete Address / Street Details *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 302, Green Heights, 5th Cross, Near Christ University, Koramangala 4th Block"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Occupancy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#222222]">
                Pricing & Sharing Types
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Monthly Rent (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    required
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="8500"
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Security Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="8500"
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sharing / Layout *
                </label>
                <select
                  value={sharingType}
                  onChange={(e) => setSharingType(e.target.value as SharingType)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                >
                  <option value="Single">Single Occupancy Room</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Entire Flat / House">Entire Flat / Independent House</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Gender Preference / Tenant Restriction
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Male only', 'Female only', 'Any / Family'] as const).map((gender) => (
                    <label
                      key={gender}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                        genderRestriction === gender
                          ? 'border-[#FF5A5F] bg-[#FF5A5F]/10 text-[#FF5A5F] shadow-xs'
                          : 'border-slate-200 bg-[#F7F9FB] text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="genderRestriction"
                        checked={genderRestriction === gender}
                        onChange={() => setGenderRestriction(gender)}
                        className="hidden"
                      />
                      <span>{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Owner Contacts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                3
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#222222]">
                Owner Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Owner / Caretaker Name *
                </label>
                <input
                  required
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contact Phone (For Calling) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    required
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+91 9845012345"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-green-500 absolute left-3.5 top-3" />
                  <input
                    required
                    type="tel"
                    value={ownerWhatsapp}
                    onChange={(e) => setOwnerWhatsapp(e.target.value)}
                    placeholder="919845012345"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222] font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Exactly 4 Photo Uploads */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#222222]">
                  Exactly 4 Property Photos *
                </h3>
              </div>
              <button
                type="button"
                onClick={handleApplySamplePresets}
                className="text-xs font-bold text-[#FF5A5F] hover:text-[#E0484D] underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill High-Res Samples</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Upload exactly 4 clear photos (1. Bedroom, 2. Living/Common, 3. Washroom/Kitchen, 4. Building Exterior/Balcony).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Bedroom & Bed', 'Living / Study Area', 'Washroom / Kitchen', 'Exterior / Balcony'].map(
                (label, index) => (
                  <div
                    key={index}
                    className="border-2 border-dashed border-slate-300 hover:border-[#FF5A5F] rounded-2xl p-3 bg-[#F7F9FB] text-center transition flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-[#222222] block mb-2">
                      Photo {index + 1}: {label}
                    </span>

                    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-slate-200">
                      <img
                        src={photos[index]}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <label className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-[#222222] text-[11px] font-bold rounded-lg border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, index)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Section 5: Facilities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                5
              </span>
              <h3 className="text-base sm:text-lg font-black text-[#222222]">
                Facilities & Amenities
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_FACILITIES.map((facility) => {
                const isSelected = selectedFacilities.includes(facility);
                return (
                  <label
                    key={facility}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                      isSelected
                        ? 'border-[#00A699] bg-[#00A699]/10 text-[#00847A] font-bold'
                        : 'border-slate-200 bg-[#F7F9FB] text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFacility(facility)}
                      className="rounded text-[#00A699] focus:ring-[#00A699] w-4 h-4"
                    />
                    <span>{facility}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 6: ₹99 Owner Listing Fee & UTR Verification */}
          <div className="bg-gradient-to-br from-[#FF5A5F]/10 via-[#F7F9FB] to-[#FFB400]/10 border border-[#FF5A5F]/25 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#FF5A5F] text-white text-xs font-black flex items-center justify-center">
                6
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#222222]">
                  Owner Listing Verification Fee (₹99 via UPI QR)
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  We charge a nominal ₹99 verification fee to eliminate fake spam listings and ensure 100% genuine properties for students.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Official Branded Google Pay QR Card */}
              <div className="md:col-span-5 flex justify-center">
                <UpiPaymentQrCard
                  amount={99}
                  note={`Listing Fee - ${title || 'Property'}`}
                  showCopyButton={false}
                />
              </div>

              {/* UTR Input & Action */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Payee Account (Bhaskar Senapati)</span>
                    <span className="text-slate-600 font-medium">UPI ID: <b className="font-mono text-[#222222]">{upiId}</b></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 bg-[#FF5A5F]/10 hover:bg-[#FF5A5F]/20 text-[#FF5A5F] font-bold rounded-lg transition text-[11px] flex items-center gap-1"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-[#00A699]" /> : <Copy className="w-3 h-3" />}
                    {copiedUpi ? 'Copied' : 'Copy UPI'}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0" />
                  <span>Official NestFinder Merchant QR &bull; Scan via GPay, PhonePe, Paytm, CRED</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Enter 12-Digit Payment UTR / Txn ID *
                  </label>
                  <input
                    required
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 423189098719"
                    maxLength={16}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none font-mono text-[#222222] font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Find the 12-digit UTR in your GPay / PhonePe / Paytm payment receipt.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-2xl font-black text-base bg-[#FF5A5F] hover:bg-[#E0484D] text-white shadow-xl shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying UTR & Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify UTR & Publish Listing (₹99 Fee)</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
