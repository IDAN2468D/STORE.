import { getOrderById } from "@/lib/actions/order.actions";
import { CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.data) {
    return <div>Order not found</div>;
  }

  const order = result.data;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16 text-center" dir="rtl">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        
        <h1 className="text-4xl font-black mb-2">ההזמנה בוצעה בהצלחה!</h1>
        <p className="text-slate-400 mb-8">מספר הזמנה: <span className="text-white font-mono">{id}</span></p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 text-right">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            פרטי המשלוח
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300">
            <div>
              <p className="text-sm text-slate-500 mb-1">נשלח אל:</p>
              <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">שיטת משלוח:</p>
              <p className="font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4" />
                משלוח אקספרס חינם
              </p>
              <p className="mt-2 text-sm">זמן אספקה משוער: 3-5 ימי עסקים</p>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/10">
             <div className="flex justify-between items-center">
                <span className="text-slate-500 italic">סכום כולל ששולם:</span>
                <span className="text-2xl font-black text-amber-400">
                   {new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(order.totalAmount)}
                </span>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop" className="bg-white text-black font-bold px-8 py-3.5 rounded-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2">
             המשך בקניות
             <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
          <Link href="/profile" className="text-slate-400 hover:text-white transition-colors">
             צפה בהיסטוריית הזמנות
          </Link>
        </div>
      </div>
    </main>
  );
}
