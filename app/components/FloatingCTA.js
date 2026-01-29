"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Phone,
  X,
  ChevronUp,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
} from "lucide-react";

// WhatsApp Icon for Desktop only
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function FloatingCTA({
  phoneNumber,
  categorySlug,
  bookingUrl = "/booking",
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDeepScrolled, setIsDeepScrolled] = useState(false);
  const [isMainCtaVisible, setIsMainCtaVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const SCROLL_TRIGGER = 200;
  const DEEP_SCROLL_PERCENTAGE = 60;
  const HIDDEN_ROUTES = ["/contact", "/login", "/admin", "/booking"];

  // Threat & Financial Gain focused copy
  const CATEGORY_DATA = {
    "chek-bargashi": {
      hook: "خطر انتقال اموال بدهکار!",
      deepHook: "هر ساعت تأخیر = ضرر مالی قطعی",
      sub: "توقیف اموال قبل از فرار بدهکار",
    },
    khanevade: {
      hook: "حقوق مالی خود را می‌شناسید؟",
      deepHook: "توافق اشتباه = پشیمانی همیشگی",
      sub: "حفظ تمام کمال دارایی و مهریه",
    },
    amlak: {
      hook: "سرمایه ملکی شوخی‌بردار نیست!",
      deepHook: "امضای اشتباه = نابودی سرمایه",
      sub: "بررسی اسناد جهت پیشگیری از کلاهبرداری",
    },
    default: {
      hook: "پرونده شما جدی به نظر می‌رسد",
      deepHook: "گزینه‌های قانونی محدود می‌شوند",
      sub: "بررسی راهکار جهت جلوگیری از ضرر",
    },
  };

  const currentData = CATEGORY_DATA[categorySlug] || CATEGORY_DATA.default;

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("cta_closed_at");
    // Re-open faster (1 hour) to capture return traffic
    if (closedAt && Date.now() - parseInt(closedAt, 10) < 1 * 60 * 60 * 1000) {
      setIsClosed(true);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollPercent = (scrollY / (docHeight - windowHeight)) * 100;

      setIsScrolled(scrollY > SCROLL_TRIGGER);
      setIsDeepScrolled(scrollPercent > DEEP_SCROLL_PERCENTAGE);
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainCtaVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const mainCta = document.getElementById("main-cta-section");
    if (mainCta) observer.observe(mainCta);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (mainCta) observer.unobserve(mainCta);
    };
  }, []);

  if (!isMounted) return null;
  if (HIDDEN_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  const showMainBar = !isClosed && isScrolled && !isMainCtaVisible;

  const toEnglishDigits = (str) =>
    str
      ? str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/\D/g, "")
      : "";

  const rawPhone = toEnglishDigits(phoneNumber || "09120000000");
  const phoneHref = `tel:${rawPhone}`;
  const whatsappHref = `https://wa.me/98${rawPhone.substring(1)}?text=${encodeURIComponent(
    "سلام. درخواست بررسی فوری پرونده را دارم.",
  )}`;

  return (
    <>
      {/* Return Button - Aggressive but clean */}
      <button
        onClick={() => {
          setIsClosed(false);
          localStorage.removeItem("cta_closed_at");
        }}
        className={`fixed bottom-4 left-4 z-[9998] group flex items-center gap-2 
        bg-slate-800 text-white pl-4 pr-3 py-3 rounded-xl
        shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        hover:scale-105 hover:bg-slate-700
        ${
          !showMainBar && isScrolled
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-[200%] opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
        </span>
        <span className="text-xs font-bold text-white">اقدام فوری</span>
        <ChevronUp size={14} className="text-white/80" />
      </button>

      {/* Main Floating CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-1/2 md:translate-x-1/2 md:w-auto md:max-w-4xl z-[9999] 
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${
            showMainBar
              ? "translate-y-0 md:translate-y-0 opacity-100"
              : "translate-y-[120%] opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="bg-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.7)] 
            md:rounded-2xl md:border md:border-white/10 md:shadow-[0_10px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Scarcity Bar - Paid Priority Focus */}
          <div className="bg-orange-600/10 border-t border-orange-500/20 md:border-none py-1.5 px-4 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 animate-pulse"></div>
            <p className="text-[10px] md:text-xs font-bold text-orange-200 flex items-center justify-center gap-2">
              <AlertTriangle
                size={12}
                className="text-orange-500 fill-orange-500/20"
              />
              <span>
                اولویت بررسی پرونده فقط با{" "}
                <span className="text-orange-400 underline decoration-orange-400/30 underline-offset-2">
                  رزرو وقت قبلی
                </span>{" "}
                است.
              </span>
            </p>
          </div>

          <button
            onClick={() => {
              setIsClosed(true);
              localStorage.setItem("cta_closed_at", Date.now().toString());
            }}
            className="hidden md:flex absolute top-2 left-2 text-white/30 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>

          <div className="px-3 py-3 md:px-5 md:py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
              {/* Desktop Copy - Left aligned */}
              <div className="hidden md:flex flex-col min-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  {isDeepScrolled && (
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]"></span>
                  )}
                  <span className="text-sm font-bold text-white">
                    {isDeepScrolled ? currentData.deepHook : currentData.hook}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {currentData.sub}
                </span>
              </div>

              {/* Action Area */}
              <div className="flex items-stretch gap-2 w-full md:w-auto">
                {/* Desktop: WhatsApp (Secondary) */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center justify-center w-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-400 hover:text-white transition-all group"
                  title="پیام در واتساپ"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-slate-500 group-hover:fill-[#25D366] transition-colors" />
                </a>

                {/* Mobile & Desktop: Call (Secondary - 35% on Mobile) */}
                <a
                  href={phoneHref}
                  className="flex-[1] md:flex-none flex items-center justify-center md:px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
                >
                  <Phone size={18} className="md:mr-2 shrink-0" />
                  <span className="hidden md:inline text-xs font-bold">
                    تماس تلفنی
                  </span>
                  <span className="md:hidden text-xs font-bold mr-1">تماس</span>
                </a>

                {/* Primary CTA - Booking (Dominant - 65% on Mobile) */}
                <a
                  href={bookingUrl}
                  className={`flex-[2] md:flex-none relative overflow-hidden flex items-center justify-center gap-2 md:gap-3 px-2 md:px-6 py-3 md:py-3.5 
                  rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 
                  text-white shadow-[0_4px_0_rgb(154,52,18)] hover:shadow-[0_2px_0_rgb(154,52,18)] hover:translate-y-[2px]
                  transition-all duration-200 group
                  ${isDeepScrolled ? "animate-pulse md:animate-none" : ""}`}
                >
                  <div className="flex flex-col items-start justify-center">
                    <span className="flex items-center gap-1.5 font-black text-xs md:text-sm leading-none">
                      <FileSearch size={16} className="shrink-0" />
                      رزرو بررسی تخصصی
                    </span>
                    <span className="text-[10px] md:text-[10px] font-medium text-orange-100/90 mt-0.5 md:mt-1">
                      تحلیل پرونده + راهکار قطعی
                    </span>
                  </div>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
