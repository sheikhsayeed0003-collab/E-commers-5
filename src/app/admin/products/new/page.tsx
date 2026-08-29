import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (categories.length === 0) {
    return (
      <div className="admin-card text-center py-16 text-gray-400">
        No categories found. Please seed the database first.
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Add New Product" description="Create a new product listing for your store" />
      <ProductForm mode="create" categories={categories} brands={brands} />
    </div>
  );
}
