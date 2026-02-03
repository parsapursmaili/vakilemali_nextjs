import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Zap,
  Trophy,
  Scale,
  ArrowRight,
  MessageCircle,
  Phone,
  MapPin,
  Lock,
  ChevronLeft,
  FileSearch,
  AlertCircle,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
} from "lucide-react";

// --- تخصصی‌ترین استایل‌ها برای تیترها ---
const SectionHeading = ({ title, subtitle, light = false }) => (
  <div className="text-center mb-16 px-4">
    <p
      className={`text-sm !font-black uppercase tracking-[0.3em] mb-4 ${
        light ? "text-accent/80" : "text-accent"
      }`}
    >
      Professional Excellence
    </p>
    <h2
      className={`text-3xl md:text-5xl !font-black mb-6 tracking-tight leading-tight ${
        light ? "!text-white" : "!text-[#1a2b4c]"
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={`text-lg md:text-xl max-w-2xl mx-auto !font-medium leading-relaxed ${
          light ? "!text-blue-100/70" : "!text-slate-500"
        }`}
      >
        {subtitle}
      </p>
    )}
    <div className="flex justify-center gap-1 mt-8">
      <div className="w-20 h-1.5 !bg-[#c5892f] rounded-full"></div>
      <div className="w-3 h-1.5 !bg-[#c5892f]/30 rounded-full"></div>
    </div>
  </div>
);

const PricingCard = ({
  plan,
  price,
  duration,
  features,
  recommended,
  icon: Icon,
}) => (
  <div
    className={`relative flex flex-col p-8 rounded-[3rem] transition-all duration-500 hover:-translate-y-4 ${
      recommended
        ? "!bg-[#1a2b4c] !text-white shadow-[0_40px_80px_-15px_rgba(26,43,76,0.4)] scale-105 z-10 border-2 border-[#c5892f]"
        : "!bg-white border border-slate-200 shadow-xl shadow-slate-100/50"
    }`}
  >
    {recommended && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 !bg-[#c5892f] !text-white !font-black px-8 py-2 rounded-full text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
        <Trophy className="w-4 h-4" /> محبوب‌ترین انتخاب
      </div>
    )}
    <div
      className={`mb-8 p-5 rounded-2xl w-fit ${
        recommended ? "!bg-white/10" : "!bg-[#1a2b4c]/5"
      }`}
    >
      <Icon
        className={`w-10 h-10 ${
          recommended ? "!text-[#c5892f]" : "!text-[#1a2b4c]"
        }`}
      />
    </div>
    <h3 className="text-2xl !font-black mb-3">{plan}</h3>
    <div className="mb-8">
      <div className="text-sm opacity-60 mb-1 !font-bold">سرمایه‌گذاری:</div>
      <span className="text-4xl !font-black tracking-tighter">{price}</span>
      <span className="text-sm opacity-60 mr-2 !font-bold">تومان</span>
    </div>
    <ul className="space-y-5 mb-10 flex-1">
      {features.map((f, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm !font-bold leading-relaxed"
        >
          <CheckCircle2
            className={`w-5 h-5 shrink-0 ${
              recommended ? "!text-[#c5892f]" : "!text-[#14532d]"
            }`}
          />
          <span className={recommended ? "text-blue-50/80" : "text-slate-600"}>
            {f}
          </span>
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-5 rounded-[1.5rem] !font-black transition-all group flex items-center justify-center gap-2 ${
        recommended
          ? "!bg-[#c5892f] !text-white hover:!bg-[#a67226] shadow-lg shadow-accent/20"
          : "!bg-slate-100 !text-[#1a2b4c] hover:!bg-slate-200"
      }`}
    >
      درخواست پلن (پس از تأیید)
      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
    </button>
  </div>
);

export default function UltimatePremiumLanding() {
  return (
    <div className="bg-[#f9fafb] text-[#111827] font-sans leading-relaxed rtl overflow-x-hidden selection:bg-accent/30">
      {/* 1. Hero Section - اعتبار + راه حل سریع */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#1a2b4c] pt-24 pb-32 px-4">
        {/* Advanced Background Design */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#c5892f]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute inset-0 opacity-[0.03]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 !bg-white/5 backdrop-blur-xl !text-[#c5892f] border border-white/10 px-6 py-3 rounded-full mb-12 animate-fade-in">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs md:text-sm !font-black uppercase tracking-[0.2em]">
              تخصصی‌ترین مرکز دعاوی مالی و ملکی ایران
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl !font-black !text-white mb-10 leading-[1.1] tracking-tight">
            محافظت انحصاری از <br />
            <span className="!text-[#c5892f] relative italic">
              دارایی‌های کلان
              <svg
                className="absolute -bottom-4 left-0 w-full h-3 text-accent/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 25 0 50 5 T 100 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </span>{" "}
            شما
          </h1>

          <p className="text-xl md:text-2xl !text-blue-100/80 mb-14 max-w-3xl mx-auto !font-medium leading-relaxed">
            توسط{" "}
            <span className="!text-white !font-black underline decoration-accent underline-offset-8">
              سرکار خانم مرضیه توانگر
            </span>
            ؛ <br />
            وکیل پایه یک دادگستری با ۱۳ سال تمرکز تخصصی و نرخ موفقیت ۹۵٪
          </p>

          <div className="flex flex-col items-center gap-8">
            <button className="group relative w-full sm:w-auto px-16 py-8 !bg-[#c5892f] !text-white text-2xl !font-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(197,137,47,0.5)] hover:scale-105 transition-all">
              ارسال خلاصه پرونده برای ارزیابی رایگان
              <div className="absolute -inset-1 bg-white/20 rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <div className="flex items-center gap-6 !text-blue-200/50 !font-bold text-sm tracking-wide">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> پاسخگویی در ۲۴ ساعت
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-accent/40"></div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> امنیت کامل اطلاعات
              </div>
            </div>
          </div>

          <div className="mt-28 flex flex-wrap justify-center gap-16 border-t border-white/10 pt-16">
            {[
              { label: "پرونده موفق", val: "۲۰۰۰+", icon: Briefcase },
              { label: "نرخ پیروزی", val: "۹۵٪", icon: TrendingUp },
              { label: "سابقه تخصصی", val: "۱۳ سال", icon: Users },
            ].map((stat, i) => (
              <div key={i} className="text-right flex items-center gap-4 group">
                <div className="p-3 !bg-white/5 rounded-2xl group-hover:!bg-accent/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl !font-black !text-white mb-1">
                    {stat.val}
                  </div>
                  <div className="text-xs !font-black !text-blue-300 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Qualification Section - فیلترینگ هوشمند (نرم اما قاطع) */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              title="ما برای کیفیت پیروزی شما، فیلتر می‌کنیم."
              subtitle="برای تضمین نتیجه و حفظ پرستیژ دفاع، خانم توانگر فقط پرونده‌هایی را می‌پذیرند که دارای پتانسیل واقعی پیروزی و مستندات کافی باشند."
            />
            <div className="space-y-6">
              <div className="p-8 !bg-emerald-50/50 rounded-3xl border border-emerald-100 flex gap-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xl !font-black text-[#14532d] mb-2">
                    پرونده‌های ایده‌آل ما
                  </h4>
                  <p className="!font-bold text-slate-600 leading-relaxed text-sm">
                    دعاوی ملکی سنگین، چک و سفته‌های کلان، قراردادهای تجاری و نقد
                    کردن مطالبات مالی با اسناد کتبی.
                  </p>
                </div>
              </div>
              <div className="p-8 !bg-slate-50 rounded-3xl border border-slate-200 flex gap-6 opacity-70">
                <XCircle className="w-10 h-10 text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-xl !font-black text-slate-500 mb-2">
                    در چه مواردی معذوریم؟
                  </h4>
                  <p className="!font-bold text-slate-400 leading-relaxed text-sm">
                    دعاوی کیفری غیرمالی، طلاق و خانواده، و پرونده‌های فاقد
                    هرگونه مدرک مستند.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
                alt="Specialized Law"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4c]/80 to-transparent"></div>
              <div className="absolute bottom-10 right-10 left-10 p-8 !bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <p className="!text-white !font-black text-lg">
                  "سرمایه‌گذاری روی مشاوره درست، ارزان‌ترین راه برای جلوگیری از
                  خسارت‌های میلیاردی است."
                </p>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 !bg-accent/20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. The Gateway (Lead Magnet) - دروازه ارزیابی رایگان */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="!bg-[#1a2b4c] rounded-[4rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>

            <div className="relative z-10 text-center">
              <SectionHeading
                light={true}
                title="ارزیابی رایگان قابلیت پیگیری پرونده"
                subtitle="پیش از پرداخت هرگونه هزینه، مستندات خود را ارسال کنید تا وکیل متخصص، پتانسیل پیروزی شما را بررسی کند."
              />

              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                <div className="flex items-center gap-3 !text-blue-100 !font-bold">
                  <CheckCircle2 className="w-5 h-5 text-accent" /> بررسی ۲۴
                  ساعته
                </div>
                <div className="flex items-center gap-3 !text-blue-100 !font-bold">
                  <CheckCircle2 className="w-5 h-5 text-accent" /> تشخیص پتانسیل
                  برد
                </div>
                <div className="flex items-center gap-3 !text-blue-100 !font-bold">
                  <CheckCircle2 className="w-5 h-5 text-accent" /> بدون تعهد
                  مالی
                </div>
              </div>

              <button className="group relative flex items-center gap-4 mx-auto px-16 py-8 !bg-white !text-[#1a2b4c] text-2xl !font-black rounded-[2.5rem] hover:scale-105 transition-all shadow-xl">
                شروع بررسی رایگان مدارک
                <ArrowRight className="group-hover:-translate-x-2 transition-transform w-7 h-7 text-accent" />
              </button>
              <p className="mt-8 !text-blue-300/60 !font-bold italic text-sm">
                این بررسی شامل ارائه راهکار اجرایی نیست و صرفاً برای تایید
                صلاحیت پرونده است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Value Prop - چرا این سرمایه‌گذاری سود خالص است؟ */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl !font-black !text-[#1a2b4c] mb-8 leading-tight">
              چرا هزینه این مشاوره، در واقع{" "}
              <span className="text-[#c5892f]">بیمه دارایی</span> شماست؟
            </h2>
            <div className="space-y-8">
              {[
                {
                  t: "جلوگیری از رد دعوا",
                  d: "یک اشتباه در عنوان دادخواست، یعنی سوخت شدن زمان و هزینه دادرسی چند ده میلیونی.",
                },
                {
                  t: "استراتژی تهاجمی",
                  d: "ما فقط دفاع نمی‌کنیم؛ ما مسیرهایی را باز می‌کنیم که طرف مقابل را در بن‌بست قانونی قرار دهد.",
                },
                {
                  t: "تمرکز بر نقدشوندگی",
                  d: "هدف ما فقط گرفتن حکم نیست؛ هدف ما رسیدن واقعی شما به پول یا ملک است.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl !bg-accent/10 flex items-center justify-center shrink-0 group-hover:!bg-accent group-hover:!text-white transition-all">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl !font-black text-[#1a2b4c] mb-2">
                      {item.t}
                    </h4>
                    <p className="!font-medium text-slate-500 text-sm leading-relaxed">
                      {item.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 !bg-slate-100 p-12 rounded-[4rem] border border-slate-200">
            <div className="text-center mb-8">
              <div className="text-5xl !font-black text-[#1a2b4c] mb-2">
                ۹۵٪
              </div>
              <div className="!font-black text-accent uppercase tracking-widest text-sm">
                نرخ پیروزی در دعاوی مالی
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-3 !bg-white rounded-full overflow-hidden">
                <div className="w-[95%] h-full !bg-[#c5892f]"></div>
              </div>
              <p className="text-xs !font-bold text-slate-400 text-center">
                بر اساس بیش از ۲۰۰۰ پرونده مختومه در ۱۳ سال اخیر
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing - با قیمت‌گذاری روانشناسانه */}
      <section className="py-32 px-4 bg-[#1a2b4c]/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="پلن‌های مشاوره تخصصی"
            subtitle="انتخاب بر اساس پیچیدگی پرونده (فقط پس از تایید صلاحیت اولیه پیشنهاد می‌شوند)"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <PricingCard
              plan="نقشه راه"
              price="۹۹۰,۰۰۰"
              duration="۲۰ دقیقه"
              icon={Scale}
              features={[
                "بررسی مسیر صحیح حقوقی",
                "پاسخ به ۳ سوال کلیدی پرونده",
                "ارزیابی ریسک‌های اولیه",
                "مناسب برای شروع مسیر و دعاوی خرد",
              ]}
            />
            <PricingCard
              plan="استراتژی (VIP)"
              price="۲,۴۹۰,۰۰۰"
              duration="۴۵ دقیقه"
              icon={Trophy}
              recommended={true}
              features={[
                "تحلیل کامل سناریوهای برد و باخت",
                "ارائه چک‌لیست اقدامات اجرایی",
                "بررسی دقیق مستندات توسط خانم توانگر",
                "اولویت در بررسی لایحه و دادخواست",
                "تحلیل آرای مشابه اخیر قضایی",
              ]}
            />
            <PricingCard
              plan="اورژانسی (بحران)"
              price="۴,۹۹۰,۰۰۰"
              duration="۳۰ دقیقه"
              icon={Zap}
              features={[
                "رسیدگی در کمتر از ۵ ساعت کاری",
                "مخصوص توقیف اموال فوری و تامین خواسته",
                "مشاوره مستقیم برای جلوگیری از ضرر آنی",
                "ظرفیت بسیار محدود (حداکثر ۱ مورد در روز)",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 6. Social Proof / Expertise */}
      <section className="py-32 px-4 max-w-6xl mx-auto">
        <div className="!bg-white rounded-[4rem] p-12 md:p-20 shadow-xl border border-slate-100 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl !font-black text-[#1a2b4c] mb-6">
              حوزه‌های تمرکز وکیل مالی
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                "دعاوی ملکی و ثبتی کلان",
                "مطالبات ارزی و بانکی",
                "اختلافات شرکاء و قراردادهای تجاری",
                "چک، سفته و اسناد تجاری",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl !bg-slate-50 border border-slate-100 !font-bold text-slate-700"
                >
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="!bg-accent/5 p-10 rounded-[3rem] border-r-8 border-accent">
              <p className="text-xl !font-bold text-slate-700 italic leading-relaxed mb-6">
                "در دنیای امروز، حق با کسی نیست که حق با اوست؛ حق با کسی است که
                می‌تواند آن را در دادگاه ثابت کند. ما متخصص اثبات حق شما هستیم."
              </p>
              <div className="!font-black text-[#1a2b4c]">مرضیه توانگر</div>
              <div className="text-sm !font-bold text-accent uppercase">
                وکیل پایه یک دادگستری
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA - قاطع و با فوریت */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto !bg-gradient-to-br from-[#1a2b4c] to-[#1e3a8a] rounded-[4rem] p-12 md:p-24 text-center text-white shadow-2xl relative">
          <div className="absolute inset-0 opacity-10 "></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl !font-black mb-10 leading-tight">
              تصمیم امروز شما، <br />{" "}
              <span className="text-accent">آینده پرونده</span> را تعیین می‌کند.
            </h2>
            <p className="text-xl !text-blue-100 mb-14 max-w-2xl mx-auto !font-medium">
              ظرفیت مشاوره تخصصی خانم توانگر به دلیل تمرکز بالا روی پرونده‌های
              جاری، بسیار محدود است. همین حالا برای حفظ دارایی‌های خود اقدام
              کنید.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-16 py-8 !bg-accent !text-white text-2xl !font-black rounded-[2.5rem] shadow-2xl hover:bg-[#a67226] transition-all">
                رزرو نوبت بررسی صلاحیت
              </button>
              <button className="px-10 py-8 !bg-white/10 backdrop-blur-md !text-white text-xl !font-black rounded-[2.5rem] border border-white/20 hover:!bg-white/20 transition-all flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" /> تماس در تلگرام
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-right">
              <div className="text-2xl !font-black text-[#1a2b4c] mb-2">
                موسسه حقوقی وکیل مالی
              </div>
              <div className="!text-accent !font-bold text-xs uppercase tracking-[0.4em]">
                Specialized Legal Protection
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex items-center gap-3 !text-slate-500 !font-bold text-sm">
                <MapPin className="w-5 h-5 text-accent" /> تهران، خیابان شریعتی،
                خروجی همت
              </div>
              <div className="flex items-center gap-3 !text-slate-500 !font-bold text-sm">
                <Phone className="w-5 h-5 text-accent" />{" "}
                <span dir="ltr">0900 245 0090</span>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-50 text-center">
            <p className="!text-slate-300 !font-bold text-xs">
              © ۱۴۰۴ - تمامی حقوق برای سرکار خانم مرضیه توانگر محفوظ است. طراحی
              اختصاصی برای دعاوی سنگین.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA - نهایی کردن تبدیل در موبایل */}
      <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        <button className="w-full py-5 !bg-accent !text-white !font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 animate-bounce">
          <Zap className="w-5 h-5" /> شروع ارزیابی رایگان پرونده
        </button>
      </div>
    </div>
  );
}
