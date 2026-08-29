import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Edit Product" description={product.name} />
      <ProductForm
        mode="edit"
        categories={categories}
        brands={brands}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || "",
          price: String(product.price),
          comparePrice: product.comparePrice ? String(product.comparePrice) : "",
          stock: String(product.stock),
          categoryId: product.categoryId,
          brandId: product.brandId || "",
          isFeatured: product.isFeatured,
          isDeal: product.isDeal,
          isNew: product.isNew,
          images: parseImages(product.images),
        }}
      />
    </div>
  );
}
