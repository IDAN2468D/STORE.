"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order.actions";
import { Loader2, CreditCard, Truck, MapPin, User, Mail, Phone, Lock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";


interface CheckoutClientProps {
  userId: string;
  cart: any;
}

export default function CheckoutClient({ userId, cart }: CheckoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
  });

  const activeItems = cart.items.filter((i: any) => !i.savedForLater);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const orderData = {
        userId,
        items: activeItems.map((item: any) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        totalAmount: cart.finalTotal,
        shippingAddress: formData,
      };

      const result = await createOrder(orderData);
      if (result.success) {
        router.push(`/order-success/${result.data._id}`);
      } else {
        alert("שגיאה ביצירת ההזמנה: " + result.error);
      }
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
        {/* Shipping Information */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-morphism rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black">פרטי משלוח</h2>
                <p className="text-slate-500 text-xs">לאן לשלוח את ההזמנה שלך?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">שם מלא</label>
                <div className="relative">
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="ישראל ישראלי"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">אימייל</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="example@mail.com"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">טלפון</label>
                <div className="relative">
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="050-0000000"
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">כתובת</label>
                <div className="relative">
                  <input
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="הרצל 1"
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">עיר</label>
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="תל אביב"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 mr-2">מיקוד</label>
                <input
                  required
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="1234567"
                />
              </div>
            </div>
          </div>
        </motion.section>


        {/* Payment Simulation */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black">שיטת תשלום</h2>
              <p className="text-slate-500 text-xs">הפלטפורמה מאובטחת ומקודדת</p>
            </div>
          </div>
          
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-start gap-4">
             <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
               <p className="text-sm text-emerald-100 font-bold mb-1">תשלום מאובטח</p>
               <p className="text-xs text-emerald-200/60 leading-relaxed">
                 כרגע אנחנו בסימולציה של תשלום לצורכי פיתוח. בלחיצה על "בצע הזמנה" ההזמנה תאושר ותשלח לטיפול מיידי.
               </p>
             </div>
          </div>
        </motion.section>


        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-white/10 hover:bg-amber-400 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>בצע הזמנה בסך {formatPrice(cart.finalTotal)}</>
          )}
        </button>
      </form>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-[2.5rem] p-8 sticky top-24 overflow-hidden"
        >
          {/* Glow Spot */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />

          <h3 className="text-xl font-black mb-8 italic premium-gradient-text">סיכום הזמנה</h3>
          
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar px-1">
            {activeItems.map((item: any) => (
              <div key={item._id} className="flex gap-5 group">
                <div className="w-20 h-20 glass-card rounded-2xl overflow-hidden relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black truncate group-hover:text-amber-400 transition-colors">{item.product.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">כמות: {item.quantity}</p>
                  <p className="text-base font-black text-white mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">סכום ביניים</span>
              <span className="text-white font-black">{formatPrice(cart.cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">משלוח</span>
              <span className="text-emerald-400 font-black">חינם</span>
            </div>
            <div className="flex justify-between items-end pt-4">
               <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">סה"כ לתשלום</p>
                  <p className="text-3xl font-black premium-gradient-text mt-1">{formatPrice(cart.finalTotal)}</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
