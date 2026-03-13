import { getCart } from "@/lib/actions/cart.actions";
import { getSessionUser } from "@/lib/actions/auth.actions";
import CheckoutClient from "../components/CheckoutClient";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/login");
  }
  const userId = sessionUser._id;

  const cartResult = await getCart(userId);
  const cart = cartResult.success ? cartResult.data : null;

  if (!cart || cart.items.filter((i: any) => !i.savedForLater).length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">הסל שלך ריק</h1>
          <a href="/shop" className="text-amber-400 hover:underline">חזרה לחנות</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={sessionUser} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-black mb-8">קופה</h1>
        <CheckoutClient userId={userId} cart={cart} />
      </div>
    </main>
  );
}
