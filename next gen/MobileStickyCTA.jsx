"use client";

import React, { useState, useEffect } from "react";
import { Phone, ShieldCheck, X } from "lucide-react";
import ConsultationModal from "./ConsultationModal";

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // استیت مدیریت باز/بسته بودن مودال اینجاست
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. نمایش Sticky Bar با تاخیر 4 ثانیه‌ای
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // 2. گوش دادن به رویداد (Event) دکمه‌ی AuthorityHero
    // وقتی دکمه داخل مقاله کلیک شود، این تابع اجرا می‌شود
    const handleGlobalModalOpen = () => {
      setIsModalOpen(true);
    };

    window.addEventListener("open-lead-modal", handleGlobalModalOpen);

    // پاکسازی برای جلوگیری از Memory Leak
    return () => {
      clearTimeout(timer);
      window.removeEventListener("open-lead-modal", handleGlobalModalOpen);
    };
  }, []);

  return (
    <>
      {/* دکمه بازگشت (وقتی نوار مینیمایز شده) */}
      <button
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-6 right-6 z-[45] md:hidden bg-[#C5A059] text-zinc-950 p-4 rounded-2xl shadow-[0_15px_35px_rgba(197,160,89,0.4)] transition-all duration-500 transform ${
          isMinimized && isVisible
            ? "scale-100 opacity-100 rotate-0"
            : "scale-0 opacity-0 rotate-90 pointer-events-none"
        }`}
      >
        <ShieldCheck className="w-7 h-7" />
      </button>

      {/* نوار چسبان (Sticky Bar) */}
      <div
        className={`fixed bottom-5 left-5 right-5 z-50 md:hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible && !isMinimized
            ? "translate-y-0 opacity-100"
            : "translate-y-40 opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative">
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute -top-3 -right-2 bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-800 z-[60]"
          >
            <X className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <div
            className="flex w-full h-[72px] rounded-[26px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 rtl"
            dir="rtl"
          >
            <a
              href="tel:09002450090"
              className="flex-[0.4] bg-gradient-to-br from-[#1B5E20] to-[#0a2e10] text-white flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Phone className="w-5 h-5 opacity-90" />
              <span className="text-[12px] font-bold">تماس با مدیریت</span>
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="relative flex-[0.6] bg-gradient-to-br from-[#C5A059] via-[#D4AF37] to-[#B8860B] text-zinc-950 flex items-center justify-center gap-2 active:scale-95 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[14px] font-[950] leading-none">
                ارزیابی رایگان ریسک
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* فراخوانی کامپوننت مودال (یک‌بار در صفحه) */}
      {/* این مودال با دو روش باز می‌شود: 1. دکمه نوار پایین 2. دکمه AuthorityHero */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}
