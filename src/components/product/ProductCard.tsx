"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { formatPrice, calcDiscount, parseImages } from "@/lib/utils";
import { useQuickView } from "./ProductQuickViewContext";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  isDeal?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const images = parseImages(product.images);
  const discount = calcDiscount(product.price, product.comparePrice);
  const [imgSrc, setImgSrc] = useState(images[0] || "/placeholder.svg");
  const { openQuickView } = useQuickView();

  return (
    <button
      type="button"
      onClick={() => openQuickView(product.slug)}
      className="group block w-full text-left bg-white rounded-lg border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-square bg-surface overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          unoptimized={imgSrc.startsWith("/uploads")}
          onError={() => setImgSrc("/placeholder.svg")}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {product.isDeal && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            DEAL
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-sm line-clamp-2 text-secondary leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        {(product.rating || product.soldCount) && (
          <div className="flex items-center gap-2 text-xs text-muted">
            {product.rating && product.rating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.soldCount && product.soldCount > 0 && (
              <span>{product.soldCount.toLocaleString()}+ sold</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg">No products found</p>
        <Link href="/shop" className="text-primary hover:underline mt-2 inline-block">Browse all products</Link>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
