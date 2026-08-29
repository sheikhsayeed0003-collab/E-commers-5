import { Suspense } from "react";
import { ShopContent } from "./ShopContent";

export const metadata = { title: "Shop All Products" };

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-main py-8 text-center text-muted">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
