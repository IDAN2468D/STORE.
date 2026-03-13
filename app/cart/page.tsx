import { getCart } from "@/lib/actions/cart.actions";
import { seedDemoData } from "@/lib/actions/review.actions";
import CartPageClient from "../components/CartPageClient";
import { ShoppingCart } from "lucide-react";

export default async function CartPage() {
  // Ensure demo data exists
  const seedResult = await seedDemoData();

  if (!seedResult.success) {
    return (
      <main className="min-h-screen bg-[#0f172a] grid items-center justify-center p-8">
        <div className="bg-rose-500/10 text-rose-400 p-6 rounded-2xl max-w-lg border border-rose-500/30">
          <h2 className="text-xl font-bold mb-2">Failed to load data</h2>
          <p>{seedResult.error}</p>
        </div>
      </main>
    );
  }

  const { user } = seedResult;

  // Fetch the user's cart
  const cartResult = await getCart(user._id);
  const cart = cartResult.success ? cartResult.data : null;

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-10 pt-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex justify-center items-center shadow-lg shadow-emerald-900/30">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
                סל הקניות
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                נהלו את המוצרים שלכם והמשיכו לתשלום
              </p>
            </div>
          </div>
        </header>

        {/* Cart Content - Client Component */}
        <CartPageClient userId={user._id} initialCart={cart} />
      </div>
    </main>
  );
}
