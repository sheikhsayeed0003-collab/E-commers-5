export default function FAQPage() {
  const faqs = [
    { q: "How do I place an order?", a: "Browse products, add to cart, proceed to checkout, fill in your delivery details, and choose payment method (COD or Online)." },
    { q: "Do you offer Cash on Delivery?", a: "Yes! COD is available nationwide. Pay when you receive your order." },
    { q: "What are the shipping charges?", a: "Dhaka: ৳60, Outside Dhaka: ৳120. Free shipping on orders over ৳1,500." },
    { q: "How long does delivery take?", a: "Dhaka: 1-3 business days. Outside Dhaka: 3-7 business days." },
    { q: "Can I return a product?", a: "Yes, we offer a 7-day return policy for unused items in original packaging." },
    { q: "How do I track my order?", a: "Sign in to your account and go to My Orders to see order status and tracking information." },
    { q: "What payment methods do you accept?", a: "Cash on Delivery (COD), bKash, Nagad, and credit/debit cards via online payment." },
    { q: "How do I use a coupon code?", a: "Enter your coupon code at checkout. Try WELCOME10 for 10% off your first order!" },
  ];

  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map(({ q, a }) => (
          <details key={q} className="border border-border rounded-lg group">
            <summary className="p-4 font-medium cursor-pointer hover:text-primary transition-colors list-none flex justify-between items-center">
              {q}
              <span className="text-muted group-open:rotate-45 transition-transform text-lg">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
