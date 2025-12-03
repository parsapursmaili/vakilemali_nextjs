"use server";
import { db } from "@/lib/db/mysql";

export async function getPostIdBySlug(slug) {
  if (!slug || slug === "/") return null;

  try {
    // حذف اسلش اول در صورتی که وجود داشته باشد
    const cleanSlug = slug.startsWith("/") ? slug.substring(1) : slug;

    // دیکود کردن کاراکترهای فارسی
    const decodedSlug = decodeURIComponent(cleanSlug);

    const [rows] = await db.query(
      "SELECT id FROM posts WHERE slug = ? LIMIT 1",
      [decodedSlug]
    );

    if (rows && rows.length > 0) {
      return rows[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching post ID by slug:", error);
    return null;
  }
}
