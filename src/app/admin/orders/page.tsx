"use client";

import { useEffect, useState } from "react";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ShoppingBag, Phone, CreditCard, Clock } from "lucide-react";

interface Order {
  id: string; orderNumber: string; status: string; total: number;
  shippingName: string; shippingPhone: string; createdAt: string;
  payment?: { method: string };
}

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Orders" description={`${orders.length} total orders`} />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filter === "ALL" ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          statusCounts[s] > 0 && (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filter === s ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {ORDER_STATUS_LABELS[s]} ({statusCounts[s]})
            </button>
          )
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="admin-order-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{order.shippingName}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{order.shippingPhone}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(order.createdAt).toLocaleString("en-BD")}</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {order.payment?.method === "COD" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`admin-badge ${ORDER_STATUS_COLORS[order.status]?.includes("green") ? "new" : ORDER_STATUS_COLORS[order.status]?.includes("red") ? "deal" : "featured"}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="text-xl font-bold text-[#ff4747]">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <label className="text-xs font-medium text-gray-400">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="admin-input !py-2 !px-3 !w-auto text-sm"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="admin-card text-center py-16">
            <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
