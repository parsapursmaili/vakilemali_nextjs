// PostSchemaScript.jsx
import React from "react";

// تعریف نوع داده برای پر کردن Schema
/**
 * @typedef {Object} PostSchemaProps
 * @property {object} post - شیء کامل پست
 * @property {object[]} terms - آرایه‌ای از دسته‌بندی‌ها و برچسب‌ها
 * @property {string} slug - اسلاگ پست
 * @property {function(string): string} cleanImageUrlPath - تابع پاکسازی آدرس تصویر
 */

/**
 * کامپوننتی برای رندر Schema Markup از نوع BlogPosting به صورت LD+JSON
 * که در بدنه (Body) صفحه قرار می‌گیرد.
 * @param {PostSchemaProps} props
 */
export default function PostSchemaScript({
  post,
  terms,
  slug,
  cleanImageUrlPath,
}) {
  if (!post) return null;

  // 1. اطلاعات ثابت و پیش‌فرض
  const postUrl = `/${slug}`;
  const authorName = "مرضیه توانگر"; // نویسنده ثابت
  const organizationName = "وکیل مالی";
  const organizationUrl = "https://vakilemali.com"; // آدرس دامنه شما
  const organizationLogo = "/logo.png"; // لوگوی سازمانی

  const categories = terms.filter((t) => t.type === "category");
  const primaryCategory = categories[0] || null;

  const title = post.title;
  const description =
    post.excerpt ||
    (post.content
      ? post.content.substring(0, 150).replace(/<[^>]*>?/gm, "") + "..."
      : title);

  const image = post.thumbnail
    ? cleanImageUrlPath(post.thumbnail)
    : "/logo.png";
  const absoluteImageUrl = `${organizationUrl}${image}`;

  // 3. ساختار Schema Markup (BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${organizationUrl}${postUrl}`,
    },
    headline: title,
    description: description,
    // اطلاعات کامل تصویر
    image: {
      "@type": "ImageObject",
      url: absoluteImageUrl,
      width: 1200,
      height: 630,
      caption: title,
    },
    // اطلاعات کامل نویسنده (شخص)
    author: {
      "@type": "Person",
      name: authorName,
      url: `${organizationUrl}/about-us`, // یا آدرس پروفایل نویسنده
    },
    // اطلاعات کامل ناشر (سازمان)
    publisher: {
      "@type": "Organization",
      name: organizationName,
      url: organizationUrl,
      logo: {
        "@type": "ImageObject",
        url: `${organizationUrl}${organizationLogo}`,
        width: 600,
        height: 60,
      },
    },
    // تاریخ‌ها
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: new Date(post.updated_at || post.created_at).toISOString(),
    // اطلاعات دسته‌بندی
    articleSection: primaryCategory ? primaryCategory.name : undefined,
    keywords: post.tags?.map((t) => t.name),
    // محتوای اصلی (می‌تواند خلاصه یا کل متن باشد)
    articleBody:
      post.content.replace(/<[^>]*>?/gm, " ").substring(0, 1000) + "...",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
