import { getAllProducts, getCategories } from "@/lib/actions/store.actions";
import { getCart } from "@/lib/actions/cart.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";
import { getSessionUser } from "@/lib/actions/auth.actions";
import Navbar from "@/app/components/Navbar";
import ShopClient from "@/app/shop/ShopClient";
import { IUser } from "@/types";
import { redirect } from "next/navigation";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }
  const userId = sessionUser._id;

  // Fetch products with filters from URL
  const productsResult = await getAllProducts({
    category: resolvedParams?.category,
    search: resolvedParams?.q,
    sortBy: resolvedParams?.sort,
  });
  const products = productsResult.data || [];

  // Fetch categories
  const categoriesResult = await getCategories();
  const categories = categoriesResult.data || [];

  // Counts for navbar
  const cartResult = await getCart(userId);
  const cartCount = cartResult.success
    ? cartResult.data.items.filter((i: { savedForLater: boolean }) => !i.savedForLater).length
    : 0;
  const wishlistResult = await getWishlist(userId);
  const wishlistCount = wishlistResult.success ? wishlistResult.data.products.length : 0;
  const wishlistedProductIds = (wishlistResult.data?.products || []).map((p: IUser) => p._id);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartItemCount={cartCount} wishlistCount={wishlistCount} user={sessionUser} />
      <ShopClient
        initialProducts={products}
        categories={categories}
        userId={userId}
        wishlistedProductIds={wishlistedProductIds}
        initialCategory={resolvedParams?.category}
        initialSort={resolvedParams?.sort}
        initialSearch={resolvedParams?.q}
      />
    </main>
  );
}
