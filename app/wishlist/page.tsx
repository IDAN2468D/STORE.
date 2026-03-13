import { getSessionUser } from "@/lib/actions/auth.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";
import { getCart } from "@/lib/actions/cart.actions";
import Navbar from "@/app/components/Navbar";
import WishlistClient from "./WishlistClient";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }
  const userId = sessionUser._id;

  const wishlistResult = await getWishlist(userId);
  const wishlist = wishlistResult.success ? wishlistResult.data : null;

  const cartResult = await getCart(userId);
  const cartCount = cartResult.success
    ? cartResult.data.items.filter((i: { savedForLater: boolean }) => !i.savedForLater).length
    : 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartItemCount={cartCount} wishlistCount={wishlist?.products?.length || 0} user={sessionUser} />
      <WishlistClient userId={userId} initialWishlist={wishlist} />
    </main>
  );
}
