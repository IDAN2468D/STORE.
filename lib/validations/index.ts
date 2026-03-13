import { z } from "zod";

// Shipping Address Schema
export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  street: z.string().min(3, "כתובת לא תקינה"),
  city: z.string().min(2, "עיר לא תקינה"),
  zipCode: z.string().min(5, "מיקוד לא תקין"),
});

// Order Item Schema
export const OrderItemSchema = z.object({
  product: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
});

// Create Order Schema
export const CreateOrderSchema = z.object({
  userId: z.string(),
  items: z.array(OrderItemSchema).min(1, "ההזמנה חייבת להכיל לפחות פריט אחד"),
  totalAmount: z.number().nonnegative(),
  shippingAddress: ShippingAddressSchema,
});

// Add to Cart Schema
export const AddToCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
  path: z.string(),
});

// Auth Schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

export const LoginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "יש להזין סיסמה"),
});

