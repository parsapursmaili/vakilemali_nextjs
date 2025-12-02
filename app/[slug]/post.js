"use server";
import { db } from "@/lib/db/mysql";
import { isAuthenticated } from "@/actions/auth";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation"; // ✅ برای ریدایرکت 301 اضافه شد

export async function getPostData(slug) {
  try {
    const slug2 = decodeURIComponent(slug);

    // ✅ تغییر 1: حذف شرط status='published' از SQL و اضافه کردن status و redirect_url به Select
    // این کار باعث می‌شود با یک بار کوئری، هم ریدایرکت و هم دیتای پست چک شود (بهینه‌سازی)
    const [rows] = await db.query(
      `SELECT id, title, slug, content, excerpt, thumbnail, video_link, 
       created_at, updated_at, view_count, status, redirect_url 
       FROM posts 
       WHERE slug = ?`,
      [slug2]
    );

    if (!rows || rows.length === 0) {
      return { post: null, terms: [] };
    }

    const post = rows[0];

    // ✅ تغییر 2: بررسی ریدایرکت قبل از هر چیزی
    if (post.redirect_url && post.redirect_url.trim() !== "") {
      // فرض بر این است که آدرس ذخیره شده فقط اسلاگ جدید است.
      // اگر ساختار لینک‌های شما پیشوند دارد (مثلا /blog/) آن را قبل از post.redirect_url اضافه کنید.
      // مثال: permanentRedirect(`/blog/${encodeURI(post.redirect_url)}`);

      // استفاده از encodeURI برای اطمینان از صحت کاراکترهای فارسی در URL
      permanentRedirect(`/${encodeURI(post.redirect_url)}`);
    }

    // ✅ تغییر 3: بررسی وضعیت انتشار به صورت دستی بعد از چک کردن ریدایرکت
    if (post.status !== "published") {
      return { post: null, terms: [] };
    }

    // دریافت دسته‌ها و تگ‌ها (فقط در صورتی که پست منتشر شده باشد اجرا می‌شود)
    const [termsResult] = await db.query(
      `SELECT t.id, t.name, t.slug, t.type 
       FROM terms t 
       JOIN post_terms pt ON pt.term_id = t.id 
       WHERE pt.post_id = ?`,
      [post.id]
    );

    return { post, terms: termsResult };
  } catch (error) {
    // اگر ارور مربوط به ریدایرکت باشد، باید اجازه دهیم Next.js آن را مدیریت کند
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error(
      "LOG DATA ERROR: Database Error fetching post data:",
      error.message
    );
    return { post: null, terms: [] };
  }
}

export async function incrementPostViews(postId) {
  if (!postId) return false;

  // اگر کاربر لاگین بود، بازدید را نشمار (اختیاری - بر اساس کد قبلی شما)
  if (await isAuthenticated()) return false;

  const cookieStore = cookies();
  const viewedPostsCookie = cookieStore.get("viewed_posts");
  const viewedPosts = viewedPostsCookie
    ? viewedPostsCookie.value.split(",")
    : [];

  if (viewedPosts.includes(String(postId))) {
    return false;
  }

  try {
    // آپدیت بازدید کل
    await db.execute(
      "UPDATE posts SET view_count = view_count + 1 WHERE id = ?",
      [postId]
    );

    // آپدیت بازدید روزانه
    const today = new Date().toISOString().slice(0, 10);
    await db.execute(
      `INSERT INTO post_view (post_id, view_date, view_count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE view_count = view_count + 1`,
      [postId, today]
    );

    // تنظیم کوکی
    const newViewedPosts = [...viewedPosts, postId];
    cookieStore.set("viewed_posts", newViewedPosts.join(","), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 سال
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

    // استراتژی 1: پست‌های هم‌دسته
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
        excludeId || 0, // جلوگیری از نال بودن
        categoryId,
        limit,
      ]);
      relatedPosts = relatedRows;
    }

    // استراتژی 2: پر کردن باقی‌مانده با جدیدترین پست‌ها
    if (relatedPosts.length < limit) {
      const remainingLimit = limit - relatedPosts.length;
      // آرایه‌ای از IDهایی که نباید دوباره انتخاب شوند
      const excludeIds = [excludeId, ...relatedPosts.map((p) => p.id)].filter(
        Boolean
      );

      // استفاده از JOIN به جای Subquery در SELECT برای پرفورمنس بهتر
      const latestQuery = `
        SELECT p.id, p.title, p.slug, p.thumbnail, t.name as categoryName
        FROM posts p
        LEFT JOIN post_terms pt ON p.id = pt.post_id
        LEFT JOIN terms t ON pt.term_id = t.id AND t.type = 'category'
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
}
