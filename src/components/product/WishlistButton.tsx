"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  className,
  size = "md",
}: {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { productId: string }[]) => {
        setInWishlist(items.some((i) => i.productId === productId));
      })
      .catch(() => {});
  }, [productId, status]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      showToast("Login to save to wishlist");
      window.location.href = `/account/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    try {
      if (inWishlist) {
        const res = await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove");
        setInWishlist(false);
        showToast("Removed from wishlist");
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error("Failed to add");
        setInWishlist(true);
        showToast("Added to wishlist!");
      }
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "p-3 border border-border rounded-md transition-colors disabled:opacity-50",
        inWishlist
          ? "border-primary text-primary bg-primary/5"
          : "hover:border-primary hover:text-primary",
        className
      )}
    >
      <Heart className={cn(iconSize, inWishlist && "fill-primary")} />
    </button>
  );
}
