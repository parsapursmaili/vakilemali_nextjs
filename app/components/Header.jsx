// Header.js (Final Version)
"use client";

// --- Imports ---
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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

// --- Sub-components ---

/**
 * کامپوننت لینک‌های ناوبری با افکت هاور
 * @param {object} props - پراپرتی‌های کامپوننت
 * @param {string} props.href - آدرس لینک
 * @param {React.ReactNode} props.children - محتوای لینک
 * @param {Function} props.onClick - تابع برای رویداد کلیک
 */
const NavLink = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className=" text-foreground text-base font-semibold hover:text-accent transition-colors py-2 lg-py-0 block lg:inline relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all after:duration-300"
  >
    {children}
  </Link>
);

// --- Main Header Component ---

const Header = () => {
  // --- Component State ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- Search Functionality State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // --- Infinite Scroll Logic ---
  const observer = useRef();
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

  // --- Data Fetching Logic ---

  /**
   * بارگذاری نتایج جستجو بر اساس کوئری و شماره صفحه
   * @param {string} query - عبارت جستجو شده
   * @param {number} pageNum - شماره صفحه برای بارگذاری
   */
  const loadSearchResults = async (query, pageNum) => {
    if (!query) return;
    setIsLoading(true);
    const { posts: newPosts } = await searchPosts({ query, page: pageNum });
    setSearchResults((prev) =>
      pageNum === 1 ? newPosts : [...prev, ...newPosts]
    );
    setHasMore(newPosts.length === 20); // فرض بر اینکه هر صفحه 20 آیتم دارد
    setIsLoading(false);
    setIsDebouncing(false);
  };

  // --- Effects ---

  // Effect for debouncing search input
  useEffect(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    if (searchQuery.trim().length > 1) {
      setIsDebouncing(true);
      const handler = setTimeout(() => {
        loadSearchResults(searchQuery, 1);
      }, 500); // 500ms delay
      return () => clearTimeout(handler);
    } else {
      setIsDebouncing(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Effect for loading more results on page change (infinite scroll)
  useEffect(() => {
    if (page > 1) {
      loadSearchResults(searchQuery, page);
    }
  }, [page]);

  // Effect for handling 'Escape' key press to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Effect for locking body scroll when a modal is open
  useEffect(() => {
    if (isSearchOpen || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen, isMenuOpen]);

  // --- Render ---

  return (
    <header className="sticky top-0 z-50 bg-background shadow-lg">
      {/* Section: Top Announcement Bar */}
      <div className="line-h bg-primary text-background/90 py-2 px-4 text-center border-b border-primary-light/30 flex items-center justify-center">
        <p className=" font-light tracking-wide text-xs md:text-sm !mb-[-2px]   leading-none">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَيْلٌ لِلْمُطَفِّفِينَ •
          الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ • وَإِذَا
          كَالُوهُمْ أَوْ وَزَنُوهُمْ يُخْسِرُونَ • أَلَا يَظُنّّ أُولَٰئِكَ
          أَنَّهُمْ مَبْعُوثُونَ
        </p>
      </div>

      {/* Section: Main Header */}
      <div className="border-b border-muted">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center gap-4">
          <div className="flex items-center gap-10">
            {/* Logo */}
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
              />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/">صفحه اصلی</NavLink>
              <NavLink href="/articles">مقالات حقوقی</NavLink>
              <NavLink href="/contact">تماس با ما</NavLink>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Contact Info */}
            <div className=" flex flex-col items-end p-2 sm:p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/60 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent/20 hover:border-accent sm:mt-1">
              <a
                href="tel:09002450090"
                className="flex items-center gap-2 text-primary font-extrabold text-base sm:text-xl md:text-2xl leading-none hover:text-accent transition-colors"
              >
                <Phone className=" h-4 w-4 sm:h-6 sm:w-6 text-accent " />
                <span className="![direction:ltr]">0900 245 0090</span>
              </a>
              <p className="hidden sm:flex text-xs font-bold text-secondary items-center ">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                مشاوره فوری (ایتا و تلگرام)
              </p>
            </div>
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 border border-input-border text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="جستجو"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </button>
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 border border-primary text-primary rounded-full lg:hidden hover:bg-primary/10 transition-colors"
              aria-label="منوی اصلی"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section: Mobile Off-canvas Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden shadow-2xl z-[60]`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b pb-4 border-muted">
            <h3 className="text-xl font-bold text-primary">منوی موسسه</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 border border-input-border text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="بستن منو"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-2 flex-grow">
            <NavLink href="/" onClick={() => setIsMenuOpen(false)}>
              صفحه اصلی
            </NavLink>
            <NavLink href="/services" onClick={() => setIsMenuOpen(false)}>
              خدمات
            </NavLink>
            <NavLink href="/articles" onClick={() => setIsMenuOpen(false)}>
              مقالات
            </NavLink>
            <NavLink href="/contact" onClick={() => setIsMenuOpen(false)}>
              تماس با ما
            </NavLink>
          </nav>
          <div className="mt-auto pt-6 border-t border-muted">
            <p className="text-base font-bold mb-3 text-primary text-center">
              برای مشاوره فوری تماس بگیرید
            </p>
            <a
              href="tel:09002450090"
              className="flex items-center justify-center gap-3 py-3 px-6 bg-accent text-white w-full shadow-lg rounded-full font-semibold transition-transform hover:scale-105"
            >
              <Phone className="h-5 w-5" />
              <span className="text-lg font-extrabold tracking-wider">
                0900 245 0090
              </span>
            </a>
            <p className="text-xs text-center text-foreground/70 mt-3 ">
              (امکان ارسال پیام در ایتا و تلگرام)
            </p>
          </div>
        </div>
      </div>

      {/* Section: Full-Screen Search Modal */}
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 flex flex-col items-center bg-background/80 backdrop-blur-xl px-2 py-4 sm:px-6 ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSearchOpen(false)}
      >
        <div
          className={`w-full max-w-3xl flex flex-col h-full transition-all duration-500 ease-in-out ${
            isSearchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
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
                autoFocus
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

          {/* Search Results Container */}
          <div className="mt-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {searchResults.length > 0 ? (
              <div className="space-y-3 pb-4">
                {searchResults.map((post, index) => {
                  const isLastElement = searchResults.length === index + 1;
                  return (
                    <Link
                      href={`/articles/${post.slug}`}
                      key={post.id}
                      onClick={() => setIsSearchOpen(false)}
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
              // Empty State (when no results are found)
              <div className="flex flex-col items-center justify-center h-full text-center">
                {!isLoading && !isDebouncing && searchQuery.length > 1 && (
                  <div className="flex flex-col items-center gap-4">
                    <SearchX className="h-16 w-16 text-muted" />
                    <p className="text-xl font-semibold text-foreground">
                      نتیجه‌ای یافت نشد
                    </p>
                    <p className="text-foreground/70 max-w-xs">
                      برای عبارت «{searchQuery}» مقاله‌ای پیدا نکردیم. لطفا
                      عبارت دیگری را امتحان کنید.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
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
    </header>
  );
};

export default Header;
