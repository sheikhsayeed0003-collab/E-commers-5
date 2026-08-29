import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncProductRating } from "@/lib/reviews";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(3).max(1000),
});

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Login required to leave a review" }, { status: 401 });
  }

  try {
    const body = reviewSchema.parse(await req.json());

    const product = await prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const review = await prisma.review.upsert({
      where: {
        productId_userId: { productId: body.productId, userId: session.user.id },
      },
      create: {
        productId: body.productId,
        userId: session.user.id,
        rating: body.rating,
        title: body.title,
        comment: body.comment,
      },
      update: {
        rating: body.rating,
        title: body.title,
        comment: body.comment,
      },
      include: { user: { select: { name: true } } },
    });

    const stats = await syncProductRating(body.productId);

    return NextResponse.json({ review, ...stats }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save review";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
