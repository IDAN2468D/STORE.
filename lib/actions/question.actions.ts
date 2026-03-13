"use server";

import { connectToDB } from "@/lib/mongoose";
import Question from "@/models/Question";
import User from "@/models/User";
import { isAdmin } from "./auth.actions";
import { revalidatePath } from "next/cache";


const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

export async function askQuestion(params: { userId: string; productId: string; question: string; path: string }) {
  try {
    await connectToDB();
    const { userId, productId, question, path } = params;

    const newQuestion = await Question.create({
      user: userId,
      product: productId,
      question,
    });

    revalidatePath(path);
    return { success: true, data: parseStringify(newQuestion) };
  } catch (error: any) {
    console.error("Failed to ask question", error);
    return { success: false, error: error.message || "שגיאה בשליחת השאלה" };
  }
}

export async function getProductQuestions(productId: string) {
  try {
    await connectToDB();
    const questions = await Question.find({ product: productId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    return { success: true, data: parseStringify(questions) };
  } catch (error: any) {
    console.error("Failed to fetch questions", error);
    return { success: false, error: error.message || "שגיאה בטעינת השאלות" };
  }
}

export async function answerQuestion(params: { questionId: string; answer: string; path: string }) {
  try {
    const authorized = await isAdmin();
    if (!authorized) throw new Error("רק מנהל יכול לענות על שאלות");
    
    await connectToDB();

    const { questionId, answer, path } = params;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer, isAnswered: true },
      { new: true }
    );

    revalidatePath(path);
    return { success: true, data: parseStringify(updatedQuestion) };
  } catch (error: any) {
    console.error("Failed to answer question", error);
    return { success: false, error: error.message || "שגיאה בשליחת התשובה" };
  }
}
