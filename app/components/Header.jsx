"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, memo } from "react";
import { Menu, Search, Phone, X, Sparkles } from "lucide-react";

// بارگذاری داینامیک سرچ باکس
const SearchOverlay = dynamic(() => import("@/components/SearchOverlay"), {
  ssr: false,
});

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

// TopBar اصلاح شده
// تغییرات: افزودن !leading-relaxed برای جلوگیری از تداخل خطوط در موبایل
const TopBar = memo(() => (
  <div className="w-full bg-primary text-background/95 border-b border-primary-light/20 flex items-center justify-center py-2 px-2">
    <p className="!m-0 !p-0 font-light tracking-wide text-[10px] sm:text-xs text-center !leading-relaxed sm:!leading-normal max-w-4xl">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَيْلٌ لِلْمُطَفِّفِينَ •
      الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ • وَإِذَا
      كَالُوهُمْ أَوْ وَزَنُوهُمْ يُخْسِرُونَ
    </p>
  </div>
));
TopBar.displayName = "TopBar";

// --- Mobile Menu ---
const MobileMenu = memo(({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl transition-all duration-300 flex flex-col ${
        isOpen
          ? "opacity-100 visible translate-x-0"
          : "opacity-0 invisible translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-5 border-b border-muted">
        <h3 className="text-lg font-bold text-primary">دسترسی سریع</h3>
        <button
          onClick={onClose}
          className="p-2 border border-muted rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center p-6 gap-8 overflow-y-auto">
        <nav className="flex flex-col items-center gap-6 w-full">
          {["صفحه اصلی", "مقالات حقوقی", "تماس با ما", "درباره ما"].map(
            (item, idx) => {
              const href =
                item === "صفحه اصلی"
                  ? "/"
                  : item === "مقالات حقوقی"
                    ? "/articles"
                    : item === "تماس با ما"
                      ? "/contact"
                      : "/about-us";
              return (
                <Link
                  key={idx}
                  href={href}
                  onClick={onClose}
                  className="text-xl font-bold text-foreground hover:text-accent"
                >
                  {item}
                </Link>
              );
            },
          )}
        </nav>
      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

// --- Header ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // کامپوننت دکمه تماس
  const CallButton = ({ isMobile = false }) => (
    <div
      className={`flex flex-col ${
        isMobile ? "items-end" : "items-start"
      } group`}
    >
      <a
        href="tel:09002450090"
        className={`flex items-center gap-2 ${
          isMobile
            ? "px-2 py-1"
            : "px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 hover:border-accent hover:bg-accent/10"
        } transition-all duration-300`}
      >
        {/* آیکون و شماره */}
        <Phone
          className={`${
            isMobile ? "h-4 w-4" : "h-4 w-4"
          } text-accent fill-current`}
        />
        <span className="text-primary font-bold text-lg dir-ltr font-sans pt-1 leading-none">
          0900 245 0090
        </span>
      </a>
      {/* متن مشاوره */}
      <p
        className={`text-[9px] sm:text-[10px] font-bold text-secondary flex items-center gap-1 mt-1 ${
          isMobile ? "hidden sm:flex" : "flex"
        } opacity-90`}
      >
        <Sparkles className="h-2 w-2 text-accent" />
        مشاوره فوری در واتساپ و ایتا
      </p>
    </div>
  );

  return (
    <>
      <TopBar />

      <header
        // تغییر مهم: sticky top-0 حذف شد و با relative جایگزین شد
        className={`relative w-full z-40 transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-md border-muted/50 py-1"
            : "bg-background shadow-sm border-muted py-2"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 flex justify-between items-center h-16 sm:h-auto">
          {/* بخش راست: لوگو + دکمه تماس موبایل */}
          <div className="flex items-center gap-3 sm:gap-10">
            <Link
              href="/"
              className="flex items-center relative group"
              aria-label="صفحه اصلی"
            >
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/uploads/logo.webp"
                  alt="لوگو"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            {/* دکمه تماس موبایل */}
            <div className="lg:hidden block mr-1">
              <CallButton isMobile={true} />
            </div>

            {/* نویگیشن دسکتاپ */}
            <nav className="hidden lg:flex items-center gap-8 mr-4">
              <NavLink href="/">صفحه اصلی</NavLink>
              <NavLink href="/articles">مقالات حقوقی</NavLink>
              <NavLink href="/contact">تماس با ما</NavLink>
              <NavLink href="/about-us">درباره ما</NavLink>
            </nav>
          </div>

          {/* بخش چپ: دکمه‌ها */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* دکمه تماس دسکتاپ */}
            <div className="hidden lg:block">
              <CallButton />
            </div>

            {/* دکمه سرچ */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 text-primary hover:text-accent hover:bg-primary/5 rounded-full transition-all duration-300"
              aria-label="جستجو"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-primary border border-primary/20 rounded-full lg:hidden hover:bg-primary hover:text-white transition-colors"
              aria-label="منوی اصلی"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;
