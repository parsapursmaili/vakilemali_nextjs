"use server";

import { db } from "@/lib/db/mysql";

/**
 * جستجوی پیشرفته در پست‌ها با اولویت‌بندی عنوان و صفحه‌بندی (Pagination)
 * @param {object} options - گزینه‌های جستجو
 * @param {string} options.query - عبارت جستجو
 * @param {number} [options.page=1] - شماره صفحه نتایج
 * @param {number} [options.limit=20] - تعداد نتایج در هر صفحه
 * @returns {Promise<{posts: Array}>} - لیستی از پست‌های پیدا شده
 */
export async function searchPosts({ query, page = 1, limit = 20 }) {
  if (!query?.trim()) return { posts: [] };

  const searchTerm = `%${query}%`;
  const offset = (page - 1) * limit;

  const searchQuery = `
    SELECT * FROM (
      SELECT id, title, slug, excerpt, thumbnail, created_at, 1 AS sort_priority
      FROM posts
      WHERE status = 'published'
        AND type = 'post'
        AND redirect_url IS NULL
        AND title LIKE ?
      UNION ALL
      SELECT id, title, slug, excerpt, thumbnail, created_at, 2 AS sort_priority
      FROM posts
      WHERE status = 'published'
        AND type = 'post'
        AND redirect_url IS NULL
        AND content LIKE ?
        AND title NOT LIKE ?
    ) AS search_results
    ORDER BY sort_priority ASC, created_at DESC
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.query(searchQuery, [
      searchTerm,
      searchTerm,
      searchTerm,
      limit,
      offset,
    ]);

    return { posts: results };
  } catch (error) {
    console.error("Database Error - searchPosts:", error);
    return { posts: [] };
  }
}
