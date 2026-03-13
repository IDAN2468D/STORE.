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
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold">פרטי משלוח</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        </motion.section>


        {/* Payment Simulation */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">פרטי תשלום</h2>
          </div>
          
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
             <Lock className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
             <p className="text-sm text-emerald-200/80 leading-relaxed">
               מערכת התשלומים שלנו מאובטחת. כרגע אנחנו בסימולציה של תשלום, בלחיצה על "בצע הזמנה" ההזמנה תאושר מיידית.
             </p>
          </div>
        </motion.section>


        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
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
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sticky top-24">
          <h3 className="text-lg font-bold mb-5 italic">סיכום הזמנה</h3>
          
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
            {activeItems.map((item: any) => (
              <div key={item._id} className="flex gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{item.product.name}</h4>
                  <p className="text-xs text-slate-500">כמות: {item.quantity}</p>
                  <p className="text-sm font-black text-amber-400">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>סכום ביניים</span>
              <span>{formatPrice(cart.cartTotal)}</span>
            </div>
            <div className="flex justify-between text-white font-black text-xl pt-2">
              <span>סה"כ לתשלום</span>
              <span>{formatPrice(cart.finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
