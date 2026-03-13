"use server";

import React from "react";
import { getSessionUser } from "@/lib/actions/auth.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import Navbar from "../components/Navbar";
import { getCart } from "@/lib/actions/cart.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";
import { redirect } from "next/navigation";
import ProfileClient from "../components/ProfileClient";


export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await getOrdersByUser(user._id);
  const cartResult = await getCart(user._id);
  const cartCount = cartResult.data?.items?.length || 0;
  const wishlistResult = await getWishlist(user._id);
  const wishlistCount = wishlistResult.data?.products?.length || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      <Navbar user={user} cartItemCount={cartCount} wishlistCount={wishlistCount} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <ProfileClient 
          user={JSON.parse(JSON.stringify(user))} 
          orders={orders ? JSON.parse(JSON.stringify(orders)) : []} 
          wishlistCount={wishlistCount}
        />
      </div>
    </main>
  );
}
