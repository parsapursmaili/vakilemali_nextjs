"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Menu,
  Search,
  Phone,
  X,
  Sparkles,
  LoaderCircle,
  ArrowLeft,
  SearchX,
} from "lucide-react";
import { searchPosts } from "@/actions/searchActions";

// --- Utility Components ---

const NavLink = memo(({ href, children, className = "" }) => (
  <Link
    href={href}
    className={`text-foreground text-base font-semibold hover:text-accent transition-colors py-2 lg:py-0 block lg:inline relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all after:duration-300 ${className}`}
  >
    {children}
  </Link>
));
NavLink.displayName = "NavLink";

const TopBar = memo(() => (
  <div className="line-h w-full bg-primary text-background/90 py-2 px-4 text-center border-b border-primary-light/30 flex items-center justify-center">
    <p className="font-light tracking-wide text-xs md:text-sm !mb-[-2px] leading-none">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَيْلٌ لِلْمُطَفِّفِينَ •
      الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ • وَإِذَا
      كَالُوهُمْ أَوْ وَزَنُوهُمْ يُخْسِرُونَ • أَلَا يَظُنّّ أُولَٰئِكَ
      أَنَّهُمْ مَبْعُوثُونَ
    </p>
  </div>
));
TopBar.displayName = "TopBar";

// --- Mobile Menu Component (Isolated) ---

const MobileMenu = memo(({ isOpen, onClose }) => {
  // Lock body scroll only when this specific menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!document.body.classList.contains("search-open")) {
      // Check to ensure we don't unlock if search is open (rare edge case)
      document.body.style.overflow = "auto";
    }
    return () => {
      // Cleanup carefully
      if (!document.body.classList.contains("search-open")) {
        document.body.style.overflow = "auto";
      }
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl transition-all duration-300 flex flex-col ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="flex justify-between items-center p-6 border-b border-muted/30">
        <h3 className="text-xl font-bold text-primary">منوی دسترسی</h3>
        <button
          onClick={onClose}
          className="p-2 border border-input-border text-foreground rounded-full hover:bg-muted transition-colors bg-background shadow-sm"
          aria-label="بستن منو"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow gap-8 p-6 overflow-y-auto">
        <nav className="flex flex-col items-center gap-6 w-full max-w-xs">
          <Link
            href="/"
            onClick={onClose}
            className="text-2xl font-bold text-foreground hover:text-accent transition-all hover:scale-105"
          >
            صفحه اصلی
          </Link>
          <Link
            href="/articles"
            onClick={onClose}
            className="text-2xl font-bold text-foreground hover:text-accent transition-all hover:scale-105"
          >
            مقالات
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="text-2xl font-bold text-foreground hover:text-accent transition-all hover:scale-105"
          >
            تماس با ما
          </Link>
          <Link
            href="/about-us"
            onClick={onClose}
            className="text-2xl font-bold text-foreground hover:text-accent transition-all hover:scale-105"
          >
            درباره ما
          </Link>
        </nav>

        <div className="mt-8 w-full max-w-xs border-t border-muted/50 pt-8 flex flex-col items-center">
          <p className="text-base font-medium mb-4 text-primary text-center">
            مشاوره فوری
          </p>
          <a
            href="tel:09002450090"
            className="flex items-center justify-center gap-3 py-4 px-6 bg-accent text-primary w-full shadow-lg rounded-full font-semibold transition-transform hover:scale-105"
          >
            <Phone className="h-5 w-5" />
            <span className="text-xl font-extrabold tracking-wider !text-black/60">
              0900 245 0090
            </span>
          </a>
          <p className="text-sm text-foreground/70 mt-4 text-center">
            (امکان ارسال پیام در ایتا و تلگرام)
          </p>
        </div>
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

// --- Search Overlay Component (Isolated & Optimized) ---

const SearchOverlay = memo(({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const searchInputRef = useRef(null);
  const observer = useRef();

  // Scroll Lock for Search
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("search-open");
      // Focus input
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "auto";
      document.body.classList.remove("search-open");
      searchInputRef.current?.blur();
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("search-open");
    };
  }, [isOpen]);

  // Data Fetching
  const loadSearchResults = useCallback(async (query, pageNum) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const { posts: newPosts } = await searchPosts({ query, page: pageNum });
      setSearchResults((prev) =>
        pageNum === 1 ? newPosts : [...prev, ...newPosts]
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
    if (!isOpen) return; // Don't run logic if closed

    setSearchResults([]);
    setPage(1);
    setHasMore(true);

    if (searchQuery.trim().length > 1) {
      setIsDebouncing(true);
      const handler = setTimeout(() => {
        loadSearchResults(searchQuery, 1);
      }, 500);
      return () => clearTimeout(handler);
    } else {
      setIsDebouncing(false);
      setSearchResults([]);
    }
  }, [searchQuery, isOpen, loadSearchResults]);

  // Pagination Effect
  useEffect(() => {
    if (page > 1 && isOpen) {
      loadSearchResults(searchQuery, page);
    }
  }, [page, isOpen, searchQuery, loadSearchResults]);

  // Infinite Scroll Observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 flex flex-col items-center bg-background/80 backdrop-blur-xl px-2 py-4 sm:px-6 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl flex flex-col h-full transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            در مقالات ما جستجو کنید
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="مثلا: طلاق توافقی، ثبت شرکت و..."
              className="w-full pl-16 pr-6 py-4 text-base sm:text-lg border-2 border-muted bg-background/90 focus:ring-2 focus:ring-accent focus:border-accent rounded-full shadow-lg transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 text-primary">
              {isDebouncing ? (
                <LoaderCircle className="h-6 w-6 animate-spin text-accent" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {searchResults.length > 0 ? (
            <div className="space-y-3 pb-4">
              {searchResults.map((post, index) => {
                const isLastElement = searchResults.length === index + 1;
                return (
                  <Link
                    href={`/${post.slug}`}
                    key={post.id}
                    onClick={onClose}
                    ref={isLastElement ? lastPostElementRef : null}
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-background/70 rounded-2xl border border-muted transition-all duration-300 ease-in-out hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 hover:!translate-x-0"
                  >
                    <Image
                      src={`/${post.thumbnail}`}
                      alt={post.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border border-muted/50"
                    />
                    <div className="overflow-hidden flex-grow">
                      <h3 className="!text-base !font-semibold text-primary transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p className="text-sm text-foreground/70 mt-1.5 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <ArrowLeft className="h-6 w-6 mr-2 text-muted/80 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {!isLoading && !isDebouncing && searchQuery.length > 1 && (
                <div className="flex flex-col items-center gap-4">
                  <SearchX className="h-16 w-16 text-muted" />
                  <p className="text-xl font-semibold text-foreground">
                    نتیجه‌ای یافت نشد
                  </p>
                  <p className="text-foreground/70 max-w-xs">
                    برای عبارت «{searchQuery}» مقاله‌ای پیدا نکردیم. لطفا عبارت
                    دیگری را امتحان کنید.
                  </p>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-6">
              <LoaderCircle className="h-7 w-7 text-primary animate-spin" />
              <p className="text-lg text-foreground/80">
                در حال بارگذاری نتایج...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
SearchOverlay.displayName = "SearchOverlay";

// --- Main Header Component ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Key Down Listener (Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen((prev) => (prev ? false : prev));
        setIsMenuOpen((prev) => (prev ? false : prev));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <TopBar />

      <header className="bg-background shadow-lg w-full border-b border-muted z-30">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center gap-4">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="صفحه اصلی"
            >
              <Image
                src="/logo.png"
                alt="لوگوی شرکت حقوقی"
                width={80}
                height={80}
                priority
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/">صفحه اصلی</NavLink>
              <NavLink href="/articles">مقالات حقوقی</NavLink>
              <NavLink href="/contact">تماس با ما</NavLink>
              <NavLink href="/about-us">درباره ما</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-end p-2 sm:p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/60 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent/20 hover:border-accent sm:mt-1">
              <a
                href="tel:09002450090"
                className="flex items-center gap-2 text-primary font-extrabold text-sm sm:text-lg md:text-xl leading-none hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <span className="![direction:ltr]">0900 245 0090</span>
              </a>
              <p className="hidden sm:flex text-xs font-bold text-secondary items-center mt-1">
                <Sparkles className="h-3 w-3 text-accent" />
                مشاوره فوری (ایتا و تلگرام)
              </p>
            </div>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 border border-input-border text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="جستجو"
            >
              <Search className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 border border-primary text-primary rounded-full lg:hidden hover:bg-primary/10 transition-colors"
              aria-label="منوی اصلی"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </header>
    </>
  );
};

export default Header;
