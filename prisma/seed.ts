import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Stable placeholder images — picsum seed URLs never 404 */
const img = (seed: string, size = 600) => `https://picsum.photos/seed/${seed}/${size}/${size}`;

const categories = [
  { name: "Electronics", slug: "electronics", image: img("cat-electronics", 400) },
  { name: "Women's Clothing", slug: "womens-clothing", image: img("cat-womens", 400) },
  { name: "Men's Clothing", slug: "mens-clothing", image: img("cat-mens", 400) },
  { name: "Beauty & Health", slug: "beauty-health", image: img("cat-beauty", 400) },
  { name: "Shoes", slug: "shoes", image: img("cat-shoes", 400) },
  { name: "Home & Appliances", slug: "home-appliances", image: img("cat-home", 400) },
  { name: "Sports & Outdoors", slug: "sports-outdoors", image: img("cat-sports", 400) },
  { name: "Toys & Games", slug: "toys-games", image: img("cat-toys", 400) },
  { name: "Bags & Luggage", slug: "bags-luggage", image: img("cat-bags", 400) },
  { name: "Jewelry", slug: "jewelry", image: img("cat-jewelry", 400) },
  { name: "Phones & Accessories", slug: "phones-accessories", image: img("cat-phones", 400) },
  { name: "Baby & Maternity", slug: "baby-maternity", image: img("cat-baby", 400) },
];

const brands = [
  { name: "esy Basics", slug: "esy-basics" },
  { name: "TechPro", slug: "techpro" },
  { name: "StyleHub", slug: "stylehub" },
  { name: "HomeEssentials", slug: "homeessentials" },
];

function product(
  name: string,
  slug: string,
  price: number,
  comparePrice: number,
  categorySlug: string,
  brandSlug: string,
  opts: Partial<{ isFeatured: boolean; isDeal: boolean; isNew: boolean; stock: number; soldCount: number }> = {}
) {
  return {
    name,
    slug,
    description: `${name} — premium quality product available at esy.com with fast delivery across Bangladesh. Cash on delivery available.`,
    shortDescription: name.slice(0, 80),
    price,
    comparePrice,
    sku: `ESY-${slug.toUpperCase().slice(0, 20)}`,
    stock: opts.stock ?? 100,
    images: JSON.stringify([img(slug)]),
    categorySlug,
    brandSlug,
    rating: 0,
    reviewCount: 0,
    soldCount: opts.soldCount ?? Math.floor(Math.random() * 5000) + 100,
    isFeatured: opts.isFeatured ?? false,
    isDeal: opts.isDeal ?? false,
    isNew: opts.isNew ?? false,
    tags: JSON.stringify(["popular", "bestseller"]),
    specs: JSON.stringify({ warranty: "6 months", origin: "Imported" }),
  };
}

const products = [
  product("Wireless Bluetooth Earbuds Pro", "wireless-bluetooth-earbuds-pro", 899, 2499, "electronics", "techpro", { isFeatured: true, isDeal: true, soldCount: 3200 }),
  product("Smart Watch Fitness Tracker", "smart-watch-fitness-tracker", 1299, 3999, "electronics", "techpro", { isFeatured: true, isDeal: true }),
  product("Portable Power Bank 20000mAh", "portable-power-bank-20000mah", 749, 1899, "electronics", "techpro", { isDeal: true }),
  product("Women Floral Summer Dress", "women-floral-summer-dress", 599, 1599, "womens-clothing", "stylehub", { isFeatured: true, isNew: true }),
  product("Men Casual Cotton T-Shirt", "men-casual-cotton-tshirt", 399, 899, "mens-clothing", "esy-basics", { isFeatured: true }),
  product("Running Sneakers Lightweight", "running-sneakers-lightweight", 999, 2499, "shoes", "stylehub", { isDeal: true, soldCount: 1800 }),
  product("Skincare Vitamin C Serum", "skincare-vitamin-c-serum", 449, 1199, "beauty-health", "homeessentials", { isNew: true }),
  product("Electric Kettle 1.8L", "electric-kettle-18l", 849, 1999, "home-appliances", "homeessentials", { isDeal: true }),
  product("Yoga Mat Non-Slip Premium", "yoga-mat-non-slip-premium", 549, 1299, "sports-outdoors", "esy-basics"),
  product("Kids Educational Building Blocks", "kids-educational-building-blocks", 699, 1699, "toys-games", "esy-basics", { isNew: true }),
  product("Leather Crossbody Bag", "leather-crossbody-bag", 799, 2199, "bags-luggage", "stylehub", { isFeatured: true }),
  product("Sterling Silver Pendant Necklace", "sterling-silver-pendant-necklace", 649, 1799, "jewelry", "stylehub"),
  product("Phone Case Shockproof Clear", "phone-case-shockproof-clear", 199, 499, "phones-accessories", "techpro", { isDeal: true, soldCount: 8500 }),
  product("USB-C Fast Charger 65W", "usb-c-fast-charger-65w", 599, 1499, "phones-accessories", "techpro", { isDeal: true }),
  product("Baby Soft Cotton Onesie Set", "baby-soft-cotton-onesie-set", 499, 1199, "baby-maternity", "esy-basics", { isNew: true }),
  product("LED Desk Lamp Adjustable", "led-desk-lamp-adjustable", 429, 999, "home-appliances", "homeessentials"),
  product("Women High Waist Jeans", "women-high-waist-jeans", 699, 1899, "womens-clothing", "stylehub", { isDeal: true }),
  product("Men Formal Slim Fit Shirt", "men-formal-slim-fit-shirt", 549, 1399, "mens-clothing", "stylehub"),
  product("Wireless Mouse Ergonomic", "wireless-mouse-ergonomic", 349, 799, "electronics", "techpro"),
  product("Stainless Steel Water Bottle", "stainless-steel-water-bottle", 299, 699, "sports-outdoors", "esy-basics", { soldCount: 4200 }),
  product("Makeup Brush Set 12pcs", "makeup-brush-set-12pcs", 399, 999, "beauty-health", "homeessentials", { isDeal: true }),
  product("Bluetooth Speaker Portable", "bluetooth-speaker-portable", 799, 2199, "electronics", "techpro", { isFeatured: true, isDeal: true }),
  product("Canvas Tote Bag Eco Friendly", "canvas-tote-bag-eco-friendly", 249, 599, "bags-luggage", "esy-basics"),
  product("Remote Control Car Toy", "remote-control-car-toy", 899, 2299, "toys-games", "esy-basics", { isDeal: true }),
];

async function main() {
  console.log("Seeding esy database...");

  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.siteSetting.deleteMany();

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123456", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@esy.com",
      phone: "+8801700000000",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@esy.com",
      phone: "+8801711111111",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const customer = await prisma.user.findUnique({ where: { email: "customer@esy.com" } });

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  for (const brand of brands) {
    await prisma.brand.create({ data: brand });
  }

  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );
  const brandMap = Object.fromEntries(
    (await prisma.brand.findMany()).map((b) => [b.slug, b.id])
  );

  for (const p of products) {
    const { categorySlug, brandSlug, ...data } = p;
    await prisma.product.create({
      data: {
        ...data,
        categoryId: catMap[categorySlug],
        brandId: brandMap[brandSlug],
        variants: {
          create: [
            { name: "Color", value: "Black", sku: `${data.sku}-BLK`, stock: 50 },
            { name: "Color", value: "White", sku: `${data.sku}-WHT`, stock: 50 },
          ],
        },
      },
    });
  }

  // Sample reviews from demo customer on first 5 products
  const seededProducts = await prisma.product.findMany({ take: 5 });
  const sampleReviews = [
    { rating: 5, title: "Excellent!", comment: "Great quality product, fast delivery. Highly recommended!" },
    { rating: 4, title: "Good value", comment: "Works well for the price. Would buy again." },
    { rating: 5, title: "Love it", comment: "Exactly as described. Very happy with my purchase." },
    { rating: 3, title: "Okay", comment: "Decent product but packaging could be better." },
    { rating: 4, title: "Solid buy", comment: "Good build quality and arrived on time." },
  ];

  if (customer) {
    for (let i = 0; i < seededProducts.length; i++) {
      await prisma.review.create({
        data: {
          productId: seededProducts[i].id,
          userId: customer.id,
          ...sampleReviews[i],
        },
      });
      const reviews = await prisma.review.findMany({ where: { productId: seededProducts[i].id } });
      const reviewCount = reviews.length;
      const rating = reviews.reduce((s, r) => s + r.rating, 0) / reviewCount;
      await prisma.product.update({
        where: { id: seededProducts[i].id },
        data: { rating, reviewCount },
      });
    }
  }

  await prisma.coupon.createMany({
    data: [
      { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 500, maxUses: 1000 },
      { code: "ESY50", type: "FIXED", value: 50, minOrder: 1000, maxUses: 500 },
      { code: "FREESHIP", type: "SHIPPING", value: 60, minOrder: 800, maxUses: 2000 },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "site_name", value: "esy" },
      { key: "site_tagline", value: "Bangladesh's trusted online shopping destination" },
      { key: "phone", value: "+880 1700-000000" },
      { key: "email", value: "support@esy.com" },
      { key: "address", value: "Dhaka, Bangladesh" },
      { key: "primary_color", value: "#FF4747" },
      { key: "secondary_color", value: "#191919" },
      { key: "shipping_dhaka", value: "60" },
      { key: "shipping_outside", value: "120" },
      { key: "free_shipping_min", value: "1500" },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
