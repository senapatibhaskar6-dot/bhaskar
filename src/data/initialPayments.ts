import { PaymentRecord } from '../types';

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_101',
    userType: 'tenant',
    name: 'Devraj Goswami',
    phone: '9864123456',
    amount: 49,
    utr: '423189098712',
    paymentMethod: 'UPI_QR',
    referenceId: 'UPI-423189098712',
    timestamp: '2026-03-20T12:00:00.000Z',
    status: 'verified'
  },
  {
    id: 'pay_102',
    userType: 'tenant',
    name: 'Manish Kumar',
    phone: '9123456780',
    amount: 49,
    utr: '423189098713',
    paymentMethod: 'UPI_QR',
    referenceId: 'UPI-423189098713',
    timestamp: '2026-03-25T16:10:00.000Z',
    status: 'verified'
  },
  {
    id: 'pay_103',
    userType: 'tenant',
    name: 'Ankita Phukan',
    phone: '9435112233',
    amount: 49,
    utr: '423189098714',
    paymentMethod: 'UPI_QR',
    referenceId: 'UPI-423189098714',
    timestamp: '2026-04-02T10:15:00.000Z',
    status: 'verified'
  }
];
