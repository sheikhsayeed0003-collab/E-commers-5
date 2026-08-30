import Link from "next/link";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Tag } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductCard";
import { CategoryCircle } from "@/components/home/CategoryCircle";
import { HeroProductGrid } from "@/components/home/HeroProductGrid";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  try {
    const [featured, deals, categories, latest] = await Promise.all([
      prisma.product.findMany({ where: { isFeatured: true }, take: 10, orderBy: { soldCount: "desc" } }),
      prisma.product.findMany({ where: { isDeal: true }, take: 10, orderBy: { price: "asc" } }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" }, take: 12 }),
      prisma.product.findMany({ take: 15, orderBy: { createdAt: "desc" } }),
    ]);
    return { featured, deals, categories, latest };
  } catch (error) {
    console.error("Homepage data error:", error);
    return { featured: [], deals: [], categories: [], latest: [] };
  }
}

export async function HomePage() {
  const { featured, deals, categories, latest } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 via-orange-50 to-red-50">
        <div className="container-main py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                Welcome to esy
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-secondary leading-tight mb-4">
                Shop Smart.<br />
                <span className="text-primary">Save More.</span>
              </h1>
              <p className="text-muted text-sm md:text-base mb-6 max-w-md">
                Discover thousands of products at unbeatable prices. Free delivery on orders over ৳1,500. Cash on Delivery available.
              </p>
              <div className="flex gap-3">
                <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/deals" className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary hover:text-white transition-colors">
                  SuperDeals
                </Link>
              </div>
            </div>
            <HeroProductGrid products={featured} />
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border">
        <div className="container-main py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over ৳1,500" },
              { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
              { icon: ShieldCheck, label: "Secure Payment", sub: "COD & online payment" },
              { icon: Tag, label: "Best Prices", sub: "Daily deals & offers" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-main py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold">Shop by Category</h2>
          <Link href="/shop" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <CategoryCircle key={cat.id} slug={cat.slug} name={cat.name} image={cat.image} />
          ))}
        </div>
      </section>

      {/* SuperDeals */}
      <section className="bg-surface py-8">
        <div className="container-main">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">SuperDeals</h2>
              <p className="text-sm text-muted">Limited time offers — grab them fast!</p>
            </div>
            <Link href="/deals" className="text-sm text-primary hover:underline flex items-center gap-1">
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={deals} />
        </div>
      </section>

      {/* Featured */}
      <section className="container-main py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
          <Link href="/shop?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">
            See All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Promo banner */}
      <section className="container-main py-4">
        <div className="bg-secondary rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">New Customer Offer</h3>
            <p className="text-gray-400 text-sm md:text-base">Use code <span className="text-primary font-bold">WELCOME10</span> for 10% off your first order!</p>
          </div>
          <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors whitespace-nowrap">
            Start Shopping
          </Link>
        </div>
      </section>

      {/* More to love */}
      <section className="container-main py-8">
        <h2 className="text-xl md:text-2xl font-bold mb-5">More to Love</h2>
        <ProductGrid products={latest} />
      </section>
    </div>
  );
}
