import { ProductGrid } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/product-queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search Results" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const { products, total } = query
    ? await listProducts({ q: query, limit: 40 })
    : { products: [], total: 0 };

  return (
    <div className="container-main py-6">
      <h1 className="text-2xl font-bold mb-2">
        {query ? `Results for "${query}"` : "Search Products"}
      </h1>
      {query && <p className="text-sm text-muted mb-6">{total} results found</p>}
      <ProductGrid products={products} />
    </div>
  );
}
