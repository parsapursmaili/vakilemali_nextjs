"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

export async function getTerms(search = "") {
  try {
    let sql = `
      SELECT t.id, t.name, t.slug, t.parent_id, p.name as parent_name, COUNT(pt.post_id) as post_count
      FROM terms t
      LEFT JOIN terms p ON t.parent_id = p.id
      LEFT JOIN post_terms pt ON t.id = pt.term_id
    `;
    const params = [];
    if (search) {
      sql += ` WHERE t.name LIKE ? OR t.slug LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ` GROUP BY t.id ORDER BY t.id DESC`;
    const [terms] = await db.query(sql, params);
    return { success: true, data: terms };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function createTerm(formData) {
  const name = formData.get("name");
  const slug = (formData.get("slug") || name)
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  const parentId = formData.get("parent_id") || null;
  if (!name) return { success: false, message: "نام الزامی است." };

  try {
    const [existing] = await db.query("SELECT id FROM terms WHERE slug = ?", [
      slug,
    ]);
    if (existing.length > 0)
      return { success: false, message: "اسلاگ تکراری است." };
    await db.query(
      "INSERT INTO terms (name, slug, parent_id) VALUES (?, ?, ?)",
      [name, slug, parentId]
    );
    revalidatePath("/admin/terms");
    return { success: true, message: "ترم ایجاد شد." };
  } catch (e) {
    return { success: false, message: "خطا در دیتابیس." };
  }
}

export async function updateTerm(termId, formData) {
  const name = formData.get("name");
  const slug = (formData.get("slug") || name)
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
  const parentId = formData.get("parent_id") || null;
  if (!termId || !name) return { success: false, message: "خطا در ورودی." };
  if (parentId && parseInt(parentId) == parseInt(termId))
    return { success: false, message: "حلقه در والد غیرمجاز است." };

  try {
    const [existing] = await db.query(
      "SELECT id FROM terms WHERE slug = ? AND id != ?",
      [slug, termId]
    );
    if (existing.length > 0)
      return { success: false, message: "اسلاگ تکراری است." };
    await db.query(
      "UPDATE terms SET name = ?, slug = ?, parent_id = ? WHERE id = ?",
      [name, slug, parentId, termId]
    );
    revalidatePath("/admin/terms");
    return { success: true, message: "ویرایش انجام شد." };
  } catch (e) {
    return { success: false, message: "خطا در ویرایش." };
  }
}

export async function deleteTerm(termId) {
  try {
    await db.query("UPDATE terms SET parent_id = NULL WHERE parent_id = ?", [
      termId,
    ]);
    await db.query("DELETE FROM terms WHERE id = ?", [termId]);
    revalidatePath("/admin/terms");
    return { success: true, message: "حذف شد." };
  } catch (e) {
    return { success: false, message: "خطا در حذف." };
  }
}

export async function getPostsForTerm(termId) {
  try {
    const [posts] = await db.query(
      `SELECT p.id, p.title FROM posts p JOIN post_terms pt ON p.id = pt.post_id WHERE pt.term_id = ? LIMIT 50`,
      [termId]
    );
    return { success: true, data: posts };
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function searchPostsToAdd(termId, query) {
  if (!query) return { success: true, data: [] };
  const q = `%${query}%`;
  try {
    const [posts] = await db.query(
      `SELECT id, title FROM posts WHERE title LIKE ? AND id NOT IN (SELECT post_id FROM post_terms WHERE term_id = ?) LIMIT 5`,
      [q, termId]
    );
    return { success: true, data: posts };
  } catch (e) {
    return { success: false, data: [] };
  }
}

export async function addPostToTerm(termId, postId) {
  try {
    await db.query(
      "INSERT IGNORE INTO post_terms (term_id, post_id) VALUES (?, ?)",
      [termId, postId]
    );
    revalidatePath("/admin/terms");
    return { success: true };
  } catch (e) {
    return { success: false };
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
  } catch (e) {
    return { success: false };
  }
}
