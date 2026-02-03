"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Copy,
  ChevronLeft,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success
  const [isCopied, setIsCopied] = useState(false);

  // هندل کردن سابمیت فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    // شبیه‌سازی ارسال به سرور
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", phone: "", subject: "", message: "" });
    }, 2000);
  };

  // هندل کردن کپی آدرس
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      "تهران، خیابان شریعتی، خروجی همت، روبروی پارک کوروش، نبش پیروز، ساختمان شریعتی، طبقه همکف، واحد ۴",
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] selection:bg-[var(--accent)] selection:text-white pb-20 font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-[var(--primary)] pt-36 pb-32 md:pb-48 overflow-hidden isolate">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
        {/* نویز خفیف برای بافت‌دار کردن پس‌زمینه */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Orbs / Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary-light)]/30 blur-[120px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[var(--accent)] text-xs md:text-sm font-bold backdrop-blur-md mb-8 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)]"></span>
            </span>
            پذیرش وکالت تخصصی
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.2]">
            گفتگو با{" "}
            <span className="text-[var(--accent)] drop-shadow-sm inline-block relative">
              وکیل پایه یک
              <svg
                className="absolute -bottom-2 w-full h-2 md:h-3 text-[var(--accent)] opacity-40 left-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
            <br className="hidden md:block" /> برای حل چالش‌های حقوقی
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-8 font-light mb-8">
            مسیر درست قانونی را از همان ابتدا انتخاب کنید. ما آماده‌ایم تا با
            بررسی دقیق پرونده، بهترین راهکار را به شما ارائه دهیم.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <CheckCircle2 size={16} className="text-[var(--accent)]" />
              <span>پاسخگویی سریع</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <ShieldCheck size={16} className="text-[var(--accent)]" />
              <span>تضمین محرمانگی</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <div className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDE: Contact Info (Bento Grid Style) */}
          <div className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">
            {/* 1. Phone Card (Premium) */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[var(--accent)]/10 transition-colors"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/5 text-[var(--primary)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h3 className="text-gray-500 font-bold text-sm mb-1">
                      شماره تماس مستقیم
                    </h3>
                    <p className="text-[var(--primary)] font-black text-2xl md:text-3xl tracking-wide dir-ltr">
                      0900 245 0090
                    </p>
                  </div>
                </div>

                <a
                  href="tel:09002450090"
                  className="flex items-center justify-between w-full p-4 rounded-xl bg-[var(--primary)] text-white font-bold transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:-translate-y-1 shadow-lg shadow-[var(--primary)]/30 group-hover:shadow-[var(--accent)]/30 active:scale-[0.98]"
                >
                  <span>تماس تلفنی فوری</span>
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <ChevronLeft size={20} />
                  </div>
                </a>
              </div>
            </div>

            {/* 2. WhatsApp Button (BIG & ATTRACTIVE) */}
            <a
              href="https://wa.me/989002450090"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] p-1 rounded-3xl shadow-xl shadow-[#25D366]/20 group hover:shadow-2xl hover:shadow-[#25D366]/40 hover:-translate-y-1 transition-all duration-300 block active:scale-[0.98]"
            >
              <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-[20px] p-5 flex items-center gap-5 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10  bg-center bg-no-repeat bg-contain blur-sm scale-150 translate-x-10"></div>

                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle
                    size={32}
                    className="text-[#25D366]"
                    fill="currentColor"
                  />
                </div>

                <div className="flex flex-col text-white relative z-10">
                  <span className="font-bold text-xs md:text-sm opacity-90 mb-1">
                    گفتگو در واتساپ
                  </span>
                  <span className="font-black text-xl md:text-2xl leading-none">
                    ارسال پیام به وکیل
                  </span>
                  <span className="text-[10px] md:text-xs mt-2 bg-white/20 w-fit px-2 py-0.5 rounded-md backdrop-blur-sm">
                    پاسخگویی معمولاً زیر ۱ ساعت
                  </span>
                </div>

                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-[#128C7E] transition-all">
                  <ArrowLeft size={20} />
                </div>
              </div>
            </a>

            {/* 3. Address & Map Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:border-[var(--accent)] transition-all duration-300">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                      <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-[var(--primary)] text-lg">
                      آدرس دفتر
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="text-xs font-bold text-gray-400 hover:text-[var(--accent)] flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-[var(--accent)]/10 transition-all active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-green-600">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        کپی آدرس
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 leading-7 font-medium">
                  تهران، خیابان شریعتی، خروجی همت، روبروی پارک کوروش، نبش پیروز،
                  ساختمان شریعتی، طبقه همکف، واحد ۴
                </p>
              </div>

              {/* MAP FRAME */}
              <div className="w-full h-56 mt-4 relative">
                <div className="absolute inset-0 z-10 bg-[var(--primary)]/0 group-hover:bg-transparent pointer-events-none transition-colors"></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259.00305089569133!2d51.44937662468776!3d35.749075571971765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e040a5967f983%3A0x13f7ad187a22d3a5!2z2LPYp9iu2KrZhdin2YYg2b7Ysti02qnYp9mGINi02LHbjNi52KrbjA!5e1!3m2!1sfa!2sus!4v1765373414141!5m2!1sfa!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                ></iframe>
              </div>
            </div>

            {/* 4. Trust Box */}
            <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex text-amber-400 gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-500">
                  رضایت موکلین
                </span>
              </div>
              <div className="text-left">
                <span className="block font-black text-xl text-[var(--primary)]">
                  ۹۶٪
                </span>
                <span className="text-[10px] text-gray-400">
                  نرخ موفقیت پرونده‌ها
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Contact Form (High-End Design) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-gray-300/50 border border-white/50 relative overflow-hidden backdrop-blur-xl">
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]"></div>

              <div className="mb-8 md:mb-10 relative z-10">
                <h2 className="text-2xl md:text-4xl font-black text-[var(--primary)] mb-3">
                  درخواست بررسی{" "}
                  <span className="text-[var(--accent)]">تخصصی</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  لطفاً اطلاعات زیر را تکمیل کنید. ما متعهد هستیم که ظرف حداکثر
                  ۲ ساعت کاری، شرایط پرونده شما را بررسی و نتیجه را اعلام کنیم.
                </p>
              </div>

              {status === "success" ? (
                // SUCCESS STATE
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-2 border-green-100 shadow-inner">
                    <CheckCircle2
                      size={48}
                      className="text-green-600 drop-shadow-sm"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--primary)] mb-3">
                    درخواست شما ثبت شد
                  </h3>
                  <p className="text-gray-500 text-center max-w-sm mb-8 leading-7">
                    اطلاعات شما با موفقیت در سیستم ثبت گردید. کارشناسان حقوقی ما
                    به زودی با شماره ثبت شده تماس خواهند گرفت.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 rounded-xl bg-gray-100 text-[var(--foreground)] font-bold hover:bg-gray-200 transition-colors"
                  >
                    ارسال درخواست جدید
                  </button>
                </div>
              ) : (
                // FORM STATE
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 relative z-10"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="group">
                      <label className="text-xs font-bold text-[var(--primary)] mb-2 block group-focus-within:text-[var(--accent)] transition-colors">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full h-14 px-5 rounded-2xl bg-[#F8F9FA] border-2 border-transparent text-[var(--foreground)] font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_4px_20px_rgba(197,137,47,0.15)] placeholder:text-gray-300"
                        placeholder="مثال: رضا علوی"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="text-xs font-bold text-[var(--primary)] mb-2 block group-focus-within:text-[var(--accent)] transition-colors">
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        className="w-full h-14 px-5 rounded-2xl bg-[#F8F9FA] border-2 border-transparent text-[var(--foreground)] font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_4px_20px_rgba(197,137,47,0.15)] placeholder:text-gray-300 text-right"
                        placeholder="0912..."
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="group">
                    <label className="text-xs font-bold text-[var(--primary)] mb-2 block group-focus-within:text-[var(--accent)] transition-colors">
                      موضوع پرونده
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-2xl bg-[#F8F9FA] border-2 border-transparent text-[var(--foreground)] font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_4px_20px_rgba(197,137,47,0.15)] appearance-none cursor-pointer"
                        value={formState.subject}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            subject: e.target.value,
                          })
                        }
                      >
                        <option value="">موضوع را انتخاب کنید...</option>
                        <option value="check">دعاوی چک و سفته</option>
                        <option value="family">
                          دعاوی خانواده (طلاق و مهریه)
                        </option>
                        <option value="real-estate">دعاوی ملکی و ثبتی</option>
                        <option value="contracts">تنظیم و فسخ قرارداد</option>
                        <option value="criminal">پرونده‌های کیفری</option>
                        <option value="other">سایر موارد حقوقی</option>
                      </select>
                      <ChevronLeft
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none -rotate-90"
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="text-xs font-bold text-[var(--primary)] mb-2 block group-focus-within:text-[var(--accent)] transition-colors">
                      شرح مختصر
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-5 rounded-2xl bg-[#F8F9FA] border-2 border-transparent text-[var(--foreground)] font-medium outline-none transition-all duration-300 focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_4px_20px_rgba(197,137,47,0.15)] placeholder:text-gray-300 resize-none"
                      placeholder="توضیح کوتاهی درباره مشکل خود بنویسید..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-16 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg hover:bg-[#23355A] active:scale-[0.98] hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 w-full h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

                    {status === "loading" ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span>در حال پردازش...</span>
                      </>
                    ) : (
                      <>
                        <Send size={22} />
                        <span>ثبت درخواست و دریافت مشاوره</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                    <ShieldCheck size={14} />
                    <span>
                      تمامی اطلاعات ارسالی تحت قانون محرمانگی وکیل و موکل محفوظ
                      است.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
