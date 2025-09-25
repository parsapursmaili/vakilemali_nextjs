"use server";
import { db } from "@/lib/db/mysql";
import { revalidatePath } from "next/cache";
export async function getPostData(slug) {
  try {
    console.log("LOG QRY 1: Searching DB with ID:", slug);
    const [rows] = await db.query(
      "SELECT id, title, content, excerpt, thumbnail, created_at, view_count FROM posts WHERE id = ? AND status = 'published'",
      [slug]
    );
    console.log("LOG QRY 2: Rows count:", rows ? rows.length : "N/A");
    if (!rows || rows.length === 0) {
      console.log("LOG QRY 3: Query returned NO results.");
      return { post: null, terms: [] };
    }
    const post = rows[0];
    if (!post || !post.id) {
      return { post: null, terms: [] };
    }
    console.log("LOG QRY 4: Post Found. ID:", post.id);
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
