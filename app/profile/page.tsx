"use server";

import React from "react";
import { getSessionUser } from "@/lib/actions/auth.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import Navbar from "../components/Navbar";
import { getCart } from "@/lib/actions/cart.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, User as UserIcon, Settings, ChevronLeft } from "lucide-react";


export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await getOrdersByUser(user._id);
  const cartResult = await getCart(user._id);
  const cartCount = cartResult.data?.items?.length || 0;
  const wishlistResult = await getWishlist(user._id);
  const wishlistCount = wishlistResult.data?.products?.length || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      <Navbar user={user} cartItemCount={cartCount} wishlistCount={wishlistCount} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - User Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full" title="מחובר" />
              </div>
              <h1 className="text-2xl font-black mb-1">{user.name}</h1>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <p className="text-amber-400 font-black text-xl">{orders?.length || 0}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">הזמנות</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <p className="text-amber-400 font-black text-xl">{wishlistCount}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">אהבתי</p>
                 </div>
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                עריכת פרופיל
              </button>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                       <ShoppingBag className="w-6 h-6 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black">היסטוריית הזמנות</h2>
                 </div>
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order._id} className="group bg-white/5 hover:bg-white/[0.07] border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all">
                       <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-bold text-xs text-slate-500">
                                #{order._id.slice(-4)}
                             </div>
                             <div>
                                <p className="text-sm font-bold">{formatDate(order.createdAt)}</p>
                                <p className="text-xs text-slate-500">{order.items.length} פריטים</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                             <div className="text-left md:text-right">
                                <p className="text-xs text-slate-500 mb-1">סטטוס</p>
                                <span className="inline-flex px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                                   {order.status}
                                </span>
                             </div>
                             <div className="text-left md:text-right">
                                <p className="text-xs text-slate-500 mb-1">סה"כ</p>
                                <p className="text-sm font-black text-amber-400">{formatPrice(order.totalAmount)}</p>
                             </div>
                             <button className="p-2 bg-white/5 hover:bg-amber-400 hover:text-black rounded-xl transition-all">
                                <ChevronLeft className="w-5 h-5 rotate-180" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <ShoppingBag className="w-10 h-10 text-slate-600" />
                   </div>
                   <h3 className="text-xl font-bold mb-2">אין לכם הזמנות עדיין</h3>
                   <p className="text-slate-500 text-sm max-w-xs mb-8">נראה שעדיין לא רכשתם אצלנו. זה הזמן המושלם להתחיל לקנות!</p>
                   <Link href="/shop" className="bg-amber-500 hover:bg-amber-400 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20">
                      למעבר לחנות
                   </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
