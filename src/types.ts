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
  passPurchasedAt?: string;
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

export interface PaymentRecord {
  id: string;
  userType: 'tenant' | 'owner';
  name: string;
  phone: string;
  amount: number;
  utr: string;
  referenceId: string;
  propertyId?: string;
  timestamp: string;
  status: 'verified' | 'pending';
}
