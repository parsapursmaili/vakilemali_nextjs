"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

const COMMENTS_PER_PAGE = 50;

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

    const countQuery = `SELECT COUNT(c.id) as total ${baseQuery}`;
    const [countRows] = await db.query(countQuery, params);
    const totalComments = countRows[0].total;

    // دریافت داده‌ها به صورت فلت (مسطح)
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
    console.error("DB Error:", error.message);
    return { comments: [], totalComments: 0 };
  }
}

export async function updateCommentDetails(commentId, data) {
  const { author_name, author_email, content } = data;
  if (!commentId || !author_name || !content)
    return { error: "نام و متن الزامی است." };
  const emailToSave =
    author_email && author_email.trim() !== "" ? author_email : "";

  try {
    await db.query(
      "UPDATE comments SET author_name = ?, author_email = ?, content = ? WHERE id = ?",
      [author_name, emailToSave, content, commentId]
    );
    revalidatePath("/admin/comments");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function addCommentReply({
  parent_id,
  post_id,
  author_name,
  author_email,
  content,
}) {
  if (!content?.trim() || !author_name?.trim())
    return { error: "نام و متن پاسخ الزامی است." };
  const emailToSave =
    author_email && author_email.trim() !== "" ? author_email : "";

  try {
    await db.query(
      "INSERT INTO comments (post_id, parent_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [post_id, parent_id, author_name, emailToSave, content]
    );
    revalidatePath("/admin/comments");
    return { success: true };
  } catch (error) {
    return { error: `خطا در دیتابیس: ${error.message}` };
  }
}

export async function updateCommentsStatus(commentIds, status) {
  if (!commentIds?.length) return { error: "انتخابی انجام نشده." };
  try {
    const [result] = await db.query(
      "UPDATE comments SET status = ? WHERE id IN (?)",
      [status, commentIds]
    );
    revalidatePath("/admin/comments");
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteComments(commentIds) {
  if (!commentIds?.length) return { error: "انتخابی انجام نشده." };
  try {
    const [result] = await db.query("DELETE FROM comments WHERE id IN (?)", [
      commentIds,
    ]);
    revalidatePath("/admin/comments");
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message };
  }
}
