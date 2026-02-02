"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Search,
  X,
  Loader2,
  Frown,
  CornerDownLeft,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { searchPosts } from "@/actions/searchActions";

// --- Skeleton Loader ---
const ResultSkeleton = () => (
  <div className="flex gap-4 p-3 rounded-xl border border-transparent bg-white/50 mb-2 animate-pulse">
    <div className="w-[60px] h-[60px] rounded-lg bg-muted/40 flex-shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-3 bg-muted/40 rounded w-2/3" />
      <div className="h-2 bg-muted/30 rounded w-full" />
    </div>
  </div>
);

const SearchOverlay = memo(({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("جستجو...");

  const searchInputRef = useRef(null);
  const observer = useRef();
  const containerRef = useRef(null);

  // --- 1. Robust Scroll Lock ---
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => searchInputRef.current?.focus(), 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // --- 2. Responsive Placeholder Logic ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setPlaceholderText("جستجو در مقالات (مثلا: چک، طلاق، قرارداد...)");
      } else {
        setPlaceholderText("جستجو...");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 3. Reliable ESC Key Listener ---
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // --- 4. Immediate Unlock on Navigation ---
  const handleLinkClick = () => {
    onClose();
  };

  // --- Search Logic ---
  const loadSearchResults = useCallback(async (query, pageNum) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const { posts: newPosts } = await searchPosts({ query, page: pageNum });
      setSearchResults((prev) =>
        pageNum === 1 ? newPosts : [...prev, ...newPosts],
      );
      setHasMore(newPosts.length === 20);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setIsLoading(false);
      setIsDebouncing(false);
    }
  }, []);

  // Debounce Logic
  useEffect(() => {
    if (!isOpen) return;
    if (searchQuery.trim().length > 1) {
      setIsDebouncing(true);
      setPage(1);
      setHasMore(true);
      const handler = setTimeout(() => {
        loadSearchResults(searchQuery, 1);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      setSearchResults([]);
      setIsDebouncing(false);
    }
  }, [searchQuery, isOpen, loadSearchResults]);

  // Pagination Logic
  useEffect(() => {
    if (page > 1 && isOpen) loadSearchResults(searchQuery, page);
  }, [page, isOpen, searchQuery, loadSearchResults]);

  // Infinite Scroll Observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4 transition-all duration-200 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[600px] bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 flex flex-col max-h-[80vh] overflow-hidden relative animate-in slide-in-from-top-4 duration-300 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header Section --- */}
        <div className="p-4 border-b border-muted/50 bg-white/50 backdrop-blur-md z-10">
          <div className="relative group flex items-center gap-3 bg-white border border-muted/60 rounded-xl px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/20 focus-within:shadow-lg focus-within:shadow-accent/5">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors shrink-0" />

            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholderText}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm md:text-base text-foreground placeholder:text-muted-foreground/50 h-6 p-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />

            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent shrink-0" />
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-muted rounded-full transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <div
                onClick={onClose}
                className="cursor-pointer p-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors shrink-0"
                title="بستن (ESC)"
              >
                <span className="text-[10px] font-bold">ESC</span>
              </div>
            )}
          </div>
        </div>

        {/* --- Results Body --- */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-gray-50/50 min-h-[250px]"
        >
          {/* 1. Empty State */}
          {searchQuery.length < 2 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-60">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 border border-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <p className="!text-sm font-bold text-foreground mb-1">
                جستجوی پیشرفته
              </p>
              <p className="!text-xs text-muted-foreground">
                عنوان مقاله یا کلمه کلیدی خود را وارد کنید.
              </p>
            </div>
          )}

          {/* 2. Loading State */}
          {(isLoading || isDebouncing) && page === 1 && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <ResultSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 3. Results List */}
          {!isDebouncing && searchResults.length > 0 && (
            <div className="space-y-2 pb-2">
              <div className="px-2 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    نتایج پیدا شده
                  </span>
                </div>
              </div>

              {searchResults.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  onClick={handleLinkClick}
                  ref={
                    index === searchResults.length - 1
                      ? lastPostElementRef
                      : null
                  }
                  className="group relative flex items-center gap-4 p-3 rounded-xl border border-transparent hover:bg-white hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 transition-all duration-200 overflow-hidden"
                >
                  {/* Hover Indicator */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-xl" />

                  {/* Thumbnail */}
                  <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden border border-muted/50 bg-muted">
                    <Image
                      src={`/${post.thumbnail}`}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="60px"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex justify-between items-start gap-2">
                      {/* 
                         تغییر اعمال شده: استفاده از !text-sm برای موبایل و md:!text-base برای دسکتاپ 
                         برای اطمینان از اورراید شدن سایز فونت بزرگ گلوبال
                      */}
                      <h3 className="!text-sm md:!text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1 leading-snug">
                        {post.title}
                      </h3>
                      <CornerDownLeft className="w-4 h-4 text-muted-foreground/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}

              {isLoading && page > 1 && (
                <div className="py-4 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              )}
            </div>
          )}

          {/* 4. Not Found */}
          {!isLoading &&
            !isDebouncing &&
            searchQuery.length >= 2 &&
            searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <Frown className="w-8 h-8 text-destructive/50" />
                </div>
                <h3 className="!text-sm !font-bold text-foreground mb-1">
                  یافت نشد
                </h3>
                <p className="!text-xs text-muted-foreground">
                  برای عبارت{" "}
                  <span className="text-destructive font-medium">
                    "{searchQuery}"
                  </span>{" "}
                  مقاله‌ای نداریم.
                </p>
              </div>
            )}
        </div>

        {/* --- Footer --- */}
        <div className="px-4 py-2.5 bg-white/50 border-t border-muted/30 backdrop-blur-md flex justify-between items-center text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            برای انتخاب <span className="font-bold text-accent">کلیک</span> کنید
          </span>
          <div className="flex items-center gap-2 opacity-70">
            <span className="hidden sm:inline">مشاهده مقاله</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
});

SearchOverlay.displayName = "SearchOverlay";

export default SearchOverlay;
