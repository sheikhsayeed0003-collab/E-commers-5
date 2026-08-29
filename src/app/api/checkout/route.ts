import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    variantName: z.string().optional(),
    variantValue: z.string().optional(),
  })).min(1),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(10),
  shippingDivision: z.string().min(2),
  shippingDistrict: z.string().min(2),
  shippingArea: z.string().min(2),
  shippingAddress: z.string().min(5),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  guestEmail: z.string().email().optional(),
});

async function resolveItemPrice(
  product: { id: string; price: number; name: string; stock: number },
  variantValue?: string
) {
  if (!variantValue) {
    return { price: product.price, stock: product.stock, variant: null };
  }

  const variant = await prisma.productVariant.findFirst({
    where: { productId: product.id, value: variantValue },
  });

  if (!variant) {
    throw new Error(`Variant not found for ${product.name}`);
  }

  return {
    price: variant.price ?? product.price,
    stock: variant.stock,
    variant,
  };
}

function applyCoupon(
  coupon: { type: string; value: number; minOrder: number; isActive: boolean; expiresAt: Date | null; maxUses: number | null; usedCount: number },
  subtotal: number,
  shippingCost: number
) {
  if (!coupon.isActive) throw new Error("Coupon is not active");
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error("Coupon has expired");
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new Error("Coupon usage limit reached");
  if (subtotal < coupon.minOrder) throw new Error(`Minimum order ৳${coupon.minOrder} required for this coupon`);

  let discount = 0;
  let finalShipping = shippingCost;

  if (coupon.type === "PERCENT") discount = subtotal * (coupon.value / 100);
  else if (coupon.type === "FIXED") discount = Math.min(coupon.value, subtotal);
  else if (coupon.type === "SHIPPING") finalShipping = 0;

  return { discount, shippingCost: finalShipping };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Some products not found" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
      total: number;
      variantName?: string;
      variantValue?: string;
    }[] = [];

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      const resolved = await resolveItemPrice(product, item.variantValue);

      if (resolved.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      if (Math.abs(resolved.price - item.price) > 0.01) {
        throw new Error(`Price changed for ${product.name}. Please refresh your cart.`);
      }

      const total = resolved.price * item.quantity;
      subtotal += total;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: resolved.price,
        total,
        variantName: item.variantName,
        variantValue: item.variantValue,
      });
    }

    let discount = 0;
    let shippingCost = subtotal >= 1500 ? 0 : (data.shippingDivision === "Dhaka" ? 60 : 120);

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
      if (!coupon) throw new Error("Invalid coupon code");
      const applied = applyCoupon(coupon, subtotal, shippingCost);
      discount = applied.discount;
      shippingCost = applied.shippingCost;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    const total = subtotal + shippingCost - discount;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session?.user?.id,
        guestEmail: data.guestEmail,
        guestPhone: data.shippingPhone,
        guestName: data.shippingName,
        subtotal,
        shippingCost,
        discount,
        total,
        couponCode: data.couponCode?.toUpperCase(),
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingDivision: data.shippingDivision,
        shippingDistrict: data.shippingDistrict,
        shippingArea: data.shippingArea,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        status: "PENDING",
        items: { create: orderItems },
        payment: {
          create: {
            method: data.paymentMethod,
            status: "PENDING",
            amount: total,
            transactionId: data.paymentMethod === "ONLINE" ? `MOCK-${Date.now()}` : undefined,
          },
        },
      },
      include: { items: { include: { product: true } }, payment: true },
    });

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      const resolved = await resolveItemPrice(product, item.variantValue);

      if (resolved.variant) {
        await prisma.productVariant.update({
          where: { id: resolved.variant.id },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity }, soldCount: { increment: item.quantity } },
        });
      }

      if (resolved.variant) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { soldCount: { increment: item.quantity } },
        });
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
