"use server";
import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";
export async function getPostData(slug) {
  try {
    const [rows] = await db.query(
      "SELECT id, title, content, excerpt, thumbnail, created_at, view_count FROM posts WHERE id = ? AND status = 'published'",
      [slug]
    );
    if (!rows || rows.length === 0) {
      return { post: null, terms: [] };
    }
    const post = rows[0];
    if (!post || !post.id) {
      return { post: null, terms: [] };
    }
    const termsResult = await db.query(
      `SELECT t.name, t.slug, t.type FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = ?`,
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
  try {
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );
    return true;
  } catch (error) {
    console.error("Database Error incrementing view:", error);
    return false;
  }
}
