"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown,
  Truck, Smartphone, Globe,
} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/deals", label: "SuperDeals" },
  { href: "/shop?sort=deals", label: "Today's Deals" },
  { href: "/category/electronics", label: "Electronics" },
  { href: "/category/womens-clothing", label: "Women's Clothing" },
  { href: "/category/mens-clothing", label: "Men's Clothing" },
  { href: "/category/beauty-health", label: "Beauty" },
  { href: "/category/shoes", label: "Shoes" },
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-white text-xs md:text-sm py-1.5 text-center">
        <span className="inline-flex items-center gap-1">
          <Truck className="h-3.5 w-3.5" />
          Free shipping on orders over ৳1,500 · Cash on Delivery available nationwide
        </span>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container-main">
          <div className="flex items-center gap-3 md:gap-6 py-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight">esy</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full rounded-full border-2 border-secondary overflow-hidden">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="bg-secondary text-white px-6 flex items-center gap-1 hover:bg-secondary/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">Search</span>
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <div className="hidden lg:flex items-center gap-1 text-xs text-muted cursor-pointer">
                <Globe className="h-4 w-4" />
                <span>EN / BDT</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex flex-col items-center gap-0.5 text-xs hover:text-primary transition-colors p-1"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">
                    {session ? session.user?.name?.split(" ")[0] : "Account"}
                  </span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
                    {session ? (
                      <>
                        <Link href="/account/profile" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setAccountOpen(false)}>My Profile</Link>
                        <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setAccountOpen(false)}>My Orders</Link>
                        <Link href="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setAccountOpen(false)}>Wishlist</Link>
                        {session.user?.role === "ADMIN" && (
                          <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-surface text-primary font-medium" onClick={() => setAccountOpen(false)}>Admin Panel</Link>
                        )}
                        <button onClick={() => { signOut(); setAccountOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-surface text-red-600">Sign Out</button>
                      </>
                    ) : (
                      <>
                        <Link href="/account/login" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setAccountOpen(false)}>Sign In</Link>
                        <Link href="/account/register" className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setAccountOpen(false)}>Register</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link href="/cart" className="flex flex-col items-center gap-0.5 text-xs hover:text-primary transition-colors p-1 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden md:block">Cart</span>
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex rounded-full border border-border overflow-hidden">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-primary text-white px-4">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Nav bar */}
        <nav className="hidden md:block border-t border-border bg-white">
          <div className="container-main flex items-center gap-1 py-0">
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-secondary text-white hover:bg-secondary/90">
                <Menu className="h-4 w-4" />
                All Categories
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {categoriesOpen && categories.length > 0 && (
                <div className="absolute left-0 top-full w-64 bg-white border border-border shadow-xl rounded-b-lg py-2 z-50 max-h-96 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-surface hover:text-primary transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="text-xl font-bold text-primary">esy</span>
              <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted uppercase">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-2.5 text-sm hover:bg-surface"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm hover:bg-surface"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
