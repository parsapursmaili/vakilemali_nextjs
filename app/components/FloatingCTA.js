// app/components/FloatingCTA.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Phone, X, ChevronUp } from "lucide-react";

// آیکون واتساپ
const WhatsAppIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function FloatingCTA({ phoneNumber, categorySlug }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  console.log("cat:", categorySlug);
  const SCROLL_TRIGGER = 150;
  const HIDDEN_ROUTES = ["/contact", "/login", "/admin"];

  const CATEGORY_DATA = {
    "chek-bargashi": {
      hook: "چک برگشتی دارید؟",
      sub: "وصول فوری و مسدودی حساب طرف مقابل",
      waText: "سلام، لطفاً پرونده چک برگشتی من را بررسی کنید.",
    },
    khanevade: {
      hook: "طلاق، مهریه یا حضانت؟",
      sub: "پیگیری فوری و جلوگیری از تضییع حقوق",
      waText: "سلام، درخواست بررسی پرونده خانواده را دارم.",
    },
    amlak: {
      hook: "اختلاف ملکی یا تخلیه؟",
      sub: "بازپس‌گیری ملک و تنظیم قراردادها",
      waText: "سلام، مدارک پرونده ملکی را می‌فرستم لطفاً بررسی کنید.",
    },
    ers: {
      hook: "تقسیم ارث و انحصار وراثت؟",
      sub: "محاسبه سهم‌الارث و رفع اختلافات",
      waText: "سلام، درباره تقسیم ارث نیاز به راهنمایی دارم.",
    },
    gharardad: {
      hook: "اختلاف در قرارداد؟",
      sub: "فسخ، داوری و دریافت خسارت",
      waText: "سلام، لطفاً قرارداد من را بررسی کنید.",
    },
    jarayem: {
      hook: "پرونده کیفری یا احضاریه؟",
      sub: "دفاع تخصصی و فوری",
      waText: "سلام، پرونده کیفری دارم، لطفاً بررسی کنید.",
    },
    kar: {
      hook: "اختلاف کارگر و کارفرما؟",
      sub: "وصول مطالبات و دفاع حرفه‌ای",
      waText: "سلام، درباره شکایت اداره کار سوال دارم.",
    },
    tejarat: {
      hook: "مسائل شرکت‌ها و تجارت؟",
      sub: "تنظیم قراردادهای تجاری و دعاوی شرکت",
      waText: "سلام، برای امور شرکت نیاز به مشاوره دارم.",
    },
    pezeshki: {
      hook: "قصور پزشکی یا خطا؟",
      sub: "دریافت دیه و اثبات تقصیر",
      waText: "سلام، پرونده قصور پزشکی دارم.",
    },
    default: {
      hook: "سوال حقوقی دارید؟",
      sub: "بررسی فوری و پیگیری تخصصی",
      waText: "سلام، لطفاً پرونده من را بررسی کنید.",
    },
  };

  const currentData = CATEGORY_DATA[categorySlug] || CATEGORY_DATA.default;

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("cta_closed_at");
    if (closedAt && Date.now() - parseInt(closedAt, 10) < 2 * 60 * 60 * 1000) {
      setIsClosed(true);
    }
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_TRIGGER);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;
  if (HIDDEN_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  const handleClose = () => {
    setIsClosed(true);
    localStorage.setItem("cta_closed_at", Date.now().toString());
  };

  const handleReopen = () => {
    setIsClosed(false);
    localStorage.removeItem("cta_closed_at");
  };

  const toEnglishDigits = (str) =>
    str
      ? str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/\D/g, "")
      : "";

  const rawPhone = toEnglishDigits(phoneNumber || "09120000000");
  const phoneHref = `tel:${rawPhone}`;
  const whatsappHref = `https://wa.me/98${rawPhone.substring(
    1
  )}?text=${encodeURIComponent(currentData.waText)}`;

  const showMainBar = !isClosed && isScrolled;

  return (
    <>
      {/* --- دکمه بازکردن مینیمال --- */}
      <button
        onClick={handleReopen}
        className={`fixed bottom-5 left-5 z-[9998] group flex items-center gap-2.5 
        bg-[var(--primary)] text-white px-3.5 py-2.5 rounded-full 
        shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)] border border-white/10
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        hover:scale-105 hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.4)] hover:-translate-y-1
        ${
          isClosed
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-[200%] opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span className="text-[13px] font-bold text-white/95 tracking-wide">
          مشاوره
        </span>
        <ChevronUp
          size={16}
          className="text-white/70 group-hover:text-white transition-colors"
        />
      </button>

      {/* --- نوار اصلی (Main CTA) --- */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${showMainBar ? "translate-y-0" : "translate-y-[120%]"}`}
      >
        {showMainBar && (
          <div className="max-w-[1100px] mx-auto relative h-0">
            <button
              onClick={handleClose}
              className="absolute -top-9 left-2 bg-[var(--primary)] text-white/70 hover:bg-red-500 hover:text-white rounded-full p-1.5 shadow-md border border-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="bg-[var(--primary)] border-t-2 border-[var(--accent)] shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
          {/* تغییر اصلی اینجاست: pt-3 pb-5 */}
          {/* این یعنی محتوا از بالا 12 پیکسل و از پایین 20 پیکسل فاصله دارد */}
          {/* این باعث میشه محتوا کمی بالا بیاد ولی باکس همچنان به پایین چسبیده باشه */}
          <div className="w-full max-w-[1100px] mx-auto px-3 pt-4 pb-5 md:py-7">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex-1 text-right space-y-0.5 -mt-3.5 md:-mt-4">
                <h3 className="font-vazir font-black !text-white text-[15px] md:text-lg leading-tight">
                  {currentData.hook}
                </h3>
                <p className="text-gray-300 text-[12px] md:text-sm leading-snug">
                  {currentData.sub}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 text-[11px] md:text-xs text-white/80">
                  <span className="whitespace-nowrap">
                    ✔ بررسی اولیه رایگان
                  </span>
                  <span className="whitespace-nowrap">✔ +۱۳ سال سابقه</span>
                  <span className="whitespace-nowrap">
                    ✔ ۳۰ دقیقه مشاوره فقط ۱۷۹٬۰۰۰ تومان
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto h-11 md:h-12">
                <a
                  href={phoneHref}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 h-full px-3 md:px-5 rounded-lg border border-white/20 bg-white/5 hover:bg-white transition-all active:scale-95 group"
                >
                  <Phone
                    size={18}
                    className="text-white group-hover:text-[var(--primary)]"
                  />
                  <span className="font-bold text-[11px] md:text-xs text-white group-hover:text-[var(--primary)]">
                    تماس
                  </span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] md:flex-none flex items-center justify-center gap-2 h-full px-4 md:px-7 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all active:scale-95"
                >
                  <WhatsAppIcon className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                  <div className="flex flex-col items-start leading-none justify-center">
                    <span className="font-black text-[12px] md:text-[14px] text-white leading-tight">
                      مشاوره اولیه رایگان در واتساپ
                    </span>
                    <span className="text-[10px] md:text-[11px] text-white/90 font-medium mt-0.5">
                      بررسی توسط وکیل
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
