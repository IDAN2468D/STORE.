export interface IProduct {
  _id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  saleEndDate?: Date;
  stock: number;
  image: string;
  gallery: string[];
  category: string;
  colors: string[];
  sizes: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}


export interface IReview {
  _id: string;
  user: IUser | string;
  product: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  priceAtAddition: number;
  savedForLater: boolean;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  cartTotal: number;
  discountAmount: number;
  finalTotal: number;
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
}

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface IQuestion {
  _id: string;
  user: IUser | string;
  product: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
}
