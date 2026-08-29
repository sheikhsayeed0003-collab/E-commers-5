import { prisma } from "./prisma";

export async function syncProductRating(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  await prisma.product.update({
    where: { id: productId },
    data: { rating, reviewCount },
  });

  return { rating, reviewCount };
}
