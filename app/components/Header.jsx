"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Search, Phone, X, Sparkles } from "lucide-react";

// کامپوننت لینک‌های منو با استایل هاور
const NavLink = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className=" text-foreground text-base font-semibold hover:text-accent transition-colors py-2 lg:py-0 block lg:inline relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-accent hover:after:w-full after:transition-all after:duration-300"
  >
    {children}
  </Link>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-lg">
      {/* نوار بالا — اصلاح نهایی: با leading-none فاصله اضافی پاراگراف حذف و تراز کامل شد */}
      <div className="line-h bg-primary text-background/90 py-2 px-4 text-center border-b border-primary-light/30 flex items-center justify-center">
        <p className=" font-light tracking-wide text-xs md:text-sm !m-3 !mb-2 leading-none">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • وَيْلٌ لِلْمُطَفِّفِينَ •
          الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ • وَإِذَا
          كَالُوهُمْ أَوْ وَزَنُوهُمْ يُخْسِرُونَ • أَلَا يَظُنُّ أُولَٰئِكَ
          أَنَّهُمْ مَبْعُوثُونَ
        </p>
      </div>

      {/* هدر اصلی */}
      <div className="border-b border-muted">
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
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/">صفحه اصلی</NavLink>
              <NavLink href="/services">خدمات و تخصص‌ها</NavLink>
              <NavLink href="/articles">مقالات حقوقی</NavLink>
              <NavLink href="/contact">تماس با ما</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* باکس مشاوره — اصلاح نهایی: با مارجین منفی تراز بصری دقیق ایجاد شد */}
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

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 border border-input-border text-foreground rounded-full hover:bg-muted transition-colors"
              aria-label="جستجو"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </button>

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

      {/* منوی موبایل (اسلاید از کنار) */}
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

      {/* جستجوی تمام صفحه */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-background/80 backdrop-blur-md z-[70] transition-opacity duration-300 flex items-center justify-center ${
          isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-6 right-6 p-3 rounded-full text-foreground hover:bg-muted"
          aria-label="بستن جستجو"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="w-full max-w-2xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">
            دنبال چه خدمتی می‌گردید؟
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="مثلا: طلاق توافقی، ثبت شرکت و..."
              className="w-full pl-16 pr-6 py-4 text-lg border-2 border-muted focus:ring-2 focus:ring-accent focus:border-accent rounded-full shadow-lg"
            />
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-background rounded-full hover:bg-primary-light transition-colors"
              aria-label="جستجو کردن"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
