import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "./ProductDetail";
import { ProductCardData } from "@/components/product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return {
    title: product?.metaTitle || product?.name || "Product",
    description: product?.metaDescription || product?.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      variants: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!product) notFound();

  let userReview = null;
  if (session?.user?.id) {
    userReview = await prisma.review.findUnique({
      where: { productId_userId: { productId: product.id, userId: session.user.id } },
      select: { rating: true, title: true, comment: true },
    });
  }

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 10,
    orderBy: { soldCount: "desc" },
  });

  return (
    <ProductDetail
      product={product}
      related={related as ProductCardData[]}
      userReview={userReview}
    />
  );
}
