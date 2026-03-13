import { getProductById, getRelatedProducts } from "@/lib/actions/store.actions";
import { getSessionUser } from "@/lib/actions/auth.actions";
import { isInWishlist } from "@/lib/actions/wishlist.actions";
import { getReviewsByProduct } from "@/lib/actions/review.actions";
import { getProductQuestions } from "@/lib/actions/question.actions";
import ProductDetailClient from "@/app/product/[id]/ProductDetailClient";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { getCart } from "@/lib/actions/cart.actions";
import { getWishlist } from "@/lib/actions/wishlist.actions";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const result = await getProductById(id);
  if (!result.success || !result.data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="bg-rose-500/10 text-rose-400 p-6 rounded-2xl max-w-lg border border-rose-500/30 text-center">
          <h2 className="text-2xl font-bold mb-2">מוצר לא נמצא</h2>
        </div>
      </main>
    );
  }

  const [relatedResult, wishlistCheck, reviewsResult, questionsResult, cartResult, wishlistResult] = await Promise.all([
    getRelatedProducts(id, result.data.category),
    isInWishlist(user._id, id),
    getReviewsByProduct(id),
    getProductQuestions(id),
    getCart(user._id),
    getWishlist(user._id)
  ]);

  return (
    <>
      <Navbar 
        user={user} 
        cartItemCount={cartResult.data?.items?.length || 0} 
        wishlistCount={wishlistResult.data?.products?.length || 0} 
      />
      <ProductDetailClient
        product={result.data}
        relatedProducts={relatedResult.data || []}
        user={user}
        isInWishlist={!!wishlistCheck.data}
        initialReviews={reviewsResult.data || []}
        initialQuestions={questionsResult.data || []}
      />
    </>
  );
}
