import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, uniqueSlug, uniqueSku } from "@/lib/admin";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional().nullable(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string()).min(1),
  categoryId: z.string(),
  brandId: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isDeal: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const slug = data.slug ? data.slug : await uniqueSlug(data.name);
    const sku = data.sku ? data.sku : await uniqueSku(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription || data.name.slice(0, 80),
        price: data.price,
        comparePrice: data.comparePrice,
        sku,
        stock: data.stock,
        images: JSON.stringify(data.images),
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        isFeatured: data.isFeatured ?? false,
        isDeal: data.isDeal ?? false,
        isNew: data.isNew ?? false,
        tags: JSON.stringify(["new"]),
        specs: JSON.stringify({ warranty: "6 months" }),
      },
      include: { category: true, brand: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
