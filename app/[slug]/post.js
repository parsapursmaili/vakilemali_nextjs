"use server";
import { db } from "@/lib/db/mysql";
import { isAuthenticated } from "@/actions/auth";
import { cookies } from "next/headers";

export async function getPostData(slug) {
  try {
    const slug2 = decodeURIComponent(slug);
    const [rows] = await db.query(
      // ✅ تغییر: اضافه شدن updated_at به لیست فیلدها
      "SELECT id, title, slug, content, excerpt, thumbnail, video_link, created_at, updated_at, view_count FROM posts WHERE slug = ? AND status = 'published'",
      [slug2]
    );
    if (!rows || rows.length === 0) {
      return { post: null, terms: [] };
    }
    const post = rows[0];
    if (!post || !post.id) {
      return { post: null, terms: [] };
    }

    const [termsResult] = await db.query(
      `SELECT t.id, t.name, t.slug, t.type FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ?`,
      [post.id]
    );
    return { post, terms: termsResult };
  } catch (error) {
    console.error(
      "LOG DATA ERROR: Database Error fetching post data:",
      error.message
    );
    return { post: null, terms: [] };
  }
}

export async function incrementPostViews(postId) {
  if (!postId) {
    return false;
  }

  if (await isAuthenticated()) {
    return false;
  }

  const cookieStore = cookies();
  const viewedPostsCookie = cookieStore.get("viewed_posts");
  const viewedPosts = viewedPostsCookie
    ? viewedPostsCookie.value.split(",")
    : [];

  if (viewedPosts.includes(String(postId))) {
    return false;
  }

  try {
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );

    const today = new Date().toISOString().slice(0, 10);
    await db.execute(
      `INSERT INTO post_view (post_id, view_date, view_count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE view_count = view_count + 1`,
      [postId, today]
    );

    const newViewedPosts = [...viewedPosts, postId];
    cookieStore.set("viewed_posts", newViewedPosts.join(","), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("Database Error incrementing view:", error);
    return false;
  }
}

export async function getRelatedPosts({
  limit = 6,
  excludeId = null,
  categoryId = null,
}) {
  try {
    let relatedPosts = [];

    if (categoryId) {
      const relatedQuery = `
        SELECT p.id, p.title, p.slug, p.thumbnail, t.name as categoryName
        FROM posts p
        JOIN post_terms pt ON p.id = pt.post_id
        JOIN terms t ON pt.term_id = t.id AND t.type = 'category'
        WHERE p.status = 'published'
          AND p.id != ?
          AND pt.term_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      const [relatedRows] = await db.query(relatedQuery, [
        excludeId,
        categoryId,
        limit,
      ]);
      relatedPosts = relatedRows;
    }

    if (relatedPosts.length < limit) {
      const remainingLimit = limit - relatedPosts.length;
      const excludeIds = [excludeId, ...relatedPosts.map((p) => p.id)];

      const latestQuery = `
        SELECT 
          p.id, p.title, p.slug, p.thumbnail,
          (SELECT t.name FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = p.id AND t.type = 'category' LIMIT 1) as categoryName
        FROM posts p
        WHERE p.status = 'published'
          AND p.id NOT IN (?)
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
      const [latestRows] = await db.query(latestQuery, [
        excludeIds.length > 0 ? excludeIds : [0],
        remainingLimit,
      ]);

      relatedPosts.push(...latestRows);
    }

    return { posts: relatedPosts };
  } catch (error) {
    console.error("Database Error fetching related posts:", error.message);
    return { posts: [] };
  }
}
