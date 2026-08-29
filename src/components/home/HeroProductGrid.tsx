"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { parseImages } from "@/lib/utils";
import { useQuickView } from "@/components/product/ProductQuickViewContext";

export function HeroProductGrid({ products }: { products: { id: string; slug: string; name: string; images: string }[] }) {
  const { openQuickView } = useQuickView();

  return (
    <div className="hidden md:grid grid-cols-2 gap-3">
      {products.slice(0, 4).map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => openQuickView(p.slug)}
          className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <SafeImage src={parseImages(p.images)[0]} alt={p.name} fill className="object-cover" sizes="25vw" />
        </button>
      ))}
    </div>
  );
}
