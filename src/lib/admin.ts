import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const { prisma } = await import("./prisma");
  let slug = slugify(base);
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.product.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
}

export async function uniqueSku(base: string, excludeId?: string): Promise<string> {
  const { prisma } = await import("./prisma");
  let sku = `ESY-${base.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16)}`;
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? sku : `${sku}-${counter}`;
    const existing = await prisma.product.findFirst({
      where: { sku: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!existing) return candidate;
    counter++;
  }
}
