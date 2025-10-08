"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

/**
 * 💡 Server Action برای واکشی کامنت‌های یک پست و ساختاردهی درختی آن‌ها
 * @param {number} postId - شناسه پست
 * @returns {Promise<Array<Object>>} - آرایه‌ای از کامنت‌های اصلی (Root) با پاسخ‌های تو در تو
 */
export async function getCommentsData(postId) {
  try {
    const [comments] = await db.query(
      "SELECT id, parent_id, author_name, content, created_at FROM comments WHERE post_id = ? AND status = 'approved' ORDER BY created_at ASC",
      [postId]
    );
    // منطق ساده برای ساختار درختی (Nested) کامنت‌ها
    const commentsMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      commentsMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parent_id !== null && commentsMap[comment.parent_id]) {
        commentsMap[comment.parent_id].replies.push(commentsMap[comment.id]);
      } else if (comment.parent_id === null) {
        rootComments.push(commentsMap[comment.id]);
      }
    });

    return rootComments.reverse(); // نمایش جدیدترین‌ها در ابتدا
  } catch (error) {
    console.error("Database Error fetching comments:", error);
    return [];
  }
}

/**
 * 💡 Server Action برای ثبت یک کامنت جدید
 * @param {Object} prevState - وضعیت قبلی useFormState
 * @param {FormData} formData - داده‌های فرم (توسط Next.js)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitComment(prevState, formData) {
  const postId = parseInt(formData.get("postId"));
  const parentId = formData.get("parentId")
    ? parseInt(formData.get("parentId"))
    : null;
  const authorName = formData.get("author_name");
  const authorEmail = formData.get("author_email"); // برای رعایت ساختار دیتابیس
  const content = formData.get("content");
  const postSlug = formData.get("postSlug");

  // اعتبارسنجی اولیه
  if (!authorName || !content || !postId || !postSlug) {
    return { success: false, message: "لطفاً نام و متن نظر را وارد کنید." };
  }

  try {
    await db.execute(
      "INSERT INTO comments (post_id, parent_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [
        postId,
        parentId,
        authorName,
        authorEmail || "no-email@example.com",
        content,
      ] // email را اختیاری در نظر می‌گیریم اگر کاربر نخواهد پر کند
    );

    // Revalidate کردن مسیر پست برای اطمینان از تازگی داده‌ها (اختیاری است، Client Component کامنت‌ها را مجدداً واکشی می‌کند)
    revalidatePath(`/posts/${postSlug}`);

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد. ⚖️",
    };
  } catch (error) {
    console.error("Error submitting comment:", error);
    return {
      success: false,
      message: "خطا در ثبت نظر. لطفاً دوباره تلاش کنید.",
    };
  }
}
