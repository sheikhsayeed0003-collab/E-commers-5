import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

/** Avoid build-time DB prerender failures on Vercel */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "esy — Online Shopping in Bangladesh",
    template: "%s | esy",
  },
  description:
    "Shop electronics, fashion, beauty, home & more at esy.com. Free delivery options, cash on delivery, best prices in Bangladesh.",
  keywords: ["esy", "online shopping", "Bangladesh", "ecommerce", "BDT"],
  openGraph: {
    siteName: "esy",
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
