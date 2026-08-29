"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingBag, Store, Menu, X, Bell, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

function SidebarContent({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-5 py-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff4747] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-white font-black text-lg">e</span>
          </div>
          <div>
            <p className="admin-logo text-xl font-black tracking-tight">esy</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">Menu</p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? current === href
            : href !== "/admin" && current.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          onClick={onNavigate}
          className="admin-nav-item text-white/50 hover:text-white"
        >
          <Store className="h-[18px] w-[18px]" />
          View Storefront
        </Link>
      </div>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle =
    NAV.find((n) => (n.exact ? pathname === n.href : n.href !== "/admin" && pathname.startsWith(n.href)))
      ?.label || "Dashboard";

  return (
    <div className="admin-root flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar admin-sidebar-desktop w-64 shrink-0 flex flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent current={pathname} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="admin-sidebar absolute inset-y-0 left-0 w-72 flex flex-col animate-quickview">
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent current={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="admin-topbar sticky top-0 z-30 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="admin-mobile-nav p-2 rounded-xl hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff4747] rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff4747] to-[#ff6b35] flex items-center justify-center text-white font-bold text-sm">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{session?.user?.name || "Admin"}</p>
                <p className="text-[11px] text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
