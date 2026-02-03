// PostSchemaScript.jsx
import React from "react";

/**
 * کامپوننتی برای رندر Schema Markup از نوع BlogPosting به صورت LD+JSON
 */
export default function PostSchemaScript({
  post,
  terms,
  slug,
}) {
  if (!post) return null;

  // 1. استخراج دسته‌بندی‌ها و تگ‌ها از آرایه terms
  const categories = terms?.filter((t) => t.type === "category") || [];
  const tags = terms?.filter((t) => t.type === "tag") || [];
  const primaryCategory = categories[0] || null;

  // 2. اطلاعات ثابت و پیش‌فرض
  const postUrl = `/${slug}`;
  const authorName = "مرضیه توانگر";
  const organizationName = "وکیل مالی";
  const organizationUrl = "https://vakilemali.com";
  const organizationLogo = "/logo.png";

  const title = post.title;
  // حذف تگ‌های HTML از محتوا برای توضیحات
  const cleanContent = post.content
    ? post.content.replace(/<[^>]*>?/gm, " ").trim()
    : "";

  const description = post.excerpt || cleanContent.substring(0, 150) + "...";

  const image = post.thumbnail
    ? post.thumbnail
    : "/logo.png";
  const absoluteImageUrl = `${organizationUrl}${image}`;

  // 3. ساختار Schema Markup (BlogPosting)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    inLanguage: "fa-IR", // ✅ اضافه شده: زبان محتوا
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${organizationUrl}${postUrl}`,
    },
    headline: title,
    description: description,
    image: {
      "@type": "ImageObject",
      url: absoluteImageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: authorName,
      url: `${organizationUrl}/about-us`,
    },
    publisher: {
      "@type": "Organization",
      name: organizationName,
      url: organizationUrl,
      logo: {
        "@type": "ImageObject",
        url: `${organizationUrl}${organizationLogo}`,
        width: 600, // ابعاد لوگو را دقیق وارد کنید
        height: 60,
      },
    },
    // ✅ تاریخ انتشار اصلی
    datePublished: new Date(post.created_at).toISOString(),
    // ✅ تاریخ بروزرسانی (بسیار مهم برای سئو جدید شما)
    dateModified: new Date(post.updated_at || post.created_at).toISOString(),

    articleSection: primaryCategory ? primaryCategory.name : "عمومی",
    // ✅ اصلاح شده: استفاده از آرایه tags استخراج شده
    keywords: tags.map((t) => t.name).join(", "),

    // بدنه مقاله (محدود شده برای جلوگیری از سنگین شدن صفحه)
    articleBody: cleanContent.substring(0, 2000),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
