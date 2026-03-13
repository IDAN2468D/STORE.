import { getAdminStats } from "@/lib/actions/admin.actions";
import Navbar from "@/app/components/Navbar";
import { BarChart3, TrendingUp, Users, ShoppingBag, Package, ArrowUpRight, DollarSign } from "lucide-react";
import Image from "next/image";

export default async function AdminPage() {
  const statsResult = await getAdminStats();

  if (!statsResult.success) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h1 className="text-2xl font-black mb-4">גישה נדחתה</h1>
          <p className="text-slate-400 mb-6">{statsResult.error || "אין לך הרשאות לצפות בדף זה."}</p>
          <a href="/" className="bg-amber-500 text-black px-6 py-2 rounded-xl font-bold">חזרה לדף הבית</a>
        </div>
      </main>
    );
  }


  const { totalOrders, totalProducts, totalUsers, totalRevenue, recentOrders, topProducts, dailyRevenue, salesByCategory } = statsResult.data;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  const stats = [
    { label: "סה\"כ הכנסות", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "הזמנות", value: totalOrders, icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "לקוחות", value: totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "מוצרים", value: totalProducts, icon: Package, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16" dir="rtl">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">סקירה כללית של ביצועי החנות</p>
          </div>
          <div className="hidden sm:flex gap-3">
             <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">ייצוא דוח</button>
             <button className="bg-amber-500 text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-400 transition-all">הוסף מוצר</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{s.label}</p>
              <h3 className="text-2xl font-black mt-1">{s.value}</h3>
              <div className="absolute top-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Daily Revenue Chart Placeholder/Simple View */}
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-8">
             <h3 className="text-xl font-bold mb-6 italic">מגמת הכנסות (7 ימים אחרונים)</h3>
             <div className="h-64 flex items-end justify-between gap-2 px-4">
                {dailyRevenue && dailyRevenue.length > 0 ? (
                  dailyRevenue.map((day: any) => {
                    const maxRevenue = Math.max(...dailyRevenue.map((d: any) => d.revenue));
                    const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={day._id} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-white/5 rounded-t-lg relative flex items-end justify-center min-h-[4px]" style={{ height: `${height}%` }}>
                           <div className="absolute -top-10 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatPrice(day.revenue)}
                           </div>
                           <div className="w-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors rounded-t-lg" style={{ height: '100%' }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{day._id.split('-').slice(1).reverse().join('/')}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">אין נתונים ב-7 הימים האחרונים</div>
                )}
             </div>
          </div>

          {/* Sales by Category */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8">
             <h3 className="text-xl font-bold mb-6 italic">מכירות לפי קטגוריה</h3>
             <div className="space-y-4">
               {salesByCategory.map((cat: any) => (
                 <div key={cat._id} className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-bold">{cat._id}</span>
                      <span className="text-slate-500">{formatPrice(cat.revenue)}</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500" 
                        style={{ width: `${(cat.revenue / totalRevenue) * 100}%` }} 
                      />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Recent Orders */}
           <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">הזמנות אחרונות</h3>
                <button className="text-amber-400 text-sm hover:underline flex items-center gap-1">
                   ראה הכל <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-slate-500 text-sm border-b border-white/10">
                      <th className="pb-4 font-medium">לקוח</th>
                      <th className="pb-4 font-medium">תאריך</th>
                      <th className="pb-4 font-medium">סכום</th>
                      <th className="pb-4 font-medium">סטטוס</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.map((order: any) => (
                      <tr key={order._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                           <p className="font-bold text-white">{order.user.name}</p>
                           <p className="text-xs text-slate-500">{order.user.email}</p>
                        </td>
                        <td className="py-4 text-slate-300">{new Date(order.createdAt).toLocaleDateString("he-IL")}</td>
                        <td className="py-4 font-black">{formatPrice(order.totalAmount)}</td>
                        <td className="py-4">
                           <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border border-amber-500/20">
                              {order.status === 'Processing' ? 'בטיפול' : order.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Top Products */}
           <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 italic">מוצרים מובילים במכירות</h3>
              <div className="space-y-6">
                {topProducts.map((p: any) => (
                  <div key={p._id} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden relative flex-shrink-0">
                       <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold truncate group-hover:text-amber-400 transition-colors">{p.name}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{p.totalSold} מכירות</p>
                    </div>
                    <div className="text-left font-black text-sm">
                       {formatPrice(p.revenue)}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 rounded-2xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                 <BarChart3 className="w-4 h-4" />
                 ניתוח מלא
              </button>
           </div>
        </div>
      </div>
    </main>
  );
}
