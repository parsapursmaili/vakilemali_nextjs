// app/robots.js

export default function robots() {
  // آدرس اصلی سایت خود را اینجا جایگزین کنید
  const baseUrl = "https://vakilemali.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/", // صفحات مدیریت
          "/login", // صفحه ورود
          "/*?*", // جلوگیری از ایندکس شدن لینک‌های تکراری دارای پارامتر (سئو عالی)
        ],
      },
    ],
    // معرفی خودکار نقشه سایت
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
