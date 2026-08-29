"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Loader2, Search, Package } from "lucide-react";
import { formatPrice, calcDiscount, parseImages } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  soldCount: number;
  images: string;
  isFeatured: boolean;
  isDeal: boolean;
  isNew: boolean;
  category: { name: string };
}

export function ProductsTable({ products: initial }: { products: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your catalog`}
        action={
          <Link href="/admin/products/new" className="admin-btn-primary">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        }
      />

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search products, SKU, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-10"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sold</th>
                <th>Tags</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const img = parseImages(p.images)[0];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100">
                          <Image src={img} alt="" fill className="object-cover" sizes="44px" unoptimized={img.startsWith("/uploads")} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600">{p.category.name}</td>
                    <td>
                      <span className="font-semibold text-gray-900">{formatPrice(p.price)}</span>
                      {p.comparePrice && (
                        <span className="text-xs text-gray-400 ml-1">(-{calcDiscount(p.price, p.comparePrice)}%)</span>
                      )}
                    </td>
                    <td>
                      <span className={`font-medium ${p.stock <= 10 ? "text-red-500" : "text-gray-700"}`}>
                        {p.stock}
                      </span>
                      {p.stock <= 10 && <span className="text-[10px] text-red-400 ml-1">Low</span>}
                    </td>
                    <td className="text-gray-600">{p.soldCount.toLocaleString()}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && <span className="admin-badge featured">Featured</span>}
                        {p.isDeal && <span className="admin-badge deal">Deal</span>}
                        {p.isNew && <span className="admin-badge new">New</span>}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/products/${p.id}/edit`} className="admin-action-btn edit" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="admin-action-btn delete"
                          title="Delete"
                        >
                          {deleting === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-500 mb-4">{search ? "No products match your search" : "No products yet"}</p>
            {!search && (
              <Link href="/admin/products/new" className="admin-btn-primary">Add Your First Product</Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
