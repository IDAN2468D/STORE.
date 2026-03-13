"use server";

import { connectToDB } from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { isAdmin } from "./auth.actions";


const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

export async function getAdminStats() {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return { success: false, error: "גישה נדחתה: חסרות הרשאות מנהל" };
    }
    await connectToDB();


    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Total Revenue
    const revenueStats = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueStats[0]?.total || 0;

    // Daily Revenue (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: "Paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Sales by Category
    const salesByCategory = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Top Products (by actual sales quantity)
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          image: { $first: "$items.image" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Recent Orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(8);

    return {
      success: true,
      data: parseStringify({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        recentOrders,
        topProducts,
        dailyRevenue,
        salesByCategory,
      }),
    };
  } catch (error: unknown) {
    console.error("Failed to fetch admin stats", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
