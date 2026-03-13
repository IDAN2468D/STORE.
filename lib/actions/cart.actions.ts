"use server";

import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongoose";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { AddToCartSchema } from "../validations";


// Utility to serialize Mongoose documents to plain objects safely
const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// === 1. GET CART ===
export async function getCart(userId: string) {
  try {
    await connectToDB();

    // Use findOneAndUpdate with upsert to handle race conditions atomically
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true, returnDocument: "after", runValidators: true }
    ).populate({

      path: "items.product",
      model: Product,
      select: "name price image stock",
    });


    return { success: true, data: parseStringify(cart) };
  } catch (error: unknown) {
    console.error("Failed to fetch cart", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === 2. ADD TO CART ===
export async function addToCart(params: any) {
  try {
    await connectToDB();

    // Validate params
    const validatedData = AddToCartSchema.parse(params);
    const { userId, productId, quantity, selectedColor, selectedSize, path } = validatedData;


    // Fetch the product to get its current price
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    // Get or create the user's cart atomically
    let cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true, returnDocument: "after", runValidators: true }
    );



    // Check if the item is already in the cart (matching product, color, and size)
    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // If it exists, but was saved for later, bring it back to active cart
      if (cart.items[existingItemIndex].savedForLater) {
        cart.items[existingItemIndex].savedForLater = false;
        // Optionally update the price to current if it was a long time
        cart.items[existingItemIndex].priceAtAddition = product.price;
      }
      
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        selectedColor,
        selectedSize,
        priceAtAddition: product.price,
        savedForLater: false,
      });
    }

    // Calculate totals and save
    cart.calculateTotals();
    await cart.save();

    revalidatePath(path);
    return { success: true, data: parseStringify(cart) };
  } catch (error: unknown) {
    console.error("Failed to add to cart", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === 3. UPDATE QUANTITY ===
export async function updateCartItemQuantity(params: {
  userId: string;
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  path: string;
}) {
  try {
    await connectToDB();
    const { userId, productId, quantity, selectedColor, selectedSize, path } = params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      
      cart.calculateTotals();
      await cart.save();
      revalidatePath(path);
      return { success: true, data: parseStringify(cart) };
    } else {
      throw new Error("Item not found in cart");
    }
  } catch (error: unknown) {
    console.error("Failed to update cart quantity", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === 4. REMOVE FROM CART ===
export async function removeFromCart(params: {
  userId: string;
  productId: string;
  selectedColor?: string;
  selectedSize?: string;
  path: string;
}) {
  try {
    await connectToDB();
    const { userId, productId, selectedColor, selectedSize, path } = params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (item) => 
        !(item.product.toString() === productId && 
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize)
    );

    cart.calculateTotals();
    await cart.save();
    revalidatePath(path);
    return { success: true, data: parseStringify(cart) };
  } catch (error: unknown) {
    console.error("Failed to remove from cart", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === 5. TOGGLE SAVE FOR LATER ===
export async function toggleSaveForLater(params: {
  userId: string;
  productId: string;
  selectedColor?: string;
  selectedSize?: string;
  isSavedForLater: boolean;
  path: string;
}) {
  try {
    await connectToDB();
    const { userId, productId, selectedColor, selectedSize, isSavedForLater, path } = params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].savedForLater = isSavedForLater;
      cart.calculateTotals();
      await cart.save();
      revalidatePath(path);
      return { success: true, data: parseStringify(cart) };
    } else {
      throw new Error("Item not found in cart");
    }
  } catch (error: unknown) {
    console.error("Failed to toggle save for later", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
