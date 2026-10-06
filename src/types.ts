export type PropertyType =
  | 'Boys PG'
  | 'Girls PG'
  | 'Co-ed PG'
  | 'Private Hostel'
  | '1 BHK Flat'
  | '2 BHK Flat'
  | '3 BHK Flat'
  | 'Independent House';

export type SharingType = 'Single' | 'Double' | 'Triple' | 'Entire Flat / House';

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  sharingType: SharingType;
  address: string;
  city: string;
  landmark?: string;
  monthlyRent: number;
  securityDeposit: number;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  images: [string, string, string, string]; // exactly 4 photos
  facilities: string[];
  description: string;
  isVerified: boolean;
  isBooked?: boolean; // When true, shown as "Currently Booked / Unavailable"
  listingUtr?: string;
  createdAt: string;
  genderRestriction?: 'Male only' | 'Female only' | 'Any / Family';
  ratingValue?: number;
  ratingCount?: number;
  userRating?: number;
}

export interface TenantUser {
  id: string;
  name: string;
  whatsapp: string;
  preferredCity?: string;
  tenantType?: 'Student' | 'Working Professional' | 'Family';
  hasPaidPass: boolean;
  passUtr?: string;
  razorpayPaymentId?: string;
  paymentMethod?: 'Razorpay' | 'UPI_QR';
  passPurchasedAt?: string;
  password?: string;
}

export interface Appointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantWhatsapp: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSynced?: string;
}

export interface RazorpayConfig {
  keyId: string;
  isTestMode: boolean;
  businessName: string;
}

export interface PaymentRecord {
  id: string;
  userType: 'tenant' | 'owner';
  name: string;
  phone: string;
  amount: number;
  utr: string;
  razorpayPaymentId?: string;
  paymentMethod?: 'Razorpay' | 'UPI_QR';
  referenceId: string;
  propertyId?: string;
  timestamp: string;
  status: 'verified' | 'pending';
}

export interface AppReview {
  id: string;
  name: string;
  userType: 'Student' | 'Working Professional' | 'Property Owner' | 'Family' | 'Tenant';
  city: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  education: string;
  experience: string;
  phone: string;
  description: string;
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  employerName?: string;
  postedAt: string;
  isBooked?: boolean; // When true, shown as "Booked / Filled (পদ পূৰ্ণ হ'ল)", calls paused!
}

export interface PoliceVerification {
  id: string;
  referenceNumber: string;
  tenantName: string;
  guardianName?: string;
  dob: string;
  phone: string;
  whatsapp?: string;
  permanentAddress: string;
  idProofType: 'Aadhaar Card' | 'Voter ID' | 'Passport' | 'Driving License';
  idProofNumber: string;
  arrivalDate: string;
  propertyName: string;
  roomNumber: string;
  propertyAddress: string;
  ownerName: string;
  ownerPhone: string;
  policeStationName: string;
  policeStationPhone?: string;
  policeStationEmail?: string;
  purposeOfStay: string;
  workOrCollegeName?: string;
  status: 'Submitted' | 'Shared with Police' | 'Verified';
  createdAt: string;
}
