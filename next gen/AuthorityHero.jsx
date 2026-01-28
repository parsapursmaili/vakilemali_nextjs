"use client";

import React from "react";
import Image from "next/image";
import {
  ShieldAlert,
  ChevronLeft,
  Lock,
  BadgeCheck,
  Scale,
  TrendingUp,
} from "lucide-react";

const AuthorityHero = ({ categoryName, authorImage, onOpenModal }) => {
  const handleCtaClick = () => {
    if (onOpenModal) {
      onOpenModal();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-lead-modal"));
    }
  };

  const currentCategory = categoryName || "مالی و ملکی";

  return (
    <div className="w-full my-8 px-0 font-sans" dir="rtl">
      {/* Container */}
      <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-white dark:bg-[#0a0a0a] shadow-sm border border-slate-200 dark:border-white/10 transition-all duration-300 hover:shadow-md group">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1B5E20_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Top Border Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#1B5E20] via-[#C5A059] to-[#1B5E20]"></div>

        <div className="flex flex-col md:flex-row items-stretch">
          {/* Section 1: Lawyer Profile (Optimized for Mobile) */}
          <div className="relative md:w-[30%] bg-slate-50 dark:bg-[#111] p-5 md:p-6 flex flex-row md:flex-col items-center gap-4 md:gap-3 border-b md:border-b-0 md:border-l border-slate-100 dark:border-white/5 z-10">
            {/* Avatar Wrapper */}
            <div className="relative shrink-0">
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#C5A059] to-[#1B5E20]">
                <Image
                  src={authorImage || "/lawyer-avatar.webp"}
                  alt="مرضیه توانگر"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full border-2 border-white dark:border-[#111]"
                />
              </div>
              {/* Online Dot */}
              <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#111]"></span>
              </span>
            </div>

            <div className="text-right md:text-center flex-1 md:flex-none">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight">
                مرضیه توانگر
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center md:justify-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                وکیل پایه یک دادگستری
              </p>
            </div>
          </div>

          {/* Section 2: Persuasion Content */}
          <div className="flex-1 p-5 md:p-8 flex flex-col justify-center relative z-10">
            <Scale className="absolute left-[-20px] top-[-20px] w-40 h-40 text-slate-900/[0.03] dark:text-white/[0.02] -z-10 rotate-12 pointer-events-none" />

            <div className="mb-5">
              <div className="flex items-center gap-2 text-[#b91c1c] dark:text-red-400 text-xs font-black mb-2 uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>نکته حیاتی قبل از مطالعه:</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-7 text-justify">
                قوانین{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  دعاوی {currentCategory}
                </span>{" "}
                دائماً در حال تغییرند. این مقاله راهنماست، اما یک اشتباه کوچک در{" "}
                <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold px-1 rounded">
                  نحوه تنظیم دادخواست
                </span>{" "}
                می‌تواند باعث رد شدن دعوای شما شود.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleCtaClick}
                className="w-full sm:w-auto relative group overflow-hidden bg-[#1B5E20] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgba(27,94,32,0.39)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span>بررسی شانس پیروزی (رایگان)</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Social Proof & Trust - اصلاح شده */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-1 text-[11px] font-medium text-slate-500 w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                <div className="flex items-center gap-1.5 text-[#C5A059] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>۹۵٪ نرخ موفقیت (سنا)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span>تضمین محرمانگی اطلاعات</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityHero;
