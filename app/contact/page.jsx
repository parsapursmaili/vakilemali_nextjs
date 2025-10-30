// app/contact/page.js

import {
  Phone,
  ShieldCheck,
  Scale,
  MessageSquareQuote,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// برای بهینه‌سازی SEO
export const metadata = {
  title: "تماس با ما | مشاوره فوری حقوقی",
  description:
    "برای دریافت مشاوره تخصصی و فوری حقوقی با ما تماس بگیرید. وکلای مجرب ما آماده پاسخگویی به سوالات شما در زمینه‌های مختلف حقوقی هستند.",
};

const ContactPage = () => {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      {/* بخش Hero بازطراحی شده */}
      <section className="mb-20 md:mb-28">
        <div className="relative overflow-hidden rounded-2xl border border-muted bg-background p-8 py-12 md:p-16 text-center shadow-lg">
          {/* عناصر تزئینی پس‌زمینه */}
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 bg-accent/5 blur-3xl"></div>

          <div className="mx-auto flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-background shadow-md">
              <Scale className="h-8 w-8" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              راه ارتباطی شما با وکلای متخصص ما
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl text-foreground/80 leading-relaxed">
              یک تماس تا دریافت مشاوره تخصصی حقوقی از وکلای مجرب ما فاصله دارید.
              بدون پیچیدگی و در سریع‌ترین زمان ممکن، پاسخ سوالات خود را بیابید.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4">
              <a
                href="tel:09002450090"
                className="button-primary inline-flex transform items-center gap-3 rounded-full py-4 px-8 text-lg font-bold shadow-lg shadow-primary/30 transition-transform hover:scale-105 md:text-xl"
              >
                <Phone className="h-6 w-6" />
                تماس برای مشاوره فوری
              </a>
              <p className="text-sm text-foreground/70">
                (امکان ارسال پیام در ایتا و تلگرام)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* بخش "چرا باید با ما تماس بگیرید؟" */}
      <section className="mt-20 md:mt-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            چرا مشاوره تلفنی با ما؟
          </h2>
          <p className="mt-3 text-base text-foreground/70 max-w-xl mx-auto">
            ما معتقدیم دسترسی به مشاوره حقوقی باید ساده، سریع و قابل اعتماد
            باشد.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center items-center flex flex-col !bg-background border border-muted hover:border-accent transition-colors duration-300">
            <ShieldCheck className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary">محرمانگی کامل</h3>
            <p className="mt-2 text-foreground/80">
              تمام اطلاعات و مکالمات شما در امنیت کامل و به صورت کاملاً محرمانه
              محفوظ خواهد ماند.
            </p>
          </div>
          <div className="card text-center items-center flex flex-col !bg-background border border-muted hover:border-accent transition-colors duration-300">
            <Scale className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary">مشاوره تخصصی</h3>
            <p className="mt-2 text-foreground/80">
              پرونده شما توسط وکلای متخصص در همان حوزه بررسی شده و بهترین راهکار
              حقوقی به شما ارائه می‌شود.
            </p>
          </div>
          <div className="card text-center items-center flex flex-col !bg-background border border-muted hover:border-accent transition-colors duration-300">
            <MessageSquareQuote className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary">پاسخگویی سریع</h3>
            <p className="mt-2 text-foreground/80">
              بدون نیاز به مراجعه حضوری و صرف وقت، به سرعت پاسخ سوالات خود را
              دریافت کرده و مسیر درست را انتخاب کنید.
            </p>
          </div>
        </div>
      </section>

      {/* بخش فرآیند مشاوره */}
      <section className="mt-20 md:mt-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            فرآیند دریافت مشاوره در ۳ مرحله ساده
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="flex-1 text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-background font-black text-4xl border-4 border-primary-light">
              ۱
            </div>
            <h4 className="mt-4 font-bold text-xl">تماس با ما</h4>
            <p className="text-foreground/70 mt-1">
              با شماره موجود در این صفحه تماس بگیرید.
            </p>
          </div>
          <ArrowLeft className="h-10 w-10 text-accent/50 rotate-90 md:rotate-0" />
          <div className="flex-1 text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-background font-black text-4xl border-4 border-primary-light">
              ۲
            </div>
            <h4 className="mt-4 font-bold text-xl">طرح مسئله</h4>
            <p className="text-foreground/70 mt-1">
              مشکل یا سوال حقوقی خود را با وکیل متخصص در میان بگذارید.
            </p>
          </div>
          <ArrowLeft className="h-10 w-10 text-accent/50 rotate-90 md:rotate-0" />
          <div className="flex-1 text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary text-background font-black text-4xl border-4 border-primary-light">
              ۳
            </div>
            <h4 className="mt-4 font-bold text-xl">دریافت راه‌حل</h4>
            <p className="text-foreground/70 mt-1">
              راهکار حقوقی دقیق و کاربردی را از وکیل دریافت کنید.
            </p>
          </div>
        </div>
      </section>

      {/* بخش پایانی و CTA نهایی */}
      <section className="mt-20 md:mt-28 p-8 md:p-12 rounded-lg bg-gradient-to-tr from-primary/5 to-secondary/5 border border-muted text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          آماده‌اید تا اولین قدم را بردارید؟
        </h2>
        <p className="mt-3 text-base text-foreground/70 max-w-xl mx-auto">
          مشکلات حقوقی را به تعویق نیندازید. همین امروز با ما تماس بگیرید و از
          حقوق خود آگاه شوید.
        </p>

        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm font-medium text-secondary mb-2">
            شماره تماس جهت مشاوره فوری:
          </p>
          <a
            href="tel:09002450090"
            className="text-4xl md:text-5xl font-extrabold tracking-wider text-primary hover:text-accent transition-colors ![direction:ltr]"
            aria-label="شماره تماس: 09002450090"
          >
            0900 245 0090
          </a>
          <a
            href="tel:09002450090"
            className="button-primary inline-flex items-center gap-3 mt-8 py-3 px-8"
          >
            <Phone className="h-5 w-5" />
            اکنون تماس بگیرید
          </a>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
