// app/actions.js

"use server";

import { db } from "@/lib/db/mysql";

export async function getLatestPosts({ limit = 10, offset = 0 }) {
  try {
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.thumbnail,
        (
          SELECT t.name 
          FROM terms t 
          JOIN post_terms pt ON pt.term_id = t.id 
          WHERE pt.post_id = p.id 
          LIMIT 1
        ) as categoryName
      FROM posts p
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT ?
      OFFSET ?
    `;

    const [rows] = await db.query(query, [limit, offset]);
    return { posts: rows };
  } catch (error) {
    console.error("Database Error fetching latest posts:", error.message);
    return { posts: [] };
  }
}

export async function getPopularPosts({ limit = 10 }) {
  try {
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.thumbnail,
        (
          SELECT t.name 
          FROM terms t 
          JOIN post_terms pt ON pt.term_id = t.id 
          WHERE pt.post_id = p.id 
          LIMIT 1
        ) as categoryName
      FROM posts p
      WHERE p.status = 'published'
      ORDER BY p.view_count DESC, p.created_at DESC
      LIMIT ?
    `;

    const [rows] = await db.query(query, [limit]);
    return { posts: rows };
  } catch (error) {
    console.error("Database Error fetching popular posts:", error.message);
    return { posts: [] };
  }
}

export async function findPostSlugById(postId) {
  try {
    const query =
      "SELECT slug FROM posts WHERE id = ? AND status = 'published' LIMIT 1";

    const [rows] = await db.query(query, [postId]);

    if (rows.length > 0) {
      return { slug: encodeURIComponent(rows[0].slug) };
    }

    return { slug: null };
  } catch (error) {
    console.error("Database Error fetching slug by ID:", error.message);
    return { slug: null };
  }
}
