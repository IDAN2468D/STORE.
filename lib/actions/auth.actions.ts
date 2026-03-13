"use server";

import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { RegisterSchema, LoginSchema } from "../validations";
import { revalidatePath } from "next/cache";

const getSecret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "default_secret_for_dev_only_change_in_production");

const parseStringify = (value: unknown) => JSON.parse(JSON.stringify(value));

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}


// === REGISTER ===
export async function register(params: any) {
  try {
    await connectToDB();
    const validatedData = RegisterSchema.parse(params);
    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: "משתמש עם אימייל זה כבר קיים" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create session
    const sessionPayload = { userId: newUser._id.toString(), email: newUser.email, name: newUser.name };
    const session = await encrypt(sessionPayload);

    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: "/",
    });

    return { success: true, data: parseStringify(newUser) };
  } catch (error: any) {
    console.error("Registration failed", error);
    return { success: false, error: error?.message || "הרשמה נכשלה" };
  }
}

// === LOGIN ===
export async function login(params: any) {
  try {
    await connectToDB();
    const validatedData = LoginSchema.parse(params);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return { success: false, error: "אימייל או סיסמה לא נכונים" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { success: false, error: "אימייל או סיסמה לא נכונים" };
    }

    // Create session
    const sessionPayload = { userId: user._id.toString(), email: user.email, name: user.name };
    const session = await encrypt(sessionPayload);

    (await cookies()).set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      path: "/",
    });

    return { success: true, data: parseStringify(user) };
  } catch (error: any) {
    console.error("Login failed", error);
    return { success: false, error: error?.message || "התחברות נכשלה" };
  }
}

// === LOGOUT ===
export async function logout() {
  (await cookies()).delete("session");
  revalidatePath("/");
  return { success: true };
}

// === GET SESSION ===
export async function getSessionUser() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const decoded = await decrypt(session);
  if (!decoded) return null;

  try {
    await connectToDB();
    const user = await User.findById(decoded.userId).select("-password");
    return user ? parseStringify(user) : null;
  } catch (error) {
    return null;
  }
}
