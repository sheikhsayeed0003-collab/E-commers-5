import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const featured = searchParams.get("featured");
  const deals = searchParams.get("deals");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {};

  if (category) where.category = { slug: category };
  if (featured === "true") where.isFeatured = true;
  if (deals === "true") where.isDeal = true;
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
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
      include: { category: { select: { name: true, slug: true } }, brand: { select: { name: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}
