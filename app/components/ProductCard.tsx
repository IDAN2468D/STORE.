"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/lib/actions/cart.actions";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist.actions";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";


interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  userId: string;
  initialWishlisted?: boolean;
}

export default function ProductCard({ product, userId, initialWishlisted = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await addToCart({
        userId,
        productId: product._id,
        quantity: 1,
        path: "/",
      });
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      if (isWishlisted) {
        await removeFromWishlist({ userId, productId: product._id, path: "/" });
      } else {
        await addToWishlist({ userId, productId: product._id, path: "/" });
      }
      setIsWishlisted(!isWishlisted);
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link
        href={`/product/${product._id}`}
        className="group relative glass-card rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 glow-hover block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-end justify-center pb-6 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={isPending || added}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-xl ${
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-black hover:bg-amber-400 hover:text-black"
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : added ? (
                "נוסף לסל ✓"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  הוספה לסל
                </>
              )}
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10 group/wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isWishlisted ? "fill-rose-500 text-rose-500 scale-110" : "text-white group-hover/wishlist:text-rose-400"
              }`}
            />
          </button>

          {/* Stock Badge */}
          {product.stock < 15 && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
              מלאי נמוך
            </span>
          )}

          {/* Sale Badge */}
          {product.salePrice && (
            <span className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
              מבצע
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 md:p-5">
          {/* Category */}
          {product.category && (
            <p className="text-amber-400/60 text-[10px] uppercase tracking-widest font-semibold mb-1">{product.category}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
            <span className="text-slate-500 text-xs ml-1">({reviewCount})</span>
          </div>

          {/* Name */}
          <h3 className="text-white font-semibold text-sm md:text-base leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-1 text-right">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-lg">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="text-slate-500 text-xs line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-emerald-400 text-xs font-medium">במלאי</span>
            ) : (
              <span className="text-rose-400 text-xs font-medium">אזל מהמלאי</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );

}
