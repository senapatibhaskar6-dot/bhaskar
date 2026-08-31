import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Building, ShieldCheck, IndianRupee } from 'lucide-react';
import { Property } from '../types';

interface GalleryModalProps {
  property: Property | null;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ property, onClose }) => {
  if (!property) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const photoLabels = [
    'Photo 1: Master Bedroom & Beds',
    'Photo 2: Living & Study Area',
    'Photo 3: Washroom & Kitchen',
    'Photo 4: Balcony & Building Exterior'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-5xl w-full flex flex-col h-full max-h-[92vh] justify-between py-2">
        
        {/* Top Information Bar */}
        <div className="flex items-center justify-between text-white px-2 py-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FF5A5F] text-white">
                {property.propertyType}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {property.sharingType}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              {property.title}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF5A5F]" /> {property.city} • {property.address}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Rent</span>
            <span className="text-xl sm:text-2xl font-black text-[#00A699]">
              ₹{property.monthlyRent.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Main Center Stage Image with Navigation */}
        <div className="relative flex-1 flex items-center justify-center min-h-[300px] overflow-hidden my-2 rounded-2xl bg-black">
          
          <img
            src={property.images[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="max-h-[62vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 text-white bg-black/60 hover:bg-[#FF5A5F] p-3 rounded-full transition shadow-lg backdrop-blur-xs"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 text-white bg-black/60 hover:bg-[#FF5A5F] p-3 rounded-full transition shadow-lg backdrop-blur-xs"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Current Photo Label Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
            {photoLabels[currentIndex] || `Photo ${currentIndex + 1} of 4`}
          </div>
        </div>

        {/* Bottom 4-Thumbnail Strip */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto w-full px-2">
          {property.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition ${
                currentIndex === idx
                  ? 'border-[#FF5A5F] scale-100 ring-2 ring-[#FF5A5F]/50'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold bg-black/80 text-white rounded">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
