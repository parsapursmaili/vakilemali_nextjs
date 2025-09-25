// app/not-found.js
import Link from "next/link";
import { SearchX } from "lucide-react"; // برای آیکون جذاب

/**
 * کامپوننت سفارشی صفحه 404 (Not Found)
 * این کامپوننت به طور خودکار توسط Next.js هنگام فراخوانی notFound() رندر می‌شود.
 */
export default function NotFound() {
  return (
    // استفاده از کلاس‌های Tailwind و متغیرهای CSS تعریف‌شده
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 md:p-12 bg-[var(--background)] text-[var(--foreground)]">
      {/* آیکون برای جلب توجه */}
      <SearchX className="w-24 h-24 text-[var(--accent)] mb-6" />

      {/* عنوان اصلی */}
      <h1 className="text-7xl md:text-8xl font-extrabold mb-4 leading-tight text-[var(--primary)]">
        ۴۰۴
      </h1>

      {/* پیام خطا */}
      <p className="text-2xl md:text-3xl font-semibold mt-4 mb-6">
        صفحه مورد نظر پیدا نشد
      </p>

      {/* توضیح بیشتر */}
      <p className="text-lg text-[var(--foreground)] opacity-80 max-w-lg mb-10">
        متأسفیم، به نظر می‌رسد آدرسی که وارد کرده‌اید یا پستی که به دنبال آن
        بودید، در دسترس نیست یا حذف شده است.
      </p>

      {/* دکمه بازگشت به صفحه اصلی */}
      {/* استفاده از کلاس سفارشی button-primary که در فایل گلوبال تعریف کرده‌اید */}
      <Link
        href="/"
        className="button-primary text-[var(--background)] hover:bg-[var(--primary-light)] inline-flex items-center justify-center"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
