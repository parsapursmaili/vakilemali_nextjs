"use client";

import Image from "next/image";
import {
  Phone,
  ArrowLeft,
  Star,
  ShieldCheck,
  Clock,
  MessageSquare,
} from "lucide-react";

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ArticleEndCTA({
  phoneNumber = "09002450090",
  categorySlug = "default",
  lawyerName = "مرضیه توانگر",
  lawyerTitle = "وکیل پایه یک دادگستری",
}) {
  const DATA = {
    "chek-bargashi": {
      title: "چک برگشتی دارید؟ قبل از انتقال اموال اقدام کنید",
      sub: "هر ساعت تاخیر یعنی شانس کمتر برای وصول پول. همین حالا مدارک چک را بفرستید تا دستور توقیف اموال را بررسی کنیم.",
    },
    khanevade: {
      title: "پرونده خانواده؛ جای هیچ آزمون و خطایی نیست",
      sub: "یک توافق اشتباه در طلاق یا مهریه قابل جبران نیست. قبل از امضای هر برگه‌ای، اجازه دهید من شرایط را بررسی کنم.",
    },
    amlak: {
      title: "خطر کلاهبرداری در پرونده ملکی را جدی بگیرید",
      sub: "سرمایه یک عمر زندگی‌تان را ریسک نکنید. قرارداد شما باید بند به بند توسط وکیل بررسی شود تا راه کلاهبرداری بسته شود.",
    },
    ers: {
      title: "تقسیم ارث بدون جنگ و دعوای خانوادگی",
      sub: "اجازه ندهید اختلافات خانوادگی حق شما را ضایع کند. محاسبه دقیق سهم‌الارث و راهکار قانونی را از من بخواهید.",
    },
    gharardad: {
      title: "فسخ قرارداد و دریافت خسارت سنگین",
      sub: "اگر طرف مقابل به تعهدش عمل نکرده، قانون به شما حق فسخ و خسارت می‌دهد. متن قرارداد را بفرستید تا راهش را بگویم.",
    },
    jarayem: {
      title: "احضاریه دارید؟ خطر بازداشت وجود دارد",
      sub: "در پرونده کیفری، «چه بگویید» و «چه نگویید» مرز بین آزادی و زندان است. قبل از کلانتری، استراتژی دفاع را بچینید.",
    },
    kar: {
      title: "تمام حقوق معوقه خود را زنده کنید",
      sub: "کارفرما حق ندارد ریالی از حق شما را نادیده بگیرد. وصول مطالبات، سنوات و عیدی تخصص ماست.",
    },
    tejarat: {
      title: "کسب‌وکارتان را بیمه حقوقی کنید",
      sub: "تنظیم قراردادهای تجاری محکم یعنی آسودگی خیال. قبل از معامله، قرارداد را برای بررسی ارسال کنید.",
    },
    pezeshki: {
      title: "گرفتن دیه و خسارت قصور پزشکی",
      sub: "اثبات تقصیر پزشک سخت است اما غیرممکن نیست. پرونده پزشکی را بفرستید تا درصد موفقیت را بگویم.",
    },
    default: {
      title: "هنوز نگران نتیجه پرونده هستید؟",
      sub: "هیچ‌چیز بدتر از بلاتکلیفی نیست. مدارک را بفرستید، بررسی می‌کنم و رک و راست به شما می‌گویم شانستان چقدر است.",
    },
  };

  const content = DATA[categorySlug] || DATA.default;
  const rawPhone = phoneNumber.replace(/\D/g, "");
  const phoneHref = `tel:${rawPhone}`;
  // پیام هوشمندانه و بدون اصطکاک
  const WA_MSG =
    "سلام خانم توانگر، یک سوال حقوقی فوری دارم. امکانش هست پرونده را بررسی کنید؟";
  const whatsappHref = `https://wa.me/98${rawPhone.substring(1)}?text=${encodeURIComponent(WA_MSG)}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-1 md:px-0 py-16 md:py-24 font-sans direction-rtl">
      <div className="relative bg-slate-900 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-visible isolate mt-16 md:mt-0">
        {/* افکت‌های پس‌زمینه */}
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#128C7E]/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-stretch">
          {/* بخش آواتار و مشخصات وکیل */}
          <div className="relative z-10 w-full md:w-1/3 flex flex-col items-center md:items-start md:pr-10 mt-[-70px] md:mt-[-60px] mb-6 md:mb-0">
            <div className="relative group cursor-pointer mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1EBE5D]/40 to-[#128C7E]/40 blur-2xl opacity-70 animate-pulse"></div>

              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-slate-900 bg-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/uploads/lawyer-avatar.webp"
                  alt={lawyerName}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 160px, 200px"
                />
              </div>

              {/* نشان وضعیت آنلاین واقعی */}
              <div className="absolute bottom-2 right-0 md:right-5 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg z-20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span>پاسخگویی آنلاین</span>
              </div>
            </div>

            <div className="text-center md:text-right md:mr-4">
              <h3 className="text-white font-black text-xl md:text-2xl drop-shadow-md leading-tight">
                {lawyerName}
              </h3>
              <p className="text-gray-400 text-sm font-medium mt-1">
                {lawyerTitle}
              </p>
              {/* Social Proof ستاره‌دار */}
              <div className="flex items-center justify-center md:justify-start gap-1 mt-3 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <span className="text-white/90 text-xs font-bold mr-1">
                  ۴.۹/۵
                </span>
                <span className="text-white/50 text-[10px] mr-1">
                  (۳۱۲ نظر)
                </span>
              </div>
            </div>
          </div>

          {/* بخش محتوا و دکمه‌ها */}
          <div className="w-full md:w-2/3 px-5 pb-8 pt-2 md:py-12 md:pl-12 flex flex-col justify-center text-center md:text-right relative z-0">
            <div className="space-y-4 mb-8">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-1 rounded-full text-[11px] md:text-xs font-bold animate-pulse">
                  <Clock size={14} />
                  <span>پاسخگویی در سریع ترین زمان ممکن</span>
                </div>
              </div>

              <h2 className="text-[24px] md:text-3xl lg:text-[36px] font-black text-white leading-tight">
                {content.title}
              </h2>

              <p className="text-gray-300 text-sm md:text-[16px] leading-8 max-w-2xl mx-auto md:mx-0 font-light opacity-95">
                {content.sub}
              </p>
            </div>

            {/* آمار (Social Proof) */}
            <div className="grid grid-cols-3 gap-2 md:gap-8 border-t border-white/10 pt-6 mb-8">
              {/* آیتم ۱: سابقه */}
              <div className="flex flex-col items-center md:items-start">
                <span className="font-black text-lg md:text-2xl text-white">
                  +۱۳ سال
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                  سابقه وکالت
                </span>
              </div>
              {/* آیتم ۲: پرونده‌ها */}
              <div className="flex flex-col items-center md:items-start border-r border-white/10 md:border-none pr-2 md:pr-0">
                <span className="font-black text-lg md:text-2xl text-white">
                  +۲۰۰۰
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                  پرونده موفق
                </span>
              </div>
              {/* آیتم ۳: نجات پرونده */}
              <div className="flex flex-col items-center md:items-start border-r border-white/10 md:border-none pr-2 md:pr-0">
                <div className="flex items-center gap-1 text-green-400 font-bold text-[10px] md:text-xs mb-1">
                  <ShieldCheck size={14} />
                  <span>تضمین بررسی</span>
                </div>
                <span className="text-[10px] md:text-xs text-gray-400">
                  توسط شخص وکیل
                </span>
              </div>
            </div>

            {/* ناحیه دکمه‌ها (Ultimate Action) */}
            <div className="flex flex-col gap-3 w-full relative">
              {/* متن کمیابی (Scarcity Trigger) */}
              <p className="text-red-300 text-[11px] font-bold animate-pulse">
                ⚠️ اقدام سریع می‌تواند جلوی ضرر مالی یا حقوقی را بگیرد
              </p>

              <div className="flex flex-col md:flex-row gap-3">
                {/* دکمه اصلی (واتساپ) */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden flex-[1.6] bg-gradient-to-r from-[#1EBE5D] to-[#128C7E] hover:from-[#2ecc71] hover:to-[#16a085] text-white font-black text-[15px] md:text-lg py-4 px-6 rounded-xl shadow-[0_6px_25px_-5px_rgba(18,140,126,0.4)] transition-all active:scale-98 hover:-translate-y-1 flex items-center justify-center gap-3 border border-white/10"
                >
                  {/* انیمیشن درخشش */}
                  <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

                  <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7 relative z-10 fill-white shrink-0" />
                  <div className="flex flex-col items-start leading-none relative z-10">
                    <span>ارسال مدارک برای بررسی</span>
                    <span className="text-[10px] md:text-[11px] opacity-90 font-medium mt-1 text-white/90">
                      پاسخ فوری و رایگان • بدون تعهد
                    </span>
                  </div>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform relative z-10 mr-auto shrink-0 opacity-80" />
                </a>

                {/* دکمه ثانویه (تماس) */}
                <a
                  href={phoneHref}
                  className="flex-1 border-2 border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-bold text-[14px] md:text-[16px] py-4 px-4 rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 group"
                >
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white">
                    تماس تلفنی
                  </span>
                </a>
              </div>

              {/* Micro-Commitment Text */}
              <p className="text-[10px] text-center md:text-right text-white/40 mt-1">
                پیام شما کاملاً محرمانه می‌ماند و مستقیماً توسط وکیل خوانده
                می‌شود.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
