function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="prose prose-sm text-muted leading-relaxed space-y-4">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <StaticPage title="About esy">
      <p>esy is Bangladesh&apos;s trusted online shopping destination, offering a wide range of products at competitive prices with fast delivery and cash on delivery options.</p>
      <p>Our mission is to make online shopping accessible, affordable, and reliable for every customer across Bangladesh.</p>
      <h2 className="text-lg font-bold text-secondary mt-6">Why Choose esy?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Thousands of quality products</li>
        <li>Best prices with daily deals</li>
        <li>Free shipping on orders over ৳1,500</li>
        <li>Cash on Delivery nationwide</li>
        <li>7-day easy return policy</li>
        <li>24/7 customer support</li>
      </ul>
    </StaticPage>
  );
}
