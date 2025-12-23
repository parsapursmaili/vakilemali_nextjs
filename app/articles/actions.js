"use server";

import { db } from "@/lib/db/mysql";

const POSTS_PER_PAGE = 24;

export async function getCategories() {
  try {
    const [categories] = await db.query(
      "SELECT id, name, slug FROM terms ORDER BY name ASC"
    );
    return categories;
  } catch (error) {
    console.error("Database Error fetching categories:", error.message);
    return [];
  }
}

export async function getPaginatedPosts({
  page = 1,
  sortBy = "newest",
  categoryId = null,
}) {
  try {
    const offset = (page - 1) * POSTS_PER_PAGE;
    let params = [];
    let countParams = [];

    let query = `
      SELECT 
        p.id, p.title, p.slug, p.thumbnail,
        (SELECT t.name FROM terms t JOIN post_terms pt ON pt.term_id = t.id WHERE pt.post_id = p.id LIMIT 1) as categoryName
      FROM posts p
    `;

    let countQuery = `SELECT COUNT(DISTINCT p.id) as total FROM posts p`;

    if (categoryId) {
      const joinClause = `
        JOIN post_terms pt ON p.id = pt.post_id
        JOIN terms t ON pt.term_id = t.id
      `;
      query += joinClause;
      countQuery += joinClause;
    }

    let whereClause = ` WHERE p.status = 'published' and redirect_url is NULL and p.type = 'post'`;
    if (categoryId) {
      whereClause += ` AND t.id = ?`;
      params.push(categoryId);
      countParams.push(categoryId);
    }
    query += whereClause;
    countQuery += whereClause;

    let orderByClause = " ORDER BY ";
    switch (sortBy) {
      case "popular":
        orderByClause += "p.view_count DESC, p.created_at DESC";
        break;
      case "random":
        orderByClause += "RAND()";
        break;
      default:
        orderByClause += "p.created_at DESC";
    }
    query += orderByClause;

    query += ` LIMIT ? OFFSET ?`;
    params.push(POSTS_PER_PAGE, offset);

    const [[posts], [[{ total }]]] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    const totalPages = Math.ceil(total / POSTS_PER_PAGE);

    return { posts, totalPages, currentPage: page };
  } catch (error) {
    console.error("Database Error fetching paginated posts:", error.message);
    return { posts: [], totalPages: 0, currentPage: 1 };
  }
}
