"use server";

import { db } from "@/lib/db/mysql"; // مسیر دیتابیس خود را تنظیم کنید
import { revalidatePath } from "next/cache";

// تعداد نظرات برای نمایش در هر صفحه
const COMMENTS_PER_PAGE = 50;

/**
 * دریافت نظرات از دیتابیس با قابلیت فیلتر و صفحه‌بندی
 * @param {object} options - شامل filterStatus و page
 */
export async function getComments({ filterStatus = "all", page = 1 }) {
  try {
    const offset = (page - 1) * COMMENTS_PER_PAGE;
    let baseQuery = "FROM comments c JOIN posts p ON c.post_id = p.id";
    const params = [];

    const validStatuses = ["pending", "approved", "spam"];
    if (validStatuses.includes(filterStatus)) {
      baseQuery += " WHERE c.status = ?";
      params.push(filterStatus);
    }

    // کوئری برای دریافت تعداد کل نظرات (برای محاسبه تعداد صفحات)
    const countQuery = `SELECT COUNT(c.id) as total ${baseQuery}`;
    const [countRows] = await db.query(countQuery, params);
    const totalComments = countRows[0].total;

    // کوئری برای دریافت نظرات صفحه فعلی
    const commentsQuery = `
      SELECT
        c.id, c.post_id, c.parent_id, c.author_name, c.author_email,
        c.content, c.created_at, c.status, p.title as post_title, p.slug as post_slug
      ${baseQuery}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [comments] = await db.query(commentsQuery, [
      ...params,
      COMMENTS_PER_PAGE,
      offset,
    ]);

    return { comments, totalComments };
  } catch (error) {
    console.error("Database Error fetching comments:", error.message);
    return { comments: [], totalComments: 0 };
  }
}

/**
 * ویرایش جزئیات یک کامنت خاص
 */
export async function updateCommentDetails(commentId, data) {
  const { author_name, author_email, content } = data;
  if (!commentId || !author_name || !content) {
    return { error: "نام نویسنده و متن نظر الزامی هستند." };
  }
  try {
    await db.query(
      "UPDATE comments SET author_name = ?, author_email = ?, content = ? WHERE id = ?",
      [author_name, author_email || null, content, commentId]
    );
    revalidatePath("/admin/comments");
    return { success: "اطلاعات کامنت با موفقیت ویرایش شد." };
  } catch (error) {
    console.error("Database Error updating comment details:", error.message);
    return { error: "خطا در ویرایش کامنت." };
  }
}

/**
 * به‌روزرسانی وضعیت یک یا چند کامنت
 */
export async function updateCommentsStatus(commentIds, status) {
  if (!commentIds || commentIds.length === 0)
    return { error: "هیچ کامنتی انتخاب نشده است." };
  const validStatuses = ["approved", "pending", "spam"];
  if (!validStatuses.includes(status)) return { error: "وضعیت نامعتبر است." };

  try {
    const [result] = await db.query(
      "UPDATE comments SET status = ? WHERE id IN (?)",
      [status, commentIds]
    );
    revalidatePath("/admin/comments");
    return {
      success: `${result.affectedRows} کامنت با موفقیت به‌روزرسانی شد.`,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error("Database Error updating status:", error.message);
    return { error: "خطا در به‌روزرسانی وضعیت کامنت‌ها." };
  }
}

/**
 * حذف یک یا چند کامنت از دیتابیس
 */
export async function deleteComments(commentIds) {
  if (!commentIds || commentIds.length === 0)
    return { error: "هیچ کامنتی انتخاب نشده است." };
  try {
    const [result] = await db.query("DELETE FROM comments WHERE id IN (?)", [
      commentIds,
    ]);
    revalidatePath("/admin/comments");
    return {
      success: `${result.affectedRows} کامنت با موفقیت حذف شد.`,
      affectedRows: result.affectedRows,
    };
  } catch (error) {
    console.error("Database Error deleting comments:", error.message);
    return { error: "خطا در حذف کامنت‌ها." };
  }
}
