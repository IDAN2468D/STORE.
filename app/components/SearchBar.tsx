"use client";

import { useState, useEffect, useRef } from "react";
import { getSearchSuggestions } from "@/lib/actions/store.actions";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Suggestion {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      const result = await getSearchSuggestions(query);
      if (result.success) {
        setSuggestions(result.data || []);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="חיפוש מוצרים..."
          className="w-full bg-white/5 border border-white/10 rounded-full pr-10 pl-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all text-right"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <span className="text-sm font-bold text-amber-400">{formatPrice(item.price)}</span>
                </Link>
              ))}
              {/* View All */}
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block text-center py-3 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/5 transition-colors font-medium"
              >
                צפו בכל התוצאות עבור &quot;{query}&quot;
              </Link>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-slate-500 text-sm">לא נמצאו מוצרים עבור &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
