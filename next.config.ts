import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix trace root when parent folder has another lockfile (local + Vercel)
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: process.env.VERCEL === "1",
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
