"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, BD_DIVISIONS } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ discount: number; shippingCost: number; total: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingDivision: "Dhaka",
    shippingDistrict: "",
    shippingArea: "",
    shippingAddress: "",
    paymentMethod: "COD" as "COD" | "ONLINE",
    notes: "",
    guestEmail: "",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        shippingName: f.shippingName || session.user?.name || "",
        guestEmail: f.guestEmail || session.user?.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    setCouponApplied(null);
    setCouponError("");
  }, [form.shippingDivision, items]);

  if (!mounted) return <div className="container-main py-8 text-center">Loading...</div>;

  const subtotal = getSubtotal();
  const baseShipping = subtotal >= 1500 ? 0 : (form.shippingDivision === "Dhaka" ? 60 : 120);
  const shipping = couponApplied?.shippingCost ?? baseShipping;
  const discount = couponApplied?.discount ?? 0;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Nothing to checkout</h1>
        <Button href="/shop">Continue Shopping</Button>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
          shippingDivision: form.shippingDivision,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponApplied(null);
        setCouponError(data.error || "Invalid coupon");
        return;
      }
      setCouponApplied({ discount: data.discount, shippingCost: data.shippingCost, total: data.total });
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            variantName: i.variantName,
            variantValue: i.variantValue,
          })),
          ...form,
          couponCode: couponApplied ? couponCode : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(`/order/confirmation/${data.order.orderNumber}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-5">
            <h2 className="font-bold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">Full Name *</label>
                <input required value={form.shippingName} onChange={(e) => setForm({ ...form, shippingName: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Phone *</label>
                <input required type="tel" placeholder="+880 1XXX-XXXXXX" value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              {!session && (
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium block mb-1">Division *</label>
                <select required value={form.shippingDivision} onChange={(e) => setForm({ ...form, shippingDivision: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary">
                  {BD_DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">District *</label>
                <input required value={form.shippingDistrict} onChange={(e) => setForm({ ...form, shippingDistrict: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Area *</label>
                <input required value={form.shippingArea} onChange={(e) => setForm({ ...form, shippingArea: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">Full Address *</label>
                <textarea required rows={2} value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">Order Notes (optional)</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions..." className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-5">
            <h2 className="font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: "COD", label: "Cash on Delivery (COD)", desc: "Pay when you receive your order" },
                { value: "ONLINE", label: "Online Payment", desc: "bKash / Nagad / Card (mock gateway)" },
              ].map((method) => (
                <label key={method.value} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${form.paymentMethod === method.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="payment" value={method.value} checked={form.paymentMethod === method.value} onChange={() => setForm({ ...form, paymentMethod: method.value as "COD" | "ONLINE" })} className="mt-1" />
                  <div>
                    <p className="font-medium text-sm">{method.label}</p>
                    <p className="text-xs text-muted">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border border-border rounded-lg p-5 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantValue}`} className="flex justify-between">
                  <span className="text-muted truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-3">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>
              )}
              <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(null); setCouponError(""); }}
                placeholder="Coupon code (e.g. WELCOME10)"
                className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <Button type="button" variant="outline" onClick={applyCoupon} disabled={applyingCoupon || !couponCode.trim()}>
                {applyingCoupon ? "..." : "Apply"}
              </Button>
            </div>
            {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
            {couponApplied && <p className="text-xs text-green-600 mt-1">Coupon applied!</p>}
            <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
              {loading ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
