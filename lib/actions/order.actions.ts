"use server";

import { connectToDB } from "@/lib/mongoose";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { revalidatePath } from "next/cache";
import { CreateOrderSchema } from "../validations";


const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

interface CreateOrderParams {
  userId: string;
  items: any[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    zipCode: string;
  };
}

export async function createOrder(params: CreateOrderParams) {
  try {
    await connectToDB();

    // Validate params
    const validatedData = CreateOrderSchema.parse(params);
    const { userId, items, totalAmount, shippingAddress } = validatedData;

    const newOrder = await Order.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      status: "Processing",
      paymentStatus: "Paid", // Simulating successful payment
    });


    // Clear the cart after successful order
    await Cart.findOneAndUpdate({ user: userId }, { items: [], cartTotal: 0, finalTotal: 0 });

    revalidatePath("/cart");
    revalidatePath("/profile");

    return { success: true, data: parseStringify(newOrder) };
  } catch (error: unknown) {
    console.error("Failed to create order", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    await connectToDB();
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return { success: true, data: parseStringify(orders) };
  } catch (error: unknown) {
    console.error("Failed to fetch orders", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    await connectToDB();
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    return { success: true, data: parseStringify(order) };
  } catch (error: unknown) {
    console.error("Failed to fetch order", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
