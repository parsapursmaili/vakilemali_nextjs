"use client";

import Image from "next/image";
import {
  Phone,
  CheckCircle2,
  AlertOctagon,
  ArrowLeft,
  Scale,
  Clock,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

// آیکون واتساپ ساده و مینیمال
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ArticleEndCTA({
  phoneNumber = "09000000000",
  lawyerName = "نام وکیل",
  lawyerTitle = "وکیل پایه یک دادگستری",
  bookingUrl = "/booking",
}) {
  const rawPhone = phoneNumber.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/98${rawPhone.substring(1)}?text=${encodeURIComponent(
    "سلام. می‌خواهم بدانم آیا پرونده من در تخصص شما هست یا خیر؟",
  )}`;

  return (
    <div
      id="main-cta-section"
      className="w-full max-w-5xl mx-auto px-4 py-20 direction-rtl font-sans"
    >
      <div className="relative bg-[#1e293b] rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border border-slate-700/50 overflow-hidden isolate">
        {/* Abstract Tech/Law Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-800/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-900/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row">
          {/* ستون اول: Authority & Filter (چپ چین در دسکتاپ برای فارسی) */}
          <div className="lg:w-[40%] bg-[#0f172a]/60 backdrop-blur-sm border-b lg:border-b-0 lg:border-l border-white/5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src="/lawyer-avatar.webp" // عکس باید جدی و حرفه‌ای باشد
                    alt={lawyerName}
                    fill
                    className="object-cover rounded-lg border border-slate-600 grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    {lawyerName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{lawyerTitle}</p>
                </div>
              </div>

              {/* The "Reframe" - تغییر زاویه دید */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                  <ShieldAlert size={16} />
                  چرا هر پرونده‌ای را نمی‌پذیریم؟
                </h4>
                <p className="text-sm text-slate-300 leading-7 text-justify">
                  تجربه نشان داده است که ۹۰٪ شکست‌ها در دادگاه، ناشی از
                  «استراتژی غلط اولیه» است. ما تنها پرونده‌هایی را می‌پذیریم که
                  پس از ارزیابی اولیه، اطمینان یابیم می‌توانیم ارزش واقعی برای
                  موکل خلق کنیم.
                </p>
              </div>
            </div>

            {/* آمار واقعی (Authority Proof) */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xl font-bold text-slate-200">
                  ٪۴۰
                </span>
                <span className="text-[10px] text-slate-500">
                  نرخ رد پرونده‌های ورودی
                </span>
              </div>
              <div>
                <span className="block text-xl font-bold text-slate-200">
                  ۱۵+
                </span>
                <span className="text-[10px] text-slate-500">
                  سال تمرکز تخصصی
                </span>
              </div>
            </div>
          </div>

          {/* ستون دوم: Commitment Ladder & Action */}
          <div className="lg:w-[60%] p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                مسیر پرونده خود را شفاف کنید
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                بدون آزمون و خطا پیش بروید. قبل از هر اقدامی، درخواست دهید تا
                پرونده شما توسط تیم حقوقی ارزیابی شود.
              </p>
            </div>

            {/* گیت تشخیص (Self-Diagnosis Gate) */}
            <div className="bg-slate-800/30 rounded-lg p-4 mb-8 border border-white/5">
              <p className="text-xs font-bold text-slate-300 mb-3 px-1">
                این بررسی مناسب شماست اگر:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500/80" />
                  به دنبال راهکار قطعی و قانونی هستید، نه وعده‌های توخالی.
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500/80" />
                  پرونده شما دارای پیچیدگی مالی یا ملکی است.
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500/80" />
                  اولویت شما حفظ سرمایه و زمان است، نه کمترین هزینه ظاهری.
                </li>
              </ul>
            </div>

            {/* اکشن اصلی - The Paid/Priority Gate */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={bookingUrl}
                className="flex-[2] group relative bg-slate-100 hover:bg-white text-slate-900 rounded-lg px-6 py-4 flex items-center justify-between transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <Scale size={18} className="text-amber-600" />
                    درخواست بررسی اولویت‌دار
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">
                    شامل: مطالعه پرونده + ارائه نقشه راه (۲۰ دقیقه)
                  </span>
                </div>
                <ArrowLeft
                  size={18}
                  className="text-slate-400 group-hover:-translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* مسیرهای فرعی - The Low Commitment Options */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-700/30">
              <p className="text-[11px] text-slate-500 font-medium">
                پرونده فوری نیست؟
              </p>
              <div className="flex gap-4">
                <a
                  href={`tel:${rawPhone}`}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={14} />
                  تماس با دفتر (ساعات اداری)
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  پیام در واتساپ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
