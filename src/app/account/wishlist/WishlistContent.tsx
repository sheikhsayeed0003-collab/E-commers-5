"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { formatPrice, parseImages } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { useToast } from "@/components/ui/Toast";
import { useQuickView } from "@/components/product/ProductQuickViewContext";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string;
    stock: number;
  };
}

export function WishlistContent() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { openQuickView } = useQuickView();

  const load = () => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => showToast("Failed to load wishlist"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (productId: string) => {
    const res = await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast("Removed from wishlist");
    }
  };

  if (loading) {
    return <div className="container-main py-16 text-center text-muted">Loading wishlist...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <Heart className="h-16 w-16 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Wishlist</h1>
        <p className="text-muted mb-6">Save items you love and shop them later.</p>
        <Button href="/shop">Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist ({items.length})</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(({ id, productId, product }) => {
          const images = parseImages(product.images);
          return (
            <div key={id} className="border border-border rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => openQuickView(product.slug)}
                className="relative aspect-square w-full block"
              >
                <SafeImage src={images[0]} alt={product.name} fill className="object-cover" sizes="25vw" />
              </button>
              <div className="p-3">
                <Link href={`/product/${product.slug}`} className="text-sm font-medium line-clamp-2 hover:text-primary">
                  {product.name}
                </Link>
                <p className="text-base font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => openQuickView(product.slug)}
                    disabled={product.stock < 1}
                  >
                    {product.stock < 1 ? "Out of Stock" : "View Product"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => remove(productId)}
                    className="p-2 border border-border rounded-md hover:border-red-400 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
