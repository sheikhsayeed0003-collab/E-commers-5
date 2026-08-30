import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/product-queries";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const result = await listProducts({
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
    category: searchParams.get("category") || undefined,
    sort: searchParams.get("sort") || undefined,
    featured: searchParams.get("featured") === "true",
    deals: searchParams.get("deals") === "true",
    minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
    q: searchParams.get("q") || undefined,
  });

  return NextResponse.json(result);
}
