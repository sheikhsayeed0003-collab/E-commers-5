export default function ShippingPolicyPage() {
  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Shipping & Delivery</h1>
      <div className="text-sm text-muted space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-secondary">Delivery Areas</h2>
        <p>We deliver nationwide across all 8 divisions of Bangladesh.</p>
        <h2 className="text-base font-bold text-secondary">Shipping Charges</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Inside Dhaka: ৳60</li>
          <li>Outside Dhaka: ৳120</li>
          <li>Free shipping on orders over ৳1,500</li>
        </ul>
        <h2 className="text-base font-bold text-secondary">Delivery Time</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dhaka: 1-3 business days</li>
          <li>Outside Dhaka: 3-7 business days</li>
        </ul>
      </div>
    </div>
  );
}
