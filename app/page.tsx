import { seedStoreData, getAllProducts } from "@/lib/actions/store.actions";
import { getCart } from "@/lib/actions/cart.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";
import { getSessionUser } from "@/lib/actions/auth.actions";
import Navbar from "./components/Navbar";

import ProductCard from "./components/ProductCard";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones, Tag } from "lucide-react";
import { redirect } from "next/navigation";
import CountdownTimer from "./components/CountdownTimer";
import { IProduct } from "@/types";


export default async function Home() {
  // Get real session user first
  const sessionUser = await getSessionUser();
  
  // If not logged in, redirect to login page immediately
  if (!sessionUser) {
    redirect("/login");
  }

  let productsResult = await getAllProducts();

  // If DB is empty, perform one-time seed
  if (productsResult.success && (!productsResult.data || productsResult.data.length === 0)) {
    await seedStoreData();
    productsResult = await getAllProducts();
  }

  if (!productsResult.success) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] grid items-center justify-center p-8">
        <div className="bg-rose-500/10 text-rose-400 p-6 rounded-2xl max-w-lg border border-rose-500/30 text-right">
          <h2 className="text-xl font-bold mb-2">שגיאה בטעינת החנות</h2>
          <p>{productsResult.error}</p>
        </div>
      </main>
    );
  }

  const user = sessionUser;
  const products = productsResult.data || [];

  // Get cart + wishlist counts for navbar
  const cartResult = await getCart(user._id);
  const cartItemCount = (cartResult.data?.items || [])
    .filter((i: { savedForLater: boolean }) => !i.savedForLater).length;
  const wishlistResult = await getWishlist(user._id);
  const wishlistCount = wishlistResult.data?.products?.length || 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <Navbar cartItemCount={cartItemCount} wishlistCount={wishlistCount} user={sessionUser} />


      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/hero.png"
          alt="Store Hero"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                קולקציית 2024 החדשה
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-6">
                גלו את
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  הטוב ביותר
                </span>
                <br />
                עבורכם
              </h1>

              <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                מבחר מוצרים יוקרתיים שנבחרו בקפידה עבור אורח החיים המודרני. איכות פוגשת אלגנטיות.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="bg-white text-black font-bold px-8 py-3.5 rounded-full hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-amber-500/20 active:scale-[0.97]">
                  קנו עכשיו
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
                <Link href="/shop?category=Collections" className="border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/5 transition-all duration-300">
                  צפו בקולקציות
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="relative z-10 -mt-10 mb-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
           
           <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                 <Tag className="w-8 h-8 text-white rotate-90" />
              </div>
              <div>
                 <h2 className="text-2xl md:text-3xl font-black text-white italic">מבצעי בזק! ⚡</h2>
                 <p className="text-white/80 font-medium text-sm">הנחות עד 50% על מוצרי אלקטרוניקה. המבצע מסתיים בעוד:</p>
              </div>
           </div>

           <CountdownTimer />

           <Link href="/shop?category=%D7%90%D7%9C%D7%A7%D7%98%D7%A8%D7%95%D7%A0%D7%99%D7%A7%D7%94" className="bg-white text-orange-600 font-black px-8 py-3.5 rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95 whitespace-nowrap">
              נצלו את המבצע
           </Link>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {[
              { icon: Truck, title: "משלוח חינם", desc: "בהזמנות מעל ₪199" },
              { icon: ShieldCheck, title: "תשלום מאובטח", desc: "הצפנת SSL מתקדמת" },
              { icon: RotateCcw, title: "החזרות קלות", desc: "מדיניות החזרה של 30 יום" },
              { icon: Headphones, title: "תמיכה 24/7", desc: "מרכז עזרה ייעודי" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 py-5 md:py-6 px-4 md:px-6">
                <Icon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs md:text-sm font-semibold">{title}</p>
                  <p className="text-slate-500 text-[10px] md:text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              הקולקציה שלנו
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              מוצרים נבחרים
            </h2>
          </div>
          <button className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors group">
            צפו בהכל
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((product: IProduct) => {
            const isWishlisted = (wishlistResult.data?.products || [])
              .some((p: IProduct) => p._id === product._id);
            
            return (
              <ProductCard 
                key={product._id} 
                product={product} 
                userId={user?._id || ""} 
                initialWishlisted={isWishlisted}
              />
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="relative bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl overflow-hidden border border-amber-500/10 p-8 md:p-14">
          <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-5" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              הצטרפו ל<span className="text-amber-400">קהילה</span> שלנו
            </h3>
            <p className="text-slate-400 text-sm md:text-base mb-6">
              הירשמו כדי לקבל הצעות בלעדיות, גישה מוקדמת לקולקציות חדשות והנחות לחברים בלבד.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="הזינו כתובת אימייל"
                className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors text-right"
              />
              <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-full transition-all whitespace-nowrap shadow-lg shadow-amber-500/20">
                הרשמה
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">S</span>
                </div>
                <span className="text-white font-bold text-xl">
                  STORE<span className="text-amber-400">.</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                מוצרי פרימיום שנבחרו עבור אורח החיים המודרני. איכות, עיצוב וקיימות.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "חנות", links: ["מוצרים חדשים", "הנמכרים ביותר", "מבצעים", "קולקציות"] },
              { title: "עזרה", links: ["צור קשר", "משלוחים", "החזרות", "שאלות נפוצות"] },
              { title: "חברה", links: ["אודות", "קריירה", "עיתונות", "חנויות"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{section.title}</h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="/" className="text-slate-500 hover:text-white text-sm transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row-reverse items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">
              &copy; 2024 STORE. כל הזכויות שמורות.
            </p>
            <div className="flex gap-6">
              {[{l: "Privacy", t:"פרטיות"}, {l: "Terms", t:"תנאי שימוש"}, {l: "Cookies", t: "עוגיות"}].map((link) => (
                <Link key={link.l} href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
                  {link.t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
