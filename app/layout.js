import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { vazir } from "./font.js";
import Header from "@/components/Header.jsx";
import ProgressBarProvider from "@/components/ProgressBarProvider.jsx";
import { AdminBar } from "@/components/AdminBar";
// ۱. ایمپورت کردن کامپوننت Script
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "وکیل مالی | مشاوره حقوقی آنلاین و تلفنی | وکیل پایه یک دادگستری",
  description:
    "وکیل مالی، مرکز تخصصی مشاوره و وکالت آنلاین در حوزه مالیات، طلاق و نفقه، دعاوی کیفری، چک و سفته، ارث و میراث، قراردادها و … . وکیل پایه یک با امکان مشاوره تلفنی و حضوری.",
};

// ۲. تبدیل layout به یک تابع async (که قبلاً انجام داده‌اید)
export default async function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className={`antialiased bg-background text-foreground`}>
        {/* ۳. اضافه کردن اسکریپت Clarity با استراتژی بهینه */}
        <Script
          id="microsoft-clarity-script" // یک شناسه یونیک برای Script
          strategy="lazyOnload" // استراتژی بهینه: پس از بارگذاری تمام منابع حیاتی
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "u6ut03m13a");
            `,
          }}
        />

        <AdminBar />
        <ProgressBarProvider />
        <Header />

        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
