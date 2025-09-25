// app/posts/[slug]/actions.js

"use server";

import db from "@/app/";
import { revalidatePath } from "next/cache";

/**
 * پست را بر اساس Slug واکشی می‌کند.s
 * @param {string} slug - اسلاگ پست
 * @returns {Promise<Object|null>} - شیء پست یا null
 */
export async function getPostBySlug(slug) {
  try {
    const post = await db.query(
      "SELECT * FROM posts WHERE slug = ? AND status = 'published'",
      [slug]
    );
    return post[0] || null;
  } catch (error) {
    console.error("Database Error fetching post:", error);
    return null;
  }
}

/**
 * تعداد بازدیدهای پست را ۱ واحد افزایش می‌دهد.
 * از revalidatePath استفاده نمی‌کنیم چون بازدید را از کامپوننت کلاینت جداگانه واکشی می‌کنیم.
 * @param {number} postId - شناسه پست
 * @returns {Promise<boolean>} - موفقیت‌آمیز بودن عملیات
 */
export async function incrementPostViews(postId) {
  try {
    const result = await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database Error incrementing view:", error);
    return false;
  }
}
