import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, uniqueSlug, uniqueSku } from "@/lib/admin";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().min(10).optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().optional().nullable(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isDeal: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const data = updateSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = data.slug;
    if (data.slug) {
      slug = await uniqueSlug(data.slug, id);
    }

    let sku = data.sku;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(slug && { slug }),
        ...(data.description && { description: data.description }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.comparePrice !== undefined && { comparePrice: data.comparePrice }),
        ...(sku && { sku }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.images && { images: JSON.stringify(data.images) }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.brandId !== undefined && { brandId: data.brandId }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isDeal !== undefined && { isDeal: data.isDeal }),
        ...(data.isNew !== undefined && { isNew: data.isNew }),
      },
      include: { category: true, brand: true },
    });

    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    const orderCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete — product has existing orders. Reduce stock to 0 instead." },
        { status: 400 }
      );
    }

    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
