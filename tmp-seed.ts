import { connectToDB } from "./lib/mongoose";
import Coupon from "./models/Coupon";
import Order from "./models/Order";
import User from "./models/User";
import Product from "./models/Product";
import mongoose from "mongoose";

async function main() {
  await connectToDB();

  // 1. Seed Coupons
  const coupons = [
    {
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      expiryDate: new Date("2026-12-31"),
      isActive: true,
    }
  ];
  for (const c of coupons) {
    await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
  }

  // 2. Seed a dummy Paid Order for analytics
  const user = await User.findOne();
  const product = await Product.findOne();
  
  if (user && product) {
    await Order.create({
      user: user._id,
      items: [
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1
        }
      ],
      totalAmount: product.price,
      shippingAddress: {
        fullName: "QA Tester",
        email: "test@qa.com",
        phone: "123456789",
        street: "QA St",
        city: "QA City",
        zipCode: "12345"
      },
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod: "Credit Card"
    });
  }

  console.log("Seed complete");
  process.exit(0);
}

main();
