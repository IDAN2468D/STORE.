"use client";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { IReview, IUser } from "@/types";

interface ReviewSectionProps {
  productId: string;
  user: IUser | null;
  initialReviews: any[]; // Using any because ReviewList expects a specific sub-structure that IReview doesn't fully capture without casting
}

export default function ReviewSection({ productId, user, initialReviews }: ReviewSectionProps) {
  return (
    <div className="space-y-12">
      <ReviewForm userId={user?._id || ""} productId={productId} />
      <div className="border-t border-white/5 pt-10">
        <h3 className="text-xl font-bold mb-6 text-right italic">ביקורות לקוחות ({initialReviews.length})</h3>
        <ReviewList currentUserId={user?._id || ""} reviews={initialReviews as any} />
      </div>
    </div>
  );
}
