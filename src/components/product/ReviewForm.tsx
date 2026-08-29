"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface UserReview {
  rating: number;
  title?: string | null;
  comment: string;
}

export function ReviewForm({
  productId,
  productSlug,
  userReview,
}: {
  productId: string;
  productSlug: string;
  userReview?: UserReview | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [rating, setRating] = useState(userReview?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState(userReview?.title ?? "");
  const [comment, setComment] = useState(userReview?.comment ?? "");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="border border-border rounded-lg p-5 text-center">
        <p className="text-sm text-muted mb-3">Login to rate and review this product</p>
        <Button href={`/account/login?callbackUrl=/product/${productSlug}`} size="sm">
          Login to Review
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      showToast("Please select a star rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title: title || undefined, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(userReview ? "Review updated!" : "Review submitted!");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-5">
      <h3 className="font-bold mb-4">{userReview ? "Update Your Review" : "Write a Review"}</h3>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Your Rating *</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    value <= (hover || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}
          {rating > 0 && <span className="text-sm text-muted ml-2 self-center">{rating}/5</span>}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
          maxLength={100}
        />
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium block mb-1">Your Review *</label>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary resize-none"
          minLength={3}
          maxLength={1000}
        />
      </div>

      <Button type="submit" disabled={loading || rating < 1}>
        {loading ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}
