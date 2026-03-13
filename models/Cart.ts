import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  priceAtAddition: number;
  savedForLater: boolean;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  cartTotal: number;
  discountAmount: number;
  finalTotal: number;
  createdAt: Date;
  updatedAt: Date;
  calculateTotals(): void;
}

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
  selectedColor: { type: String },
  selectedSize: { type: String },
  priceAtAddition: { 
    type: Number, 
    required: true,
    description: "To track price drops or increases since item was added" 
  },
  savedForLater: {
    type: Boolean,
    default: false,
  }
});

const CartSchema: Schema<ICart> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user gets exactly 1 active cart
    },
    items: [CartItemSchema],
    couponCode: {
      type: String,
      trim: true,
    },
    cartTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    finalTotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt
  }
);

// Static method to calculate totals before saving
CartSchema.methods.calculateTotals = function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = this as any;
  if (!doc.items || doc.items.length === 0) {
    doc.cartTotal = 0;
    doc.finalTotal = 0;
    return;
  }

  // Calculate cartTotal based only on items NOT saved for later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeItems = doc.items.filter((item: any) => !item.savedForLater);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.cartTotal = activeItems.reduce((total: number, item: any) => {
    return total + (item.priceAtAddition * item.quantity);
  }, 0);

  // Apply discount
  doc.finalTotal = doc.cartTotal - (doc.discountAmount || 0);
};

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
