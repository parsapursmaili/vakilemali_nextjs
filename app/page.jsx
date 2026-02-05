import { redirect } from "next/navigation";
import Link from "next/link";
import PostsSlider from "@/components/PostsSlider";
import {
  ShieldCheck,
  Scale,
  FileSignature,
  Users,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  Briefcase,
  ScrollText,
  Building2,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import {
  getLatestPosts,
  getPopularPosts,
  findPostSlugById,
} from "./actions/main-Page";

const ServiceCard = ({ icon: Icon, title, desc, slug }) => (
  <Link
    href={`/articles?category=${slug}`}
    className="group flex flex-col p-5 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--accent)] transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
  >
    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-[var(--accent)]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[var(--primary)]/5 text-[var(--primary)] flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
      <Icon size={20} className="md:w-6 md:h-6" />
    </div>

    <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] mb-2 md:mb-3 group-hover:text-[var(--primary)] transition-colors">
      {title}
    </h3>

    <p className="text-xs md:text-sm text-gray-500 leading-6 md:leading-7 mb-4 relative z-10 line-clamp-2">
      {desc}
    </p>

    <div className="mt-auto flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
      <span>مشاهده مقالات</span>
      <ArrowLeft
        size={14}
        className="group-hover:-translate-x-1 transition-transform md:w-4 md:h-4"
      />
    </div>
  </Link>
);

const StatBox = ({ value, label }) => (
  <div className="text-center p-2 md:p-4 border-l last:border-l-0 border-white/10">
    <div className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--accent)] mb-1 dir-ltr">
      {value}
    </div>
    <div className="text-[10px] md:text-xs lg:text-sm text-gray-300 font-medium whitespace-nowrap">
      {label}
    </div>
  </div>
);

const PrimarySocialButton = ({ icon: Icon, label, sub, bgClass, href }) => (
  <a
    href={href}
    className={`${bgClass} flex items-center justify-center md:justify-start gap-3 p-4 rounded-xl text-white hover:brightness-110 active:scale-[0.98] transition-all shadow-lg w-full md:w-auto md:flex-1`}
  >
    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shrink-0">
      <Icon size={20} className="md:w-6 md:h-6 text-white" />
    </div>
    <div className="flex flex-col text-right">
      <span className="font-bold text-sm md:text-base">{label}</span>
      <span className="text-[10px] md:text-xs text-white/80 opacity-90">
        {sub}
      </span>
    </div>
  </a>
);

export default async function HomePage({ searchParams }) {
  const postId = (await searchParams)?.p;

  if (postId && !isNaN(postId)) {
    const post = await findPostSlugById(Number(postId));

    if (post && post.slug) {
      redirect(`/${post.slug}`);
    }
  }

  const [latestPostsData, popularPostsData] = await Promise.all([
    getLatestPosts({ limit: 12 }),
    getPopularPosts({ limit: 12 }),
  ]);

  const servicesData = [
    {
      title: "چک برگشتی",
      slug: "chek-bargashi",
      icon: FileSignature,
      desc: "اقدام فوری برای توقیف اموال، ممنوع‌الخروجی و وصول وجه چک و سفته.",
    },
    {
      title: "مهریه، طلاق و خانواده",
      slug: "khanevade",
      icon: Users,
      desc: "طلاق توافقی، مطالبه مهریه، نفقه و حضانت با کمترین تنش و زمان.",
    },
    {
      title: "املاک و مستغلات",
      slug: "amlak",
      icon: Building2,
      desc: "دعاوی خلع ید، الزام به تنظیم سند، تخلیه و مشکلات شهرداری و ثبتی.",
    },
    {
      title: "ارث و انحصار وراثت",
      slug: "ers",
      icon: Scale,
      desc: "تقسیم ترکه، تحریر ترکه و حل اختلاف بین وراث در کوتاه‌ترین زمان.",
    },
    {
      title: "قراردادها و تعهدات",
      slug: "gharardad",
      icon: ScrollText,
      desc: "تنظیم تخصصی قراردادهای مشارکت، پیمانکاری و فسخ قراردادهای معیوب.",
    },
    {
      title: "جرایم کیفری و شکایات",
      slug: "jarayem",
      icon: ShieldAlert,
      desc: "دفاع در پرونده‌های کلاهبرداری، خیانت در امانت، سرقت و فروش مال غیر.",
    },
    {
      title: "قانون کار و تأمین اجتماعی",
      slug: "kar",
      icon: Briefcase,
      desc: "پیگیری مطالبات کارگر و کارفرما، سنوات، عیدی و دعاوی اداره کار.",
    },
    {
      title: "شرکت‌ها و حقوق تجارت",
      slug: "tejarat",
      icon: Briefcase,
      desc: "ثبت شرکت، ورشکستگی، دعاوی تجاری و تنظیم اساسنامه‌های شرکتی.",
    },
    {
      title: "قصور و اشتباهات پزشکی",
      slug: "pezeshki",
      icon: Stethoscope,
      desc: "پیگیری پرونده‌های قصور پزشکی، دریافت دیه و خسارت از کادر درمان.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-[var(--background)] selection:bg-[var(--accent)] selection:text-white overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-[var(--primary)] pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden isolate">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--primary-light)]/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[var(--accent)]/10 blur-[60px] md:blur-[100px] rounded-full pointer-events-none"></div>

        {/* 
            تغییرات کلیدی برای وسط‌چین کردن دقیق:
            1. اضافه کردن flex flex-col items-center به کانتینر اصلی
            2. اضافه کردن !text-center به h1 و p
            3. اضافه کردن flex justify-center به دور badge
        */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="max-w-4xl w-full flex flex-col items-center">
            {/* Wrapper برای بج که آن را دقیقاً وسط نگه دارد */}
            <div className="flex justify-center w-full mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 rounded-full bg-white/5 border border-white/10 text-[var(--accent)] text-[11px] md:text-xs font-bold backdrop-blur-sm animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
                پاسخگویی آنلاین و فوری
              </div>
            </div>

            <h1 className="!text-center text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.4] md:leading-[1.3] tracking-tight mb-4 md:mb-6 w-full">
              وکیل حرفه‌ای، <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[#eebc70] to-[var(--accent)] block md:inline mt-2 md:mt-0">
                پلی میان شما و عدالت
              </span>
            </h1>

            <p className="!text-center text-base md:text-xl text-gray-300 mb-8 md:mb-10 leading-7 md:leading-relaxed max-w-2xl !mx-auto font-light px-2 w-full">
              موسسه حقوقی وکیل مالی با مدیریت <strong>مرضیه توانگر</strong>.
              تخصص ما نجات سرمایه شما در پرونده‌های ملکی، مالی و قراردادهاست.
            </p>

            <div className="flex flex-col sm:flex-row items-center !justify-center gap-3 md:gap-4 w-full sm:w-auto">
              <a
                href="tel:09002450090"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--accent)] text-white hover:bg-[#b07825] px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all shadow-[0_10px_30px_-10px_rgba(197,137,47,0.5)] active:scale-[0.98]"
              >
                <Phone size={18} className="md:w-5 md:h-5" />
                مشاوره تلفنی رایگان
              </a>
              <Link
                href="/articles"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 hover:bg-white/10 px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all backdrop-blur-sm active:scale-[0.98]"
              >
                <FileSignature size={18} className="md:w-5 md:h-5" />
                بررسی نمونه پرونده‌ها
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 md:mt-20">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/20">
              <StatBox value="+۱۳" label="سال تجربه وکالت" />
              <StatBox value="۹۶٪" label="نرخ موفقیت" />
              <StatBox value="+۲۰۰۰" label="پرونده مختومه" />
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] md:text-[11px] text-gray-400 opacity-80 font-light flex flex-wrap items-center justify-center gap-1 leading-tight">
                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                <span>
                  آمارهای فوق بر اساس سوابق مستند در سامانه خدمات الکترونیک
                  قضایی (ثنا) می‌باشد.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-16 md:py-24 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div className="text-center md:text-right">
              <h2 className="text-2xl md:text-4xl font-black text-[var(--primary)] mb-2 md:mb-3">
                خدمات تخصصی حقوقی
              </h2>
              <p className="text-sm md:text-lg text-gray-500">
                دسته‌بندی دقیق پرونده‌ها برای رسیدن به سریع‌ترین نتیجه.
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden md:flex text-[var(--accent)] font-bold items-center gap-2 hover:gap-3 transition-all"
            >
              آرشیو کامل مقالات <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {servicesData.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                desc={service.desc}
                slug={service.slug}
                icon={service.icon}
              />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[var(--accent)] font-bold text-sm"
            >
              مشاهده همه خدمات <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section className="py-12 md:py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-[var(--primary)] rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
              <div className="text-white text-center md:text-right">
                <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 text-white">
                  نیاز به راهنمایی فوری دارید؟
                </h2>
                <p className="text-white/80 text-sm md:text-lg leading-7 md:leading-8 mb-6 md:mb-8">
                  پرونده‌های حقوقی جای آزمون و خطا نیستند. قبل از هر اقدامی،
                  موضوع را با وکیل متخصص مطرح کنید تا از ضرر و زیان جلوگیری شود.
                </p>

                <div className="hidden md:flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="text-[var(--accent)]" />
                    <span>تضمین محرمانگی تمام اطلاعات</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="text-[var(--accent)]" />
                    <span>بررسی پرونده توسط شخص وکیل</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                  <PrimarySocialButton
                    href="tel:09002450090"
                    bgClass="bg-[#c5892f]"
                    icon={Phone}
                    label="تماس تلفنی"
                    sub="پاسخگویی ۰۹۰۰۲۴۵۰۰۹۰"
                  />

                  <PrimarySocialButton
                    href="https://wa.me/989002450090"
                    bgClass="bg-[#25D366]"
                    icon={MessageCircle}
                    label="ارسال پیام"
                    sub="گفتگو در واتساپ"
                  />
                </div>

                <div className="mt-2 md:mt-4 text-center">
                  <p className="text-white/70 text-xs md:text-sm font-medium">
                    دسترسی به واتساپ ندارید؟
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1 mt-2 text-white/90 text-xs md:text-sm">
                    <span>می‌توانید از طریق</span>
                    <a
                      href="#"
                      className="font-bold text-[#3db4f2] hover:underline decoration-[#3db4f2]"
                    >
                      تلگرام
                    </a>
                    <span>یا</span>
                    <a
                      href="#"
                      className="font-bold text-[#e46a23] hover:underline decoration-[#e46a23]"
                    >
                      پیام‌رسان ایتا
                    </a>
                    <span>هم با ما در ارتباط باشید.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SLIDERS */}
      <section className="py-12 md:py-20 space-y-12 md:space-y-20 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-1 md:w-1.5 h-6 md:h-8 bg-[var(--primary)] rounded-full"></div>
            <h3 className="text-lg md:text-2xl font-bold text-[var(--foreground)]">
              آخرین مقالات حقوقی
            </h3>
          </div>
          <PostsSlider posts={latestPostsData.posts} />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-1 md:w-1.5 h-6 md:h-8 bg-[var(--accent)] rounded-full"></div>
            <h3 className="text-lg md:text-2xl font-bold text-[var(--foreground)]">
              پربازدیدترین مطالب
            </h3>
          </div>
          <PostsSlider posts={popularPostsData.posts} />
        </div>
      </section>
    </main>
  );
}
