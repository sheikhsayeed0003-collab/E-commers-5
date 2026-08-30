"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ShopSortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set("sort", sort);
    else params.delete("sort");
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
    >
      <option value="">Newest</option>
      <option value="popular">Most Popular</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
      <option value="deals">Best Deals</option>
    </select>
  );
}
