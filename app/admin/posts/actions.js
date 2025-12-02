"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";

//================================================================================
// دریافت لیست پست‌ها (برای صفحه اصلی ادمین)
//================================================================================
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
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as categories,
      (CASE WHEN p.title LIKE ? THEN 2 ELSE 0 END) as title_score,
      (CASE WHEN p.content LIKE ? THEN 1 ELSE 0 END) as content_score
      FROM posts p
      LEFT JOIN post_terms pt ON p.id = pt.post_id
      LEFT JOIN terms t ON pt.term_id = t.id AND t.type = 'category'
      ${whereString} 
      GROUP BY p.id 
      ORDER BY (title_score + content_score) DESC, ${safeSortBy} ${safeOrder} 
      LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM posts p ${whereString}`;

    const postsQueryParams = [
      searchQuery,
      searchQuery,
      ...params,
      limit,
      offset,
    ];

    const [posts] = await db.query(postsQuery, postsQueryParams);
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

//================================================================================
// دریافت اطلاعات یک پست برای صفحه ویرایش
//================================================================================
export async function getPostByIdForEditPage(postId) {
  try {
    // ✨ فیلد redirect_url اضافه شد
    const [rows] = await db.query(
      "SELECT id, title, slug, content, excerpt, thumbnail, status, created_at, updated_at, view_count, type, approved, video_link, redirect_url FROM posts WHERE id = ?",
      [postId]
    );

    if (!rows || rows.length === 0)
      return { post: null, success: false, error: "Post not found." };
    const post = rows[0];

    const [termsResult] = await db.query(
      `SELECT t.id, t.type FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ? AND t.type = 'category'`,
      [post.id]
    );

    const [commentsResult] = await db.query(
      `SELECT id, author_name, content, created_at, status FROM comments WHERE post_id = ? ORDER BY created_at DESC`,
      [post.id]
    );

    const postData = {
      ...post,
      categoryIds: termsResult.map((t) => t.id),
      tagIds: [],
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

//================================================================================
// دریافت تمام ترم‌ها (فقط دسته‌بندی‌ها)
//================================================================================
export async function getAllTerms() {
  try {
    const [terms] = await db.query(
      "SELECT id, name, slug, type FROM terms WHERE type = 'category' ORDER BY name ASC"
    );
    return {
      categories: terms,
      tags: [],
      success: true,
    };
  } catch (error) {
    console.error("Database Error fetching terms:", error.message);
    return { categories: [], tags: [], success: false, error: error.message };
  }
}

//================================================================================
// جستجوی پست‌ها برای دراپ‌باکس ریدارکت (جدید) ✨
//================================================================================
export async function searchPostsList(query) {
  try {
    if (!query || query.length < 2) return { posts: [], success: true };

    const searchQuery = `%${query}%`;
    const [posts] = await db.query(
      "SELECT id, title, slug FROM posts WHERE title LIKE ? ORDER BY created_at DESC LIMIT 10",
      [searchQuery]
    );
    return { posts, success: true };
  } catch (error) {
    console.error("Database Error searching posts:", error.message);
    return { posts: [], success: false, error: error.message };
  }
}

//================================================================================
// به‌روزرسانی پست
//================================================================================
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
    const video_link = formData.get("video_link");
    // ✨ دریافت فیلد redirect_url
    const redirect_url = formData.get("redirect_url");

    const approved = formData.get("approved") === "1" ? 1 : 0;
    const categoryIds = formData.getAll("categories").map(Number);

    await connection.execute(
      // ✨ اضافه شدن redirect_url به آپدیت
      `UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?, thumbnail = ?, approved = ?, video_link = ?, redirect_url = ? WHERE id = ?`,
      [
        title,
        slug,
        content,
        excerpt,
        status,
        thumbnail,
        approved,
        video_link,
        redirect_url,
        postId,
      ]
    );

    await connection.execute("DELETE FROM post_terms WHERE post_id = ?", [
      postId,
    ]);

    if (categoryIds.length > 0) {
      const termValues = categoryIds.map((termId) => [postId, termId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [termValues]
      );
    }

    await connection.commit();

    revalidatePath("/admin/posts");
    revalidatePath(`/${slug}`);

    return { success: true, message: "پست با موفقیت به‌روزرسانی شد." };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error updating post:", error.message);
    return { success: false, message: `خطا در به‌روزرسانی: ${error.message}` };
  } finally {
    connection.release();
  }
}

//================================================================================
// ایجاد پست جدید
//================================================================================
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
    const video_link = formData.get("video_link");
    // ✨ دریافت فیلد redirect_url
    const redirect_url = formData.get("redirect_url");

    const approved = formData.get("approved") === "1" ? 1 : 0;
    const categoryIds = formData.getAll("categories").map(Number);

    const [postResult] = await connection.execute(
      // ✨ اضافه شدن redirect_url به اینسرت
      `INSERT INTO posts (title, slug, content, excerpt, status, thumbnail, approved, type, created_at, updated_at, video_link, redirect_url) VALUES (?, ?, ?, ?, ?, ?, ?, 'post', NOW(), NOW(), ?, ?)`,
      [
        title,
        slug,
        content,
        excerpt,
        status,
        thumbnail,
        approved,
        video_link,
        redirect_url,
      ]
    );

    const postId = postResult.insertId;

    if (categoryIds.length > 0) {
      const termValues = categoryIds.map((termId) => [postId, termId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [termValues]
      );
    }

    await connection.commit();

    revalidatePath("/admin/posts");
    revalidatePath(`/${slug}`);

    return {
      success: true,
      message: "پست با موفقیت ایجاد شد.",
      postId: postId,
    };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error creating post:", error.message);
    return { success: false, message: `خطا در ایجاد پست: ${error.message}` };
  } finally {
    connection.release();
  }
}

//================================================================================
// ویرایش سریع (بدون تغییر)
//================================================================================
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

    const [existingCategoryTerms] = await connection.query(
      `SELECT term_id FROM post_terms pt JOIN terms t ON pt.term_id = t.id WHERE pt.post_id = ? AND t.type = 'category'`,
      [postId]
    );
    const existingCategoryIds = existingCategoryTerms.map((t) => t.term_id);

    if (existingCategoryIds.length > 0) {
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
    revalidatePath(`/${slug}`);

    return { success: true, message: "ویرایش سریع با موفقیت انجام شد." };
  } catch (error) {
    await connection.rollback();
    console.error("Database Error in quick edit:", error.message);
    return { success: false, message: `خطا در ویرایش سریع: ${error.message}` };
  } finally {
    connection.release();
  }
}

//================================================================================
// عملیات گروهی (بدون تغییر)
//================================================================================
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

//================================================================================
// تغییر وضعیت دیدگاه (بدون تغییر)
//================================================================================
export async function updateCommentStatus(commentId, status) {
  try {
    await db.execute("UPDATE comments SET status = ? WHERE id = ?", [
      status,
      commentId,
    ]);
    revalidatePath("/admin/posts/[id]", "page");
    return { success: true, message: "وضعیت دیدگاه تغییر کرد." };
  } catch (error) {
    console.error("Database Error updating comment status:", error.message);
    return { success: false, message: error.message };
  }
}
