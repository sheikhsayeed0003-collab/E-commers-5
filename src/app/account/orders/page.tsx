"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, parseImages } from "@/lib/utils";

interface OrderItem {
  id: string; quantity: number; price: number; total: number;
  product: { name: string; slug: string; images: string };
}
interface Order {
  id: string; orderNumber: string; status: string; total: number;
  createdAt: string; items: OrderItem[];
  payment?: { method: string; status: string };
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/account/login"); return; }
    if (status === "authenticated") {
      fetch("/api/orders").then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
    }
  }, [status, router]);

  if (loading) return <div className="container-main py-8 text-center">Loading orders...</div>;

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="mb-4">No orders yet</p>
          <Link href="/shop" className="text-primary hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-bold text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-surface shrink-0">
                      <Image src={parseImages(item.product.images)[0]} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.slug}`} className="text-sm hover:text-primary truncate block">{item.product.name}</Link>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                <span className="text-sm text-muted">{order.payment?.method === "COD" ? "Cash on Delivery" : "Online"}</span>
                <span className="font-bold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
