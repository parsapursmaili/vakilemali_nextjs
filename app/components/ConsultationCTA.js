"use client";

import Image from "next/image";
import {
  Phone,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Users,
  Briefcase,
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
  const CALL_BTN_TEXT = "بررسی اولیه پرونده (۵ دقیقه)";
  const WA_DEFAULT_MSG = "سلام، نیاز به بررسی پرونده به صورت رایگان دارم.";

  const DATA = {
    "chek-bargashi": {
      title: "چک برگشتی دارید؟ نگران نباشید.",
      sub: "زمان مهم‌ترین فاکتور شماست. قبل از اینکه اموال بدهکار منتقل شود، همین حالا برای توقیف اموال و حکم جلب اقدام کنید.",
    },
    khanevade: {
      title: "پرونده خانواده؛ جای آزمون و خطا نیست",
      sub: "یک تصمیم اشتباه در طلاق یا مهریه می‌تواند آینده مالی شما را نابود کند. با استراتژی درست و قانونی حق خود را بگیرید.",
    },
    amlak: {
      title: "خطر کلاهبرداری در معاملات ملکی!",
      sub: "سرمایه یک عمر زندگی‌تان را به خطر نیندازید. قبل از هر امضا یا پرداخت وجه، قرارداد را توسط وکیل متخصص بررسی کنید.",
    },
    ers: {
      title: "تقسیم ارث بدون درگیری و اختلاف",
      sub: "محاسبه دقیق سهم‌الارث و انحصار وراثت را به قانون بسپارید تا از تضییع حقوق وراث جلوگیری شود.",
    },
    gharardad: {
      title: "فسخ قرارداد و دریافت خسارت",
      sub: "طرف مقابل به تعهداتش عمل نکرده؟ ما راهکارهای قانونی برای دریافت خسارت و فسخ فوری قرارداد را به شما نشان می‌دهیم.",
    },
    jarayem: {
      title: "احضاریه دادگاه دارید؟",
      sub: "در پرونده‌های کیفری، اولین اظهارات شما سرنوشت‌ساز است. قبل از حضور در کلانتری، حتماً خط دفاعی خود را تنظیم کنید.",
    },
    kar: {
      title: "شکایت کارگر و کارفرما",
      sub: "تمام حقوق قانونی خود (سنوات، بیمه، عیدی) را طبق قانون کار زنده کنید. ما تا دریافت آخرین ریال همراه شما هستیم.",
    },
    tejarat: {
      title: "امنیت حقوقی کسب‌وکار شما",
      sub: "تنظیم قراردادهای تجاری محکم و وصول مطالبات شرکتی، تخصص ماست. تجارت خود را بیمه حقوقی کنید.",
    },
    pezeshki: {
      title: "جبران خسارت قصور پزشکی",
      sub: "اگر قربانی خطای پزشکی شده‌اید، دریافت دیه و اثبات تقصیر حق شماست. پرونده را به متخصص این حوزه بسپارید.",
    },
    default: {
      title: "هنوز سوال بی‌پاسخ دارید؟",
      sub: "هیچ‌چیز جایگزین مشورت با یک وکیل باسابقه نمی‌شود. همین حالا تماس بگیرید و مسیر پرونده خود را شفاف کنید.",
    },
  };

  const content = DATA[categorySlug] || DATA.default;
  const rawPhone = phoneNumber.replace(/\D/g, "");
  const phoneHref = `tel:${rawPhone}`;
  const whatsappHref = `https://wa.me/98${rawPhone.substring(
    1
  )}?text=${encodeURIComponent(WA_DEFAULT_MSG)}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-1 md:px-0 py-12 md:py-20 font-sans direction-rtl">
      <div className="relative bg-slate-900 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.7)] overflow-visible isolate mt-16 md:mt-0">
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-stretch">
          <div className="relative z-10 w-full md:w-1/3 flex flex-col items-center md:items-start md:pr-10 mt-[-60px] md:mt-[-50px] mb-6 md:mb-0">
            <div className="relative group cursor-pointer mb-3">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/40 to-orange-600/40 blur-xl opacity-60 animate-pulse"></div>

              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-[5px] border-slate-900 bg-slate-800 shadow-2xl overflow-hidden">
                <Image
                  src="/lawyer-avatar.webp"
                  alt={lawyerName}
                  fill
                  className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 150px, 220px"
                />
              </div>

              <div className="absolute bottom-1 right-[-5px] md:right-4 bg-slate-900 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1.5 shadow-lg z-20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>آنلاین</span>
              </div>
            </div>

            <div className="text-center md:text-right md:mr-3">
              <h3 className="!text-white font-black text-lg md:text-xl drop-shadow-md leading-tight">
                {lawyerName}
              </h3>
              <p className="!text-gray-400 text-xs md:text-sm font-medium mt-1">
                {lawyerTitle}
              </p>
            </div>
          </div>

          <div className="w-full md:w-2/3 px-4 pb-6 pt-0 md:py-10 md:pl-10 flex flex-col justify-center text-center md:text-right relative z-0">
            <div className="space-y-3 mb-6 md:mb-8">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-[11px] md:text-xs font-bold">
                  <ShieldCheck size={14} />
                  <span>بررسی اولیه پرونده رایگان</span>
                </div>
              </div>

              <h2 className="text-[22px] md:text-3xl lg:text-[34px] font-black !text-white leading-tight">
                {content.title}
              </h2>

              <p className="text-gray-300 text-sm md:text-base leading-7 max-w-2xl mx-auto md:mx-0 font-light opacity-90">
                {content.sub}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 md:gap-6 border-t border-white/10 pt-5 mb-6 md:mb-8">
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1 font-black text-lg md:text-2xl !text-white">
                  +۱۳{" "}
                  <Briefcase
                    size={16}
                    className="text-amber-500 md:w-5 md:h-5"
                  />
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                  سال سابقه
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1 font-black text-lg md:text-2xl !text-white">
                  +۲۰۰۰{" "}
                  <Users size={16} className="text-amber-500 md:w-5 md:h-5" />
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                  پرونده موفق
                </span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="flex items-center gap-1 font-black text-lg md:text-2xl !text-white">
                  +۹۵٪{" "}
                  <TrendingUp
                    size={16}
                    className="text-green-500 md:w-5 md:h-5"
                  />
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                    درصد موفقیت
                  </span>
                  <span className="text-[8px] md:text-[9px] text-gray-500 font-light scale-90 md:scale-100 origin-top">
                    منبع: سامانه سنا
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
              <a
                href={phoneHref}
                className="group relative overflow-hidden flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 !text-white font-black text-[13px] md:text-[15px] lg:text-lg py-3.5 md:py-4 px-2 md:px-4 rounded-xl shadow-[0_4px_20px_-5px_rgba(249,115,22,0.4)] transition-transform active:scale-98 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <Phone className="w-4 h-4 md:w-5 md:h-5 fill-white relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">
                  {CALL_BTN_TEXT}
                </span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#2ecc71] hover:to-[#16a085] !text-white font-bold text-[14px] md:text-lg py-3.5 md:py-4 px-4 rounded-xl shadow-[0_4px_20px_-5px_rgba(37,211,102,0.4)] transition-transform active:scale-98 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <WhatsAppIcon className="w-5 h-5 md:w-6 md:h-6 relative z-10 fill-white shrink-0" />
                <div className="flex flex-col items-start leading-none relative z-10">
                  <span className="text-[12px] md:text-[15px]">
                    پرسش سوال در واتساپ
                  </span>
                  <span className="text-[9px] md:text-[10px] opacity-90 font-light">
                    + بررسی اولیه رایگان
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform relative z-10 mr-auto shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
