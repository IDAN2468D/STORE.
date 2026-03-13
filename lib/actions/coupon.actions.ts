"use server";

import { connectToDB } from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import Cart from "@/models/Cart";
import { revalidatePath } from "next/cache";

const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

export async function applyCoupon(params: { userId: string; code: string; path: string }) {
  try {
    await connectToDB();
    const { userId, code, path } = params;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return { success: false, error: "קופון לא תקף או פג תוקף" };
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { success: false, error: "הקופון פג תוקף" };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, error: "קופון זה הגיע למכסת השימושים המקסימלית" };
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return { success: false, error: "סל קניות לא נמצא" };
    }

    if (coupon.minOrderAmount && cart.cartTotal < coupon.minOrderAmount) {
      return { success: false, error: `על סכום ההזמנה להיות לפחות ${coupon.minOrderAmount} ₪ לשימוש בקופון זה` };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cart.cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    cart.couponCode = coupon.code;
    cart.discountAmount = discountAmount;
    cart.calculateTotals();
    await cart.save();

    revalidatePath(path);
    return { success: true, data: parseStringify(cart) };
  } catch (error: any) {
    console.error("Failed to apply coupon", error);
    return { success: false, error: error.message || "שגיאה בהחלת הקופון" };
  }
}

export async function removeCoupon(params: { userId: string; path: string }) {
  try {
    await connectToDB();
    const { userId, path } = params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return { success: false, error: "סל קניות לא נמצא" };

    cart.couponCode = undefined;
    cart.discountAmount = 0;
    cart.calculateTotals();
    await cart.save();

    revalidatePath(path);
    return { success: true, data: parseStringify(cart) };
  } catch (error: any) {
    console.error("Failed to remove coupon", error);
    return { success: false, error: error.message || "שגיאה בהסרת הקופון" };
  }
}
