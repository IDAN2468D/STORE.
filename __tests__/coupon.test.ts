import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyCoupon } from "../lib/actions/coupon.actions";
import Coupon from "../models/Coupon";
import Cart from "../models/Cart";

// Mocking dependencies
vi.mock("../lib/mongoose", () => ({
  connectToDB: vi.fn(),
}));

vi.mock("../models/Coupon", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("../models/Cart", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("applyCoupon Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if coupon does not exist", async () => {
    (Coupon.findOne as any).mockResolvedValue(null);

    const result = await applyCoupon({ userId: "123", code: "INVALID", path: "/cart" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("קופון לא תקף או פג תוקף");
  });

  it("should return error if coupon is expired", async () => {
    (Coupon.findOne as any).mockResolvedValue({
      code: "EXPIRED",
      isActive: true,
      expiryDate: new Date("2020-01-01"),
    });

    const result = await applyCoupon({ userId: "123", code: "EXPIRED", path: "/cart" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("הקופון פג תוקף");
  });

  it("should apply percentage discount correctly", async () => {
    (Coupon.findOne as any).mockResolvedValue({
      code: "SAVE10",
      isActive: true,
      expiryDate: new Date("2028-01-01"),
      discountType: "percentage",
      discountValue: 10,
    });

    const mockCart = {
      cartTotal: 100,
      save: vi.fn(),
      calculateTotals: vi.fn(),
    };
    (Cart.findOne as any).mockResolvedValue(mockCart);

    const result = await applyCoupon({ userId: "123", code: "SAVE10", path: "/cart" });

    expect(result.success).toBe(true);
    expect(mockCart.discountAmount).toBe(10);
  });
});
