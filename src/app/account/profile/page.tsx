import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/account/login");

  return (
    <div className="container-main py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="border border-border rounded-lg p-6 space-y-4">
        <div><span className="text-sm text-muted">Name</span><p className="font-medium">{session.user?.name}</p></div>
        <div><span className="text-sm text-muted">Email</span><p className="font-medium">{session.user?.email}</p></div>
        <div><span className="text-sm text-muted">Role</span><p className="font-medium capitalize">{session.user?.role?.toLowerCase()}</p></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-6">
        <Link href="/account/orders" className="border border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <p className="font-medium text-sm">My Orders</p>
        </Link>
        <Link href="/account/wishlist" className="border border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <p className="font-medium text-sm">Wishlist</p>
        </Link>
        <Link href="/cart" className="border border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <p className="font-medium text-sm">Cart</p>
        </Link>
      </div>
    </div>
  );
}
