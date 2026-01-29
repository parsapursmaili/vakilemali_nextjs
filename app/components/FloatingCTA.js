"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Phone,
  X,
  ChevronUp,
  Clock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

// آیکون واتساپ با استایل جدید
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
  const SCROLL_TRIGGER = 150;
  const HIDDEN_ROUTES = ["/contact", "/login", "/admin"];

  // داده‌های Hyper-Specific (مشکل = راه حل فوری)
  const CATEGORY_DATA = {
    "chek-bargashi": {
      hook: "چک برگشتی دارید؟",
      sub: "خطر انتقال اموال بدهکار! همین الان اقدام کنید",
      waText: "سلام، درخواست توقیف اموال و بررسی چک برگشتی دارم.",
    },
    khanevade: {
      hook: "تصمیم طلاق یا مهریه؟",
      sub: "یک امضای اشتباه = سال‌ها پشیمانی. قبل از هر اقدامی بپرسید.",
      waText: "سلام، پرونده خانواده دارم و نگران ضایع شدن حقم هستم.",
    },
    amlak: {
      hook: "مشکل ملکی یا تخلیه؟",
      sub: "سرمایه‌تان در خطر است؟ ارسال مدارک جهت بررسی فوری.",
      waText: "سلام، مدارک ملکی دارم، لطفاً فوری بررسی کنید.",
    },
    ers: {
      hook: "اختلاف در تقسیم ارث؟",
      sub: "جلوگیری از تصرف غیرقانونی وراث. مشاوره فوری.",
      waText: "سلام، در مورد انحصار وراثت و سهم‌الارث راهنمایی می‌خواهم.",
    },
    gharardad: {
      hook: "طرف قرارداد تخلف کرده؟",
      sub: "فسخ و دریافت خسارت امکان‌پذیر است. بررسی قرارداد.",
      waText: "سلام، طرف مقابل به قرارداد عمل نکرده، راهکار چیست؟",
    },
    jarayem: {
      hook: "احضاریه یا پرونده کیفری؟",
      sub: "هشدار: اولین اظهارات شما سرنوشت‌ساز است. بدون وکیل نروید.",
      waText: "سلام، پرونده کیفری دارم، نیاز به دفاع فوری دارم.",
    },
    kar: {
      hook: "اخراج یا حقوق معوقه؟",
      sub: "زنده کردن تمام حق و حقوق (سنوات، عیدی، بیمه).",
      waText: "سلام، شکای اداره کار دارم، لطفاً راهنمایی کنید.",
    },
    default: {
      hook: "مشکل حقوقی فوری دارید؟",
      sub: "زمان علیه شماست. همین الان جلوی ضرر را بگیرید.",
      waText: "سلام، یک مشکل حقوقی فوری دارم و نیاز به بررسی دارم.",
    },
  };

  const currentData = CATEGORY_DATA[categorySlug] || CATEGORY_DATA.default;

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("cta_closed_at");
    // باز شدن مجدد بعد از 1 ساعت به جای 2 ساعت (Aggressive Re-targeting)
    if (closedAt && Date.now() - parseInt(closedAt, 10) < 1 * 60 * 60 * 1000) {
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

  const rawPhone = toEnglishDigits(phoneNumber || "09002450090");
  const phoneHref = `tel:${rawPhone}`;
  const whatsappHref = `https://wa.me/98${rawPhone.substring(
    1,
  )}?text=${encodeURIComponent(currentData.waText)}`;

  const showMainBar = !isClosed && isScrolled;

  return (
    <>
      {/* --- دکمه بازکردن (Re-engage) --- */}
      <button
        onClick={handleReopen}
        className={`fixed bottom-5 left-5 z-[9998] group flex items-center gap-2.5 
        bg-gradient-to-r from-[#1EBE5D] to-[#128C7E] text-white px-4 py-3 rounded-full 
        shadow-[0_8px_20px_rgba(18,140,126,0.4)] border border-white/20
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        hover:scale-105 hover:-translate-y-1
        ${
          isClosed
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-[200%] opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#128C7E]"></span>
        </span>
        <span className="text-sm font-black text-white tracking-wide">
          سوال فوری دارم
        </span>
        <ChevronUp size={18} className="text-white/80" />
      </button>

      {/* --- نوار اصلی (Ultimate CTA Bar) --- */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${showMainBar ? "translate-y-0" : "translate-y-[120%]"}`}
      >
        {/* دکمه بستن */}
        {showMainBar && (
          <div className="max-w-[1150px] mx-auto relative h-0">
            <button
              onClick={handleClose}
              className="absolute -top-10 left-3 bg-black/60 backdrop-blur-md text-white/80 hover:bg-red-500 hover:text-white rounded-full p-1.5 shadow-sm border border-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* بدنه اصلی نوار */}
        <div className="bg-[#0f172a] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
          <div className="w-full max-w-[1150px] mx-auto px-3 py-3 md:py-4">
            {/* Scarcity Bar (نوار باریک بالای محتوا در موبایل و دسکتاپ) */}
            {/* Scarcity Bar */}
            <div
              className="flex items-center justify-center gap-2 mb-3 
  md:mb-0 md:absolute md:-top-[28px] md:right-4 
  md:bg-[#1EBE5D] md:px-4 md:h-7 md:flex md:items-center md:justify-center 
  md:rounded-t-lg md:shadow-lg md:min-w-[220px]"
            >
              <Clock
                size={14}
                className="text-red-400 md:text-white animate-pulse !mb-[-7px]"
              />
              <p className=" !mb-[-7px] text-[10px] md:text-[11px] font-bold text-red-300 md:text-white whitespace-nowrap">
                اقدام سریع می‌تواند جلوی ضرر را بگیرد
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
              {/* بخش متنی (Hook + Trust) */}
              <div className="flex-1 text-right w-full">
                <div className="flex items-center gap-2 mb-0.5">
                  <ShieldAlert
                    size={16}
                    className="text-amber-500 hidden md:block"
                  />
                  <h3 className="font-vazir font-black text-white text-[15px] md:text-[17px] leading-tight">
                    {currentData.hook}
                  </h3>
                </div>
                <p className="text-gray-300 text-[12px] md:text-[13px] leading-snug hidden md:block">
                  {currentData.sub}
                </p>
                {/* Mobile Text Alternative */}
                <p className="text-gray-300 text-[12px] block md:hidden">
                  همین الان مدارک رو بفرست، خودم بررسی می‌کنم.
                </p>

                {/* Personal Touch */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center border border-white/20">
                    <CheckCircle2 size={10} className="text-green-400" />
                  </div>
                  <span className="text-[10px] md:text-[11px] text-white/60 font-medium">
                    👩‍⚖️ بررسی مستقیم توسط وکیل (نه اپراتور)
                  </span>
                </div>
              </div>

              {/* بخش دکمه‌ها (Action Area) */}
              <div className="flex items-stretch gap-2 w-full md:w-auto h-12 md:h-14">
                {/* Secondary CTA (Phone) - Outline & Subtle */}
                <a
                  href={phoneHref}
                  className="flex-1 md:w-32 flex flex-col items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all active:scale-95 group px-2"
                >
                  <div className="flex items-center gap-1.5">
                    <Phone
                      size={16}
                      className="text-white/70 group-hover:text-white"
                    />
                    <span className="font-bold text-[12px] text-white/90 group-hover:text-white">
                      تماس
                    </span>
                  </div>
                </a>

                {/* Primary CTA (WhatsApp) - Gradient & Hero */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2.5] md:w-72 flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-[#1EBE5D] to-[#128C7E] hover:brightness-110 shadow-[0_6px_20px_rgba(18,140,126,0.25)] transition-all active:scale-95 px-2 relative overflow-hidden"
                >
                  {/* درخشش نامحسوس روی دکمه */}
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 rounded-full bg-white/20 blur-xl"></div>

                  <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7 fill-white drop-shadow-sm" />
                  <div className="flex flex-col items-start leading-none justify-center z-10">
                    <span className="font-black text-[13px] md:text-[15px] text-white leading-tight">
                      ارسال مدارک + پاسخ فوری
                    </span>
                    <span className="text-[10px] md:text-[11px] text-white/90 font-medium mt-0.5 opacity-90">
                      بررسی رایگان • بدون تعهد
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
