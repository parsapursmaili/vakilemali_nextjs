"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

// تابع اصلی برای دریافت ترم‌ها با قابلیت جستجو و فیلتر
export async function getFilteredTerms({ query = "", type = "all" }) {
  try {
    let sql = `
      SELECT 
        t.id, t.name, t.slug, t.type, COUNT(pt.post_id) as post_count
      FROM terms t
      LEFT JOIN post_terms pt ON t.id = pt.term_id
    `;
    const params = [];

    const whereClauses = [];
    if (query) {
      whereClauses.push("t.name LIKE ?");
      params.push(`%${query}%`);
    }
    if (type && type !== "all") {
      whereClauses.push("t.type = ?");
      params.push(type);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    sql += `
      GROUP BY t.id
      ORDER BY t.id DESC
    `;

    const [terms] = await db.query(sql, params);
    return { success: true, data: terms };
  } catch (error) {
    console.error("Database Error fetching filtered terms:", error.message);
    return { success: false, message: "خطا در دریافت اطلاعات." };
  }
}

// ... (توابع createTerm, updateTerm, deleteTerm بدون تغییر باقی می‌مانند) ...
export async function createTerm(formData) {
  const name = formData.get("name");
  const slug = (formData.get("slug") || name).trim().replace(/\s+/g, "-");
  const type = formData.get("type") || "category";
  if (!name || !slug)
    return { success: false, message: "نام و اسلاگ الزامی هستند." };
  try {
    const [existing] = await db.query("SELECT id FROM terms WHERE slug = ?", [
      slug,
    ]);
    if (existing.length > 0)
      return { success: false, message: "این اسلاگ قبلاً استفاده شده است." };
    await db.query("INSERT INTO terms (name, slug, type) VALUES (?, ?, ?)", [
      name,
      slug,
      type,
    ]);
    revalidatePath("/admin/terms");
    return { success: true, message: "ترم با موفقیت ایجاد شد." };
  } catch (error) {
    return { success: false, message: "خطا در ایجاد ترم جدید." };
  }
}
export async function updateTerm(termId, formData) {
  const name = formData.get("name");
  const slug = (formData.get("slug") || name).trim().replace(/\s+/g, "-");
  const type = formData.get("type");
  if (!termId || !name || !slug || !type)
    return { success: false, message: "اطلاعات ارسالی ناقص است." };
  try {
    const [existing] = await db.query(
      "SELECT id FROM terms WHERE slug = ? AND id != ?",
      [slug, termId]
    );
    if (existing.length > 0)
      return {
        success: false,
        message: "این اسلاگ قبلاً برای ترم دیگری استفاده شده است.",
      };
    await db.query(
      "UPDATE terms SET name = ?, slug = ?, type = ? WHERE id = ?",
      [name, slug, type, termId]
    );
    revalidatePath("/admin/terms");
    return { success: true, message: "ترم با موفقیت به‌روزرسانی شد." };
  } catch (error) {
    return { success: false, message: "خطا در به‌روزرسانی ترم." };
  }
}
export async function deleteTerm(termId) {
  if (!termId) return { success: false, message: "شناسه ترم مشخص نشده است." };
  try {
    await db.query("DELETE FROM terms WHERE id = ?", [termId]);
    revalidatePath("/admin/terms");
    return { success: true, message: "ترم با موفقیت حذف شد." };
  } catch (error) {
    return { success: false, message: "خطا در حذف ترم." };
  }
}
export async function getPostsForTerm(termId) {
  if (!termId) return { success: true, data: [] };
  try {
    const [posts] = await db.query(
      `SELECT p.id, p.title FROM posts p JOIN post_terms pt ON p.id = pt.post_id WHERE pt.term_id = ? ORDER BY p.created_at DESC`,
      [termId]
    );
    return { success: true, data: posts };
  } catch (error) {
    return { success: false, message: "خطا در دریافت پست‌ها." };
  }
}

// FIX: This function now searches in both title and content.
export async function searchPostsToAdd(termId, query) {
  if (!query) return { success: true, data: [] };
  try {
    const searchQuery = `%${query}%`;
    const [posts] = await db.query(
      `
            SELECT id, title 
            FROM posts 
            WHERE (title LIKE ? OR content LIKE ?) 
              AND status = 'published' 
              AND id NOT IN (
                SELECT post_id FROM post_terms WHERE term_id = ?
            ) LIMIT 10
        `,
      [searchQuery, searchQuery, termId] // Pass the query parameter twice
    );
    return { success: true, data: posts };
  } catch (error) {
    console.error("Database Error searching posts:", error.message);
    return { success: false, message: "خطا در جستجوی پست‌ها." };
  }
}

export async function addPostToTerm(termId, postId) {
  try {
    await db.query("INSERT INTO post_terms (term_id, post_id) VALUES (?, ?)", [
      termId,
      postId,
    ]);
    revalidatePath("/admin/terms");
    return { success: true };
  } catch (error) {
    return { success: false, message: "خطا در افزودن پست." };
  }
}
export async function removePostFromTerm(termId, postId) {
  try {
    await db.query("DELETE FROM post_terms WHERE term_id = ? AND post_id = ?", [
      termId,
      postId,
    ]);
    revalidatePath("/admin/terms");
    return { success: true };
  } catch (error) {
    return { success: false, message: "خطا در حذف پست." };
  }
}
