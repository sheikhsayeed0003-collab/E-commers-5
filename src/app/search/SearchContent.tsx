"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid, ProductCardData } from "@/components/product/ProductCard";

export function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(q)}&limit=40`)
      .then((r) => r.json())
      .then((data) => { setProducts(data.products); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-2">
        {q ? `Results for "${q}"` : "Search Products"}
      </h1>
      {q && <p className="text-sm text-muted mb-6">{total} results found</p>}
      {loading ? (
        <div className="text-center py-16 text-muted">Searching...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
