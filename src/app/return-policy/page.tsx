export default function ReturnPolicyPage() {
  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Return & Refund Policy</h1>
      <div className="text-sm text-muted space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-secondary">7-Day Return Policy</h2>
        <p>You may return unused items in original packaging within 7 days of delivery for a full refund or exchange.</p>
        <h2 className="text-base font-bold text-secondary">How to Return</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Contact our support team at support@esy.com or +880 1700-000000</li>
          <li>Provide your order number and reason for return</li>
          <li>Our team will arrange pickup or provide return instructions</li>
          <li>Refund will be processed within 5-7 business days after inspection</li>
        </ol>
        <h2 className="text-base font-bold text-secondary">Non-Returnable Items</h2>
        <p>Personal care products, undergarments, and customized items cannot be returned unless defective.</p>
      </div>
    </div>
  );
}
