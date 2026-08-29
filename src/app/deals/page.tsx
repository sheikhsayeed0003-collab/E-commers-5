import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/product/ProductCard";

export const metadata = { title: "SuperDeals — Best Offers" };

export default async function DealsPage() {
  const deals = await prisma.product.findMany({
    where: { isDeal: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="container-main py-6">
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl p-6 md:p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">SuperDeals</h1>
        <p className="text-white/80 text-sm">Limited time offers — up to 70% off on selected products!</p>
      </div>
      <ProductGrid products={deals} />
    </div>
  );
}
