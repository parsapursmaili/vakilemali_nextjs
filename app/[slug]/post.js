"use server";

import { db } from "@/lib/db/mysql"; // فرض بر وجود ماژول db در lib/db.js
import { revalidatePath } from "next/cache";

/**
 * 💡 Server Action برای واکشی پست و دسته‌بندی‌ها
 * @param {string} slug - اسلاگ پست
 * @returns {Promise<{post: Object|null, terms: Array<Object>|[]}>}
 */
export async function getPostData(slug) {
  try {
    // 1. واکشی پست
    const decodedSlug = decodeURIComponent(slug);
    console.log("slugL ", decodedSlug);
    const postResult = await db.query(
      "SELECT id, title, content, excerpt, thumbnail, created_at, view_count FROM posts WHERE slug = ? AND status = 'published'",
      [decodedSlug]
    );
    const post = postResult[0] || null;

    if (!post) {
      return { post: null, terms: [] };
    }

    // 2. واکشی دسته‌بندی‌ها و تگ‌ها (Terms)
    const termsResult = await db.query(
      `SELECT t.name, t.slug, t.type FROM terms t
       JOIN post_terms pt ON pt.term_id = t.id
       WHERE pt.post_id = ?`,
      [post.id]
    );

    return { post, terms: termsResult };
  } catch (error) {
    console.error("Database Error fetching post data:", error);
    return { post: null, terms: [] };
  }
}

/**
 * 💡 Server Action برای افزایش بازدید
 * این تابع فقط برای استفاده توسط Client Component PostViews طراحی شده است.
 * @param {number} postId - شناسه پست
 * @returns {Promise<boolean>} - موفقیت‌آمیز بودن عملیات
 */
export async function incrementPostViews(postId) {
  try {
    // افزایش بازدید
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );
    // توجه: نیازی به revalidatePath نیست چون Client Component، بازدید جدید را مستقیم نمایش می‌دهد
    return true;
  } catch (error) {
    console.error("Database Error incrementing view:", error);
    return false;
  }
}
