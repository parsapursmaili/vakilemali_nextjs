import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { vazir } from "./font.js";
import Header from "@/components/Header.jsx";
import ProgressBarProvider from "@/components/ProgressBarProvider.jsx";
import AdminBar from "@/components/AdminBar"; // ۱. ایمپورت کامپوننت نوار ادمین
import { isAuthenticated } from "@/actions/auth"; // ۲. ایمپورت تابع احراز هویت

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "سایت وکالتی",
  description: "مقالات و خدمات حقوقی",
};

// ۳. تبدیل layout به یک تابع async
export default async function RootLayout({ children }) {
  // ۴. بررسی وضعیت لاگین بودن ادمین در سرور
  const isUserAdmin = await isAuthenticated();

  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className={`antialiased bg-background text-foreground ${
          // اگر ادمین لاگین بود، یک فاصله‌ی خالی در بالای صفحه ایجاد می‌کنیم
          // تا محتوای اصلی زیر نوار ادمین قرار بگیرد
          isUserAdmin ? "pt-16" : ""
        }`}
      >
        {/* ۵. رندر شرطی نوار ادمین */}
        {isUserAdmin && <AdminBar />}

        <ProgressBarProvider />

        <Header />

        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
