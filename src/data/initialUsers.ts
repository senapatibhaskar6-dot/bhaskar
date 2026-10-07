import { UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_admin_1',
    name: 'Bhaskar Senapati (Admin)',
    email: 'admin@nestfinder.in',
    phone: '9876543210',
    role: 'admin',
    hasPaidPass: true,
    registeredAt: '2026-01-15T08:30:00.000Z'
  },
  {
    id: 'usr_owner_1',
    name: 'Ramesh Reddy (Royal Living PG)',
    email: 'ramesh.reddy@gmail.com',
    phone: '9845012345',
    role: 'owner',
    hasPaidPass: true,
    registeredAt: '2026-02-10T10:15:00.000Z'
  },
  {
    id: 'usr_owner_2',
    name: 'Sunita Sarma (Greenview Stays)',
    email: 'sunita.sarma@yahoo.com',
    phone: '9864019283',
    role: 'owner',
    hasPaidPass: true,
    registeredAt: '2026-02-18T14:20:00.000Z'
  },
  {
    id: 'usr_owner_3',
    name: 'Anup Kalita (Scholars Hub)',
    email: 'anup.kalita@gmail.com',
    phone: '9435012984',
    role: 'owner',
    hasPaidPass: true,
    registeredAt: '2026-03-01T09:45:00.000Z'
  },
  {
    id: 'usr_job_seeker_1',
    name: 'Rahul Bora (B.Tech Graduate)',
    email: 'rahul.bora@outlook.com',
    phone: '9706012345',
    role: 'job_seeker',
    hasPaidPass: false,
    registeredAt: '2026-03-12T11:00:00.000Z'
  },
  {
    id: 'usr_job_seeker_2',
    name: 'Priyanka Das (Accounts Clerk)',
    email: 'priyanka.das@gmail.com',
    phone: '9854098712',
    role: 'job_seeker',
    hasPaidPass: false,
    registeredAt: '2026-03-15T15:30:00.000Z'
  },
  {
    id: 'usr_customer_1',
    name: 'Devraj Goswami (Student)',
    email: 'devraj.g@gmail.com',
    phone: '9864123456',
    role: 'customer',
    hasPaidPass: true,
    passPurchasedAt: '2026-03-20T12:00:00.000Z',
    registeredAt: '2026-03-20T11:45:00.000Z'
  },
  {
    id: 'usr_customer_2',
    name: 'Manish Kumar (Working IT)',
    email: 'manish.k@tcs.com',
    phone: '9123456780',
    role: 'customer',
    hasPaidPass: true,
    passPurchasedAt: '2026-03-25T16:10:00.000Z',
    registeredAt: '2026-03-25T15:50:00.000Z'
  },
  {
    id: 'usr_customer_3',
    name: 'Ankita Phukan (Medical Intern)',
    email: 'ankita.p@gmail.com',
    phone: '9435112233',
    role: 'customer',
    hasPaidPass: false,
    registeredAt: '2026-04-01T09:20:00.000Z'
  }
];
