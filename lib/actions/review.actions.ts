"use server";

import { connectToDB } from "@/lib/mongoose";
import Review from "@/models/Review";
import User from "@/models/User";
import Product from "@/models/Product";
import { isAdmin } from "./auth.actions";
import { revalidatePath } from "next/cache";

// Utility to serialize Mongoose documents to plain objects safely
const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

// === CREATE ===
export async function createReview(params: {
  userId: string;
  productId: string;
  text: string;
  rating: number;
  path: string;
}) {
  try {
    await connectToDB();

    const { userId, productId, text, rating, path } = params;

    const newReview = await Review.create({
      user: userId,
      product: productId,
      text,
      rating,
    });

    revalidatePath(path);
    return { success: true, data: parseStringify(newReview) };
  } catch (error: unknown) {
    console.error("Failed to create review", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === READ ===
export async function getReviewsByProduct(productId: string) {
  try {
    await connectToDB();

    const reviews = await Review.find({ product: productId })
      .populate({
        path: "user",
        model: User,
        select: "name email",
      })
      .sort({ createdAt: -1 });

    return { success: true, data: parseStringify(reviews) };
  } catch (error: unknown) {
    console.error("Failed to fetch product reviews", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === UPDATE ===
export async function updateReview(params: {
  reviewId: string;
  text: string;
  rating: number;
  path: string;
}) {
  try {
    await connectToDB();
    const { reviewId, text, rating, path } = params;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { text, rating },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedReview) {
      throw new Error("Review not found");
    }

    revalidatePath(path);
    return { success: true, data: parseStringify(updatedReview) };
  } catch (error: unknown) {
    console.error("Failed to update review", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === DELETE ===
export async function deleteReview(params: { reviewId: string; userId: string; path: string }) {
  try {
    await connectToDB();
    const { reviewId, userId, path } = params;

    const review = await Review.findById(reviewId);
    if (!review) throw new Error("ביקורת לא נמצאה");

    const authorized = (await isAdmin()) || review.user.toString() === userId;
    if (!authorized) throw new Error("אין לך הרשאה למחוק ביקורת זו");

    await Review.findByIdAndDelete(reviewId);

    revalidatePath(path);
    return { success: true, data: parseStringify({ id: reviewId }) };

  } catch (error: unknown) {
    console.error("Failed to delete review", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// === SEED DATABASE === (Development only to test the site)
export async function seedDemoData() {
  try {
    await connectToDB();

    // Create a dummy user
    let user = await User.findOne({ email: "demo@user.com" });
    if (!user) {
      user = await User.create({ name: "Demo User", email: "demo@user.com" });
    }

    // Create a dummy product
    let product = await Product.findOne({ name: "Awesome E-Commerce Widget" });
    if (!product) {
      product = await Product.create({
        name: "Awesome E-Commerce Widget",
        description: "This is a premium product you can review.",
      });
    }

    return { success: true, user: parseStringify(user), product: parseStringify(product) };
  } catch (error: unknown) {
    console.error("Seed failed", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
