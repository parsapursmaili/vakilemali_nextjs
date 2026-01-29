"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronUp, Scale, ArrowUpLeft, Briefcase } from "lucide-react";

export default function FloatingCTA({ bookingUrl = "/booking" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMainCtaVisible, setIsMainCtaVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const SCROLL_TRIGGER = 300; // کمی دیرتر ظاهر شود تا مزاحم خواندن نشود
  const HIDDEN_ROUTES = ["/contact", "/login", "/admin", "/booking"];

  useEffect(() => {
    setIsMounted(true);
    const closedAt = localStorage.getItem("cta_closed_at");
    // بازگشت بعد از ۲ ساعت (احترام به تصمیم کاربر)
    if (closedAt && Date.now() - parseInt(closedAt, 10) < 2 * 60 * 60 * 1000) {
      setIsClosed(true);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_TRIGGER);
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

  return (
    <>
      {/* دکمه بازگشت (Return Button) - مینیمال و اداری */}
      <button
        onClick={() => {
          setIsClosed(false);
          localStorage.removeItem("cta_closed_at");
        }}
        className={`fixed bottom-6 left-6 z-[9998] flex items-center gap-2 
        bg-slate-900 text-slate-200 pl-4 pr-3 py-3 rounded-none border-l-4 border-amber-600/70
        shadow-[0_4px_20px_rgba(0,0,0,0.3)] 
        transition-all duration-500 ease-out
        hover:bg-slate-800
        ${
          !showMainBar && isScrolled
            ? "translate-y-0 opacity-100"
            : "translate-y-[200%] opacity-0 pointer-events-none"
        }`}
      >
        <Briefcase size={16} className="text-amber-500/80" />
        <span className="text-xs font-medium tracking-wide">بررسی پرونده</span>
        <ChevronUp size={14} className="text-slate-500" />
      </button>

      {/* نوار اصلی شناور */}
      <div
        className={`fixed bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8 md:w-auto md:max-w-md z-[9999] 
          transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1)
          ${
            showMainBar
              ? "translate-y-0 opacity-100"
              : "translate-y-[120%] opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="bg-[#0f172a] shadow-[0_-10px_40px_rgba(0,0,0,0.6)] 
            md:rounded-lg md:border md:border-slate-700/50 overflow-hidden"
        >
          {/* نوار وضعیت - Authority Statement */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 py-1.5 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80"></span>
              </span>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                وضعیت پذیرش: <span className="text-emerald-400/90">محدود</span>
              </p>
            </div>
            <button
              onClick={() => {
                setIsClosed(true);
                localStorage.setItem("cta_closed_at", Date.now().toString());
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-4 md:p-5 flex flex-col gap-4">
            {/* متن اصلی - Reframe */}
            <div>
              <h4 className="text-sm font-bold text-slate-100 mb-1 leading-relaxed">
                آیا پرونده شما ارزش حقوقی پیگیری دارد؟
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                پیش از هرگونه هزینه، ابتدا باید از «صلاحیت پرونده» و «شانس
                موفقیت» آن مطمئن شویم.
              </p>
            </div>

            {/* دکمه‌ها - Selective CTA */}
            <div className="flex gap-3">
              <a
                href={bookingUrl}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs font-bold py-3 rounded shadow-lg shadow-amber-900/20 transition-all group"
              >
                <Scale size={16} className="text-amber-100" />
                درخواست بررسی تخصصی
                <ArrowUpLeft
                  size={14}
                  className="group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform opacity-70"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
