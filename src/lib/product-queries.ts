import { prisma } from "./prisma";

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  featured?: boolean;
  deals?: boolean;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

export async function listProducts({
  page = 1,
  limit = 20,
  category,
  sort,
  featured,
  deals,
  minPrice,
  maxPrice,
  q,
}: ProductListParams) {
  const where: Record<string, unknown> = {};

  if (category) where.category = { slug: category };
  if (featured) where.isFeatured = true;
  if (deals) where.isDeal = true;
  if (minPrice != null || maxPrice != null) {
    where.price = {
      ...(minPrice != null ? { gte: minPrice } : {}),
      ...(maxPrice != null ? { lte: maxPrice } : {}),
    };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { soldCount: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };
  if (sort === "deals") orderBy = { price: "asc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
