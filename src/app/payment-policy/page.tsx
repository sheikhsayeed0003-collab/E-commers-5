export default function PaymentPolicyPage() {
  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
      <div className="text-sm text-muted space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-secondary">Cash on Delivery (COD)</h2>
        <p>Pay in cash when your order is delivered. Available nationwide. No advance payment required.</p>
        <h2 className="text-base font-bold text-secondary">Online Payment</h2>
        <p>Pay securely online using:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>bKash</li>
          <li>Nagad</li>
          <li>Visa / Mastercard</li>
        </ul>
        <p className="text-xs italic">Note: Online payment gateway is currently in test mode. COD is recommended for immediate orders.</p>
      </div>
    </div>
  );
}
