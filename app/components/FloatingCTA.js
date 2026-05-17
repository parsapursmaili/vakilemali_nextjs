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
  ChevronLeft,
} from "lucide-react";

export default function FloatingCTA({ phoneNumber, categorySlug }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const SCROLL_TRIGGER = 150;
  const HIDDEN_ROUTES = ["/contact", "/login", "/admin"];

  const CATEGORY_DATA = {
    "chek-bargashi": {
      hook: "چک برگشتی دارید؟",
      sub: "خطر انتقال اموال بدهکار! همین الان اقدام کنید",
    },
    khanevade: {
      hook: "تصمیم طلاق یا مهریه؟",
      sub: "یک امضای اشتباه = سال‌ها پشیمانی. قبل از هر اقدامی بپرسید.",
    },
    amlak: {
      hook: "مشکل ملکی یا تخلیه؟",
      sub: "سرمایه‌تان در خطر است؟ ارسال مدارک جهت بررسی فوری.",
    },
    ers: {
      hook: "اختلاف در تقسیم ارث؟",
      sub: "جلوگیری از تصرف غیرقانونی وراث. مشاوره فوری.",
    },
    gharardad: {
      hook: "طرف قرارداد تخلف کرده؟",
      sub: "فسخ و دریافت خسارت امکان‌پذیر است. بررسی قرارداد.",
    },
    jarayem: {
      hook: "احضاریه یا پرونده کیفری؟",
      sub: "هشدار: اولین اظهارات شما سرنوشت‌ساز است. بدون وکیل نروید.",
    },
    kar: {
      hook: "اخراج یا حقوق معوقه؟",
      sub: "زنده کردن تمام حق و حقوق (سنوات، عیدی، بیمه).",
    },
    default: {
      hook: "مشکل حقوقی فوری دارید؟",
      sub: "زمان علیه شماست. همین الان جلوی ضرر را بگیرید.",
    },
  };

  const currentData = CATEGORY_DATA[categorySlug] || CATEGORY_DATA.default;

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("cta_closed_at");
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
  : "09002450090";

  const rawPhone = toEnglishDigits(phoneNumber);
  const phoneHref = `tel:${rawPhone}`;
  const rowId='vakilemali';
  const eitaaHref = `https://eitaa.com/${rowId}`;

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

      {/* --- نوار اصلی (CTA Bar) --- */}
      <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${showMainBar ? "translate-y-0" : "translate-y-[120%]"}`}
        >
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

        <div className="bg-[#0f172a] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
        <div className="w-full max-w-[1150px] mx-auto px-3 py-3 md:py-4">
        {/* Scarcity Bar */}
        <div
        className="flex items-center justify-center gap-2 mb-3
        md:mb-0 md:absolute md:-top-[28px] md:right-4
        md:bg-[#E77D5D] md:px-4 md:h-7 md:flex md:items-center md:justify-center
        md:rounded-t-lg md:shadow-lg md:min-w-[220px]"
        >
        <Clock size={14} className="text-white animate-pulse" />
        <p className="text-[10px] md:text-[11px] font-bold text-white whitespace-nowrap pt-4">
        اقدام سریع می‌تواند جلوی ضرر را بگیرد
        </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        <div className="flex-1 text-right w-full">
        <div className="flex items-center gap-2 mb-0.5">
        <ShieldAlert
        size={16}
        className="text-amber-500 hidden md:block"
        />
        <h3 className="font-black text-white text-[15px] md:text-[17px] leading-tight">
        {currentData.hook}
        </h3>
        </div>
        <p className="text-gray-300 text-[12px] md:text-[13px] leading-snug hidden md:block">
        {currentData.sub}
        </p>
        <p className="text-gray-300 text-[12px] block md:hidden">
        همین الان در ایتا مدارک رو بفرست، خودم بررسی می‌کنم.
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
        <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center border border-white/20">
        <CheckCircle2 size={10} className="text-orange-400" />
        </div>
        <span className="text-[10px] md:text-[11px] text-white/60 font-medium">
        👩‍⚖️ بررسی مستقیم توسط وکیل (نه اپراتور)
        </span>
        </div>
        </div>

        <div className="flex items-stretch gap-2 w-full md:w-auto h-12 md:h-14">
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
        تماس تلفنی
        </span>
        </div>
        </a>

        {/* دکمه بازطراحی شده ایتا بدون لوگو */}
        <a
        href={eitaaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-[2.5] md:w-72 flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#E77D5D] to-[#D85C3D] hover:brightness-110 shadow-[0_6px_20px_rgba(231,125,93,0.3)] transition-all active:scale-95 px-4 relative overflow-hidden group"
        >
        {/* افکت درخشش ملایم */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* نشانگر آنلاین بودن (بجای لوگو) */}
        <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </div>

        <div className="flex flex-col items-start leading-none justify-center z-10">
        <span className="font-black text-[14px] md:text-[16px] text-white leading-tight">
        ارسال پیام در ایتا
        </span>
        <span className="text-[10px] md:text-[11px] text-white/90 font-medium mt-1 opacity-90">
        پاسخگویی آنی و بررسی مدارک
        </span>
        </div>

        <ChevronLeft size={18} className="text-white/50 mr-auto hidden md:block group-hover:translate-x-[-3px] transition-transform" />
        </a>
        </div>
        </div>
        </div>
        </div>
        </div>
        </>
  );
}
