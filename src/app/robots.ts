import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/account/"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
