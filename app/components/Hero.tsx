"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-like scale */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Store Hero"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Enhanced Overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
      </div>

      {/* Floating Glass Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl w-full mx-4"
      >
        <div className="glass-morphism p-8 md:p-16 rounded-[2.5rem] text-center md:text-right relative overflow-hidden animate-float">
          {/* Animated Glow Spot */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">High-End Lifestyle Store</span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic">
              EXPERIENCE
              <br />
              <span className="premium-gradient-text">LUXURY</span>
            </h1>

            <p className="text-slate-300 text-base md:text-xl leading-relaxed mb-10 max-w-xl md:mr-0 md:ml-auto opacity-80">
              קולקציית הפרימיום שלנו משלבת עיצוב נצחי עם פונקציונליות מודרנית. 
              מבחר מוצרים שנולדו לעורר השראה.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start flex-row-reverse">
              <Link href="/shop" className="group relative bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-amber-400 transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="relative z-10 flex items-center gap-3">
                  התחילו לקנות
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/shop?category=Collections" className="border border-white/10 text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                צפו בקולקציות
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
