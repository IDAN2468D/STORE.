"use client";

import { useState } from "react";
import { Star, Trash2, UserCircle2, Loader2, Calendar } from "lucide-react";
import { deleteReview } from "../../lib/actions/review.actions";

interface UserInfo {
  _id: string;
  name: string;
}

interface ReviewItem {
  _id: string;
  text: string;
  rating: number;
  user: UserInfo;
  createdAt: string;
}

interface ReviewListProps {
  currentUserId: string;
  reviews: ReviewItem[];
}

export default function ReviewList({ currentUserId, reviews }: ReviewListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId);
    await deleteReview(reviewId, "/");
    setDeletingId(null);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-slate-800/20 border border-slate-700/50 p-10 rounded-2xl text-center shadow-lg">
        <h3 className="text-xl font-medium text-slate-300">אין עדיין ביקורות</h3>
        <p className="text-slate-500 mt-2">
          היו הראשונים לשתף את דעתכם על המוצר!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 flex flex-col sm:flex-row shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 gap-4 sm:gap-6 relative group overflow-hidden"
        >
          {/* Subtle Accent Line */}
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex-shrink-0 flex items-center justify-center sm:block">
            <UserCircle2 className="w-16 h-16 text-slate-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex sm:items-center justify-between flex-col sm:flex-row mb-2 gap-2">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight truncate text-right">
                  {review.user?.name || "משתמש אנונימי"}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(review.createdAt).toLocaleDateString("he-IL", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              
              {/* Star Rating Layout */}
              <div className="flex bg-slate-900/50 rounded-full px-3 py-1.5 self-start sm:self-center border border-slate-700">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                        : "text-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mt-4 break-words font-light text-right">
              &quot;{review.text}&quot;
            </p>

            {currentUserId === review.user?._id && (
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {deletingId === review._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deletingId === review._id ? "מוחק..." : "מחק ביקורת"}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
