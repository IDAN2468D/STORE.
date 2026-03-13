"use client";

import { useState, useTransition } from "react";
import { removeFromWishlist } from "@/lib/actions/wishlist.actions";
import { addToCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingCart, Trash2, Loader2, Star, Package,
} from "lucide-react";

interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

interface WishlistData {
  _id: string;
  products: WishlistProduct[];
}

interface WishlistClientProps {
  userId: string;
  initialWishlist: WishlistData | null;
}

export default function WishlistClient({ userId, initialWishlist }: WishlistClientProps) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const products = wishlist?.products || [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  const handleRemove = (productId: string) => {
    setLoadingId(productId);
    startTransition(async () => {
      await removeFromWishlist({ userId, productId, path: "/wishlist" });
      setWishlist((prev) => {
        if (!prev) return prev;
        return { ...prev, products: prev.products.filter((p) => p._id !== productId) };
      });
      setLoadingId(null);
    });
  };

  const handleMoveToCart = (product: WishlistProduct) => {
    setLoadingId(product._id);
    startTransition(async () => {
      await addToCart({ userId, productId: product._id, quantity: 1, path: "/wishlist" });
      await removeFromWishlist({ userId, productId: product._id, path: "/wishlist" });
      setWishlist((prev) => {
        if (!prev) return prev;
        return { ...prev, products: prev.products.filter((p) => p._id !== product._id) };
      });
      setAddedId(product._id);
      setTimeout(() => setAddedId(null), 2000);
      setLoadingId(null);
    });
  };

  // Empty state
  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-16">
        <h1 className="text-3xl md:text-4xl font-black mb-10">רשימת המשאלות שלי</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">רשימת המשאלות שלך ריקה</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            התחילו להוסיף מוצרים שאתם אוהבים לרשימה!
          </p>
          <Link
            href="/shop"
            className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            צפו במוצרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl md:text-4xl font-black">
          רשימת המשאלות שלי
          <span className="mr-3 bg-rose-500/10 text-rose-400 text-sm py-1 px-3 rounded-full font-bold">
            {products.length}
          </span>
        </h1>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => {
          const isLoading = loadingId === product._id;
          const isAdded = addedId === product._id;

          return (
            <div
              key={product._id}
              className={`bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group ${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {/* Image */}
              <Link href={`/product/${product._id}`}>
                <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </Link>

              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                    />
                  ))}
                  <span className="text-xs text-slate-600 ml-1">({product.reviewCount})</span>
                </div>

                {/* Name */}
                <Link href={`/product/${product._id}`}>
                  <h3 className="text-white font-semibold text-sm truncate hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-slate-600 mb-2">{product.category}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-white font-bold">{formatPrice(product.salePrice || product.price)}</span>
                  {product.salePrice && (
                    <span className="text-xs text-slate-500 line-through">{formatPrice(product.price)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={isPending || product.stock === 0}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-black hover:bg-amber-400"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isAdded ? (
                      "נוסף! ✓"
                    ) : (
                      <><ShoppingCart className="w-3.5 h-3.5" /> העברה לסל</>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={isPending}
                    className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
