"use server";

import { db } from "@/lib/db/mysql";

const POSTS_PER_PAGE = 24;

/**
 * دریافت تمام دسته‌بندی‌ها برای نمایش در دراپ‌داون فیلتر
 */
export async function getCategories() {
  try {
    // ID, name و slug برای استفاده در client و FilterControls برگردانده می‌شود.
    const [categories] = await db.query(
      "SELECT id, name, slug FROM terms WHERE type = 'category' ORDER BY name ASC"
    );
    return categories;
  } catch (error) {
    console.error("Database Error fetching categories:", error.message);
    return [];
  }
}

/**
 * دریافت پست‌های مقالات به صورت صفحه‌بندی شده با قابلیت فیلتر و مرتب‌سازی
 */
export async function getPaginatedPosts({
  page = 1,
  sortBy = "newest", // 'newest', 'popular', 'random'
  categoryId = null, // ✅ تغییر: پذیرش categoryId به جای categorySlug
}) {
  try {
    const offset = (page - 1) * POSTS_PER_PAGE;
    let params = [];
    let countParams = [];

    // --- بخش اصلی کوئری ---
    let query = `
      SELECT 
        p.id, p.title, p.slug, p.thumbnail,
        (SELECT t.name FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = p.id AND t.type = 'category' LIMIT 1) as categoryName
      FROM posts p
    `;

    // --- کوئری برای شمارش کل آیتم‌ها (برای صفحه‌بندی) ---
    let countQuery = `SELECT COUNT(DISTINCT p.id) as total FROM posts p`;

    // --- افزودن JOIN در صورت فیلتر بر اساس دسته‌بندی ---
    if (categoryId) {
      const joinClause = `
        JOIN post_terms pt ON p.id = pt.post_id
        JOIN terms t ON pt.term_id = t.id
      `;
      query += joinClause;
      countQuery += joinClause;
    }

    // --- افزودن شرط WHERE ---
    let whereClause = ` WHERE p.status = 'published'`;
    if (categoryId) {
      whereClause += ` AND t.id = ? AND t.type = 'category'`; // ✅ تغییر: فیلتر بر اساس t.id
      params.push(categoryId);
      countParams.push(categoryId);
    }
    query += whereClause;
    countQuery += whereClause;

    // --- مرتب‌سازی ---
    let orderByClause = " ORDER BY ";
    switch (sortBy) {
      case "popular":
        orderByClause += "p.view_count DESC, p.created_at DESC";
        break;
      case "random":
        orderByClause += "RAND()";
        break;
      default: // 'newest'
        orderByClause += "p.created_at DESC";
    }
    query += orderByClause;

    // --- افزودن LIMIT و OFFSET ---
    query += ` LIMIT ? OFFSET ?`;
    params.push(POSTS_PER_PAGE, offset);

    // --- اجرای همزمان کوئری‌ها ---
    const [[posts], [[{ total }]]] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    const totalPages = Math.ceil(total / POSTS_PER_PAGE);

    return { posts, totalPages, currentPage: page };
  } catch (error) {
    console.error("Database Error fetching paginated posts:", error.message);
    return { posts: [], totalPages: 0, currentPage: 1 };
  }
}
