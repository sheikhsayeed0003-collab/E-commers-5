"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-main py-8 text-center">Loading cart...</div>;

  const subtotal = getSubtotal();
  const shipping = subtotal >= 1500 ? 0 : 60;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Button href="/shop" size="lg">Explore Products</Button>
      </div>
    );
  }

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({getItemCount()} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantValue}`} className="flex gap-4 border border-border rounded-lg p-4">
              <Link href={`/product/${item.slug}`} className="relative w-24 h-24 shrink-0 rounded overflow-hidden bg-surface">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:text-primary line-clamp-2">{item.name}</Link>
                {item.variantValue && <p className="text-xs text-muted mt-0.5">{item.variantName}: {item.variantValue}</p>}
                <p className="text-base font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantValue)} className="p-1.5 hover:bg-surface"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantValue)} className="p-1.5 hover:bg-surface"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => removeItem(item.productId, item.variantValue)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-5 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              {subtotal < 1500 && <p className="text-xs text-primary">Add {formatPrice(1500 - subtotal)} more for free shipping!</p>}
              <hr className="border-border my-2" />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
            </div>
            <Button href="/checkout" size="lg" className="w-full mt-4">Proceed to Checkout</Button>
            <p className="text-xs text-muted text-center mt-3 flex items-center justify-center gap-1">🔒 Safe & secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
