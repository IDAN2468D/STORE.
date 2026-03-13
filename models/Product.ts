import mongoose, { Schema, Document, Model } from "mongoose";

// Product interface — extended with categories, colors, sizes, gallery & sale fields
export interface IProduct extends Document {
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
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    salePrice: { type: Number },
    saleEndDate: { type: Date },
    stock: { type: Number, required: true, default: 10 },
    image: { type: String, required: true, default: "/placeholder.jpg" },
    gallery: [{ type: String }],
    category: { type: String, required: true, default: "uncategorized" },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for full-text search on name, description, and category
ProductSchema.index({ name: "text", description: "text", category: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
