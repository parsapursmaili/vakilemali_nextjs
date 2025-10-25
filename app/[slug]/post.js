"use server";
import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

// تابع اول: گرفتن اطلاعات پست تکی (با یک تغییر کوچک)
export async function getPostData(slug) {
  try {
    const [rows] = await db.query(
      // تغییر: کوئری برای slug به جای id بهتر است چون از URL می‌آید
      "SELECT id, title, slug, content, excerpt, thumbnail, created_at, view_count FROM posts WHERE id = ? AND status = 'published'",
      [slug]
    );
    if (!rows || rows.length === 0) {
      return { post: null, terms: [] };
    }
    const post = rows[0];
    if (!post || !post.id) {
      return { post: null, terms: [] };
    }
    // --- تغییر کلیدی: حالا ID دسته‌بندی‌ها را هم دریافت می‌کنیم ---
    const [termsResult] = await db.query(
      `SELECT t.id, t.name, t.slug, t.type FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ?`,
      [post.id]
    );
    return { post, terms: termsResult };
  } catch (error) {
    console.error(
      "LOG DATA ERROR: Database Error fetching post data:",
      error.message
    );
    return { post: null, terms: [] };
  }
}

// تابع دوم: افزایش بازدید (بدون تغییر)
export async function incrementPostViews(postId) {
  // ... (کد این تابع بدون تغییر باقی می‌ماند)
  try {
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );
    return true;
  } catch (error) {
    console.error("Database Error incrementing view:", error);
    return false;
  }
}

// --- تابع سوم: منطق جدید برای دریافت پست‌های مرتبط (جایگزین getLatestPosts) ---
export async function getRelatedPosts({
  limit = 6,
  excludeId = null,
  categoryId = null,
}) {
  try {
    let relatedPosts = [];

    // مرحله ۱: ابتدا پست‌های مرتبط از همان دسته‌بندی را پیدا کن
    if (categoryId) {
      const relatedQuery = `
        SELECT p.id, p.title, p.slug, p.thumbnail, t.name as categoryName
        FROM posts p
        JOIN post_terms pt ON p.id = pt.post_id
        JOIN terms t ON pt.term_id = t.id AND t.type = 'category'
        WHERE p.status = 'published'
          AND p.id != ?
          AND pt.term_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      const [relatedRows] = await db.query(relatedQuery, [
        excludeId,
        categoryId,
        limit,
      ]);
      relatedPosts = relatedRows;
    }

    // مرحله ۲: اگر تعداد کافی نبود، با آخرین پست‌ها لیست را کامل کن
    if (relatedPosts.length < limit) {
      const remainingLimit = limit - relatedPosts.length;
      const excludeIds = [excludeId, ...relatedPosts.map((p) => p.id)];

      const latestQuery = `
        SELECT 
          p.id, p.title, p.slug, p.thumbnail,
          (SELECT t.name FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = p.id AND t.type = 'category' LIMIT 1) as categoryName
        FROM posts p
        WHERE p.status = 'published'
          AND p.id NOT IN (?) -- از نمایش پست‌های تکراری جلوگیری کن
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      const [latestRows] = await db.query(latestQuery, [
        excludeIds,
        remainingLimit,
      ]);

      relatedPosts.push(...latestRows);
    }

    return { posts: relatedPosts };
  } catch (error) {
    console.error("Database Error fetching related posts:", error.message);
    return { posts: [] };
  }
}
