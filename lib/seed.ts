import { connectToDB } from "./mongoose";
import Coupon from "../models/Coupon";

export async function seedCoupons() {
  try {
    await connectToDB();
    
    const coupons = [
      {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: 10,
        expiryDate: new Date("2026-12-31"),
        isActive: true,
      },
      {
        code: "FIXED50",
        discountType: "fixed",
        discountValue: 50,
        minOrderAmount: 200,
        expiryDate: new Date("2026-12-31"),
        isActive: true,
      }
    ];

    for (const coupon of coupons) {
        await Coupon.findOneAndUpdate({ code: coupon.code }, coupon, { upsert: true });
    }

    console.log("Coupons seeded successfully");
  } catch (error) {
    console.error("Failed to seed coupons", error);
  }
}
