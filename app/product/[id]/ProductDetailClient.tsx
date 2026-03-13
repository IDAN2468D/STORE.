"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/actions/cart.actions";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist.actions";
import {
  ShoppingCart, Heart, Star, Minus, Plus, Check, Loader2,
  ChevronRight, Truck, ShieldCheck, RotateCcw, Package,
} from "lucide-react";
import { IProduct, IReview, IUser, IQuestion } from "@/types";
import ReviewSection from "@/app/components/ReviewSection";
import QuestionSection from "@/app/components/QuestionSection";
import ProductCard from "@/app/components/ProductCard";
import { motion } from "framer-motion";

interface ProductDetailClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
  user: IUser | null;
  initialReviews: IReview[];
  isInWishlist: boolean;
  initialQuestions: IQuestion[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  user,
  initialReviews,
  isInWishlist,
  initialQuestions,
}: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "qa">("desc");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(isInWishlist);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  const handleAddToCart = () => {
    if (!user) return;
    startTransition(async () => {
      const result = await addToCart({
        userId: user._id,
        productId: product._id,
        quantity,
        selectedColor: selectedColor || undefined,
        selectedSize: selectedSize || undefined,
        path: `/product/${product._id}`,
      });
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      }
    });
  };

  const handleWishlist = () => {
    if (!user) return;
    startTransition(async () => {
      if (wishlisted) {
        await removeFromWishlist({ userId: user._id, productId: product._id, path: `/product/${product._id}` });
      } else {
        await addToWishlist({ userId: user._id, productId: product._id, path: `/product/${product._id}` });
      }
      setWishlisted(!wishlisted);
    });
  };

  const allImages = product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">בית</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href="/shop" className="hover:text-white transition-colors">חנות</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#f5f5f5] rounded-3xl overflow-hidden shadow-2xl shadow-white/5">
              <Image src={allImages[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all relative flex-shrink-0 ${selectedImage === idx ? "border-amber-400" : "border-white/10 hover:border-white/30"}`}>
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3 italic">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                ))}
              </div>
              <span className="text-sm text-slate-400">{product.rating}</span>
              <span className="text-sm text-slate-600">({product.reviewCount} ביקורות)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black">{formatPrice(product.salePrice || product.price)}</span>
              {product.salePrice && <span className="text-lg text-slate-500 line-through">{formatPrice(product.price)}</span>}
            </div>

            <p className="text-slate-400 leading-relaxed mb-8">{product.description}</p>

            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">צבע: <span className="text-slate-400 font-normal">{selectedColor}</span></p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedColor === color ? "border-amber-400 bg-amber-500/10 text-amber-400" : "border-white/10 text-slate-400 hover:border-white/30"}`}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">מידה: <span className="text-slate-400 font-normal">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-[60px] px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${selectedSize === size ? "border-amber-400 bg-amber-500/10 text-amber-400" : "border-white/10 text-slate-400 hover:border-white/30"}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
              </div>

              <button onClick={handleAddToCart} disabled={isPending || product.stock === 0} className={`flex-1 py-3.5 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-[0.98] ${added ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-amber-400"}`}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : added ? <><Check className="w-5 h-5" /> נוסף لسל</> : <><ShoppingCart className="w-5 h-5" /> הוספה לסל</>}
              </button>

              <button onClick={handleWishlist} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${wishlisted ? "border-rose-500 bg-rose-500/10 text-rose-400" : "border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"}`}>
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-400" : ""}`} />
              </button>
            </div>

            <div className="space-y-2.5 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2.5 text-sm">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className={product.stock > 0 ? "text-emerald-400" : "text-rose-400"}>{product.stock > 0 ? `במלאי (${product.stock} יחידות זמינות)` : "אזל מהמלאי"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400"><Truck className="w-4 h-4 text-amber-400" />משלוח חינם</div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400"><ShieldCheck className="w-4 h-4 text-amber-400" />תשלום מאובטח</div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-white/5 pt-10">
          <div className="flex border-b border-white/5 mb-8 overflow-x-auto scrollbar-none">
            {[
              { id: "desc", label: "תיאור" },
              { id: "specs", label: "מפרט טכני" },
              { id: "reviews", label: `ביקורות (${initialReviews.length})` },
              { id: "qa", label: "שאלות ותשובות" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 px-6 text-sm font-bold transition-all relative flex-shrink-0 ${activeTab === tab.id ? "text-amber-400" : "text-slate-500 hover:text-white"}`}>
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-full" />}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === "desc" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl prose prose-invert">
                <p className="text-slate-300 leading-relaxed text-lg">{product.longDescription || product.description}</p>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-slate-500 text-sm">{key}</span>
                    <span className="text-white font-bold text-sm">{value as string}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ReviewSection productId={product._id} user={user} initialReviews={initialReviews} />
              </motion.div>
            )}

            {activeTab === "qa" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <QuestionSection productId={product._id} user={user} initialQuestions={initialQuestions} />
              </motion.div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-white/5 pt-10">
            <h2 className="text-2xl font-black mb-8 italic">אולי תאהבו גם</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p: IProduct) => (
                <ProductCard key={p._id} product={p} userId={user?._id || ""} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
