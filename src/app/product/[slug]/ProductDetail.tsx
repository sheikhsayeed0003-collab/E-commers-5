"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice, calcDiscount, parseImages, parseSpecs } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/components/ui/Toast";
import { ProductGrid, ProductCardData } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { ReviewForm } from "@/components/product/ReviewForm";
import { WishlistButton } from "@/components/product/WishlistButton";

interface Variant { id: string; name: string; value: string; price?: number | null; stock: number; }
interface Review { id: string; rating: number; title?: string | null; comment: string; user: { name: string }; createdAt: string | Date; }
interface UserReview { rating: number; title?: string | null; comment: string; }

interface Product {
  id: string; name: string; slug: string; description: string;
  price: number; comparePrice?: number | null; images: string;
  stock: number; rating: number; reviewCount: number; soldCount: number;
  specs?: string | null;
  category: { name: string; slug: string };
  brand?: { name: string } | null;
  variants: Variant[];
  reviews: Review[];
}

export function ProductDetail({
  product,
  related,
  userReview,
}: {
  product: Product;
  related: ProductCardData[];
  userReview?: UserReview | null;
}) {
  const images = parseImages(product.images);
  const specs = parseSpecs(product.specs ?? null);
  const discount = calcDiscount(product.price, product.comparePrice);
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );

  const maxStock = selectedVariant?.stock ?? product.stock;

  const addToCart = () => {
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
  };

  const handleAddToCart = () => {
    addToCart();
    showToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart();
    router.push("/checkout");
  };

  return (
    <div className="container-main py-6">
      <nav className="text-sm text-muted mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-secondary line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="relative aspect-square bg-surface rounded-lg overflow-hidden border border-border mb-3">
            <SafeImage src={images[selectedImage] || images[0]} alt={product.name} fill className="object-cover" priority sizes="50vw" />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-2 py-1 rounded">-{discount}%</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-16 h-16 rounded border-2 overflow-hidden ${selectedImage === i ? "border-primary" : "border-border"}`}>
                  <SafeImage src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h1>
          {product.brand && <p className="text-sm text-muted mb-3">Brand: <span className="font-medium text-secondary">{product.brand.name}</span></p>}

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm text-muted">
              {product.reviewCount > 0 ? `${product.rating.toFixed(1)} (${product.reviewCount} reviews)` : "No reviews yet"}
            </span>
            <span className="text-sm text-muted">· {product.soldCount.toLocaleString()}+ sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(selectedVariant?.price ?? product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-muted line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          {product.variants.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 text-sm border rounded-md transition-colors ${selectedVariant?.id === v.id ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary"}`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-surface"><Minus className="h-4 w-4" /></button>
                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))} className="p-2 hover:bg-surface"><Plus className="h-4 w-4" /></button>
              </div>
              <span className="text-sm text-muted">{maxStock} available</span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddToCart} size="lg" className="flex-1 gap-2" disabled={maxStock < 1}>
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={handleBuyNow} disabled={maxStock < 1}>
              Buy Now
            </Button>
            <WishlistButton productId={product.id} />
          </div>

          <div className="space-y-2 text-sm border-t border-border pt-4">
            <p className="flex items-center gap-2 text-muted"><Truck className="h-4 w-4 text-primary" /> Free delivery on orders over ৳1,500</p>
            <p className="flex items-center gap-2 text-muted"><ShieldCheck className="h-4 w-4 text-primary" /> Cash on Delivery available</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-3">Description</h2>
          <p className="text-sm text-muted leading-relaxed">{product.description}</p>
        </div>
        {Object.keys(specs).length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3">Specifications</h2>
            <dl className="space-y-2">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm border-b border-border pb-2">
                  <dt className="text-muted capitalize">{key}</dt>
                  <dd className="font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4">
          Customer Reviews {product.reviewCount > 0 && `(${product.reviewCount})`}
        </h2>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <ReviewForm productId={product.id} productSlug={product.slug} userReview={userReview} />
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.user.name}</span>
                    <span className="text-xs text-muted">
                      {new Date(review.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                  <p className="text-sm text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted text-sm">
              Be the first to review this product!
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
