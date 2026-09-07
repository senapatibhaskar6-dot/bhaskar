import React, { useState } from 'react';
import {
  Star,
  X,
  MessageSquare,
  CheckCircle2,
  Send,
  MapPin,
  Sparkles,
  Award
} from 'lucide-react';
import { AppReview } from '../types';

interface AppReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: AppReview[];
  onAddReview: (review: AppReview) => void;
}

export const AppReviewModal: React.FC<AppReviewModalProps> = ({
  isOpen,
  onClose,
  reviews,
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'read'>('write');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [userType, setUserType] = useState<AppReview['userType']>('Student');
  const [city, setCity] = useState<string>('Guwahati');
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');

  if (!isOpen) return null;

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: AppReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      userType,
      city: city.trim() || 'Assam',
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      isVerified: true
    };

    onAddReview(newReview);
    setIsSubmitted(true);

    // Reset after submission
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setComment('');
      setActiveTab('read');
    }, 1200);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Outstanding & Highly Recommended!';
      case 4:
        return 'Very Good Experience';
      case 3:
        return 'Average / Satisfactory';
      case 2:
        return 'Needs Improvement';
      case 1:
        return 'Poor Experience';
      default:
        return '';
    }
  };

  const filteredReviews =
    filterRating === 'ALL'
      ? reviews
      : reviews.filter((r) => r.rating === filterRating);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#222222] via-[#2D2D2D] to-[#1A1A1A] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-[#FF5A5F] flex items-center justify-center shadow-lg shadow-[#FF5A5F]/20">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  NestFinder Community Reviews
                </h3>
                <span className="bg-[#FF5A5F]/20 text-[#FF5A5F] border border-[#FF5A5F]/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real ratings & feedback from students, tenants, and property owners in Assam
              </p>
            </div>
          </div>

          {/* Quick Rating Summary Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400 font-black text-base">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{avgRating}</span>
              </div>
              <span className="text-slate-300 font-medium">
                out of 5.0 ({totalReviews} Community Reviews)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-700/40">
              <Award className="w-3.5 h-3.5" />
              <span>99% Verified Genuine Users</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('write')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'write'
                ? 'border-[#FF5A5F] text-[#FF5A5F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>

          <button
            onClick={() => setActiveTab('read')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'read'
                ? 'border-[#FF5A5F] text-[#FF5A5F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>All Reviews ({totalReviews})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'write' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">Thank You for Your Review!</h4>
                  <p className="text-xs text-emerald-700">
                    Your review for NestFinder has been published successfully.
                  </p>
                </div>
              ) : (
                <>
                  {/* Star Rating Selection */}
                  <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 text-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                      Your Rating for NestFinder
                    </label>
                    <div className="flex items-center justify-center gap-2 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-hidden"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#FF5A5F] block mt-1">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>

                  {/* Name and Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Bikash Bora"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] outline-hidden transition font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        I am a... *
                      </label>
                      <select
                        value={userType}
                        onChange={(e) =>
                          setUserType(e.target.value as AppReview['userType'])
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] outline-hidden transition font-medium"
                      >
                        <option value="Student">Student (College / University)</option>
                        <option value="Working Professional">Working Professional / Employee</option>
                        <option value="Tenant">Direct Tenant</option>
                        <option value="Family">Family Member</option>
                        <option value="Property Owner">Property Owner / Landlord</option>
                      </select>
                    </div>
                  </div>

                  {/* City or Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Area in Assam *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Guwahati (Beltola), Jorhat, Dibrugarh, etc."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] outline-hidden transition font-medium"
                    />
                  </div>

                  {/* Review / Feedback Comment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Review / Experience with NestFinder *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your honest review. How did NestFinder help you find a PG/Flat or get direct tenants with zero brokerage?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF5A5F]/20 focus:border-[#FF5A5F] outline-hidden transition font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold text-sm rounded-xl shadow-md shadow-[#FF5A5F]/30 transition flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Your Review</span>
                  </button>
                </>
              )}
            </form>
          ) : (
            /* Read Reviews View */
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-700">Filter by Rating:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilterRating('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      filterRating === 'ALL'
                        ? 'bg-[#222222] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({totalReviews})
                  </button>
                  <button
                    onClick={() => setFilterRating(5)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                      filterRating === 5
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>5★ ({fiveStarCount})</span>
                  </button>
                  <button
                    onClick={() => setFilterRating(4)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                      filterRating === 4
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>4★ ({fourStarCount})</span>
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#FF5A5F]/30 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {rev.name}
                          </h4>
                          {rev.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700 bg-slate-200/70 px-1.5 py-0.2 rounded text-[10px]">
                            {rev.userType}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {rev.city}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
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
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assam Verified Community</span>
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100/90 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span>Community reviews are 100% moderated for authenticity.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
