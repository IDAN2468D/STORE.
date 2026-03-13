"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/lib/actions/store.actions";
import ProductCard from "@/app/components/ProductCard";
import { SlidersHorizontal, X, ChevronDown, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: string[];
  userId: string;
  wishlistedProductIds: string[];
  initialCategory?: string;
  initialSort?: string;
  initialSearch?: string;
}

export default function ShopClient({
  initialProducts,
  categories,
  userId,
  wishlistedProductIds,
  initialCategory,
  initialSort,
  initialSearch,
}: ShopClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState(initialCategory || "All");
  const [sortBy, setSortBy] = useState(initialSort || "newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sortOptions = [
    { value: "newest", label: "הכי חדש" },
    { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
    { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
    { value: "rating", label: "דירוג גבוה" },
    { value: "name", label: "שם: א-ת" },
  ];

  // Apply filters
  const applyFilters = (cat?: string, sort?: string) => {
    const selectedCat = cat !== undefined ? cat : activeCategory;
    const selectedSort = sort !== undefined ? sort : sortBy;

    startTransition(async () => {
      const result = await getAllProducts({
        category: selectedCat === "All" ? undefined : selectedCat,
        sortBy: selectedSort,
        search: initialSearch,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
      });
      if (result.success) setProducts(result.data);
    });

    // Update URL
    const params = new URLSearchParams();
    if (selectedCat && selectedCat !== "All") params.set("category", selectedCat);
    if (selectedSort && selectedSort !== "newest") params.set("sort", selectedSort);
    if (initialSearch) params.set("q", initialSearch);
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    applyFilters(cat);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    applyFilters(undefined, sort);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black">
          {initialSearch ? (
            <>תוצאות עבור <span className="text-amber-400">&quot;{initialSearch}&quot;</span></>
          ) : activeCategory !== "All" ? (
            activeCategory
          ) : (
            "כל המוצרים"
          )}
        </h1>
        <p className="text-slate-500 mt-1">נמצאו {products.length} מוצרים</p>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        {/* Categories (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "All"
                ? "bg-white text-black"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            הכל
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-white text-black"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-slate-300"
        >
          <SlidersHorizontal className="w-4 h-4" />
          מסננים
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="md:hidden bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold">מסננים</h3>
            <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div>
            <p className="text-sm text-slate-400 mb-2">קטגוריה</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === "All" ? "bg-amber-500 text-black" : "bg-white/5 text-slate-400"
                }`}
              >
                הכל
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat ? "bg-amber-500 text-black" : "bg-white/5 text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-sm text-slate-400 mb-2">טווח מחירים</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="מינימום"
              />
              <span className="text-slate-600">—</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="מקסימום"
              />
              <button
                onClick={() => applyFilters()}
                className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-bold"
              >
                סנן
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((product: Product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              userId={userId} 
              initialWishlisted={wishlistedProductIds.includes(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">לא נמצאו מוצרים</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            נסו לשנות את המסננים או את מילות החיפוש.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setPriceRange([0, 500]);
              applyFilters("All", "newest");
            }}
            className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium"
          >
            נקה הכל
          </button>
        </div>
      )}
    </div>
  );
}
