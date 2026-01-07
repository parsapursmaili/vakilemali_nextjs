import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "test",
  // --- تنظیمات حیاتی زیر را اضافه کن ---
  waitForConnections: true,
  connectionLimit: 10, // حداکثر ۱۰ کانکشن باز همزمان (بسیار حیاتی)
  maxIdle: 10, // حداکثر ۱۰ کانکشن در حالت استراحت
  idleTimeout: 60000, // حذف کانکشن‌های بیکار بعد از ۶۰ ثانیه
  queueLimit: 0, // تعداد درخواست‌های در صف (۰ یعنی نامحدود)
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
