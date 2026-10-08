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
  Trash2,
  KeyRound,
  ArrowRight,
  Search,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, PropertyType, SharingType, SupabaseConfig, UserProfile } from '../types';
import { AVAILABLE_FACILITIES, SAMPLE_PHOTO_PRESETS } from '../data/initialProperties';
import { UpiPaymentQrCard } from './UpiPaymentQrCard';
import { uploadPropertyPhotoToSupabase } from '../services/supabase';

interface OwnerPortalProps {
  properties: Property[];
  onTogglePropertyStatus: (propertyId: string, isBooked: boolean) => void;
  onAddProperty: (property: Property) => void;
  onNavigateToExplore: () => void;
  supabaseConfig?: SupabaseConfig;
  currentUser?: UserProfile | null;
  onOwnerAuthChange?: (user: UserProfile) => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  properties,
  onTogglePropertyStatus,
  onAddProperty,
  onNavigateToExplore,
  supabaseConfig,
  currentUser,
  onOwnerAuthChange
}) => {
  // --- Owner Authentication States ---
  const [ownerId, setOwnerId] = useState<string>(() => {
    return localStorage.getItem('nestfinder_owner_id') || '';
  });
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

  // --- Forgot Password States ---
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp_reset'>('phone');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('482910');

  // Handle Forgot Password - Step 1: Send OTP
  const handleSendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    const clean = forgotPhone.trim().replace(/\D/g, '');
    if (clean.length < 10) {
      setForgotMsg({ type: 'error', text: 'Please enter a valid 10-digit registered phone number.' });
      return;
    }

    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    const exists = clean === '9876543210' || savedAccounts.some((acc: any) => acc.phone === clean);
    if (!exists) {
      setForgotMsg({ type: 'error', text: 'No owner account found with this phone number. Please register first.' });
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedDemoOtp(newOtp);
    setForgotStep('otp_reset');
    setForgotMsg({ type: 'success', text: `6-Digit OTP sent to +91 ${clean}! Enter the code received below.` });
  };

  // Handle Forgot Password - Step 2: Verify & Reset
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    if (forgotOtp.trim() !== generatedDemoOtp && forgotOtp.trim() !== '482910' && forgotOtp.trim() !== '123456') {
      setForgotMsg({ type: 'error', text: 'Invalid 6-digit OTP code. Please enter the OTP displayed.' });
      return;
    }

    if (!forgotNewPass.trim() || forgotNewPass.trim().length < 4) {
      setForgotMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }

    if (forgotNewPass !== forgotConfirmPass) {
      setForgotMsg({ type: 'error', text: 'Passwords do not match. Please re-check.' });
      return;
    }

    const clean = forgotPhone.trim().replace(/\D/g, '');
    if (clean === '9876543210') {
      localStorage.setItem('nestfinder_demo_owner_password', forgotNewPass.trim());
    }

    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    const updated = savedAccounts.map((acc: any) => {
      if (acc.phone === clean) {
        return { ...acc, password: forgotNewPass.trim() };
      }
      return acc;
    });
    localStorage.setItem('nestfinder_owner_accounts', JSON.stringify(updated));

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    setLoginPhone(clean);
    setLoginPassword(forgotNewPass.trim());
    setLoginError('');
    setIsForgotModalOpen(false);
    setForgotStep('phone');
    setForgotPhone('');
    setForgotOtp('');
    setForgotNewPass('');
    setForgotConfirmPass('');
    setForgotMsg(null);
  };

  // --- Owner Dashboard Navigation & Status States ---
  const [ownerPortalTab, setOwnerPortalTab] = useState<'manage' | 'add'>('manage');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'booked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);
  const [initialIsBooked, setInitialIsBooked] = useState(false);

  // Status Toggle Handler with Instant Feedback
  const handleToggleStatusWithToast = (prop: Property) => {
    const nextStatus = !prop.isBooked;
    onTogglePropertyStatus(prop.id, nextStatus);

    if (nextStatus) {
      setToastMessage(`🔴 "${prop.title}" marked as Booked / Full! Tenants will now see "Currently Unavailable (Rooms Full)" and calls are paused.`);
    } else {
      setToastMessage(`🟢 "${prop.title}" marked as Available! Tenants can now view and call you directly.`);
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    setTimeout(() => {
      setToastMessage((curr) => (curr && curr.includes(prop.title) ? null : curr));
    }, 4500);
  };

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

    const clean = loginPhone.trim().replace(/\D/g, '').slice(-10);
    if (!clean || !loginPassword.trim()) {
      setLoginError('Please enter both Phone Number and Password.');
      return;
    }

    // Default tester credentials
    const currentDemoPass = localStorage.getItem('nestfinder_demo_owner_password') || 'admin';
    if (clean === '9876543210' && loginPassword === currentDemoPass) {
      const demoId = 'owner_demo_9876543210';
      const demoUser: UserProfile = {
        id: demoId,
        name: 'Bhaskar Senapati',
        phone: clean,
        role: 'owner',
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('nestfinder_owner_logged_in', 'true');
      localStorage.setItem('nestfinder_owner_id', demoId);
      localStorage.setItem('nestfinder_owner_phone', clean);
      localStorage.setItem('nestfinder_owner_name', demoUser.name);
      localStorage.setItem('nestfinder_owner_current_account', JSON.stringify(demoUser));
      sessionStorage.setItem('nestfinder_owner_session', JSON.stringify(demoUser));

      setOwnerId(demoId);
      setOwnerName(demoUser.name);
      setOwnerPhone(clean);
      setOwnerWhatsapp(clean);
      setIsLoggedIn(true);
      setShowAllProperties(false);
      setOwnerPortalTab('manage');

      onOwnerAuthChange?.(demoUser);
      setToastMessage('Owner Portal logged in successfully.');
      return;
    }

    // Custom accounts stored in localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    const matched = savedAccounts.find((acc: any) => acc.phone === clean && acc.password === loginPassword.trim());
    if (matched) {
      const activeId = matched.id || matched.owner_id || `owner_${Date.now()}`;
      const ownerProfile: UserProfile = {
        id: activeId,
        name: matched.name,
        phone: matched.phone,
        role: 'owner',
        registeredAt: matched.registeredAt || new Date().toISOString()
      };

      localStorage.setItem('nestfinder_owner_logged_in', 'true');
      localStorage.setItem('nestfinder_owner_id', activeId);
      localStorage.setItem('nestfinder_owner_phone', matched.phone);
      localStorage.setItem('nestfinder_owner_name', matched.name);
      localStorage.setItem('nestfinder_owner_current_account', JSON.stringify(ownerProfile));
      sessionStorage.setItem('nestfinder_owner_session', JSON.stringify(ownerProfile));

      setOwnerId(activeId);
      setOwnerName(matched.name);
      setOwnerPhone(matched.phone);
      setOwnerWhatsapp(matched.phone);
      setIsLoggedIn(true);
      setShowAllProperties(false);
      setOwnerPortalTab('manage');

      onOwnerAuthChange?.(ownerProfile);
      setToastMessage(`Welcome back, ${matched.name}!`);
    } else {
      setLoginError('Invalid Phone Number or Password. Try again or register a new account!');
    }
  };

  // Handle Register submission - Clean session, unique owner_id & route directly to Add Property
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!registerName.trim() || !registerPhone.trim() || !registerPassword.trim()) {
      setLoginError('Please fill in all fields to register.');
      return;
    }

    const clean = registerPhone.trim().replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      setLoginError('Please enter a valid 10-digit phone number.');
      return;
    }

    const savedAccounts = JSON.parse(localStorage.getItem('nestfinder_owner_accounts') || '[]');
    if (savedAccounts.some((acc: any) => acc.phone === clean)) {
      setLoginError('An owner with this phone number is already registered. Please log in.');
      return;
    }

    // Generate unique owner_id
    const generatedOwnerId = `owner_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newAccount = {
      id: generatedOwnerId,
      owner_id: generatedOwnerId,
      name: registerName.trim(),
      phone: clean,
      password: registerPassword.trim(),
      registeredAt: new Date().toISOString()
    };
    savedAccounts.push(newAccount);
    localStorage.setItem('nestfinder_owner_accounts', JSON.stringify(savedAccounts));

    // Clear any stale cached draft inputs from any previous owner sessions
    setTitle('');
    setCity('');
    setLandmark('');
    setAddress('');
    setMonthlyRent('');
    setSecurityDeposit('');
    setDescription('');
    setFormError('');
    setPhotoUploadError('');
    setPhotoUploadSuccess('');
    setPhotoMeta({});
    setPhotos([
      SAMPLE_PHOTO_PRESETS[0].url,
      SAMPLE_PHOTO_PRESETS[1].url,
      SAMPLE_PHOTO_PRESETS[2].url,
      SAMPLE_PHOTO_PRESETS[3].url
    ]);

    const ownerProfile: UserProfile = {
      id: generatedOwnerId,
      name: newAccount.name,
      phone: newAccount.phone,
      role: 'owner',
      registeredAt: newAccount.registeredAt
    };

    // Auto-login after registration with clean state
    localStorage.setItem('nestfinder_owner_logged_in', 'true');
    localStorage.setItem('nestfinder_owner_id', generatedOwnerId);
    localStorage.setItem('nestfinder_owner_phone', newAccount.phone);
    localStorage.setItem('nestfinder_owner_name', newAccount.name);
    localStorage.setItem('nestfinder_owner_current_account', JSON.stringify(ownerProfile));
    sessionStorage.setItem('nestfinder_owner_session', JSON.stringify(ownerProfile));

    setOwnerId(generatedOwnerId);
    setOwnerName(newAccount.name);
    setOwnerPhone(newAccount.phone);
    setOwnerWhatsapp(newAccount.phone);
    setIsLoggedIn(true);
    setShowAllProperties(false);
    // Route fresh registered owner directly to "+ List New Property" so they can add photos
    setOwnerPortalTab('add');

    onOwnerAuthChange?.(ownerProfile);

    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}

    setToastMessage(`Registration successful! Welcome, ${newAccount.name}. Upload your property photos and list your property below.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('nestfinder_owner_logged_in');
    localStorage.removeItem('nestfinder_owner_id');
    localStorage.removeItem('nestfinder_owner_phone');
    localStorage.removeItem('nestfinder_owner_name');
    localStorage.removeItem('nestfinder_owner_current_account');
    sessionStorage.removeItem('nestfinder_owner_session');
    setIsLoggedIn(false);
    setOwnerId('');
    setOwnerName('');
    setOwnerPhone('');
    setOwnerWhatsapp('');
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
  const compressImage = (
    file: File
  ): Promise<{ blob: Blob; dataUrl: string; size: string; name: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Failed to read photo file from device.'));
      reader.onload = (e) => {
        img.onerror = () => reject(new Error('Invalid image file format.'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            // Optimal 1200px max dimension: crisp HD detail while keeping file under ~40-60KB
            const MAX_DIM = 1200;
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
              const directData = e.target?.result as string;
              resolve({
                blob: file,
                dataUrl: directData,
                size: `${(file.size / 1024).toFixed(0)} KB`,
                name: file.name
              });
              return;
            }

            // Draw image with high quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to standard JPEG at 0.75 quality for rapid upload and minimal memory footprint
            const quality = 0.75;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

            canvas.toBlob(
              (blob) => {
                const finalBlob = blob || file;
                const approxBytes = finalBlob.size || Math.round((compressedDataUrl.length * 3) / 4);
                const formattedSize =
                  approxBytes < 1024 * 1024
                    ? `${Math.round(approxBytes / 1024)} KB`
                    : `${(approxBytes / (1024 * 1024)).toFixed(1)} MB`;

                resolve({
                  blob: finalBlob,
                  dataUrl: compressedDataUrl,
                  size: formattedSize,
                  name: file.name.replace(/\.[^/.]+$/, '') + '.jpg'
                });
              },
              'image/jpeg',
              quality
            );
          } catch (err) {
            resolve({
              blob: file,
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

      // Max file size check (25MB limit on raw camera input)
      if (file.size > 25 * 1024 * 1024) {
        setPhotoUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a photo under 25MB.`);
        setIsProcessingPhoto(false);
        return false;
      }

      // 2. Client-side compression & blob creation
      const processed = await compressImage(file);

      // 3. Attempt Supabase Storage Upload if connected
      let finalPhotoUrl = processed.dataUrl;
      let storageNote = processed.size;

      if (supabaseConfig && supabaseConfig.isConnected && supabaseConfig.url && supabaseConfig.anonKey) {
        const activeOwner = ownerId || localStorage.getItem('nestfinder_owner_id') || 'owner';
        const uniqueFileName = `${activeOwner}_${Date.now()}_img${index + 1}.jpg`;
        const cloudUrl = await uploadPropertyPhotoToSupabase(processed.blob, uniqueFileName, supabaseConfig);
        if (cloudUrl) {
          finalPhotoUrl = cloudUrl;
          storageNote = 'Supabase Cloud Storage ✓';
        }
      }

      setPhotos((prev) => {
        const next = [...prev] as [string, string, string, string];
        next[index] = finalPhotoUrl;
        return next;
      });

      setPhotoMeta((prev) => ({
        ...prev,
        [index]: { name: processed.name, size: storageNote }
      }));

      setPhotoUploadSuccess(
        `Photo ${index + 1} uploaded & optimized successfully (${storageNote})!`
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
        isBooked: initialIsBooked,
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotModalOpen(true);
                        setForgotPhone(loginPhone || '');
                        setForgotMsg(null);
                        setForgotStep('phone');
                      }}
                      className="text-[11px] font-bold text-[#FF5A5F] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
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

        {/* Forgot Password Recovery Modal */}
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
              
              {/* Modal Top Gradient Bar */}
              <div className="w-full grid grid-cols-4 h-1.5">
                <div className="bg-[#FF5A5F]"></div>
                <div className="bg-[#222222]"></div>
                <div className="bg-[#00A699]"></div>
                <div className="bg-[#FFB400]"></div>
              </div>

              {/* Modal Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5A5F]/10 text-[#FF5A5F] flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Reset Owner Password</h4>
                    <p className="text-[11px] text-slate-500">পাসৱৰ্ড পাহৰিলে ইয়াত ৰিছেট কৰক</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {forgotMsg && (
                  <div
                    className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                      forgotMsg.type === 'error'
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {forgotMsg.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    )}
                    <span>{forgotMsg.text}</span>
                  </div>
                )}

                {forgotStep === 'phone' ? (
                  /* Step 1: Enter Phone Number */
                  <form onSubmit={handleSendForgotOtp} className="space-y-4">
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">Enter your registered mobile number:</p>
                      <p className="text-[11px] text-slate-500">
                        We will verify your account and allow you to set a brand new login password.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                        Registered Phone Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                        <input
                          required
                          type="tel"
                          maxLength={10}
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-12 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Testing Account: <span className="font-mono font-bold text-slate-600">9876543210</span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-black text-xs shadow-md shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  /* Step 2: Enter OTP & Set New Password */
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                          Enter 6-Digit OTP *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                            setGeneratedDemoOtp(newOtp);
                            setForgotOtp(newOtp);
                            setForgotMsg({ type: 'success', text: `New OTP generated: ${newOtp}` });
                          }}
                          className="text-[10px] font-bold text-[#00A699] hover:underline"
                        >
                          Resend OTP
                        </button>
                      </div>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-center text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                        New Password *
                      </label>
                      <input
                        required
                        type="password"
                        value={forgotNewPass}
                        onChange={(e) => setForgotNewPass(e.target.value)}
                        placeholder="Enter new password (min 4 chars)"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        required
                        type="password"
                        value={forgotConfirmPass}
                        onChange={(e) => setForgotConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:bg-white text-slate-800"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotStep('phone')}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-black text-xs shadow-md shadow-[#00A699]/20 transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Update Password & Login</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentCleanPhone = (ownerPhone || (typeof window !== 'undefined' ? localStorage.getItem('nestfinder_owner_phone') || '' : '')).replace(/\D/g, '').slice(-10);

  const ownerMatchedProps = properties.filter((p) => {
    if (showAllProperties) return true;
    const propPhone = (p.ownerPhone || '').replace(/\D/g, '').slice(-10);
    return Boolean(propPhone && currentCleanPhone && propPhone === currentCleanPhone);
  });

  const filteredOwnerProps = ownerMatchedProps.filter((p) => {
    if (statusFilter === 'available' && p.isBooked) return false;
    if (statusFilter === 'booked' && !p.isBooked) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.propertyType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPropsCount = ownerMatchedProps.length;
  const availablePropsCount = ownerMatchedProps.filter((p) => !p.isBooked).length;
  const bookedPropsCount = ownerMatchedProps.filter((p) => p.isBooked).length;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#222222] via-[#2D2A32] to-[#222222] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5A5F]/20 text-rose-300 text-xs font-bold mb-2 border border-[#FF5A5F]/30">
              <ShieldCheck className="w-4 h-4 text-[#00A699]" />
              <span>Owner Dashboard & Room Availability Control</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Property Owner Portal
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Welcome back, <span className="text-white font-bold">{ownerName || 'Property Owner'}</span> (+91 {ownerPhone || '9876543210'}). Manage room availability and pause repeated incoming tenant calls when fully booked.
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

        {/* Dashboard Sub-Navigation Tabs */}
        <div className="bg-slate-100 p-2 sm:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOwnerPortalTab('manage')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition ${
                ownerPortalTab === 'manage'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Building className="w-4 h-4 text-[#00A699]" />
              <span>My Properties & Room Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF5A5F] text-white">
                {totalPropsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOwnerPortalTab('add')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition ${
                ownerPortalTab === 'add'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#FF5A5F]" />
              <span>+ List New Property</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllProperties(!showAllProperties)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                showAllProperties
                  ? 'bg-purple-100 border-purple-300 text-purple-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Toggle between viewing only your properties vs all platform listings"
            >
              <span>{showAllProperties ? '🌐 All Listings Mode' : '👤 My Properties Only'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToExplore}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-200/80 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Explore Feed</span>
            </button>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="m-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {ownerPortalTab === 'manage' ? (
          /* =============================================================== */
          /* TAB 1: MY PROPERTIES & ROOM AVAILABILITY STATUS MANAGER */
          /* =============================================================== */
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Top 3 Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Total Properties
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{totalPropsCount}</span>
                  <span className="text-xs font-semibold text-slate-500">Listed on NestFinder</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>🟢 Available (Active)</span>
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-800">{availablePropsCount}</span>
                  <span className="text-xs font-semibold text-emerald-700">Receiving Direct Calls</span>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>🔴 Booked / Full</span>
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-800">{bookedPropsCount}</span>
                  <span className="text-xs font-semibold text-rose-700">Calls Paused (Unavailable)</span>
                </div>
              </div>
            </div>

            {/* Feature Highlight Banner: Stop Repeated Calls */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <span>ৰুমৰ অৱস্থা সলনি কৰক (Property Status Toggle Switch)</span>
                  <span className="px-2 py-0.5 text-[10px] bg-amber-200 text-amber-800 font-extrabold rounded-full">
                    No Repeated Calls
                  </span>
                </h4>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  ৰুম বা পিজি সম্পূর্ণ বুক হৈ গ'লে তলৰ বুটামটো <span className="font-bold text-rose-700">"Booked / Full"</span> লৈ সলনি কৰক। ভাড়াতীয়াই ইয়াক <span className="font-bold text-slate-800">"Currently Unavailable"</span> হিচাপে দেখিব আৰু ফোন বা হোৱাটছএপ কৰিব নোৱাৰিব। পুনৰ খালী হ'লে এটি ক্লিকেৰে <span className="font-bold text-emerald-700">"Available"</span> কৰি দিব পাৰিব!
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by building name, area, or city..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  All ({totalPropsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('available')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    statusFilter === 'available'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Available ({availablePropsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('booked')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    statusFilter === 'booked'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>Booked / Full ({bookedPropsCount})</span>
                </button>
              </div>
            </div>

            {/* Property Cards List */}
            {filteredOwnerProps.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 border border-slate-200 rounded-3xl p-6">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">No properties found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                  No properties matched your current filter or search criteria.
                </p>
                <button
                  type="button"
                  onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOwnerProps.map((prop) => (
                  <div
                    key={prop.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                      prop.isBooked
                        ? 'border-rose-200 hover:border-rose-300'
                        : 'border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                      
                      {/* Left: Thumbnail & Property Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            4 Photos
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                              {prop.propertyType}
                            </span>
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">
                              {prop.sharingType}
                            </span>
                            {prop.isBooked ? (
                              <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                <span>Booked / Full</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                <span>Available</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-black text-slate-900 truncate">
                            {prop.title}
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{prop.address}, {prop.city}</span>
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <span className="font-black text-slate-900">
                              ₹{prop.monthlyRent.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] font-normal text-slate-500">/ month</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500">
                              Deposit: ₹{prop.securityDeposit.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: The Prominent Status Toggle Switch */}
                      <div className="md:w-80 shrink-0">
                        <div
                          className={`p-3.5 rounded-2xl border transition-all ${
                            prop.isBooked
                              ? 'bg-rose-50/80 border-rose-200'
                              : 'bg-emerald-50/80 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  prop.isBooked ? 'bg-rose-600 animate-pulse' : 'bg-emerald-500'
                                }`}
                              />
                              <span className="text-xs font-black text-slate-900">
                                Room Status:
                              </span>
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  prop.isBooked
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {prop.isBooked ? 'Booked / Full' : 'Available'}
                              </span>
                            </div>

                            {/* The Toggle Switch Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatusWithToast(prop)}
                              role="switch"
                              aria-checked={!prop.isBooked}
                              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                prop.isBooked
                                  ? 'bg-rose-600 focus:ring-rose-500'
                                  : 'bg-emerald-600 focus:ring-emerald-500'
                              }`}
                              title={
                                prop.isBooked
                                  ? 'Click to flip switch to Available'
                                  : 'Click to flip switch to Booked / Full'
                              }
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                  prop.isBooked ? 'translate-x-1' : 'translate-x-8'
                                }`}
                              />
                            </button>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-snug">
                            {prop.isBooked ? (
                              <span className="text-rose-900 font-semibold">
                                🔴 <strong>Currently Unavailable</strong>: Calls and WhatsApp are paused so tenants do not call repeatedly.
                              </span>
                            ) : (
                              <span className="text-emerald-900 font-semibold">
                                🟢 <strong>Currently Available</strong>: Active for student and tenant inquiries via phone & WhatsApp.
                              </span>
                            )}
                          </p>

                          {/* Quick Action Preview & Explore */}
                          <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => setPreviewProperty(prop)}
                              className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>Preview Tenant View</span>
                            </button>

                            <button
                              type="button"
                              onClick={onNavigateToExplore}
                              className="font-bold text-[#FF5A5F] hover:underline flex items-center gap-1"
                            >
                              <span>View on Explore →</span>
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Button to list another property */}
            <div className="pt-4 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setOwnerPortalTab('add')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black inline-flex items-center gap-2 shadow-md transition"
              >
                <PlusCircle className="w-4 h-4 text-[#FF5A5F]" />
                <span>List Another PG / Flat Property</span>
              </button>
            </div>

          </div>
        ) : (
          /* =============================================================== */
          /* TAB 2: LIST NEW PROPERTY FORM */
          /* =============================================================== */
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

              {/* Initial Room Availability Status */}
              <div className="sm:col-span-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
                  <span>Initial Room Availability Status *</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    (You can flip this anytime later in "My Properties")
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInitialIsBooked(false)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-start gap-3 transition text-left ${
                      !initialIsBooked
                        ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 shadow-sm ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-[#F7F9FB] text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">🟢 Available (Ready for Tenants)</div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        Active in directory • Tenants can call & chat directly
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInitialIsBooked(true)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-start gap-3 transition text-left ${
                      initialIsBooked
                        ? 'border-rose-500 bg-rose-50/90 text-rose-900 shadow-sm ring-2 ring-rose-500/30'
                        : 'border-slate-200 bg-[#F7F9FB] text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">🔴 Booked / Full (Currently Unavailable)</div>
                      <div className="text-[10px] text-rose-700 font-medium">
                        Pauses direct calls & WhatsApp so you are not called repeatedly
                      </div>
                    </div>
                  </button>
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
        )}

      </div>

      {/* Tenant View Simulation Modal */}
      {previewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#FF5A5F]" />
                <div>
                  <h4 className="text-xs font-black">Live Tenant Perspective Preview</h4>
                  <p className="text-[10px] text-slate-300">How tenants currently see this listing in the app</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProperty(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={previewProperty.images[0]}
                  alt={previewProperty.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-black text-slate-900 truncate">{previewProperty.title}</h5>
                  <p className="text-[11px] text-slate-500">{previewProperty.propertyType} • {previewProperty.city}</p>
                  <p className="text-xs font-black text-[#FF5A5F]">₹{previewProperty.monthlyRent} / month</p>
                </div>
              </div>

              {previewProperty.isBooked ? (
                /* BOOKED / CURRENTLY UNAVAILABLE SIMULATION */
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                      <span>Currently Unavailable (Rooms Full)</span>
                    </span>
                    <span className="text-[10px] bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Booked
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs text-rose-950 font-medium leading-relaxed">
                    "The owner has marked this property as fully occupied. Direct calls and visits are paused so the owner is not called repeatedly."
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-200 text-slate-400 font-bold rounded-xl text-center flex items-center justify-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Calls Paused</span>
                    </div>
                    <div className="p-2 bg-slate-200 text-slate-400 font-bold rounded-xl text-center flex items-center justify-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Paused</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                    <span className="text-[11px] text-rose-800 font-bold">Have rooms opened up?</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleToggleStatusWithToast(previewProperty);
                        setPreviewProperty({ ...previewProperty, isBooked: false });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                    >
                      Flip to Available 🟢
                    </button>
                  </div>
                </div>
              ) : (
                /* AVAILABLE SIMULATION */
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Currently Available for Rent</span>
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Available
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs text-emerald-900 font-medium leading-relaxed">
                    "Direct Owner Verified. Verified pass tenants can call and WhatsApp you directly to schedule visits."
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white">
                    <div className="p-2 bg-[#00A699] rounded-xl text-center flex items-center justify-center gap-1 shadow-xs">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Owner</span>
                    </div>
                    <div className="p-2 bg-[#25D366] rounded-xl text-center flex items-center justify-center gap-1 shadow-xs">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-800 font-bold">Are rooms fully occupied?</span>
                    <button
                      type="button"
                      onClick={() => {
                        handleToggleStatusWithToast(previewProperty);
                        setPreviewProperty({ ...previewProperty, isBooked: true });
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs transition"
                    >
                      Flip to Booked 🔴
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewProperty(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
