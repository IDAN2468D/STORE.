"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useState, useTransition } from "react";
import SearchBar from "./SearchBar";
import { logout } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Loader2 } from "lucide-react";
import { IUser } from "@/types";


interface NavbarProps {
  cartItemCount?: number;
  wishlistCount?: number;
  user?: IUser | null;
}

export default function Navbar({ cartItemCount = 0, wishlistCount = 0, user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5" dir="rtl">

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
              STORE<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right: Navigation + Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-6 mr-4">
              {[
                { label: "חנות", href: "/shop" },
                { label: "חדש", href: "/shop?sort=newest" },
                { label: "מבצעים", href: "/shop?sale=true" },
                ...(user?.role === "admin" ? [{ label: "ניהול", href: "/admin" }] : []),
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-400 hover:text-white text-sm font-medium tracking-wide transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Account / Auth */}
            <div className="hidden sm:flex items-center gap-1">
              {user ? (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl pl-2 pr-4 py-1.5 ml-2 hover:border-white/20 transition-all">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">חשבון</span>
                      <span className="text-xs text-white font-black truncate max-w-[80px]">{user.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      disabled={isPending}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="התנתקות"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <Link 
                    href="/profile"
                    prefetch={false}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="פרופיל"
                  >
                    <User className="w-5 h-5" />
                  </Link>

                </div>
              ) : (
                <Link 
                  href="/login"
                  prefetch={false}
                  className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 ml-2"
                >
                  התחברות
                </Link>

              )}
            </div>



            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all relative"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-[10px] text-white font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-[10px] text-black font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-amber-500/30">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 px-4 pb-6 pt-4">
          {/* Mobile Search */}
          <div className="mb-4">
            <SearchBar />
          </div>
          {[
            { label: "כל המוצרים", href: "/shop" },
            { label: "מוצרים חדשים", href: "/shop?sort=newest" },
            { label: "מבצעים", href: "/shop?sale=true" },
            ...(user?.role === "admin" ? [{ label: "פאנל ניהול", href: "/admin" }] : []),
            { label: "רשימת משאלות", href: "/wishlist" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              className="block py-3 text-slate-300 hover:text-white text-sm font-medium tracking-wide border-b border-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>

          ))}
        </div>
      )}
    </nav>
  );
}
