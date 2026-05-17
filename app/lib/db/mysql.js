import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // تنظیمات حیاتی برای حل Timeout در شبکه های با اختلال:
  waitForConnections: true,
  connectionLimit: 5,       // تعداد را کمتر کنید برای تست
  connectTimeout: 30000,    // ۳۰ ثانیه صبر برای کانکشن اولیه
  idleTimeout: 60000,

  family: 'IPv4',           // اجبار به IPv4 (بسیار مهم در لینوکس)

// حذف SSL چون سرور پشتیبانی نمی‌کند
ssl: false
});
