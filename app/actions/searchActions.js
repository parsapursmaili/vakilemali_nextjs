// File: app/actions/searchActions.js
"use server";

import { db } from "@/lib/db/mysql"; // ⚠️ مسیر فایل دیتابیس خود را چک کنید

/**
 * جستجوی پیشرفته در پست‌ها با اولویت‌بندی عنوان و صفحه‌بندی (Pagination)
 * @param {object} options - گزینه‌های جستجو
 * @param {string} options.query - عبارت جستجو
 * @param {number} [options.page=1] - شماره صفحه نتایج
 * @param {number} [options.limit=20] - تعداد نتایج در هر صفحه
 * @returns {Promise<{posts: Array}>} - لیستی از پست‌های پیدا شده
 */
export async function searchPosts({ query, page = 1, limit = 20 }) {
  // اگر عبارت جستجو خالی است، نتیجه‌ای برنگردان
  if (!query || query.trim() === "") {
    return { posts: [] };
  }

  try {
    const searchTerm = `%${query}%`;
    const offset = (page - 1) * limit;

    const searchQuery = `
      SELECT * FROM (
        (
          SELECT 
            id, title, slug, excerpt, thumbnail, created_at, 
            1 AS sort_priority
          FROM posts
          WHERE status = 'published' AND type = 'post' and redirect_url is NULL AND title LIKE ?
        )
        UNION
        (
          SELECT 
            id, title, slug, excerpt, thumbnail, created_at, 
            2 AS sort_priority
          FROM posts
          WHERE status = 'published' AND type = 'post' and redirect_url is NULL AND content LIKE ? AND title NOT LIKE ?
        )
      ) AS search_results
      ORDER BY 
        sort_priority ASC, 
        created_at DESC
      LIMIT ?
      OFFSET ?;
    `;

    const [results] = await db.query(searchQuery, [
      searchTerm,
      searchTerm,
      searchTerm,
      limit,
      offset,
    ]);

    return { posts: results };
  } catch (error) {
    console.error("Database Error - searchPosts Action:", error.message);
    // در صورت بروز خطا، یک آرایه خالی برگردان تا برنامه کرش نکند
    return { posts: [] };
  }
}
