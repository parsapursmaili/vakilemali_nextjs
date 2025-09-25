import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { vazir } from "./font.js"; // فرض بر این است که فونت وزیر به درستی اینجا import شده است

// این‌ها می‌توانند حذف شوند یا اگر Geist را برای جایی نیاز دارید، بمانند،
// اما کلاس‌هایشان نباید روی body اعمال شوند تا وزیر اولویت بگیرد.
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
      dir="rtl" // مطمئن شوید که متغیر فونت وزیر به تگ <html> اضافه شده باشد
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        // کلاس‌های مربوط به فونت‌های Geist و Geist Mono را حذف کنید
        className={`antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
