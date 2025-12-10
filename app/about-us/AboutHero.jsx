import Image from "next/image";
import { CheckCircle2, PhoneCall } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-[var(--primary)] text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:24px_24px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/40 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
              <span className="font-bold text-xs md:text-sm tracking-wide text-[var(--accent)]">
                عضو کانون وکلا از سال ۱۳۹۰
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight !text-white">
              موسسه حقوقی <br className="md:hidden" />
              <span className="text-[var(--accent)]">وکیل مالی</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 font-medium mb-8 leading-relaxed">
              ارائه راهکارهای حقوقی سریع و تضمینی در دعاوی مالی و ملکی.
              <br className="hidden lg:block" />
              تحت مدیریت و نظارت مستقیم{" "}
              <strong className="text-white border-b-2 border-[var(--accent)] mx-1">
                مرضیه توانگر
              </strong>
              (وکیل پایه یک دادگستری، عضو کانون وکلای ایران از سال ۱۳۹۰).
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="tel:09002450090"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent)] !text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--accent)]/20"
              >
                <PhoneCall className="w-5 h-5" />
                تماس با مدیریت (۰۹۰۰۲۴۵۰۰۹۰)
              </a>

              <div className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white cursor-default">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
                <span>+۹۵٪ موفقیت (آمار سامانه سنا، ۱۳۹۰–۱۴۰۴)</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative max-w-md mx-auto lg:max-w-full">
            <div className="relative rounded-3xl overflow-hidden border-4 border-[var(--background)] shadow-2xl">
              <Image
                src="/lawyer-full.jpg"
                alt="مرضیه توانگر - وکیل پایه یک دادگستری، عضو کانون وکلای ایران"
                width={600}
                height={750}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24 text-white text-center lg:text-right">
                <p className="text-sm text-[var(--accent)] mb-1 font-bold">
                  وکیل پایه یک دادگستری
                </p>
                <p className="text-2xl md:text-3xl font-black text-white">
                  مرضیه توانگر
                </p>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-full h-full rounded-3xl border-2 border-[var(--accent)]/30 -z-10 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
