import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal, shippingDivision } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order ৳${coupon.minOrder.toLocaleString()} required`,
      });
    }

    let discount = 0;
    let shippingCost = subtotal >= 1500 ? 0 : shippingDivision === "Dhaka" ? 60 : 120;

    if (coupon.type === "PERCENT") {
      discount = subtotal * (coupon.value / 100);
    } else if (coupon.type === "FIXED") {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === "SHIPPING") {
      shippingCost = 0;
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount,
      shippingCost,
      total: subtotal + shippingCost - discount,
    });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
}
