import React, { useState, useRef } from 'react';
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
  Layers,
  Lock,
  Unlock,
  LogOut,
  Camera,
  Info,
  X,
  Trash2
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
  // --- Owner Authentication States ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nestfinder_owner_logged_in') === 'true';
  });
  const [activePortalTab, setActivePortalTab] = useState<'login' | 'register'>('login');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- Property Registration Form States ---
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Boys PG');
  const [sharingType, setSharingType] = useState<SharingType>('Double');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [ownerName, setOwnerName] = useState(() => {
    return localStorage.getItem('nestfinder_owner_name') || '';
  });
  const [ownerPhone, setOwnerPhone] = useState(() => {
    return localStorage.getItem('nestfinder_owner_phone') || '';
  });
  const [ownerWhatsapp, setOwnerWhatsapp] = useState(() => {
    return localStorage.getItem('nestfinder_owner_phone') || '';
  });

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both Phone Number and Password.');
      return;
    }

    // Default tester credentials
    if (loginPhone === '9876543210' && loginPassword === 'admin') {
      localStorage.setItem('nestfinder_owner_logged_in', 'true');
      localStorage.setItem('nestfinder_owner_phone', loginPhone);
      localStorage.setItem('nestfinder_owner_name', 'Bhaskar Senapati');
      setOwnerName('Bhaskar Senapati');
      setOwnerPhone(loginPhone);
      setOwnerWhatsapp(loginPhone);
      setIsLoggedIn(true);
      return;
    }

    // Custom accounts stored in localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    const matched = savedAccounts.find((acc: any) => acc.phone === loginPhone && acc.password === loginPassword);
    if (matched) {
      localStorage.setItem('nestfinder_owner_logged_in', 'true');
      localStorage.setItem('nestfinder_owner_phone', matched.phone);
      localStorage.setItem('nestfinder_owner_name', matched.name);
      setOwnerName(matched.name);
      setOwnerPhone(matched.phone);
      setOwnerWhatsapp(matched.phone);
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid Phone Number or Password. Try again or register a new account!');
    }
  };

  // Handle Register submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!registerName.trim() || !registerPhone.trim() || !registerPassword.trim()) {
      setLoginError('Please fill in all fields to register.');
      return;
    }

    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    if (savedAccounts.some((acc: any) => acc.phone === registerPhone)) {
      setLoginError('An owner with this phone number is already registered.');
      return;
    }

    const newAccount = {
      name: registerName.trim(),
      phone: registerPhone.trim(),
      password: registerPassword.trim()
    };
    savedAccounts.push(newAccount);
    localStorage.setItem('nestfinder_owner_accounts', JSON.stringify(savedAccounts));

    // Auto-login after registration
    localStorage.setItem('nestfinder_owner_logged_in', 'true');
    localStorage.setItem('nestfinder_owner_phone', newAccount.phone);
    localStorage.setItem('nestfinder_owner_name', newAccount.name);
    setOwnerName(newAccount.name);
    setOwnerPhone(newAccount.phone);
    setOwnerWhatsapp(newAccount.phone);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('nestfinder_owner_logged_in');
    localStorage.removeItem('nestfinder_owner_phone');
    localStorage.removeItem('nestfinder_owner_name');
    setIsLoggedIn(false);
  };
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

  // Listing Fee is now FREE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Photo Upload & Validation States
  const [photoUploadError, setPhotoUploadError] = useState('');
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [photoMeta, setPhotoMeta] = useState<{ [key: number]: { name: string; size: string } }>({});

  // Client-side image resizing and compression for camera photos (often 8MB - 25MB on modern phones)
  const compressImage = (file: File): Promise<{ dataUrl: string; size: string; name: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Failed to read file from camera.'));
      reader.onload = (e) => {
        img.onerror = () => reject(new Error('Invalid image data.'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 1600; // Optimal 1600px dimension preserves full HD detail while keeping file under ~400KB
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              // Fallback to original reader result if canvas not supported
              resolve({
                dataUrl: e.target?.result as string,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                name: file.name
              });
              return;
            }

            // Draw image with smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to standard JPEG at 0.82 quality
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            // Calculate approximate size
            const head = 'data:image/jpeg;base64,';
            const approxBytes = Math.round(((compressedDataUrl.length - head.length) * 3) / 4);
            const formattedSize = approxBytes < 1024 * 1024
              ? `${Math.round(approxBytes / 1024)} KB`
              : `${(approxBytes / (1024 * 1024)).toFixed(1)} MB`;

            resolve({
              dataUrl: compressedDataUrl,
              size: formattedSize,
              name: file.name.replace(/\.[^/.]+$/, "") + '.jpg'
            });
          } catch (err) {
            // If canvas fails, fallback to direct dataUrl
            resolve({
              dataUrl: e.target?.result as string,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              name: file.name
            });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const validateAndProcessFile = async (file: File, index: number) => {
    setPhotoUploadError('');
    setPhotoUploadSuccess('');
    setIsProcessingPhoto(true);

    try {
      // 1. Format validation: allow image/* or check extension
      const isImage = file.type ? file.type.startsWith('image/') : true;
      const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.bmp', '.jfif'];
      const hasValidExt = validExtensions.includes(fileExtension);

      if (!isImage && !hasValidExt) {
        setPhotoUploadError(
          `Invalid file format for "${file.name}". Please upload a photo (JPG, PNG, WEBP).`
        );
        setIsProcessingPhoto(false);
        return false;
      }

      // 2. Compress image automatically so even 15MB-25MB camera shots load instantly
      const processed = await compressImage(file);

      setPhotos((prev) => {
        const next = [...prev] as [string, string, string, string];
        next[index] = processed.dataUrl;
        return next;
      });

      setPhotoMeta((prev) => ({
        ...prev,
        [index]: { name: processed.name, size: processed.size }
      }));

      setPhotoUploadSuccess(
        `Photo ${index + 1} captured & processed successfully (${processed.size})!`
      );
      setActivePickerIndex(null);

      setTimeout(() => {
        setPhotoUploadSuccess('');
      }, 4000);
      return true;
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setPhotoUploadError('Could not process camera photo. Please try choosing from Gallery or take again.');
      return false;
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndProcessFile(file, index);
    // Reset file input target value so selecting the same file triggers onChange
    e.target.value = '';
  };

  const handleApplySamplePresets = () => {
    setPhotos([
      SAMPLE_PHOTO_PRESETS[0].url,
      SAMPLE_PHOTO_PRESETS[1].url,
      SAMPLE_PHOTO_PRESETS[2].url,
      SAMPLE_PHOTO_PRESETS[3].url
    ]);
    setPhotoMeta({});
    setPhotoUploadError('');
    setPhotoUploadSuccess('Default high-resolution samples filled!');
    setTimeout(() => setPhotoUploadSuccess(''), 3000);
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

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const fakeUtr = `FREE-${Date.now().toString().slice(-6)}`;
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
        listingUtr: fakeUtr,
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
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-100/40">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2 border border-emerald-200">
              Free Verified & Published ✓
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#222222]">
              Property Successfully Listed!
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
              Your property <span className="font-bold text-[#222222]">"{title}"</span> is now live in the NestFinder search directory. All interested tenants must pass our <span className="font-bold text-emerald-600">Verified Tenant Security Registration</span> before they can contact you!
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

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Google/Brand Bar */}
          <div className="w-full grid grid-cols-4 h-1.5">
            <div className="bg-[#FF5A5F]"></div>
            <div className="bg-[#222222]"></div>
            <div className="bg-[#00A699]"></div>
            <div className="bg-[#FFB400]"></div>
          </div>

          {/* Secure Portal Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-100 text-center">
            <div className="w-12 h-12 bg-[#FF5A5F]/10 text-[#FF5A5F] rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Owner Secure Access Portal</h3>
            <p className="text-xs text-slate-500 mt-1">Manage, verify and publish your direct rental listings</p>

            {/* Compact Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-xl mt-4">
              <button
                type="button"
                onClick={() => { setActivePortalTab('login'); setLoginError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activePortalTab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Owner Login
              </button>
              <button
                type="button"
                onClick={() => { setActivePortalTab('register'); setLoginError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activePortalTab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                New Registration
              </button>
            </div>
          </div>

          {/* Forms Body */}
          <div className="p-6">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            {activePortalTab === 'login' ? (
              /* Compact Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone"
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    required
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-black text-xs shadow-md shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Secure Owner Login</span>
                </button>

                <div className="pt-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold">
                    Testing? Use Phone <span className="text-slate-600 font-mono font-black">9876543210</span> & Password <span className="text-slate-600 font-mono font-black">admin</span>
                  </span>
                </div>
              </form>
            ) : (
              /* Compact Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Bhaskar Senapati"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone"
                      className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                    Set Portal Password *
                  </label>
                  <input
                    required
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register & Open Dashboard</span>
                </button>
              </form>
            )}
          </div>

          {/* Return Home Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onNavigateToExplore}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              ← Back to Live Listings
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
        <div className="bg-gradient-to-r from-[#222222] via-[#2D2A32] to-[#222222] text-white p-6 sm:p-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
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
          
          <button
            type="button"
            onClick={handleLogout}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
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

            {/* Clear Photo Upload Guidelines Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-slate-800">
                <Info className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                <span>Photo Upload Guidelines & Format Specifications</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pl-6">
                <div>
                  <span className="font-bold text-slate-700">Supported Formats:</span> JPG, JPEG, PNG, WEBP
                </div>
                <div>
                  <span className="font-bold text-slate-700">Maximum File Size:</span> Up to 5 MB per photo
                </div>
                <div className="sm:col-span-2 text-slate-500">
                  ⚡ <strong>Camera & Gallery:</strong> Tap <strong>Camera</strong> to snap a live photo, or <strong>Gallery</strong> to choose existing files from phone storage.
                </div>
              </div>
            </div>

            {/* Error Notification Banner */}
            {photoUploadError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start justify-between gap-2 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{photoUploadError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUploadError('')}
                  className="text-rose-500 hover:text-rose-700 p-0.5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Success Notification Banner */}
            {photoUploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{photoUploadSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUploadSuccess('')}
                  className="text-emerald-600 hover:text-emerald-800 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 4 Photos Grid with Camera & Gallery Dual Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Bedroom & Bed', 'Living / Study Area', 'Washroom / Kitchen', 'Exterior / Balcony'].map(
                (label, index) => {
                  const meta = photoMeta[index];
                  return (
                    <div
                      key={index}
                      className="border-2 border-dashed border-slate-300 hover:border-[#FF5A5F] rounded-2xl p-3 bg-[#F7F9FB] text-center transition flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#222222]">
                          Photo {index + 1}: {label}
                        </span>
                      </div>

                      {/* Photo Preview */}
                      <div
                        onClick={() => setActivePickerIndex(index)}
                        className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-slate-200 cursor-pointer shadow-xs"
                        title="Click to view camera & gallery options"
                      >
                        <img
                          src={photos[index]}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold">
                          Tap to Change
                        </div>
                        {meta && (
                          <div className="absolute bottom-1 right-1 bg-emerald-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            {meta.size} ✓
                          </div>
                        )}
                      </div>

                      {/* Dual Action Buttons: Camera + Gallery */}
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          {/* Option A: Take Photo via Camera */}
                          <label className={`py-2 px-1.5 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-lg border border-slate-200 cursor-pointer flex items-center justify-center gap-1 transition shadow-2xs hover:border-[#FF5A5F] ${isProcessingPhoto ? 'opacity-60 pointer-events-none' : ''}`}>
                            <Camera className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
                            <span>Camera</span>
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(e) => handlePhotoUpload(e, index)}
                              className="hidden"
                            />
                          </label>

                          {/* Option B: Choose from Gallery / Files */}
                          <label className={`py-2 px-1.5 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-lg border border-slate-200 cursor-pointer flex items-center justify-center gap-1 transition shadow-2xs hover:border-[#00A699] ${isProcessingPhoto ? 'opacity-60 pointer-events-none' : ''}`}>
                            <ImageIcon className="w-3.5 h-3.5 text-[#00A699] shrink-0" />
                            <span>Gallery</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, index)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* More Picker Options modal trigger */}
                        <button
                          type="button"
                          onClick={() => setActivePickerIndex(index)}
                          className="w-full text-[10px] text-slate-500 hover:text-slate-800 font-bold py-1 underline transition"
                        >
                          Media Picker Dialog & Specs
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Media Picker Dialog Modal */}
          {activePickerIndex !== null && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Select Photo {activePickerIndex + 1}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {['Bedroom & Bed', 'Living / Study Area', 'Washroom / Kitchen', 'Exterior / Balcony'][activePickerIndex]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePickerIndex(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Specs Box in Modal */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-Optimized Upload:</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    • Direct live Camera snapshot or phone Gallery selection supported.
                    <br />• High-resolution camera photos (up to 25MB) are automatically resized & compressed.
                  </p>
                </div>

                {/* Current Preview */}
                <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={photos[activePickerIndex]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isProcessingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-xs font-bold">Optimizing camera photo...</span>
                    </div>
                  )}
                </div>

                {/* Big Touch-friendly Choices */}
                <div className="space-y-2">
                  {/* Camera Option */}
                  <label className={`w-full py-3.5 px-4 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-2xl font-black text-xs shadow-md shadow-[#FF5A5F]/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 ${isProcessingPhoto ? 'opacity-60 pointer-events-none' : ''}`}>
                    <Camera className="w-4 h-4" />
                    <span>Take Photo with Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handlePhotoUpload(e, activePickerIndex)}
                      className="hidden"
                    />
                  </label>

                  {/* Gallery Option */}
                  <label className={`w-full py-3.5 px-4 bg-[#00A699] hover:bg-[#00847A] text-white rounded-2xl font-black text-xs shadow-md shadow-[#00A699]/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 ${isProcessingPhoto ? 'opacity-60 pointer-events-none' : ''}`}>
                    <ImageIcon className="w-4 h-4" />
                    <span>Choose from Device Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, activePickerIndex)}
                      className="hidden"
                    />
                  </label>

                  {/* Reset to preset sample */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhotos((prev) => {
                        const next = [...prev] as [string, string, string, string];
                        next[activePickerIndex] = SAMPLE_PHOTO_PRESETS[activePickerIndex].url;
                        return next;
                      });
                      setPhotoMeta((prev) => {
                        const next = { ...prev };
                        delete next[activePickerIndex];
                        return next;
                      });
                      setActivePickerIndex(null);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                    <span>Restore Default Preset Photo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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

          {/* Section 6: Free Listing with Aadhaar Verified Tenant Security Pledge */}
          <div className="bg-gradient-to-br from-emerald-50 via-[#F7F9FB] to-[#00A699]/10 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-[#00A699] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                6
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#222222] flex items-center gap-2">
                  <span>100% Free Owner Listing (সম্পূৰ্ণ বিনামূলীয়া পঞ্জীয়ন)</span>
                  <span className="px-2.5 py-0.5 text-[10px] bg-emerald-600 text-white font-extrabold uppercase rounded-full tracking-wider animate-bounce">
                    FREE
                  </span>
                </h3>
                <p className="text-xs text-slate-700 font-semibold mt-1">
                  মালিকসকলৰ সুবিধাৰ বাবে ঘৰৰ বিজ্ঞাপন দিয়াটো সম্পূর্ণ ফ্ৰী ৰখা হৈছে! We charge absolutely ₹0 from Property Owners to list properties.
                </p>
              </div>
            </div>

            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#222222]">
                    মালিকৰ সুৰক্ষা আৰু বিশ্বাসযোগ্যতাৰ গেৰাণ্টি (Owner Safety & Safety Lock)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    আপোনাৰ নিৰাপত্তা সুৰক্ষিত ৰাখিবলৈ আমি সকলো ভাড়াতীয়া বা শিক্ষাৰ্থীৰ বাবে **Verified Tenant Registration** বাধ্যতামূলক কৰিছোঁ। কেৱল পৰিচয় পঞ্জীয়ন কৰা প্ৰকৃত ভাড়াতীয়াইহে আপোনাৰ মোবাইল আৰু হোৱাটছএপ নম্বৰ চাব পাৰিব। ইয়াৰ ফলত কোনো স্পেম, ফ্ৰড বা মধ্যভোগী দালাল আহিব নোৱাৰে!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>No Brokerage, No Fees (₹০ চার্জ)</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>Only Verified Pass Tenants Can Call</span>
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
              className="w-full py-4 px-8 rounded-2xl font-black text-base bg-[#00A699] hover:bg-[#00847A] text-white shadow-xl shadow-[#00A699]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Listing & Securing Your Property...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Publish My Free Property Listing Now ✓</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
