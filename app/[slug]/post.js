"use server";

import { db } from "@/lib/db/mysql";
import { isAuthenticated } from "@/actions/auth";
import { permanentRedirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";

// استفاده از Map برای نگهداری ارجاعات واحد از توابع کش‌شده به ازای هر کلید پویا
const postDataCacheMap = new Map();
const relatedPostsCacheMap = new Map();

/**
 * دریافت اطلاعات یک پست بر اساس slug
 */
export async function getPostData(slug) {
  const decodedSlug = decodeURIComponent(slug);

  let getCachedData = postDataCacheMap.get(decodedSlug);

  if (!getCachedData) {
    getCachedData = unstable_cache(
      async () => {
        try {
          const [rows] = await db.query(
            `SELECT id, title, slug, content, excerpt, thumbnail, video_link, 
             created_at, updated_at, view_count, status, redirect_url 
             FROM posts 
             WHERE slug = ?`,
            [decodedSlug],
          );

          if (!rows || rows.length === 0) {
            return { post: null, terms: [] };
          }

          const post = rows[0];

          // دریافت دسته‌بندی‌ها و ترم‌های مرتبط
          const [termsResult] = await db.query(
            `SELECT t.id, t.name, t.slug 
             FROM terms t 
             JOIN post_terms pt ON pt.term_id = t.id 
             WHERE pt.post_id = ?`,
            [post.id],
          );

          return { post, terms: termsResult };
        } catch (error) {
          console.error(
            "[PostData] Database Error fetching post data:",
            error.message,
          );
          return { post: null, terms: [] };
        }
      },
      [`single-post-data-${decodedSlug}`],
      {
        tags: [`post-${decodedSlug}`],
        revalidate: 3600, // کش ۱ ساعته
      },
    );
    postDataCacheMap.set(decodedSlug, getCachedData);
  }

  const data = await getCachedData();

  if (!data.post) return { post: null, terms: [] };

  if (data.post.redirect_url && data.post.redirect_url.trim() !== "") {
    permanentRedirect(`/${encodeURI(data.post.redirect_url)}`);
  }

  if (data.post.status !== "published") {
    return { post: null, terms: [] };
  }

  return data;
}

/**
 * افزایش بازدید یک پست
 */
export async function incrementPostViews(postId) {
  if (!postId) return false;

  try {
    if (await isAuthenticated()) return false;

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    const botPattern =
      /bot|crawler|spider|crawling|slurp|bing|google|baidu|yandex|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\slink\spreview|showyoubot|outbrain|pinterest\/0\.|zeitgeist|vkShare|W3C_Validator|whatsapp/i;
    if (botPattern.test(userAgent)) return false;

    const cookieStore = await cookies();
    const cookieName = "visited_posts";
    const visitedCookie = cookieStore.get(cookieName)?.value;

    let visitedIds = [];
    try {
      visitedIds = visitedCookie ? JSON.parse(visitedCookie) : [];
    } catch (e) {
      visitedIds = [];
    }

    // بررسی اینکه آیا پست قبلاً بازدید شده است یا خیر
    if (visitedIds.includes(postId)) return false;

    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId],
    );

    const today = new Date().toISOString().slice(0, 10);
    await db.execute(
      `INSERT INTO post_view (post_id, view_date, view_count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE view_count = view_count + 1`,
      [postId, today],
    );

    // افزودن شناسه پست فعلی به کوکی تجمیع شده
    visitedIds.push(postId);

    // محدود کردن آرایه به ۵۰ آیتم اخیر جهت ممانعت از طولانی شدن هدرهای HTTP
    if (visitedIds.length > 50) {
      visitedIds.shift();
    }

    cookieStore.set(cookieName, JSON.stringify(visitedIds), {
      path: "/",
      maxAge: 60 * 60 * 12,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("[incrementPostViews] Error:", error);
    return false;
  }
}

/**
 * دریافت پست‌های مرتبط
 */
export async function getRelatedPosts({
  limit = 6,
  excludeId = null,
  categoryId = null,
}) {
  const cacheKey = `${categoryId}-${excludeId}-${limit}`;
  let getCachedRelated = relatedPostsCacheMap.get(cacheKey);

  if (!getCachedRelated) {
    getCachedRelated = unstable_cache(
      async () => {
        try {
          let relatedPosts = [];

          if (categoryId) {
            const relatedQuery = `
              SELECT p.id, p.title, p.slug, p.thumbnail, t.name as categoryName
              FROM posts p
              JOIN post_terms pt ON p.id = pt.post_id
              JOIN terms t ON pt.term_id = t.id
              WHERE p.status = 'published'
                AND p.id != ?
                AND pt.term_id = ?
              GROUP BY p.id
              ORDER BY p.created_at DESC
              LIMIT ?`;
            const [relatedRows] = await db.query(relatedQuery, [
              excludeId || 0,
              categoryId,
              limit,
            ]);
            relatedPosts = relatedRows;
          }

          if (relatedPosts.length < limit) {
            const remainingLimit = limit - relatedPosts.length;
            const excludeIds = [
              excludeId,
              ...relatedPosts.map((p) => p.id),
            ].filter(Boolean);

            const latestQuery = `
              SELECT p.id, p.title, p.slug, p.thumbnail, t.name as categoryName
              FROM posts p
              LEFT JOIN post_terms pt ON p.id = pt.post_id
              LEFT JOIN terms t ON pt.term_id = t.id
              WHERE p.status = 'published'
                AND p.id NOT IN (?)
              GROUP BY p.id
              ORDER BY p.created_at DESC
              LIMIT ?`;
            const [latestRows] = await db.query(latestQuery, [
              excludeIds.length > 0 ? excludeIds : [0],
              remainingLimit,
            ]);
            relatedPosts.push(...latestRows);
          }

          return { posts: relatedPosts };
        } catch (error) {
          console.error("[getRelatedPosts] Database Error:", error.message);
          return { posts: [] };
        }
      },
      [`related-posts-${cacheKey}`],
      { tags: ["posts-list"], revalidate: 3600 },
    );
    relatedPostsCacheMap.set(cacheKey, getCachedRelated);
  }

  return getCachedRelated();
}
