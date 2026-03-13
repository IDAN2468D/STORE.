"use client";

import { useState, useTransition } from "react";
import {
  updateCartItemQuantity,
  removeFromCart,
  toggleSaveForLater,
} from "@/lib/actions/cart.actions";
import { applyCoupon, removeCoupon } from "@/lib/actions/coupon.actions";
import {
  Trash2,
  Plus,
  Minus,
  Loader2,
  ShoppingBag,
  Bookmark,
  BookmarkCheck,
  Tag,
  Truck,
  ShieldCheck,
  ArrowRight,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Types for the Cart data coming from the server
interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  priceAtAddition: number;
  savedForLater: boolean;
}

interface CartData {
  _id: string;
  user: string;
  items: CartItem[];
  couponCode?: string;
  cartTotal: number;
  discountAmount: number;
  finalTotal: number;
}

interface CartPageClientProps {
  userId: string;
  initialCart: CartData | null;
}

export default function CartPageClient({ userId, initialCart }: CartPageClientProps) {
  const [cart, setCart] = useState<CartData | null>(initialCart);
  const [isPending, startTransition] = useTransition();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Active items (not saved for later)
  const activeItems = cart?.items.filter((item) => !item.savedForLater) || [];
  // Saved for later items
  const savedItems = cart?.items.filter((item) => item.savedForLater) || [];

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
    }).format(price);
  };

  // Handle quantity change
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    setLoadingItemId(item._id);
    startTransition(async () => {
      const result = await updateCartItemQuantity({
        userId,
        productId: item.product._id,
        quantity: newQuantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        path: "/cart",
      });
      if (result.success) setCart(result.data);
      setLoadingItemId(null);
    });
  };

  // Handle remove item
  const handleRemove = (item: CartItem) => {
    setLoadingItemId(item._id);
    startTransition(async () => {
      const result = await removeFromCart({
        userId,
        productId: item.product._id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        path: "/cart",
      });
      if (result.success) setCart(result.data);
      setLoadingItemId(null);
    });
  };

  // Handle save for later toggle
  const handleSaveForLater = (item: CartItem) => {
    setLoadingItemId(item._id);
    startTransition(async () => {
      const result = await toggleSaveForLater({
        userId,
        productId: item.product._id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        isSavedForLater: !item.savedForLater,
        path: "/cart",
      });
      if (result.success) setCart(result.data);
      setLoadingItemId(null);
    });
  };

  // Handle coupon
  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setCouponError("");
    startTransition(async () => {
      const result = await applyCoupon({ userId, code: couponCode, path: "/cart" });
      if (result.success) {
        setCart(result.data);
        setCouponCode("");
      } else {
        setCouponError(result.error || "שגיאה בהחלת הקופון");
      }
    });
  };

  const handleRemoveCoupon = () => {
    startTransition(async () => {
      const result = await removeCoupon({ userId, path: "/cart" });
      if (result.success) setCart(result.data);
    });
  };

  // Check if a specific item's price dropped since addition
  const getPriceDiff = (item: CartItem) => {
    if (!item.product) return 0;
    return item.priceAtAddition - item.product.price;
  };

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-slate-800/60 rounded-full flex items-center justify-center mb-6 border border-slate-700/50">
          <ShoppingBag className="w-12 h-12 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">סל הקניות שלך ריק</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          נראה שעדיין לא הוספת מוצרים לסל. התחילו לקנות כדי למלא אותו!
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <Package className="w-5 h-5" />
          צפו במוצרים
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Cart Items Section */}
      <div className="lg:col-span-8">
        {/* Active Cart Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">
              מוצרים בסל
              <span className="mr-2 bg-emerald-500/10 text-emerald-400 text-sm py-0.5 px-2.5 rounded-full font-bold">
                {activeItems.length}
              </span>
            </h2>
          </div>

          {activeItems.length === 0 && (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 text-center">
              <p className="text-slate-400">אין מוצרים פעילים בסל שלך.</p>
            </div>
          )}

          {activeItems.map((item) => {
            const priceDiff = getPriceDiff(item);
            const isLoading = loadingItemId === item._id;

            return (
              <div
                key={item._id}
                className={`bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/40 p-4 md:p-6 flex flex-col sm:flex-row gap-4 relative group overflow-hidden transition-all duration-300 hover:border-slate-600/60 ${
                  isLoading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500 opacity-30 group-hover:opacity-80 transition-opacity" />

                {/* Product Image */}
                <div className="w-full sm:w-28 h-28 bg-slate-900/60 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.product?.image || "/placeholder.jpg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg truncate">
                      {item.product?.name || "Unknown Product"}
                    </h3>

                    {/* Variants */}
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {item.selectedColor && (
                        <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                          צבע: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                          מידה: {item.selectedSize}
                        </span>
                      )}
                    </div>

                    {/* Price drop notification */}
                    {priceDiff > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-2.5 py-1 w-fit">
                        <Tag className="w-3 h-3" />
                        המחיר ירד ב-{formatPrice(priceDiff)} מאז שהוספת לסל!
                      </div>
                    )}
                    {priceDiff < 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-2.5 py-1 w-fit">
                        <Tag className="w-3 h-3" />
                        המחיר עלה ב-{formatPrice(Math.abs(priceDiff))} מאז ההוספה
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Price + Controls */}
                  <div className="flex items-end justify-between mt-4 gap-3 flex-wrap">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-slate-900/50 rounded-xl border border-slate-700/50 p-0.5">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        disabled={isLoading || item.quantity >= (item.product?.stock || 99)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-black text-white">
                        {formatPrice((item.product?.price || item.priceAtAddition) * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-500">
                          {formatPrice(item.product?.price || item.priceAtAddition)} ליחידה
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2 sm:gap-1 items-start sm:items-end justify-end">
                  <button
                    onClick={() => handleSaveForLater(item)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                    title="שמור לאחר כך"
                    disabled={isLoading}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="הסר מוצר"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Saved for Later Section */}
        {savedItems.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-amber-400" />
              שמור לאחר כך
              <span className="mr-2 bg-amber-500/10 text-amber-400 text-sm py-0.5 px-2.5 rounded-full font-bold">
                {savedItems.length}
              </span>
            </h2>

            <div className="space-y-3">
              {savedItems.map((item) => {
                const isLoading = loadingItemId === item._id;
                return (
                  <div
                    key={item._id}
                    className={`bg-slate-800/20 rounded-xl border border-slate-700/30 border-dashed p-4 flex items-center gap-4 transition-all ${
                      isLoading ? "opacity-60 pointer-events-none" : ""
                    }`}
                  >
                    {/* Small Image */}
                    <div className="w-14 h-14 bg-slate-900/40 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={item.product?.image || "/placeholder.jpg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">
                        {item.product?.name || "Unknown Product"}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        {formatPrice(item.product?.price || item.priceAtAddition)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveForLater(item)}
                        className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                        disabled={isLoading}
                      >
                        העברה לסל
                      </button>
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isLoading && (
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin absolute" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-4">
        <div className="sticky top-8 space-y-4">
          {/* Summary Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-6 shadow-2xl text-right">
            <h3 className="text-lg font-bold text-white mb-5">סיכום הזמנה</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>סכום ביניים ({activeItems.length} מוצרים)</span>
                <span>{formatPrice(cart?.cartTotal || 0)}</span>
              </div>

              {(cart?.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>הנחה</span>
                  <span>-{formatPrice(cart?.discountAmount || 0)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>משלוח</span>
                <span className="text-emerald-400 font-medium">חינם</span>
              </div>

              <div className="border-t border-slate-700/50 pt-3 mt-3">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>סה&quot;כ</span>
                  <span>{formatPrice(cart?.finalTotal || 0)}</span>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
               <p className="text-sm font-bold text-white mb-3">יש לכם קופון?</p>
               {cart?.couponCode ? (
                 <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                   <div className="flex items-center gap-2">
                     <Tag className="w-4 h-4 text-emerald-400" />
                     <span className="text-sm font-black text-emerald-400">{cart.couponCode}</span>
                   </div>
                   <button 
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                   >
                     הסר
                   </button>
                 </div>
               ) : (
                 <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="הזינו קוד..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all shadow-inner"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isPending || !couponCode}
                        className="bg-white hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-50"
                      >
                         {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "מימוש"}
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-400 font-bold mr-1">{couponError}</p>}
                 </div>
               )}
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 active:scale-[0.98]"
            >
              המשך לתשלום
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>תשלום מאובטח ומוצפן SSL</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>משלוח חינם על כל ההזמנות</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Tag className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>התחייבות למחיר הטוב ביותר</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
