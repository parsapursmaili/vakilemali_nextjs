import { getDashboardStatistics } from "./actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // 1. فراخوانی اکشن برای دریافت داده‌ها در سمت سرور
  const stats = await getDashboardStatistics();

  // 2. مدیریت حالت خطا
  if (stats.error) {
    return (
      <div className="p-8 text-center text-[var(--destructive)] bg-[var(--error-background)] border border-[var(--error-border)] rounded-lg">
        <h2 className="font-bold text-lg">خطا در بارگذاری داشبورد</h2>
        <p className="text-sm mt-1">{stats.error}</p>
      </div>
    );
  }

  // 3. ارسال داده‌ها به کامپوننت کلاینت برای رندر شدن
  return <DashboardClient initialStats={stats} />;
}
