import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WishlistContent } from "./WishlistContent";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/account/login?callbackUrl=/account/wishlist");
  }

  return <WishlistContent />;
}
