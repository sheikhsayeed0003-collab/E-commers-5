"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X, Star, Minus, Plus, ShoppingCart, Truck, ShieldCheck, Loader2,
} from "lucide-react";
import { formatPrice, calcDiscount, parseImages } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/components/ui/Toast";
import { SafeImage } from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/product/WishlistButton";

interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock: number;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string;
  stock: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  category?: { name: string; slug: string };
  brand?: { name: string } | null;
  variants: Variant[];
}

export function ProductQuickView({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const { addItem } = useCartStore();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError("");
    setSelectedImage(0);
    setQuantity(1);

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load");
        return data as ProductDetail;
      })
      .then((data) => {
        setProduct(data);
        setSelectedVariant(data.variants?.length ? data.variants[0] : null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [slug]);

  const images = product ? parseImages(product.images) : [];
  const discount = product ? calcDiscount(product.price, product.comparePrice) : 0;
  const maxStock = selectedVariant?.stock ?? product?.stock ?? 0;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: selectedVariant?.price ?? product.price,
      comparePrice: product.comparePrice,
      image: images[0],
      quantity,
      variantName: selectedVariant?.name,
      variantValue: selectedVariant?.value,
      stock: maxStock,
    });
    showToast(`${product.name} added to cart!`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-quickview">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 border border-border hover:bg-surface shadow-sm"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        {loading && (
          <div className="flex items-center justify-center py-24 text-muted gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading product...
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24 text-red-600">
            <p className="mb-4">{error}</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        )}

        {product && !loading && (
          <div className="grid md:grid-cols-2 gap-0">
            {/* Gallery */}
            <div className="bg-surface p-4 md:p-6">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-border mb-3">
                <SafeImage
                  src={images[selectedImage] || images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-2 py-1 rounded">
                    -{discount}%
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-14 h-14 shrink-0 rounded-lg border-2 overflow-hidden ${
                        selectedImage === i ? "border-primary" : "border-border"
                      }`}
                    >
                      <SafeImage src={img} alt="" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 md:p-6 flex flex-col">
              {product.category && (
                <p className="text-xs text-muted mb-1">{product.category.name}</p>
              )}
              <h2 className="text-xl md:text-2xl font-bold mb-2 pr-8">{product.name}</h2>

              {product.brand && (
                <p className="text-sm text-muted mb-3">
                  Brand: <span className="font-medium text-secondary">{product.brand.name}</span>
                </p>
              )}

              <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                <span className="flex items-center gap-0.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {product.rating.toFixed(1)}
                </span>
                <span>({product.reviewCount} reviews)</span>
                <span>· {product.soldCount.toLocaleString()}+ sold</span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(selectedVariant?.price ?? product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-4">
                {product.description}
              </p>

              {product.variants?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">{product.variants[0].name}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                          selectedVariant?.id === v.id
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-surface"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      className="p-2 hover:bg-surface"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted">{maxStock} available</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
                <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2" disabled={maxStock < 1}>
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    handleAddToCart();
                    onClose();
                    window.location.href = "/checkout";
                  }}
                  disabled={maxStock < 1}
                >
                  Buy Now
                </Button>
                {product && <WishlistButton productId={product.id} className="sm:self-stretch" />}
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-muted">
                <p className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-primary" /> Free delivery on orders over ৳1,500
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Cash on Delivery available
                </p>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="mt-4 text-sm text-primary hover:underline text-center"
              >
                View full details →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
