import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Trophy,
  Scale,
  FileText,
  ArrowRight,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";

// --- Components ---

const SectionHeading = ({ title, subtitle, light = false }) => (
  <div className="text-center mb-12">
    <h2
      className={`text-3xl md:text-4xl font-extrabold mb-4 ${
        light ? "text-white" : "text-primary"
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={`text-lg ${light ? "text-blue-100" : "text-foreground/70"}`}
      >
        {subtitle}
      </p>
    )}
    <div
      className={`w-24 h-1.5 mx-auto mt-4 rounded-full ${
        light ? "bg-accent" : "bg-accent"
      }`}
    ></div>
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
    className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 ${
      recommended
        ? "bg-primary text-white shadow-2xl scale-105 z-10 border-4 border-accent"
        : "bg-white border border-muted shadow-lg"
    }`}
  >
    {recommended && (
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-primary font-bold px-6 py-1 rounded-full text-sm">
        محبوب‌ترین انتخاب
      </span>
    )}
    <div
      className={`mb-6 p-4 rounded-2xl w-fit ${
        recommended ? "bg-white/10" : "bg-primary/5"
      }`}
    >
      <Icon
        className={`w-8 h-8 ${recommended ? "text-accent" : "text-primary"}`}
      />
    </div>
    <h3 className="text-2xl font-bold mb-2">{plan}</h3>
    <div className="mb-6">
      <span className="text-3xl font-black">{price}</span>
      <span className="text-sm opacity-80 mr-2">/ {duration}</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
          <CheckCircle2
            className={`w-5 h-5 shrink-0 ${
              recommended ? "text-accent" : "text-secondary"
            }`}
          />
          {f}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-4 rounded-xl font-bold transition-colors ${
        recommended
          ? "bg-accent text-primary hover:bg-yellow-500"
          : "bg-primary text-white hover:bg-primary-light"
      }`}
    >
      رزرو نوبت مشاوره
    </button>
  </div>
);

// --- Main Page Component ---

export default function ConsultationPage() {
  return (
    <div className="bg-background text-foreground font-sans leading-relaxed rtl">
      {/* 1. Hero Section - ایجاد اعتبار و فوریت */}
      <section className="relative overflow-hidden bg-primary pt-20 pb-32 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-8 border border-accent/30">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              تخصصی‌ترین مرکز دعاوی مالی ایران
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.2] md:leading-[1.2]">
            محافظت تخصصی از{" "}
            <span className="text-accent italic">دارایی‌های</span> <br />
            مالی و ملکی شما
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            توسط{" "}
            <strong className="font-bold text-white border-b-2 border-accent">
              سرکار خانم مرضیه توانگر
            </strong>
            ؛ وکیل پایه یک دادگستری و عضو کانون وکلای مرکز با ۱۳ سال تجربه
            متمرکز.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-accent text-primary text-xl font-black rounded-2xl shadow-xl hover:bg-yellow-500 transition-all hover:scale-105 active:scale-95">
              ارزیابی فوری پرونده (رایگان)
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white text-xl font-bold rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
              مشاهده پلن‌های مشاوره
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-70">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="text-accent" /> بیش از ۲۰۰۰ پرونده موفق
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="text-accent" /> متخصص دعاوی سنگین ملکی
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="text-accent" /> نرخ موفقیت ۹۵٪
            </div>
          </div>
        </div>
      </section>

      {/* 2. Qualification Section - فیلترینگ هوشمند برای جذب مشتری باکیفیت */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suitable For */}
          <div className="bg-green-50/50 p-10 rounded-[2.5rem] border border-secondary/10">
            <h3 className="text-2xl font-bold text-secondary mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" /> این مشاوره برای شما حیاتی است
              اگر:
            </h3>
            <ul className="space-y-5">
              {[
                "درگیر دعوای مالی پیچیده یا ملکی با ارزش بالا هستید",
                "دارای چک، سفته یا اسناد قراردادی نیازمند تحلیل هستید",
                "به دنبال کوتاه‌ترین مسیر قانونی برای نقد کردن طلب هستید",
                "می‌خواهید قبل از هر اقدام، ریسک‌های خود را به صفر برسانید",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-lg text-slate-700"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not Suitable For */}
          <div className="bg-red-50/50 p-10 rounded-[2.5rem] border border-destructive/10">
            <h3 className="text-2xl font-bold text-destructive mb-8 flex items-center gap-3">
              <XCircle className="w-8 h-8" /> این مشاوره مناسب شما نیست اگر:
            </h3>
            <ul className="space-y-5">
              {[
                "صرفاً به دنبال مشاوره رایگان و تلفنی طولانی هستید",
                "موضوع پرونده شما طلاق، کیفری یا خانواده است",
                "به دنبال تضمین‌های غیرقانونی (صد درصدی) نتیجه هستید",
                "پرونده شما فاقد هرگونه مستندات و مدارک کتبی است",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-lg text-slate-700"
                >
                  <div className="w-2 h-2 rounded-full bg-destructive mt-2.5"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Free Assessment Section - تبدیل (Conversion) */}
      <section className="py-20 bg-muted/30 border-y border-muted">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent text-primary font-bold px-8 py-2 rounded-bl-3xl">
              رایگان
            </div>
            <SectionHeading
              title="ارزیابی اولیه هوشمند پرونده"
              subtitle="بدون نیاز به تماس تلفنی - بررسی مستقیم توسط تیم فنی"
            />

            <div className="grid md:grid-cols-2 gap-8 mb-10 text-right">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-primary flex items-center gap-2">
                  <CheckCircle2 className="text-secondary w-5 h-5" /> آنچه
                  دریافت می‌کنید:
                </h4>
                <ul className="text-foreground/70 space-y-2 mr-7">
                  <li>• بررسی اجمالی اسناد ارسالی</li>
                  <li>• تشخیص قابلیت پیگیری قانونی</li>
                  <li>• اعلام نتیجه اولیه به صورت متنی</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-destructive flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> آنچه شامل نمی‌شود:
                </h4>
                <ul className="text-foreground/70 space-y-2 mr-7">
                  <li>• مشاوره تلفنی و پرسش و پاسخ</li>
                  <li>• ارائه راهکار و استراتژی اجرایی</li>
                  <li>• تنظیم لایحه یا دادخواست</li>
                </ul>
              </div>
            </div>

            <button className="group flex items-center gap-3 mx-auto px-12 py-6 bg-primary text-white text-xl font-bold rounded-2xl hover:bg-primary-light transition-all">
              شروع ارزیابی مدارک
              <ArrowRight className="group-hover:translate-x-[-8px] transition-transform" />
            </button>
            <p className="mt-6 text-sm text-foreground/50 italic">
              «پاسخ ارزیابی حداکثر ظرف ۲۴ ساعت کاری ارسال می‌شود.»
            </p>
          </div>
        </div>
      </section>

      {/* 4. Value Proposition - چرا هزینه مشاوره؟ */}
      <section className="py-24 px-4 max-w-6xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black text-primary mb-8 leading-tight">
              چرا هزینه این مشاوره، در واقع{" "}
              <span className="text-secondary">سود خالص</span> شماست؟
            </h2>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              یک اشتباه کوچک در نگارش دادخواست یا انتخاب عنوان اشتباه برای دعوا،
              می‌تواند باعث رد دعوا و از دست رفتن همیشگی فرصت پیگیری ملکی شود که
              میلیاردها تومان ارزش دارد.
            </p>
            <div className="space-y-6">
              {[
                { t: "بیمه دارایی:", d: "جلوگیری از سوخت شدن طلب و اموال." },
                {
                  t: "خرید زمان:",
                  d: "کاهش طول دوره رسیدگی با انتخاب مسیر درست.",
                },
                {
                  t: "استراتژی تهاجمی:",
                  d: "غافلگیری طرف مقابل با مستندات قانونی.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-accent/10 p-2 rounded-lg shrink-0 h-fit">
                    <ShieldCheck className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary">{item.t}</h4>
                    <p className="text-foreground/60">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="/api/placeholder/600/700"
                alt="Consultation"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Plans - جدول قیمت‌گذاری با روانشناسی فروش */}
      <section className="py-24 bg-primary px-4 relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="پلن‌های مشاوره تخصصی"
            subtitle="انتخاب بر اساس فوریت و پیچیدگی پرونده شما"
            light={true}
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <PricingCard
              plan="نقشه راه"
              price="۴۹۹,۰۰۰"
              duration="۲۰ دقیقه"
              icon={Scale}
              features={[
                "بررسی مسیر صحیح حقوقی",
                "پاسخ به سوالات کلیدی پرونده",
                "ارزیابی ریسک‌های اولیه",
                "مناسب برای شروع مسیر",
              ]}
            />
            <PricingCard
              plan="استراتژی (VIP)"
              price="۹۹۹,۰۰۰"
              duration="۴۵ دقیقه"
              icon={Trophy}
              recommended={true}
              features={[
                "تحلیل کامل سناریوهای ممکن",
                "بررسی تخصصی ریسک‌های پنهان",
                "ارائه چک‌لیست متنی اقدامات",
                "اولیت در بررسی مدارک تکمیلی",
                "تحلیل آرای مشابه اخیر",
              ]}
            />
            <PricingCard
              plan="اورژانسی"
              price="۱,۹۹۹,۰۰۰"
              duration="۳۰ دقیقه"
              icon={Zap}
              features={[
                "رسیدگی در همان روز (کمتر از ۵ ساعت)",
                "مخصوص توقیف اموال و تامین خواسته",
                "مشاوره بحران برای جلوگیری از ضرر آنی",
                "ظرفیت بسیار محدود",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 6. Why Us - تخصص و آمار */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl border border-muted p-12 overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-primary mb-6">
                چرا موسسه حقوقی وکیل مالی؟
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                ما برخلاف دفاتر عمومی، فقط بر روی «پول» و «ملک» تمرکز داریم. این
                تمرکز باعث شده است که اشراف کاملی بر بخشنامه‌های ثبتی، قوانین
                بانکی و رویه‌های دادگاه‌های اقتصادی داشته باشیم.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-primary mb-1">
                    ۱۳+
                  </div>
                  <div className="text-sm text-foreground/60 font-bold text-nowrap">
                    سال سابقه تخصصی
                  </div>
                </div>
                <div className="bg-muted/30 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-secondary mb-1">
                    ۹۵٪
                  </div>
                  <div className="text-sm text-foreground/60 font-bold text-nowrap">
                    نرخ موفقیت پرونده‌ها
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-xl mb-4 text-primary underline decoration-accent decoration-4 underline-offset-8">
                حوزه‌های تمرکز ما:
              </h4>
              {[
                {
                  t: "دعاوی چک و سفته",
                  desc: "نقد کردن اسناد تجاری با سرعت بالا",
                },
                {
                  t: "دعاوی ملکی و ثبتی",
                  desc: "الزام به تنظیم سند، خلع ید، پیش‌فروش",
                },
                {
                  t: "قراردادهای تجاری",
                  desc: "تنظیم و داوری در قراردادهای مالی",
                },
                {
                  t: "ارث و امور حسبی",
                  desc: "تقسیم ترکه و دعاوی ارث با ابعاد مالی",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white shadow-sm border border-muted p-4 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold">{item.t}</div>
                    <div className="text-xs text-foreground/50">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Process - روند کاری */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <SectionHeading
            title="روند کاری ما"
            subtitle="مسیر شما تا پیروزی در پرونده"
          />
          <div className="grid md:grid-cols-3 gap-12 mt-16 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-dashed border-t-2 border-primary/10 -z-0"></div>

            {[
              {
                i: 1,
                t: "بررسی هوشمند مدارک",
                d: "ارسال مستندات و تحلیل اولیه توسط وکیل",
              },
              {
                i: 2,
                t: "تدوین استراتژی برد",
                d: "طراحی سناریو و نقشه راه قانونی",
              },
              {
                i: 3,
                t: "اقدام قاطع و هدفمند",
                d: "ورود به دادگاه و اجرای عملیات حقوقی",
              },
            ].map((step) => (
              <div
                key={step.i}
                className="relative z-10 bg-white p-8 rounded-3xl shadow-lg border border-muted hover:border-accent transition-colors"
              >
                <div className="w-16 h-16 bg-primary text-white text-2xl font-black rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-accent">
                  {step.i}
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">
                  {step.t}
                </h4>
                <p className="text-foreground/60">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact & CTA - اقدام نهایی */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary to-primary-light rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden text-center md:text-right">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                تصمیم امروز شما، <br />
                <span className="text-accent">آینده پرونده</span> را تعیین
                می‌کند.
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                همین حالا برای حفظ دارایی‌های خود اقدام کنید. ظرفیت مشاوره تخصصی
                خانم توانگر به دلیل تمرکز روی پرونده‌های جاری محدود است.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button className="px-12 py-6 bg-accent text-primary text-xl font-black rounded-2xl shadow-xl hover:bg-yellow-500 transition-all">
                  رزرو نوبت مشاوره فوری
                </button>
              </div>
            </div>

            <div className="space-y-6 bg-white/10 p-10 rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-4 text-right">
                <MapPin className="text-accent shrink-0" />
                <span>تهران، خیابان شریعتی، خروجی همت</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-accent shrink-0" />
                <span dir="ltr">0900 245 0090</span>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="text-accent shrink-0" />
                <span>پاسخگویی آنلاین در تلگرام و واتساپ</span>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center font-bold">
                <span>آیدی تلگرام:</span>
                <span className="text-accent">@vakilemali</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-12 border-t border-muted text-center text-foreground/50 text-sm">
        <p>
          © ۱۴۰۴ موسسه حقوقی وکیل مالی - تمامی حقوق برای سرکار خانم مرضیه توانگر
          محفوظ است.
        </p>
        <p className="mt-2 tracking-widest uppercase">
          Specialized Financial Law Institute
        </p>
      </footer>
    </div>
  );
}
