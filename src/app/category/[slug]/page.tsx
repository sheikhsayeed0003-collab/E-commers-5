import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category ? `${category.name} — Shop Online` : "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { soldCount: "desc" },
  });

  return (
    <div className="container-main py-6">
      <nav className="text-sm text-muted mb-4">
        <a href="/" className="hover:text-primary">Home</a>
        <span className="mx-2">/</span>
        <span className="text-secondary font-medium">{category.name}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
      <p className="text-sm text-muted mb-6">{products.length} products</p>
      <ProductGrid products={products} />
    </div>
  );
}
