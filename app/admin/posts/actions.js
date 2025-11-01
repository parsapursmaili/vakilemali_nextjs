"use server";

import { db } from "@/lib/db/mysql"; // مسیر اتصال به دیتابیس شما
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// تابع اصلی برای دریافت پست‌ها (بدون تغییر منطق اصلی)
export async function getPosts({
  page = 1,
  limit = 15,
  query = "",
  status = "all",
  sortBy = "created_at",
  order = "desc",
}) {
  try {
    const offset = (page - 1) * limit;
    const searchQuery = `%${query}%`;
    let whereClauses = ["(p.title LIKE ? OR p.content LIKE ?)"];
    let params = [searchQuery, searchQuery];
    if (
      status !== "all" &&
      ["published", "draft", "archived"].includes(status)
    ) {
      whereClauses.push("p.status = ?");
      params.push(status);
    }
    const whereString = `WHERE ${whereClauses.join(" AND ")}`;
    const allowedSortBy = ["title", "created_at", "updated_at", "view_count"];
    const safeSortBy = allowedSortBy.includes(sortBy)
      ? `p.${sortBy}`
      : "p.created_at";
    const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const postsQuery = `
      SELECT p.id, p.title, p.slug, p.status, p.view_count, p.created_at, p.updated_at,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as categories
      FROM posts p
      LEFT JOIN post_terms pt ON p.id = pt.post_id
      LEFT JOIN terms t ON pt.term_id = t.id AND t.type = 'category'
      ${whereString} GROUP BY p.id ORDER BY ${safeSortBy} ${safeOrder} LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM posts p ${whereString}`;

    const [posts] = await db.query(postsQuery, [...params, limit, offset]);
    const [[{ total }]] = await db.query(countQuery, params);

    return { posts, total, pages: Math.ceil(total / limit), success: true };
  } catch (error) {
    console.error("Database Error fetching posts:", error.message);
    return {
      posts: [],
      total: 0,
      pages: 1,
      success: false,
      error: error.message,
    };
  }
}

// اصلاح شده: دریافت اطلاعات پست بر اساس ID
export async function getPostByIdForEditPage(postId) {
  try {
    const [rows] = await db.query(
      "SELECT id, title, slug, content, excerpt, thumbnail, status, created_at, updated_at, view_count, type FROM posts WHERE id = ?",
      [postId]
    );

    if (!rows || rows.length === 0)
      return { post: null, success: false, error: "Post not found." };
    const post = rows[0];

    const [termsResult] = await db.query(
      `SELECT t.id, t.type FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ?`,
      [post.id]
    );
    const [commentsResult] = await db.query(
      `SELECT id, author_name, content, created_at, status FROM comments WHERE post_id = ? ORDER BY created_at DESC`,
      [post.id]
    );

    const postData = {
      ...post,
      categoryIds: termsResult
        .filter((t) => t.type === "category")
        .map((t) => t.id),
      tagIds: termsResult.filter((t) => t.type === "tag").map((t) => t.id),
      comments: commentsResult,
    };
    return { post: postData, success: true };
  } catch (error) {
    console.error(
      "Database Error fetching single post for edit:",
      error.message
    );
    return { post: null, success: false, error: error.message };
  }
}

// تابع دریافت تگ‌ها و دسته‌بندی‌ها (بدون تغییر)
export async function getAllTerms() {
  try {
    const [terms] = await db.query(
      "SELECT id, name, slug, type FROM terms ORDER BY name ASC"
    );
    return {
      categories: terms.filter((t) => t.type === "category"),
      tags: terms.filter((t) => t.type === "tag"),
      success: true,
    };
  } catch (error) {
    console.error("Database Error fetching terms:", error.message);
    return { categories: [], tags: [], success: false, error: error.message };
  }
}

// اصلاح شده: به‌روزرسانی پست با مسیرهای revalidate جدید
export async function updatePost(postId, formData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const status = formData.get("status");
    const thumbnail = formData.get("thumbnail");
    const categoryIds = formData.getAll("categories").map(Number);
    const tagIds = formData.getAll("tags").map(Number);

    await connection.execute(
      `UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?, thumbnail = ? WHERE id = ?`,
      [title, slug, content, excerpt, status, thumbnail, postId]
    );
    await connection.execute("DELETE FROM post_terms WHERE post_id = ?", [
      postId,
    ]);
    const allTermIds = [...new Set([...categoryIds, ...tagIds])];
    if (allTermIds.length > 0) {
      const termValues = allTermIds.map((termId) => [postId, termId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [termValues]
      );
    }

    await connection.commit();
    revalidatePath("/admin/posts");
    revalidatePath(`/${slug}`); // Revalidate the public post page at root

    return { success: true, message: "پست با موفقیت به‌روزرسانی شد." };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error updating post:", error.message);
    return { success: false, message: `خطا در به‌روزرسانی: ${error.message}` };
  } finally {
    connection.release();
  }
}

// **اصلاح کلیدی:** رفع باگ "Incorrect arguments"
export async function quickEditPost(formData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const postId = formData.get("postId");
    const title = formData.get("title");
    const slug = formData.get("slug");
    const status = formData.get("status");
    const categoryIds = formData.getAll("categories").map(Number);

    await connection.execute(
      "UPDATE posts SET title = ?, slug = ?, status = ? WHERE id = ?",
      [title, slug, status, postId]
    );

    // فقط دسته‌بندی‌ها را تغییر می‌دهیم
    const [existingCategoryTerms] = await connection.query(
      `SELECT term_id FROM post_terms pt JOIN terms t ON pt.term_id = t.id WHERE pt.post_id = ? AND t.type = 'category'`,
      [postId]
    );
    const existingCategoryIds = existingCategoryTerms.map((t) => t.term_id);

    if (existingCategoryIds.length > 0) {
      // **رفع باگ:** استفاده از connection.query و ارسال آرایه به عنوان پارامتر برای IN
      await connection.query(
        "DELETE FROM post_terms WHERE post_id = ? AND term_id IN (?)",
        [postId, existingCategoryIds]
      );
    }

    if (categoryIds.length > 0) {
      const categoryValues = categoryIds.map((catId) => [postId, catId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [categoryValues]
      );
    }

    await connection.commit();
    revalidatePath("/admin/posts");
    return { success: true, message: "ویرایش سریع با موفقیت انجام شد." };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error in quick edit:", error.message);
    return { success: false, message: `خطا در ویرایش سریع: ${error.message}` };
  } finally {
    connection.release();
  }
}

// اصلاح شده: عملیات گروهی با مسیر revalidate جدید
export async function performBulkAction(action, postIds) {
  if (!postIds || postIds.length === 0)
    return { success: false, message: "هیچ پستی انتخاب نشده است." };
  try {
    let query,
      params = [postIds];
    if (action === "delete") {
      query = "DELETE FROM posts WHERE id IN (?)";
    } else if (["draft", "published", "archived"].includes(action)) {
      query = "UPDATE posts SET status = ? WHERE id IN (?)";
      params = [action, postIds];
    } else {
      return { success: false, message: "عملیات نامعتبر است." };
    }
    await db.query(query, params);
    revalidatePath("/admin/posts");
    return { success: true, message: "عملیات گروهی با موفقیت انجام شد." };
  } catch (error) {
    console.error("Database Error in bulk action:", error.message);
    return { success: false, message: `خطا در عملیات گروهی: ${error.message}` };
  }
}

// اصلاح شده: مدیریت کامنت‌ها با مسیر revalidate جدید
export async function updateCommentStatus(commentId, status) {
  try {
    await db.execute("UPDATE comments SET status = ? WHERE id = ?", [
      status,
      commentId,
    ]);
    revalidatePath("/admin/posts/[id]", "page"); // Revalidate the specific edit page
    return { success: true, message: "وضعیت دیدگاه تغییر کرد." };
  } catch (error) {
    console.error("Database Error updating comment status:", error.message);
    return { success: false, message: error.message };
  }
}

export async function createPost(formData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const status = formData.get("status");
    const thumbnail = formData.get("thumbnail");
    const categoryIds = formData.getAll("categories").map(Number);
    const tagIds = formData.getAll("tags").map(Number);

    // ایجاد پست در جدول posts
    const [postResult] = await connection.execute(
      `INSERT INTO posts (title, slug, content, excerpt, status, thumbnail, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'post', NOW(), NOW())`,
      [title, slug, content, excerpt, status, thumbnail]
    );

    const postId = postResult.insertId;

    // ایجاد ارتباط با دسته‌بندی‌ها و تگ‌ها
    const allTermIds = [...new Set([...categoryIds, ...tagIds])];
    if (allTermIds.length > 0) {
      const termValues = allTermIds.map((termId) => [postId, termId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [termValues]
      );
    }

    await connection.commit();
    revalidatePath("/admin/posts"); // صفحه لیست پست‌ها را revalidate کن

    return {
      success: true,
      message: "پست با موفقیت ایجاد شد.",
      postId: postId, // ID پست جدید را برمی‌گردانیم تا به صفحه ویرایش آن ریدایرکت کنیم
    };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error creating post:", error.message);
    return { success: false, message: `خطا در ایجاد پست: ${error.message}` };
  } finally {
    connection.release();
  }
}
