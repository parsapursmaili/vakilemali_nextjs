"use client";

import { MessageCircleQuestion, CornerDownLeft } from "lucide-react";

export default function MidArticleCTA({ categorySlug = "default" }) {
  const DATA = {
    "chek-bargashi": {
      text: "تاریخ یا متن چک خط‌خوردگی دارد؟ همین یک مورد می‌تواند وصول را غیرممکن کند.",
      btn: "پرسیدن سوال درباره چک",
      waMsg:
        "سلام خانم توانگر. در مورد خط‌خوردگی یا تاریخ چک سوال دارم. مقاله را خواندم.",
    },
    khanevade: {
      text: "توافق‌های شفاهی در دادگاه خانواده اعتبار ندارند. اگر ابهامی دارید بپرسید.",
      btn: "مشورت درباره متن توافق",
      waMsg:
        "سلام. در مورد نحوه تنظیم توافق‌نامه خانواده سوال دارم. یک ابهام حقوقی دارم.",
    },
    amlak: {
      text: "قبل از پرداخت پول، مطمئن شوید که ملک در رهن بانک یا توقیف دادگاه نیست.",
      btn: "استعلام وضعیت ملک",
      waMsg:
        "سلام. می‌خواهم مطمئن شوم ملکی که قصد خرید دارم مشکل قانونی ندارد.",
    },
    ers: {
      text: "فرمول تقسیم ارث پیچیده است. اگر در محاسبه سهم خود شک دارید، بپرسید.",
      btn: "سوال درباره سهم‌الارث",
      waMsg: "سلام. در مورد نحوه تقسیم ارث و محاسبه سهم قانونی سوال دارم.",
    },
    gharardad: {
      text: "بند «فورس ماژور» یا «حق فسخ» را چک کردید؟ این‌ها نجات‌دهنده هستند.",
      btn: "بررسی یک بند قرارداد",
      waMsg:
        "سلام. در مورد یکی از بندهای قراردادم سوال دارم. آیا این بند به ضرر من است؟",
    },
    jarayem: {
      text: "در پرونده کیفری، یک کلمه اشتباه در اظهارات اولیه می‌تواند علیه شما استفاده شود.",
      btn: "چه بگویم؟ (مشاوره)",
      waMsg:
        "سلام. احضاریه دارم و نمی‌دانم در اولین جلسه چه بگویم. لطفاً راهنمایی کنید.",
    },
    kar: {
      text: "نداشتن قرارداد کتبی مانع گرفتن حق و حقوق شما از کارفرما نیست.",
      btn: "سوال درباره حقوق معوقه",
      waMsg: "سلام. قرارداد کتبی ندارم اما حقوقم پرداخت نشده. چطور ثابت کنم؟",
    },
    default: {
      text: "این مبحث نکات ظریف قانونی دارد. اگر جایی برایتان مبهم است، بپرسید.",
      btn: "پرسیدن سوال کوتاه",
      waMsg:
        "سلام خانم توانگر. این مقاله را خواندم و یک سوال کوتاه در همین مورد دارم.",
    },
  };

  const content = DATA[categorySlug] || DATA.default;
  const phoneNumber = "09002450090";
  const rawPhone = phoneNumber.replace(/\D/g, "");

  // لینک هوشمند با پیام اختصاصی
  const waLink = `https://wa.me/98${rawPhone.substring(1)}?text=${encodeURIComponent(
    content.waMsg,
  )}`;

  return (
    <div className="my-12 w-full relative isolate group">
      {/* پترن پس‌زمینه بسیار محو برای جدا کردن باکس از متن */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 rounded-xl -skew-y-1 scale-[1.02] opacity-50 transition-transform group-hover:skew-y-0 group-hover:scale-100 duration-500" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-5 p-5 md:p-6 border-l-4 border-primary/70 bg-white dark:bg-[#151515] rounded-r-xl rounded-l-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
        {/* بخش متن: شبیه به یک نکته یا Insight */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="hidden md:flex items-start mt-1 text-primary/80">
            <CornerDownLeft size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-primary/90 uppercase tracking-widest opacity-80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              نکته حقوقی مهم
            </span>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-[15px] leading-7 md:text-base max-w-xl">
              {content.text}
            </p>
          </div>
        </div>

        {/* دکمه: سافت و غیر تهاجمی */}
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="w-full md:w-auto shrink-0 group/btn flex items-center justify-center gap-2.5 
          bg-primary/5 hover:bg-primary text-primary hover:text-white 
          border border-primary/20 hover:border-primary
          px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300"
        >
          <MessageCircleQuestion
            size={18}
            className="group-hover/btn:scale-110 transition-transform"
          />
          <span>{content.btn}</span>
        </a>
      </div>
    </div>
  );
}
