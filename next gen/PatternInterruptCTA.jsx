"use client";

import { useState } from "react";
import {
  FileWarning,
  Scale,
  AlertTriangle,
  ChevronLeft,
  ShieldAlert,
  History,
  FileSignature,
  Home,
  User,
  Building2,
  Stethoscope,
  Briefcase,
} from "lucide-react";
import ConsultationModal from "./ConsultationModal";

// --- دیکشنری محتوای اختصاصی برای ۱۰ دسته‌بندی ---
const CATEGORY_CONTENT = {
  // 1: چک برگشتی
  1: {
    title: "نکته فنی: آیا «وصف کیفری» چک زایل شده است؟",
    body: "بسیاری از دارندگان چک نمی‌دانند که یک اشتباه کوچک در «تاریخ گواهی عدم پرداخت» یا نحوه پر کردن لاشه چک، حق شکایت کیفری و حکم جلب فوری را برای همیشه از بین می‌برد. آیا مطمئنید چک شما هنوز ارزش کیفری دارد؟",
    icon: <FileWarning className="w-full h-full" />,
    btn: "بررسی فوری وضعیت چک",
  },
  // 2: مهریه، طلاق و خانواده
  2: {
    title: "هشدار حقوقی: توافقات شفاهی در دادگاه اعتبار ندارند",
    body: "در پرونده‌های خانواده، یک امضای اشتباه روی «صورت‌جلسه توافقی» یا عدم ثبت دقیق «شروط ضمن عقد»، می‌تواند مسیر پرونده را کاملاً علیه شما تغییر دهد. قبل از هر اقدامی، اعتبار مدارک خود را بسنجید.",
    icon: <User className="w-full h-full" />,
    btn: "آنالیز ریسک پرونده خانواده",
  },
  // 3: املاک و مستغلات
  3: {
    title: "خطر ملکی: آیا «خیارات قانونی» را اسقاط کرده‌اید؟",
    body: "در ۹۰٪ مبایعه‌نامه‌ها، بندی وجود دارد که حق فسخ را از شما می‌گیرد بدون اینکه متوجه شوید. اگر طرف مقابل به تعهدش عمل نکند، دست شما بسته است. همین حالا قرارداد خود را برای یافتن این حفره‌ها بررسی کنید.",
    icon: <Home className="w-full h-full" />,
    btn: "بررسی حفره‌های قرارداد ملکی",
  },
  // 4: ارث و انحصار وراثت
  4: {
    title: "نکته فنی وراثت: قبول ترکه یعنی قبول بدهی‌ها!",
    body: "آیا می‌دانستید اگر بدون «تحریر ترکه» ارث را قبول کنید، قانوناً مسئول پرداخت تمام بدهی‌های متوفی (حتی بیشتر از ارثیه) خواهید بود؟ قبل از امضای هر سندی، لیست دارایی و بدهی باید تکنیکال بررسی شود.",
    icon: <History className="w-full h-full" />,
    btn: "مشاوره فوری انحصار وراثت",
  },
  // 5: قراردادها و تعهدات
  5: {
    title: "دام حقوقی: بند «داوری» می‌تواند شما را نابود کند",
    body: "وجود یک بند داوری مبهم در قرارداد، حق مراجعه به دادگستری را از شما می‌گیرد. بسیاری از افراد به خاطر همین یک جمله، سال‌ها در راهروهای حل اختلاف سرگردان می‌شوند. قرارداد شما نیاز به اسکن حقوقی دارد.",
    icon: <FileSignature className="w-full h-full" />,
    btn: "اسکن قرارداد و تعهدات",
  },
  // 6: جرایم کیفری و شکایات
  6: {
    title: "هشدار قرمز: اظهارات اولیه شما قابل تغییر نیستند",
    body: "آنچه در ۲۴ ساعت اول در کلانتری یا بازپرسی می‌نویسید، سند مرگ و زندگی پرونده است. یک کلمه اشتباه می‌تواند عنوان اتهامی را سنگین‌تر کند. آیا اظهارات شما از نظر حقوقی بی‌نقص است؟",
    icon: <ShieldAlert className="w-full h-full" />,
    btn: "بررسی اضطراری وضعیت پرونده",
  },
  // 7: قانون کار
  7: {
    title: "قانون کار: فرم تسویه حساب سفید امضا کردید؟",
    body: "بسیاری از کارفرمایان یا کارگران با امضای یک برگه تسویه حساب عادی، ناخواسته تمام حقوق سنوات و بیمه خود را از دست می‌دهند. اثبات بی‌‌اعتباری این برگه نیاز به استراتژی دقیق و بررسی مدارک دارد.",
    icon: <Briefcase className="w-full h-full" />,
    btn: "بررسی مدارک شغلی",
  },
  // 8: شرکت‌ها و تجارت
  8: {
    title: "خطر تجاری: مسئولیت تضامنی مدیران را جدی بگیرید",
    body: "در شرکت‌ها، گاهی امضای یک چک یا سفته توسط مدیرعامل، اموال شخصی او را هم درگیر بدهی‌های شرکت می‌کند. مرز بین «شخصیت حقوقی» و «حقیقی» در اسناد شما کجاست؟",
    icon: <Building2 className="w-full h-full" />,
    btn: "آنالیز اسناد تجاری",
  },
  // 9: قصور پزشکی
  9: {
    title: "نکته پزشکی: رضایت‌نامه عمل به معنای برائت نیست",
    body: "پزشکان فکر می‌کنند گرفتن رضایت‌نامه یعنی مصونیت کامل، و بیماران فکر می‌کنند دیگر حق شکایت ندارند. هر دو اشتباه می‌کنند. اثبات «قصور» یا «برائت» به مستندات پرونده بالینی وابسته است.",
    icon: <Stethoscope className="w-full h-full" />,
    btn: "بررسی پرونده پزشکی",
  },
  // 10: سایر (پیش‌فرض)
  default: {
    title: "نکته فنی: آیا مدارک شما برای دادگاه محکمه‌پسند است؟",
    body: "بسیاری از افراد حق با آن‌هاست، اما به دلیل «نقص شکلی» در مدارک و عدم رعایت «مواعد قانونی»، پرونده را می‌بازند. قبل از هر اقدامی، از کامل بودن مستندات خود مطمئن شوید.",
    icon: <Scale className="w-full h-full" />,
    btn: "بررسی رایگان مدارک شما",
  },
};

export default function PatternInterruptCTA({ categoryId }) {
  const [isOpen, setIsOpen] = useState(false);

  // انتخاب محتوا بر اساس ID دسته‌بندی یا استفاده از پیش‌فرض
  const content = CATEGORY_CONTENT[categoryId] || CATEGORY_CONTENT.default;

  return (
    <>
      <div className="w-full my-12 md:my-16 relative group select-none dir-rtl">
        {/* 1. Visual Engineering: Native Camouflage Container */}
        {/* رنگ زمینه: Zinc-50 | بوردر سمت راست: سبز برند #1B5E20 */}
        <div className="relative w-full bg-zinc-50 dark:bg-zinc-900/40 border-r-[6px] border-[#1B5E20] rounded-l-xl overflow-hidden p-5 md:p-8 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300">
          {/* 2. Watermark Icons (Visual Noise - Background) */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 text-zinc-200 dark:text-zinc-800 opacity-60 -rotate-12 pointer-events-none">
            {content.icon}
          </div>
          <Scale
            className="absolute top-4 left-1/4 w-16 h-16 text-zinc-200 dark:text-zinc-800 opacity-40 pointer-events-none"
            strokeWidth={1}
          />

          {/* 3. Content Architecture */}
          <div className="relative z-10 flex flex-col items-start text-right">
            {/* The Hook: Alert Header */}
            <div className="flex items-center gap-2 mb-3 text-[#1B5E20] dark:text-[#4caf50]">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="font-extrabold text-sm md:text-[15px] tracking-wide uppercase">
                نکته حیاتی و فنی
              </span>
            </div>

            {/* The Question (Doubt Inducer) */}
            <h3 className="text-lg md:text-[22px] font-black text-zinc-800 dark:text-zinc-100 leading-snug mb-4">
              {content.title}
            </h3>

            {/* The Gap (Problem Description) */}
            <p className="text-zinc-600 dark:text-zinc-400 text-[15px] md:text-[17px] leading-7 md:leading-8 mb-7 max-w-2xl font-medium text-justify">
              {content.body}
            </p>

            {/* 4. The Action Mechanism */}
            <button
              onClick={() => setIsOpen(true)}
              className="w-full md:w-auto min-h-[52px] flex items-center justify-center md:justify-between gap-4 bg-[#1B5E20] hover:bg-[#144a18] text-white text-[16px] font-bold py-3 px-8 rounded-lg transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-xl cursor-pointer"
            >
              <span>{content.btn}</span>
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-[11px] text-zinc-400 mt-3 mr-1 font-medium">
              * تحلیل اولیه ریسک پرونده توسط تیم حقوقی
            </span>
          </div>
        </div>
      </div>

      {/* 5. The Modal Triggered Directly */}
      <ConsultationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
