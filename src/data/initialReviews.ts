import { AppReview } from '../types';

export const INITIAL_APP_REVIEWS: AppReview[] = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    userType: 'Student',
    city: 'Bengaluru (Koramangala)',
    rating: 5,
    comment: 'Found a clean Boys PG near college without paying 1 month broker rent. The ₹49 tenant pass saved me ₹8,000 brokerage! Direct owner contact worked instantly.',
    createdAt: '2026-03-02T10:15:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-2',
    name: 'Pranjal Saikia',
    userType: 'Property Owner',
    city: 'Guwahati (Six Mile)',
    rating: 5,
    comment: 'Listed my 2 BHK flat for free. Within 24 hours, genuine working professionals contacted me directly. No broker disturbance, 100% genuine tenants with verified passes.',
    createdAt: '2026-02-28T14:30:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-3',
    name: 'Ananya Verma',
    userType: 'Working Professional',
    city: 'Pune (Hinjawadi)',
    rating: 5,
    comment: 'Super easy to use. The 4-photo preview gave me a clear idea of the room before visiting. Scheduled an in-person visit through the app and shifted the next day!',
    createdAt: '2026-02-24T09:45:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-4',
    name: 'Rohit Kulkarni',
    userType: 'Tenant',
    city: 'Hyderabad (Madhapur)',
    rating: 5,
    comment: 'Best rental and PG platform! Transparent pricing, exact address with landmarks, and direct WhatsApp chat with landlord. Highly recommended to all students and professionals.',
    createdAt: '2026-02-20T16:20:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-5',
    name: 'Minakshi Dutta',
    userType: 'Family',
    city: 'Delhi NCR (Noida)',
    rating: 4,
    comment: 'Found a spacious family apartment without hassle. The verified badge and direct phone calling feature made the entire renting experience smooth and trustworthy.',
    createdAt: '2026-02-15T11:10:00.000Z',
    isVerified: true
  }
];
