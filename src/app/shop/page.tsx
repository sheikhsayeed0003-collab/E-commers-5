import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/product-queries";
import { ShopSortSelect } from "./ShopSortSelect";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop All Products" };

type ShopSearchParams = {
  page?: string;
  sort?: string;
  featured?: string;
  deals?: string;
};

function shopQuery(params: ShopSearchParams) {
  const query = new URLSearchParams();
  if (params.sort) query.set("sort", params.sort);
  if (params.featured === "true") query.set("featured", "true");
  if (params.deals === "true") query.set("deals", "true");
  if (params.page) query.set("page", params.page);
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const sort = params.sort || "";

  const { products, total, totalPages } = await listProducts({
    page,
    limit: 20,
    sort: sort || undefined,
    featured: params.featured === "true",
    deals: params.deals === "true",
  });

  return (
    <div className="container-main py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-muted">{total} products found</p>
        </div>
        <Suspense fallback={null}>
          <ShopSortSelect value={sort} />
        </Suspense>
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 ? (
            <Link
              href={`/shop${shopQuery({ ...params, page: String(page - 1) })}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-surface"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm border border-border rounded-md text-muted opacity-50">
              Previous
            </span>
          )}
          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/shop${shopQuery({ ...params, page: String(page + 1) })}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-surface"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 text-sm border border-border rounded-md text-muted opacity-50">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}
