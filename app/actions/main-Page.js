// app/actions.js

"use server";

import { db } from "@/lib/db/mysql"; // مسیر فایل اتصال به دیتابیس خود را چک کنید

/**
 * جدیدترین پست‌ها را با قابلیت تعیین تعداد (limit) و نقطه شروع (offset) دریافت می‌کند.
 * این تابع برای بخش "جدیدترین مطالب" و "بیشتر بخوانید" در صفحه اصلی استفاده می‌شود.
 * @param {{ limit?: number, offset?: number }} options - گزینه‌های دریافت پست‌ها
 * @returns {Promise<{posts: Array<any>}>} لیستی از پست‌ها
 */
export async function getLatestPosts({ limit = 10, offset = 0 }) {
  try {
    // این کوئری به صورت بهینه نام اولین دسته‌بندی هر پست را نیز استخراج می‌کند.
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.thumbnail,
        (
          SELECT t.name 
          FROM terms t 
          JOIN post_terms pt ON pt.term_id = t.id 
          WHERE pt.post_id = p.id AND t.type = 'category' 
          LIMIT 1
        ) as categoryName
      FROM posts p
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ?
      OFFSET ?
    `;

    // اجرای کوئری با پارامترهای امن
    const [rows] = await db.query(query, [limit, offset]);
    return { posts: rows };
  } catch (error) {
    console.error("Database Error fetching latest posts:", error.message);
    // در صورت بروز خطا، یک آرایه خالی برمی‌گردانیم تا صفحه دچار مشکل نشود
    return { posts: [] };
  }
}

/**
 * پربازدیدترین پست‌ها را بر اساس ستون `view_count` دریافت می‌کند.
 * @param {{ limit?: number }} options - گزینه‌های دریافت پست‌ها
 * @returns {Promise<{posts: Array<any>}>} لیستی از پست‌های محبوب
 */
export async function getPopularPosts({ limit = 10 }) {
  try {
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.thumbnail,
        (
          SELECT t.name 
          FROM terms t 
          JOIN post_terms pt ON pt.term_id = t.id 
          WHERE pt.post_id = p.id AND t.type = 'category' 
          LIMIT 1
        ) as categoryName
      FROM posts p
      WHERE p.status = 'published'
      ORDER BY p.view_count DESC, p.created_at DESC -- اولویت با بازدید بیشتر، سپس تاریخ جدیدتر
      LIMIT ?
    `;

    const [rows] = await db.query(query, [limit]);
    return { posts: rows };
  } catch (error) {
    console.error("Database Error fetching popular posts:", error.message);
    return { posts: [] };
  }
}

// می‌توانید سایر توابع Action که قبلاً داشتید را نیز برای یکپارچگی به این فایل منتقل کنید.
// যেমন: getPostData, incrementPostViews, getRelatedPosts و غیره.
/**
 * اسلاگ یک پست را بر اساس ID آن به صورت بهینه پیدا می‌کند.
 * @param {number} postId - شناسه (ID) پست
 * @returns {Promise<{slug: string | null}>} اسلاگ پست یا null در صورت عدم وجود
 */
export async function findPostSlugById(postId) {
  try {
    // این کوئری بسیار سریع است چون فقط یک ستون را از روی ایندکس اصلی (id) می‌خواند
    const query =
      "SELECT slug FROM posts WHERE id = ? AND status = 'published' LIMIT 1";

    const [rows] = await db.query(query, [postId]);

    // اگر پستی پیدا شد، اسلاگ آن را برگردان، در غیر این صورت null
    if (rows.length > 0) {
      return { slug: encodeURIComponent(rows[0].slug) };
    }

    return { slug: null };
  } catch (error) {
    console.error("Database Error fetching slug by ID:", error.message);
    return { slug: null }; // در صورت خطا، null برگردان
  }
}
