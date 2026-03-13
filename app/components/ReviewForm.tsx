"use client";

import { useState } from "react";
import { createReview } from "../../lib/actions/review.actions";
import { Star, Loader2 } from "lucide-react";

interface ReviewFormProps {
  userId: string;
  productId: string;
}

export default function ReviewForm({ userId, productId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return setError("נא לבחור דירוג.");
    if (!text.trim()) return setError("נא להזין תוכן לביקורת.");

    setLoading(true);
    setError("");

    const response = await createReview({
      userId,
      productId,
      text,
      rating,
      path: "/",
    });

    setLoading(false);

    if (response.success) {
      setText("");
      setRating(0);
    } else {
      setError(response.error || "שגיאה בשליחת הביקורת.");
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-cyan-900/10">
      <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2 text-right">
        כתיבת ביקורת
      </h3>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
            הדירוג שלך
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hovered || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 text-right">
            תוכן הביקורת
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none min-h-[120px] text-right"
            placeholder="מה דעתך על המוצר?"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !rating || !text.trim()}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "שלח ביקורת"
          )}
        </button>
      </form>
    </div>
  );
}
