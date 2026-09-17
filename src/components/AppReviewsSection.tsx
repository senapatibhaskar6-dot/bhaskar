import React from 'react';
import { Star, MessageSquarePlus, CheckCircle2, MapPin, Sparkles, Heart } from 'lucide-react';
import { AppReview } from '../types';

interface AppReviewsSectionProps {
  reviews: AppReview[];
  onOpenReviewModal: () => void;
}

export const AppReviewsSection: React.FC<AppReviewsSectionProps> = ({
  reviews,
  onOpenReviewModal
}) => {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  // Take the most recent 3-4 reviews for the showcase grid
  const recentReviews = reviews.slice(0, 4);

  return (
    <section className="mt-14 mb-8 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Verified Community Ratings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              What Tenants & Owners Say About NestFinder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Zero brokers, direct phone contacts, and 100% free owner registrations across India.
            </p>
          </div>

          {/* Quick Stats & Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-xs">
              <div className="flex items-center text-amber-500 font-black text-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-1" />
                <span>{avgRating}</span>
              </div>
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-extrabold text-slate-900 block">Overall Score</span>
                <span>{totalReviews} Community Reviews</span>
              </div>
            </div>

            <button
              onClick={onOpenReviewModal}
              className="px-4 py-2.5 bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm shadow-[#FF5A5F]/30 transition flex items-center gap-2 hover:scale-[1.02]"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {recentReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#FF5A5F]/40 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Stars & Verified Badge */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author details at bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                  {rev.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span className="font-semibold text-[#FF5A5F]">{rev.userType}</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                    {rev.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with link to view all */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Heart className="w-3.5 h-3.5 text-[#FF5A5F] fill-[#FF5A5F]" />
            <span>Over 2,500+ students & working professionals across India found homes through NestFinder.</span>
          </div>
          <button
            onClick={onOpenReviewModal}
            className="text-[#FF5A5F] font-bold hover:underline flex items-center gap-1"
          >
            <span>View All {totalReviews} Community Reviews & Ratings →</span>
          </button>
        </div>
      </div>
    </section>
  );
};
