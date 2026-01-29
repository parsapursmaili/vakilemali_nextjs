"use client";

import Image from "next/image";
import {
  Phone,
  ShieldCheck,
  CalendarCheck,
  Lock,
  ArrowLeft,
  Star,
  Clock,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

// WhatsApp Icon
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
  bookingUrl = "/booking",
}) {
  const WA_SALES_MSG =
    "سلام. درخواست امکان‌سنجی پرونده را دارم.\n۱) آیا پرونده من ارزش پیگیری دارد؟\n۲) هزینه وکالت چقدر است؟";

  // Data strategy: Threat first, Solution second
  const DATA = {
    "chek-bargashi": {
      title: "هشدار: زمان به نفع بدهکار است",
      sub: "هر روز تأخیر، شانس انتقال اموال توسط بدهکار را بیشتر می‌کند. همین الان برای توقیف فوری و جلب اقدام کنید، فردا دیر است.",
      badge: "فوریت: بسیار بالا",
    },
    khanevade: {
      title: "تصمیم احساسی = ضرر مالی سنگین",
      sub: "در پرونده‌های خانواده، یک امضا یا توافق اشتباه می‌تواند تمام حقوق مالی (مهریه، نفقه، تنصیف) شما را از بین ببرد. بدون استراتژی وارد دادگاه نشوید.",
      badge: "حساسیت مالی: بالا",
    },
    amlak: {
      title: "سرمایه ملکی خود را قمار نکنید",
      sub: "کلاهبرداران ملکی روی ناآگاهی شما حساب می‌کنند. قبل از هرگونه امضا یا پرداخت، اسناد را توسط وکیل بررسی کنید تا سرمایه زندگی‌تان حفظ شود.",
      badge: "ریسک: بحرانی",
    },
    default: {
      title: "پرونده حقوقی شوخی نیست",
      sub: "دادگاه جای آزمون و خطا نیست. یک اشتباه کوچک می‌تواند روند پرونده را برای همیشه تغییر دهد. با استراتژی وکیل متخصص جلو بروید.",
      badge: "بررسی تخصصی پرونده",
    },
  };

  const content = DATA[categorySlug] || DATA.default;
  const rawPhone = phoneNumber.replace(/\D/g, "");
  const phoneHref = `tel:${rawPhone}`;
  const whatsappHref = `https://wa.me/98${rawPhone.substring(1)}?text=${encodeURIComponent(WA_SALES_MSG)}`;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 direction-rtl font-sans">
      <div className="relative bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] border border-slate-700/50 overflow-hidden isolate group">
        {/* Background Gradients - Darker & More Professional */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] bg-slate-800 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Authority (Persuasion) */}
          <div className="lg:col-span-4 relative bg-slate-800/40 border-b lg:border-b-0 lg:border-l border-white/5 p-8 lg:p-10 flex flex-col items-center lg:items-start text-center lg:text-right backdrop-blur-sm">
            {/* Scarcity Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              پذیرش محدود: اولویت با رزرو
            </div>

            {/* Avatar Authority */}
            <div className="relative w-28 h-28 lg:w-40 lg:h-40 mb-5 group-hover:scale-105 transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full blur-2xl opacity-20"></div>
              <Image
                src="/lawyer-avatar.webp"
                alt={lawyerName}
                fill
                className="object-cover rounded-full border-[3px] border-slate-700 shadow-2xl relative z-10"
              />
              <div className="absolute bottom-0 -right-1 bg-slate-800 border border-slate-600 p-2 rounded-full z-20 shadow-lg text-amber-500">
                <ShieldCheck size={20} />
              </div>
            </div>

            <h3 className="text-xl font-black text-white mb-1">{lawyerName}</h3>
            <p className="text-slate-400 text-sm font-medium mb-6">
              {lawyerTitle}
            </p>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 gap-4 w-full border-t border-white/5 pt-6 mt-auto">
              <div>
                <span className="block text-2xl font-black text-white tracking-tight">
                  +۱۳{" "}
                  <span className="text-sm font-medium text-slate-500 align-top">
                    سال
                  </span>
                </span>
                <span className="text-xs text-slate-400">تجربه وکالت</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white tracking-tight">
                  ۹۸٪
                </span>
                <span className="text-xs text-slate-400">پرونده موفق</span>
              </div>
            </div>
          </div>

          {/* Right Column: Action (Revenue Focus) */}
          <div className="lg:col-span-8 p-6 md:p-10 lg:p-14 flex flex-col justify-center">
            <div className="mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold mb-4 uppercase tracking-wider">
                <AlertTriangle size={12} />
                {content.badge}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {content.title}
              </h2>
              <p className="text-slate-300 text-base md:text-lg font-normal leading-relaxed max-w-2xl opacity-90">
                {content.sub}
              </p>
            </div>

            {/* The "Forced Choice" Stack */}
            <div className="flex flex-col gap-4 max-w-2xl">
              {/* 1. Primary PAID Action (Massive & Dominant) */}
              <a
                href={bookingUrl}
                className="group/btn relative w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl p-[1px] shadow-[0_10px_40px_-10px_rgba(234,88,12,0.4)] hover:shadow-[0_20px_60px_-15px_rgba(234,88,12,0.6)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-xl px-5 py-5 md:py-6 flex items-center justify-between border-b-4 border-orange-800/30">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="bg-white/20 p-3 rounded-xl text-white shadow-inner">
                      <Briefcase className="w-7 h-7 md:w-9 md:h-9" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-lg md:text-2xl font-black text-white tracking-tight">
                        رزرو تحلیل تخصصی پرونده
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs md:text-sm font-medium text-orange-50">
                        <span className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded">
                          <Clock size={12} /> ۲۰ دقیقه مکالمه
                        </span>
                        <span className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded">
                          <Star size={12} className="fill-white" /> راهکار
                          تضمینی
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full p-2 group-hover/btn:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </a>

              {/* 2. Secondary Actions (Muted) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                {/* Office Call */}
                <a
                  href={phoneHref}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white py-3.5 rounded-lg transition-colors text-sm font-bold"
                >
                  <Phone size={16} />
                  تماس با دفتر وکالت
                </a>

                {/* WhatsApp (Now permitted here as secondary) */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-[#25D366]/10 border border-slate-700 hover:border-[#25D366]/30 text-slate-300 hover:text-[#25D366] py-3.5 rounded-lg transition-all text-sm font-bold group"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  امکان‌سنجی در واتساپ
                </a>
              </div>

              {/* Trust/Privacy Footer */}
              <div className="flex items-center justify-start gap-4 pt-3 px-1 opacity-50">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Lock size={10} />
                  اطلاعات محرمانه
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <CalendarCheck size={10} />
                  تضمین زمان‌بندی دقیق
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
