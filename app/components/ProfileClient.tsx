"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, User as UserIcon, Settings, ChevronLeft, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { logout } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import SettingsModal from "./SettingsModal";

interface ProfileClientProps {
  user: any;
  orders: any[];
  wishlistCount: number;
}

export default function ProfileClient({ 
  user, 
  orders, 
  wishlistCount, 
}: ProfileClientProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Sidebar - User Info */}
      <div className="lg:col-span-4 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-morphism rounded-[2.5rem] p-8 text-center relative overflow-hidden"
        >
          {/* Dynamic Glow Spot */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-500/30 group-hover:scale-105 transition-transform duration-500">
              <UserIcon className="w-16 h-16 text-white" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full flex items-center justify-center"
            >
               <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-black mb-2 premium-gradient-text italic">הפרופיל שלי</h1>
          <h2 className="text-xl font-bold mb-1">{user.name}</h2>
          <p className="text-slate-500 text-sm mb-8">{user.email}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="glass-card p-5 rounded-3xl group/item">
                <p className="text-amber-400 font-black text-2xl group-hover:scale-110 transition-transform">{orders?.length || 0}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">הזמנות</p>
             </div>
             <div className="glass-card p-5 rounded-3xl group/item">
                <p className="text-amber-400 font-black text-2xl group-hover:scale-110 transition-transform">{wishlistCount}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">אהבתי</p>
             </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full py-4 bg-white/5 hover:bg-amber-400 hover:text-black border border-white/10 rounded-2xl text-sm font-black transition-all glow-hover flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              הגדרות חשבון
            </button>

            <button 
              onClick={handleLogout}
              disabled={isPending}
              className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              התנתק מהחשבון
            </button>
          </div>
        </motion.div>
      </div>

      <SettingsModal 
        user={user} 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Main Content - Orders */}
      <div className="lg:col-span-8 space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-morphism rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden min-h-[600px]"
        >
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-amber-500/10 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                   <ShoppingBag className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">היסטוריית הזמנות</h2>
                  <p className="text-slate-500 text-sm">ניהול ומעקב אחר הרכישות שלך</p>
                </div>
             </div>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any, idx: number) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group glass-card hover:border-amber-500/30 rounded-3xl p-6 transition-all glow-hover"
                >
                   <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors duration-500">
                            #{order._id.slice(-4)}
                         </div>
                         <div>
                            <p className="text-base font-black">{formatDate(order.createdAt)}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">{order.items.length} פריטים באריזה</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-left md:text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1 font-bold">מצב הזמנה</p>
                            <span className="inline-flex px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                               {order.status}
                            </span>
                         </div>
                         <div className="text-left md:text-right">
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1 font-bold">סה"כ שולם</p>
                            <p className="text-lg font-black premium-gradient-text">{formatPrice(order.totalAmount)}</p>
                         </div>
                         <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white text-white hover:text-black rounded-xl transition-all duration-300">
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                         </button>
                      </div>
                   </div>
                </motion.div>
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
        </motion.div>
      </div>

    </div>
  );
}
