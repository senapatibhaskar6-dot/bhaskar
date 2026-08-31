import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, TenantUser, Appointment } from '../types';

interface AppointmentModalProps {
  property: Property | null;
  tenantPass: TenantUser | null;
  onClose: () => void;
  onConfirmAppointment: (appointment: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  property,
  tenantPass,
  onClose,
  onConfirmAppointment
}) => {
  if (!property) return null;

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [visitorName, setVisitorName] = useState(tenantPass?.name || '');
  const [visitorPhone, setVisitorPhone] = useState(tenantPass?.whatsapp || '');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      id: `appt_${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      tenantName: visitorName.trim(),
      tenantWhatsapp: visitorPhone.trim(),
      date,
      timeSlot,
      notes: notes.trim() || undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    onConfirmAppointment(newAppointment);
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Vibrant Coral */}
        <div className="bg-gradient-to-r from-[#FF5A5F] to-[#FF7E82] p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/15 hover:bg-black/25 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Direct Visit Booking</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Schedule Property Visit
          </h3>
          <p className="text-white/90 text-xs mt-1 truncate">
            {property.title} • {property.city}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00A699]/15 text-[#00A699] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#222222]">
                Visit Appointment Confirmed!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your visit for <span className="font-bold text-[#222222]">{date} ({timeSlot})</span> is scheduled with owner <span className="font-bold text-[#222222]">{property.ownerName}</span> ({property.ownerPhone}).
              </p>

              <div className="pt-3 flex gap-2">
                <a
                  href={`https://wa.me/${property.ownerWhatsapp}?text=Hi%20${encodeURIComponent(
                    property.ownerName
                  )},%20I%20have%20scheduled%20a%20visit%20for%20"${encodeURIComponent(
                    property.title
                  )}"%20on%20${date}%20at%20${timeSlot}.%20My%20name%20is%20${encodeURIComponent(
                    visitorName
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Owner on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-[#F7F9FB] p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-[#222222] block">{property.title}</span>
                  <span className="text-slate-500">{property.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Visit Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Ananya Patel"
                    className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Special Notes for Owner (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. I am looking to move in next Monday. Please confirm if food service is available."
                  className="w-full px-3 py-2 text-sm bg-[#F7F9FB] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#FF5A5F] focus:outline-none text-[#222222]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white rounded-xl font-bold text-sm shadow-md shadow-[#FF5A5F]/20 transition flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm Visit Appointment</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
