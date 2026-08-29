import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { product: true } }, payment: true },
  });

  if (!order) notFound();

  return (
    <div className="container-main py-12 max-w-2xl mx-auto text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-muted mb-6">Thank you for shopping at esy. Your order has been received.</p>

      <div className="border border-border rounded-lg p-6 text-left mb-6">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted">Order Number</span><p className="font-bold">{order.orderNumber}</p></div>
          <div><span className="text-muted">Status</span><p className="font-medium">{ORDER_STATUS_LABELS[order.status]}</p></div>
          <div><span className="text-muted">Total</span><p className="font-bold text-primary">{formatPrice(order.total)}</p></div>
          <div><span className="text-muted">Payment</span><p className="font-medium">{order.payment?.method === "COD" ? "Cash on Delivery" : "Online Payment"}</p></div>
          <div className="sm:col-span-2"><span className="text-muted">Delivery Address</span><p>{order.shippingName}, {order.shippingAddress}, {order.shippingArea}, {order.shippingDistrict}, {order.shippingDivision}</p></div>
        </div>
        <hr className="my-4 border-border" />
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button href="/account/orders">View My Orders</Button>
        <Button href="/shop" variant="outline">Continue Shopping</Button>
      </div>
    </div>
  );
}
