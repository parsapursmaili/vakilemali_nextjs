// app/admin/layout.tsx

import { redirect } from "next/navigation";
// تابع احراز هویت را از همان مسیری که در RootLayout استفاده کرده‌اید، ایمپورت می‌کنیم
import { isAuthenticated } from "@/actions/auth";

/**
 * @title AdminLayout
 * @description یک Layout تو در تو (Nested Layout) برای محافظت از مسیرهای بخش ادمین.
 * این Layout درون RootLayout قرار گرفته و هدر و فوتر آن را به ارث می‌برد.
 */
export default async function AdminLayout({ children }) {
  const isUserAdmin = await isAuthenticated();

  // ۲. منطق محافظت از مسیر
  if (!isUserAdmin) {
    redirect("/login");
  }

  return <div className="admin-content-wrapper p-4">{children}</div>;
}
