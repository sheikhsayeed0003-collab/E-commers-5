import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";
import { Package, ShoppingBag, Users, DollarSign, Plus, TrendingUp, ArrowUpRight } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [productCount, orderCount, customerCount, recentOrders, totalRevenue, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { items: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue._sum.total || 0), icon: DollarSign, type: "revenue", sub: "All time sales" },
    { label: "Total Orders", value: orderCount, icon: ShoppingBag, type: "orders", sub: `${pendingOrders} pending` },
    { label: "Products", value: productCount, icon: Package, type: "products", sub: "Active listings" },
    { label: "Customers", value: customerCount, icon: Users, type: "customers", sub: "Registered users" },
  ];

  return (
    <div>
      <div className="admin-welcome-banner mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-white/50 text-sm mb-1">Welcome back 👋</p>
            <h2 className="text-2xl md:text-3xl font-bold">{session?.user?.name || "Admin"}</h2>
            <p className="text-white/60 text-sm mt-2 max-w-md">
              Here&apos;s what&apos;s happening with your store today. Manage products, track orders, and grow your business.
            </p>
          </div>
          <Link href="/admin/products/new" className="admin-btn-primary self-start">
            <Plus className="h-4 w-4" /> Add New Product
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, type, sub }) => (
          <div key={label} className={`admin-stat-card ${type}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {sub}
                </p>
              </div>
              <div className={`admin-stat-icon ${type}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest customer purchases</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-medium text-[#ff4747] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-semibold text-gray-900">{order.orderNumber}</td>
                  <td>{order.shippingName}</td>
                  <td className="text-gray-500">{order.items.length} item(s)</td>
                  <td className="font-semibold text-[#ff4747]">{formatPrice(order.total)}</td>
                  <td>
                    <span className="admin-badge featured">{ORDER_STATUS_LABELS[order.status]}</span>
                  </td>
                  <td className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
