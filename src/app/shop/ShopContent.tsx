"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid, ProductCardData } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

export function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const totalPages = Math.ceil(total / 20);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (sort) params.set("sort", sort);
    if (searchParams.get("featured") === "true") params.set("featured", "true");
    if (searchParams.get("deals") === "true") params.set("deals", "true");

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [page, sort, searchParams]);

  return (
    <div className="container-main py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-muted">{total} products found</p>
        </div>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="deals">Best Deals</option>
        </select>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-surface rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
