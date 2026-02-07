"use server";

import { db } from "@/lib/db/mysql";
import { revalidatePath, revalidateTag } from "next/cache";

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
    const searchQuery = `%${query.trim()}%`;

    let whereClauses = ["(p.title LIKE ? OR p.content LIKE ?)"];
    let whereParams = [searchQuery, searchQuery];

    if (
      status &&
      status !== "all" &&
      ["published", "draft", "archived"].includes(status)
    ) {
      whereClauses.push("p.status = ?");
      whereParams.push(status);
    }

    const whereString = `WHERE ${whereClauses.join(" AND ")}`;
    const allowedSortBy = ["title", "created_at", "updated_at", "view_count"];
    const safeSortBy = allowedSortBy.includes(sortBy)
      ? `p.${sortBy}`
      : "p.created_at";
    const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    const postsQuery = `
      SELECT p.id, p.title, p.slug, p.status, p.view_count, p.created_at, p.updated_at, p.thumbnail,
      GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') as categories,
      (CASE WHEN p.title LIKE ? THEN 2 ELSE 0 END) as title_score,
      (CASE WHEN p.content LIKE ? THEN 1 ELSE 0 END) as content_score
      FROM posts p
      LEFT JOIN post_terms pt ON p.id = pt.post_id
      LEFT JOIN terms t ON pt.term_id = t.id
      ${whereString} 
      GROUP BY p.id 
      ORDER BY (title_score + content_score) DESC, ${safeSortBy} ${safeOrder} 
      LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) as total FROM posts p ${whereString}`;

    const finalParams = [
      searchQuery,
      searchQuery,
      ...whereParams,
      limit,
      offset,
    ];

    const [posts] = await db.query(postsQuery, finalParams);
    const [[{ total }]] = await db.query(countQuery, whereParams);

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

export async function getPostByIdForEditPage(postId) {
  try {
    const [rows] = await db.query(
      "SELECT id, title, slug, content, excerpt, thumbnail, status, created_at, updated_at, view_count, type, approved, video_link, redirect_url FROM posts WHERE id = ?",
      [postId],
    );

    if (!rows || rows.length === 0)
      return { post: null, success: false, error: "Post not found." };
    const post = rows[0];

    const [termsResult] = await db.query(
      `SELECT t.id, t.name FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ?`,
      [post.id],
    );

    const [commentsResult] = await db.query(
      `SELECT id, author_name, content, created_at, status FROM comments WHERE post_id = ? ORDER BY created_at DESC`,
      [post.id],
    );

    const postData = {
      ...post,
      categoryIds: termsResult.map((t) => t.id),
      comments: commentsResult,
    };
    return { post: postData, success: true };
  } catch (error) {
    console.error("Database Error fetching single post:", error.message);
    return { post: null, success: false, error: error.message };
  }
}

export async function getAllTerms() {
  try {
    const [terms] = await db.query(
      "SELECT id, name, slug, parent_id FROM terms ORDER BY name ASC",
    );
    return { categories: terms, success: true };
  } catch (error) {
    console.error("Database Error fetching terms:", error.message);
    return { categories: [], success: false, error: error.message };
  }
}

export async function searchPostsList(query) {
  try {
    if (!query || query.length < 2) return { posts: [], success: true };
    const searchQuery = `%${query}%`;
    const [posts] = await db.query(
      "SELECT id, title, slug FROM posts WHERE title LIKE ? ORDER BY created_at DESC LIMIT 10",
      [searchQuery],
    );
    return { posts, success: true };
  } catch (error) {
    console.error("Database Error searching posts:", error.message);
    return { posts: [], success: false, error: error.message };
  }
}

export async function updatePost(postId, formData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. دریافت اطلاعات فعلی پست از دیتابیس برای مقایسه
    const [currentPostRows] = await connection.execute(
      "SELECT * FROM posts WHERE id = ?",
      [postId],
    );

    if (currentPostRows.length === 0) {
      throw new Error("پست یافت نشد.");
    }
    const currentPost = currentPostRows[0];
    const oldSlug = currentPost.slug;

    // دریافت دسته‌بندی‌های فعلی
    const [currentTerms] = await connection.execute(
      "SELECT term_id FROM post_terms WHERE post_id = ?",
      [postId],
    );
    const oldCategoryIds = currentTerms
      .map((t) => t.term_id)
      .sort((a, b) => a - b);

    // 2. آماده‌سازی داده‌های جدید
    const title = formData.get("title");
    const slug = formData.get("slug");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const status = formData.get("status");
    const thumbnail = formData.get("thumbnail");
    const video_link = formData.get("video_link") || "";
    const redirect_url = formData.get("redirect_url") || null;
    const approved = formData.get("approved") === "1" ? 1 : 0;
    const categoryIds = formData
      .getAll("categories")
      .map(Number)
      .sort((a, b) => a - b);

    // 3. مقایسه داده‌های جدید با داده‌های قدیمی
    // تابع کمکی برای نرمال‌سازی مقادیر (تیدیل null به رشته خالی برای مقایسه)
    const normalize = (val) =>
      val === null || val === undefined ? "" : String(val);

    const isCategoriesChanged =
      JSON.stringify(oldCategoryIds) !== JSON.stringify(categoryIds);

    const isContentChanged =
      normalize(currentPost.title) !== normalize(title) ||
      normalize(currentPost.slug) !== normalize(slug) ||
      normalize(currentPost.content) !== normalize(content) ||
      normalize(currentPost.excerpt) !== normalize(excerpt) ||
      normalize(currentPost.status) !== normalize(status) ||
      normalize(currentPost.thumbnail) !== normalize(thumbnail) ||
      currentPost.approved !== approved || // مقایسه عددی
      normalize(currentPost.video_link) !== normalize(video_link) ||
      normalize(currentPost.redirect_url) !== normalize(redirect_url);

    // اگر هیچ تغییری وجود نداشت، عملیات را متوقف کن
    if (!isCategoriesChanged && !isContentChanged) {
      await connection.commit(); // پایان تراکنش (حتی اگر تغییری نباشد باید کانکشن آزاد شود)
      return { success: true, message: "هیچ تغییری اعمال نشد." };
    }

    // 4. اعمال تغییرات در صورت وجود تفاوت
    // نکته مهم: created_at = created_at اضافه شده تا از آپدیت خودکار آن توسط MySQL جلوگیری شود
    await connection.execute(
      `UPDATE posts SET 
         title = ?, 
         slug = ?, 
         content = ?, 
         excerpt = ?, 
         status = ?, 
         thumbnail = ?, 
         approved = ?, 
         video_link = ?, 
         redirect_url = ?, 
         updated_at = NOW(),
         created_at = created_at 
       WHERE id = ?`,
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
      ],
    );

    // به‌روزرسانی دسته‌بندی‌ها در صورت تغییر
    if (isCategoriesChanged) {
      await connection.execute("DELETE FROM post_terms WHERE post_id = ?", [
        postId,
      ]);

      if (categoryIds.length > 0) {
        const termValues = categoryIds.map((termId) => [postId, termId]);
        await connection.query(
          "INSERT INTO post_terms (post_id, term_id) VALUES ?",
          [termValues],
        );
      }
    }

    await connection.commit();

    // Invalidating Tags
    revalidateTag("posts-list");
    if (oldSlug) revalidateTag(`post-${oldSlug}`);
    revalidateTag(`post-${slug}`);

    // Invalidating Paths (Fallback)
    revalidatePath("/admin/posts");
    if (oldSlug) revalidatePath(`/${oldSlug}`);
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

    const video_link = formData.get("video_link") || "";
    const redirect_url = formData.get("redirect_url") || null;

    const approved = formData.get("approved") === "1" ? 1 : 0;
    const categoryIds = formData.getAll("categories").map(Number);

    const [postResult] = await connection.execute(
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
      ],
    );

    const postId = postResult.insertId;

    if (categoryIds.length > 0) {
      const termValues = categoryIds.map((termId) => [postId, termId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [termValues],
      );
    }

    await connection.commit();

    revalidateTag("posts-list");
    revalidatePath("/admin/posts");

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

export async function quickEditPost(formData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const postId = formData.get("postId");

    // اینجا هم برای quick edit می‌توانیم لاجیک created_at را رعایت کنیم
    // و همچنین چک کنیم آیا تغییری بوده یا خیر (اختیاری ولی بهتر است)
    const [oldData] = await connection.execute(
      "SELECT slug FROM posts WHERE id = ?",
      [postId],
    );
    const oldSlug = oldData[0]?.slug;

    const title = formData.get("title");
    const slug = formData.get("slug");
    const status = formData.get("status");
    const categoryIds = formData.getAll("categories").map(Number);

    // افزودن created_at = created_at برای جلوگیری از تغییر تاریخ ایجاد
    await connection.execute(
      "UPDATE posts SET title = ?, slug = ?, status = ?, updated_at = NOW(), created_at = created_at WHERE id = ?",
      [title, slug, status, postId],
    );

    await connection.query("DELETE FROM post_terms WHERE post_id = ?", [
      postId,
    ]);

    if (categoryIds.length > 0) {
      const categoryValues = categoryIds.map((catId) => [postId, catId]);
      await connection.query(
        "INSERT INTO post_terms (post_id, term_id) VALUES ?",
        [categoryValues],
      );
    }

    await connection.commit();

    revalidateTag("posts-list");
    if (oldSlug) revalidateTag(`post-${oldSlug}`);
    revalidateTag(`post-${slug}`);

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

export async function performBulkAction(action, postIds) {
  if (!postIds || postIds.length === 0)
    return { success: false, message: "هیچ پستی انتخاب نشده است." };
  try {
    let query,
      params = [postIds];
    if (action === "delete") {
      query = "DELETE FROM posts WHERE id IN (?)";
    } else if (["draft", "published", "archived"].includes(action)) {
      // در اینجا هم created_at = created_at را اضافه می‌کنیم
      query =
        "UPDATE posts SET status = ?, created_at = created_at WHERE id IN (?)";
      params = [action, postIds];
    } else {
      return { success: false, message: "عملیات نامعتبر است." };
    }
    await db.query(query, params);

    revalidateTag("posts-list");
    revalidatePath("/admin/posts");

    return { success: true, message: "عملیات گروهی با موفقیت انجام شد." };
  } catch (error) {
    console.error("Database Error in bulk action:", error.message);
    return { success: false, message: `خطا در عملیات گروهی: ${error.message}` };
  }
}

export async function updateCommentStatus(commentId, status) {
  try {
    if (!["pending", "approved", "spam"].includes(status)) {
      throw new Error("Invalid status");
    }

    // گرفتن پست آیدی برای آپدیت کش آن صفحه (اختیاری)
    const [comment] = await db.query(
      "SELECT post_id FROM comments WHERE id = ?",
      [commentId],
    );
    const postId = comment[0]?.post_id;

    await db.execute("UPDATE comments SET status = ? WHERE id = ?", [
      status,
      commentId,
    ]);

    if (postId) {
      const [post] = await db.query("SELECT slug FROM posts WHERE id = ?", [
        postId,
      ]);
      if (post[0]?.slug) revalidateTag(`post-${post[0].slug}`);
    }

    revalidatePath("/admin/posts");
    return { success: true, message: "وضعیت دیدگاه تغییر کرد." };
  } catch (error) {
    console.error("Database Error updating comment status:", error.message);
    return { success: false, message: error.message };
  }
}
