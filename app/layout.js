import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { vazir } from "./font.js"; // فرض بر این است که فونت وزیر به درستی اینجا import شده است
import Header from "@/components/Header.jsx"; //  <-- ایمپورت کردن کامپوننت هدر

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className={`antialiased bg-background text-foreground`}>
        {/* ===== کامپوننت هدر اینجا اضافه شد ===== */}
        <Header />

        {/* محتوای اصلی صفحات در اینجا رندر می‌شود */}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
