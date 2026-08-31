import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  Images,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  hasPass: boolean;
  onOpenPassModal: () => void;
  onOpenGallery: (property: Property) => void;
  onBookAppointment: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  hasPass,
  onOpenPassModal,
  onOpenGallery,
  onBookAppointment
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Badge styling for property types using Vibrant Palette
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Boys PG':
        return 'bg-[#00A699] text-white';
      case 'Girls PG':
        return 'bg-[#FF5A5F] text-white';
      case 'Co-ed PG':
        return 'bg-purple-600 text-white';
      case 'Private Hostel':
        return 'bg-[#222222] text-white';
      default:
        return 'bg-[#FFB400] text-[#222222] font-black';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#FF5A5F]/40 transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* 4 Photos Visual Preview Area */}
      <div className="relative overflow-hidden bg-slate-100">
        {/* Main Photo */}
        <div
          onClick={() => onOpenGallery(property)}
          className="relative h-52 sm:h-56 cursor-pointer overflow-hidden"
        >
          <img
            src={property.images[activeImageIndex] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className={`px-3 py-1 text-xs font-bold rounded-xl shadow-md ${getTypeBadgeColor(property.propertyType)}`}>
              {property.propertyType}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-black/65 backdrop-blur-md text-white rounded-xl">
              {property.sharingType}
            </span>
            {property.genderRestriction && (
              <span className="px-2 py-0.5 text-[11px] font-medium bg-white/90 backdrop-blur-md text-[#222222] rounded-lg">
                {property.genderRestriction}
              </span>
            )}
          </div>

          {/* 4 Photo Counter Chip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenGallery(property);
            }}
            className="absolute bottom-3 right-3 bg-[#222222]/80 backdrop-blur-md hover:bg-[#222222] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition"
          >
            <Images className="w-3.5 h-3.5 text-[#FFB400]" />
            <span>4 Photos</span>
          </button>
        </div>

        {/* 4 Miniature Thumbnails Bar */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/10 border-t border-slate-200/60">
          {property.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-11 rounded-lg overflow-hidden border-2 transition ${
                activeImageIndex === idx
                  ? 'border-[#FF5A5F] scale-95 shadow-sm'
                  : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Verified Indicator */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onOpenGallery(property)}
              className="font-extrabold text-base sm:text-lg text-[#222222] group-hover:text-[#FF5A5F] transition leading-snug cursor-pointer line-clamp-1"
            >
              {property.title}
            </h3>
          </div>

          {/* Location & Address (Always Visible per requirement) */}
          <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
            <MapPin className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#222222]">{property.city}</span>
              {property.landmark && (
                <span className="text-slate-500"> • {property.landmark}</span>
              )}
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{property.address}</p>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between bg-[#F7F9FB] p-3 rounded-2xl border border-slate-200/80 mb-4">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Monthly Rent</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#222222]">
                  ₹{property.monthlyRent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-medium text-slate-500">/ mo</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Security Deposit</span>
              <span className="text-sm font-bold text-slate-700">
                ₹{property.securityDeposit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Facilities List */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Included Amenities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {property.facilities.slice(0, 5).map((fac, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#00A699]/10 text-[#00847A] border border-[#00A699]/20 rounded-lg"
                >
                  {fac}
                </span>
              ))}
              {property.facilities.length > 5 && (
                <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg">
                  +{property.facilities.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* OWNER CONTACT SECTION: LOCKED vs UNLOCKED */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          {hasPass ? (
            /* UNLOCKED STATE */
            <div className="bg-gradient-to-r from-[#00A699]/10 via-teal-50 to-[#00A699]/10 border border-[#00A699]/40 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#00A699] text-white flex items-center justify-center font-bold text-xs">
                    {property.ownerName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#222222] block leading-tight">
                      {property.ownerName}
                    </span>
                    <span className="text-[10px] text-[#00847A] font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-[#00A699]" /> Direct Owner Verified
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#00A699] text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Unlocked
                </span>
              </div>

              {/* Call & WhatsApp Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="py-2.5 px-3 bg-[#00A699] hover:bg-[#00847A] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Owner</span>
                </a>
                <a
                  href={`https://wa.me/${property.ownerWhatsapp}?text=Hi%20${encodeURIComponent(
                    property.ownerName
                  )},%20I%20saw%20your%20property%20"${encodeURIComponent(
                    property.title
                  )}"%20on%20NestFinder.%20Is%20it%20available%20for%20a%20visit?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Schedule Visit Button */}
              <button
                onClick={() => onBookAppointment(property)}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition hover:text-[#00A699]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#00A699]" />
                <span>Schedule Visit Appointment</span>
              </button>
            </div>
          ) : (
            /* LOCKED STATE (per requirement) */
            <div className="bg-gradient-to-r from-amber-50 via-rose-50/50 to-orange-50/70 border border-amber-200/90 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-950 mb-1">
                <Lock className="w-4 h-4 text-[#FF5A5F]" />
                <span>Owner Phone & WhatsApp Locked</span>
              </div>
              <p className="text-[11px] text-amber-900/80 mb-3">
                Unlock direct owner contact numbers and schedule visits for ₹99 one-time student pass.
              </p>
              <button
                onClick={onOpenPassModal}
                className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-[#FF5A5F] to-[#FF7E82] hover:from-[#E0484D] hover:to-[#FF5A5F] text-white shadow-md shadow-[#FF5A5F]/25 transition flex items-center justify-center gap-2 group"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Students & Tenants Listing (₹99)</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
