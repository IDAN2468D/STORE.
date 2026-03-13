"use server";

import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongoose";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

// Utility to serialize Mongoose documents to plain objects safely
const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// === GET WISHLIST ===
export async function getWishlist(userId: string) {
  try {
    await connectToDB();
    // Use findOneAndUpdate with upsert to handle race conditions atomically
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, products: [] } },
      { upsert: true, returnDocument: "after", runValidators: true }
    ).populate({

      path: "products",
      model: Product,
      select: "name price image category rating reviewCount stock salePrice",
    });


    return { success: true, data: parseStringify(wishlist) };
  } catch (error: unknown) {
    console.error("Failed to fetch wishlist", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === ADD TO WISHLIST ===
export async function addToWishlist(params: {
  userId: string;
  productId: string;
  path: string;
}) {
  try {
    await connectToDB();
    const { userId, productId, path } = params;

    // Get or create the user's wishlist atomically
    let wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, products: [] } },
      { upsert: true, returnDocument: "after", runValidators: true }
    );



    // Check if already in wishlist
    const productObjId = new mongoose.Types.ObjectId(productId);
    const alreadyExists = wishlist.products.some(
      (p: mongoose.Types.ObjectId) => p.toString() === productId
    );

    if (!alreadyExists) {
      wishlist.products.push(productObjId);
      await wishlist.save();
    }

    revalidatePath(path);
    return { success: true, data: parseStringify(wishlist) };
  } catch (error: unknown) {
    console.error("Failed to add to wishlist", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === REMOVE FROM WISHLIST ===
export async function removeFromWishlist(params: {
  userId: string;
  productId: string;
  path: string;
}) {
  try {
    await connectToDB();
    const { userId, productId, path } = params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new Error("Wishlist not found");

    wishlist.products = wishlist.products.filter(
      (p: mongoose.Types.ObjectId) => p.toString() !== productId
    );
    await wishlist.save();

    revalidatePath(path);
    return { success: true, data: parseStringify(wishlist) };
  } catch (error: unknown) {
    console.error("Failed to remove from wishlist", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === CHECK IF PRODUCT IS IN WISHLIST ===
export async function isInWishlist(userId: string, productId: string) {
  try {
    await connectToDB();
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return { success: true, data: false };

    const exists = wishlist.products.some(
      (p: mongoose.Types.ObjectId) => p.toString() === productId
    );
    return { success: true, data: exists };
  } catch (error: unknown) {
    console.error("Failed to check wishlist", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
