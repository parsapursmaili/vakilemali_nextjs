import Link from "next/link";
import {
  MapPin,
  FileText,
  Gavel,
  Briefcase,
  ChevronLeft,
  Users,
  Phone,
} from "lucide-react";

export default function AboutDetails() {
  const steps = [
    {
      num: "۰۱",
      title: "بررسی مدارک",
      desc: "تحلیل دقیق اسناد شما در جلسه اول مشاوره.",
    },
    {
      num: "۰۲",
      title: "تدوین استراتژی",
      desc: "انتخاب کوتاه‌ترین مسیر قانونی برای وصول حق.",
    },
    {
      num: "۰۳",
      title: "اجرای عملیات",
      desc: "ثبت دادخواست و دفاع قاطع در جلسات دادگاه.",
    },
  ];

  return (
    <section className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="border-y border-[var(--muted)] bg-[var(--muted)]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-[var(--input-border)]">
            {[
              { label: "سابقه وکیل سرپرست", val: "۱۳ سال" },
              { label: "تعداد پرونده", val: "+۲۰۰۰" },
              { label: "نرخ موفقیت", val: "+۹۵٪" },
              { label: "عضو کانون وکلا", val: "از ۱۳۹۰" },
            ].map((item, i) => (
              <div key={i} className="py-6 text-center">
                <div className="text-2xl md:text-3xl font-black text-[var(--primary)] mb-1">
                  {item.val}
                </div>
                <div className="text-xs md:text-sm text-[var(--foreground)]/70 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[var(--primary)]">
            مسیر پرونده شما در وکیل مالی
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white border border-[var(--input-border)] p-6 rounded-2xl relative overflow-hidden group hover:border-[var(--accent)] transition-colors shadow-sm"
              >
                <span className="text-6xl font-black text-[var(--muted)]/50 absolute top-2 left-4 z-0 pointer-events-none">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold mb-3 relative z-10 text-[var(--foreground)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--foreground)]/70 relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--primary)]">
              تمرکز ما بر تخصص است
            </h2>
            <p className="text-justify leading-8 mb-8 text-[var(--foreground)]/80">
              در موسسه وکیل مالی، ما "همه کار" نمی‌کنیم. تمرکز ما صرفاً بر
              پرونده‌هایی است که در آن‌ها تخصص مطلق داریم (ملک، چک، قرارداد و
              ارث). این استراتژی باعث شده تا نرخ موفقیت ما در این دعاوی به بیش
              از ۹۵ درصد برسد.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/articles?category=1"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--input-border)] hover:border-[var(--accent)] hover:shadow-md transition-all group"
              >
                <span className="font-bold flex items-center gap-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  <FileText className="w-5 h-5 text-[var(--accent)]" />
                  دعاوی چک و سفته
                </span>
                <ChevronLeft className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/articles?category=3"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--input-border)] hover:border-[var(--accent)] hover:shadow-md transition-all group"
              >
                <span className="font-bold flex items-center gap-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  <Briefcase className="w-5 h-5 text-[var(--accent)]" />
                  دعاوی ملکی و ثبتی
                </span>
                <ChevronLeft className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/articles?category=5"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--input-border)] hover:border-[var(--accent)] hover:shadow-md transition-all group"
              >
                <span className="font-bold flex items-center gap-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  <Gavel className="w-5 h-5 text-[var(--accent)]" />
                  تنظیم قراردادهای تجاری
                </span>
                <ChevronLeft className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/articles?category=4"
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--input-border)] hover:border-[var(--accent)] hover:shadow-md transition-all group"
              >
                <span className="font-bold flex items-center gap-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                  انحصار وراثت و تقسیم ترکه
                </span>
                <ChevronLeft className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-[var(--primary)] text-white rounded-3xl p-2 shadow-2xl overflow-hidden flex flex-col h-full min-h-[450px]">
            <div className="relative flex-grow rounded-2xl overflow-hidden bg-[var(--muted)] min-h-[250px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d259.00305089569133!2d51.44937662468776!3d35.749075571971765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e040a5967f983%3A0x13f7ad187a22d3a5!2z2LPYp9iu2KrZhdin2YYg2b7Ysti02qnYp9mGINi02LHbjNi52KrbjA!5e1!3m2!1sfa!2sus!4v1765373414141!5m2!1sfa!2sus"
                width="600"
                height="450"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-6 h-6 text-[var(--accent)] mt-1 flex-shrink-0" />
                <p className="leading-7 text-white/90 text-sm md:text-base">
                  تهران، خیابان شریعتی، خروجی همت، روبروی پارک کوروش، نبش پیروز،
                  ساختمان شریعتی، طبقه همکف، واحد ۴
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">
                    شماره تماس مستقیم
                  </p>
                  <a
                    href="tel:09002450090"
                    className="text-xl font-bold text-white hover:text-[var(--accent)] transition-colors dir-ltr"
                  >
                    09002450090
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
