import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      ok: true,
      db: "connected",
      products: productCount,
      categories: categoryCount,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.startsWith("mongodb")),
      hasAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json(
      {
        ok: false,
        db: "error",
        message,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.startsWith("mongodb")),
        hasAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
      },
      { status: 500 }
    );
  }
}
