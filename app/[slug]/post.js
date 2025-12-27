"use server";

import { db } from "@/lib/db/mysql";
import { isAuthenticated } from "@/actions/auth";
import { permanentRedirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";
export async function getPostData(slug) {
  const decodedSlug = decodeURIComponent(slug);

  const getCachedData = unstable_cache(
    async () => {
      try {
        const [rows] = await db.query(
          `SELECT id, title, slug, content, excerpt, thumbnail, video_link, 
           created_at, updated_at, view_count, status, redirect_url 
           FROM posts 
           WHERE slug = ?`,
          [decodedSlug]
        );

        if (!rows || rows.length === 0) {
          return { post: null, terms: [] };
        }

        const post = rows[0];

        // نکته: ریدایرکت را اینجا اجرا نمی‌کنیم، فقط دیتا را برمی‌گردانیم
        // وضعیت منتشر نشده را هم اینجا فیلتر نمی‌کنیم تا کش معتبر بماند و بیرون هندل شود

        const [termsResult] = await db.query(
          `SELECT t.id, t.name, t.slug 
           FROM terms t 
           JOIN post_terms pt ON pt.term_id = t.id 
           WHERE pt.post_id = ?`,
          [post.id]
        );

        return { post, terms: termsResult };
      } catch (error) {
        console.error("Database Error fetching post data:", error.message);
        return { post: null, terms: [] };
      }
    },
    [`single-post-data-${decodedSlug}`],
    {
      tags: [`post-${decodedSlug}`],
      revalidate: 3600,
    }
  );

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

export async function incrementPostViews(postId) {
  if (!postId) return false;

  // ۱. بررسی لاگین بودن (طبق منطق خودتان)
  if (await isAuthenticated()) return false;

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";

  // ۲. شناسایی پیشرفته ربات‌ها (Bot Detection)
  const botPattern =
    /bot|crawler|spider|crawling|slurp|bing|google|baidu|yandex|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\slink\spreview|showyoubot|outbrain|pinterest\/0\.|zeitgeist|vkShare|W3C_Validator|whatsapp/i;

  if (botPattern.test(userAgent)) {
    // اگر ربات بود، هیچ بازدیدی ثبت نکن
    return false;
  }

  // ۳. بررسی کوکی بازدید کل سایت (۱۲ ساعته)
  const cookieStore = cookies();
  const hasVisitedRecently = cookieStore.get("site_visited");

  if (hasVisitedRecently) {
    // اگر کاربر در ۱۲ ساعت گذشته از هر صفحه‌ای بازدید کرده باشد، دیگر ثبت نکن
    return false;
  }

  try {
    // ۴. بروزرسانی دیتابیس
    // آپدیت تعداد کل بازدید پست
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );

    // ثبت در آمار روزانه
    const today = new Date().toISOString().slice(0, 10);
    await db.execute(
      `INSERT INTO post_view (post_id, view_date, view_count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE view_count = view_count + 1`,
      [postId, today]
    );

    cookieStore.set("site_visited", "true", {
      path: "/",
      maxAge: 60 * 60 * 12, // ۱۲ ساعت به ثانیه
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
  const getCachedRelated = unstable_cache(
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
            LIMIT ?
          `;
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
    },
    [`related-posts-${categoryId}-${excludeId}-${limit}`],
    {
      tags: ["posts-list"],
      revalidate: 3600,
    }
  );

  return getCachedRelated();
}
