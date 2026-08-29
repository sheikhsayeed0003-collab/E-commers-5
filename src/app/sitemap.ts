import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://esy.com";

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);

    const staticPages = ["", "/shop", "/deals", "/about", "/contact", "/faq", "/cart", "/privacy-policy", "/terms", "/return-policy", "/shipping-policy", "/payment-policy"];

    return [
      ...staticPages.map((path) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: path === "" ? 1 : 0.8,
      })),
      ...categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 }];
  }
}
