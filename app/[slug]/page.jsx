// app/posts/[slug]/page.jsx
// 'use client' ندارد، پس یک Server Component است.

import { getPostData } from "./post";
import PostViews from "@/components/PostViews";
import PostCommentsSection from "@/components/PostCommentsSection";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { notFound } from "next/navigation"; // اضافه کردن notFound

// 💡 تنظیم صفحه به حالت ISR (واکشی مجدد در پس‌زمینه هر ۱ ساعت)
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { post } = await getPostData(params.slug);

  if (!post) {
    return { title: "پست یافت نشد" };
  }

  return {
    title: post.title || "عنوان پیش‌فرض",
    description:
      post.excerpt ||
      (typeof post.content === "string" && post.content
        ? post.content.substring(0, 150) + "..."
        : "توضیحات پیش‌فرض"),
    openGraph: {
      images: [post.thumbnail || "/images/default-social.jpg"],
    },
  };
}

export default async function SinglePostPage({ params }) {
  const { post, terms } = await getPostData(params.slug);
  const postSlug = params.slug;

  if (!post) {
    notFound(); // هدایت به صفحه 404
  }

  // دسته‌بندی‌ها و تگ‌ها
  const categories = terms.filter((t) => t.type === "category");
  const tags = terms.filter((t) => t.type === "tag");

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <article className="bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-xl overflow-hidden border-2 border-primary/10 transition-colors">
        {/* تصویر شاخص */}
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-96 object-cover object-center shadow-inner-lg"
          />
        )}

        <header className="p-6 md:p-10 border-b border-muted dark:border-muted/30">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-primary dark:text-primary-light">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-foreground/70 justify-between mt-4 border-t pt-4 dark:border-muted/50">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="flex items-center">
                <Clock className="w-4 h-4 ml-1 text-accent" />
                تاریخ انتشار:{" "}
                {new Date(post.created_at).toLocaleDateString("fa-IR")}
              </span>
              {categories.length > 0 && (
                <span className="flex items-center">
                  <Tag className="w-4 h-4 ml-1 text-secondary" />
                  دسته:
                  {categories.map((cat, index) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="mr-1 hover:underline text-primary"
                    >
                      {cat.name}
                      {index < categories.length - 1 ? "،" : ""}
                    </Link>
                  ))}
                </span>
              )}
            </div>

            {/* 💡 Client Component برای نمایش و افزایش بازدید */}
            <PostViews postId={post.id} initialViews={post.view_count} />
          </div>
        </header>

        {/* محتوای اصلی پست */}
        <section className="post-content p-6 md:p-10 text-foreground/90 leading-loose text-justify">
          <div
            className="prose prose-lg dark:prose-invert prose-blue max-w-none rtl"
            // 🚨 مطمئن شو محتوا در بک‌اند پاکسازی (Sanitized) شده
            dangerouslySetInnerHTML={{ __html: String(post.content || "") }}
          />
        </section>

        {/* تگ‌ها */}
        {tags.length > 0 && (
          <footer className="p-6 md:p-10 border-t border-muted dark:border-muted/30">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold text-foreground">برچسب‌ها:</span>
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tag/${tag.slug}`}
                  className="text-xs bg-muted/70 hover:bg-muted dark:bg-muted/50 dark:hover:bg-muted transition-colors px-3 py-1 rounded-full text-primary font-medium"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </footer>
        )}
      </article>

      {/* 💡 Client Component برای مدیریت کامل بخش کامنت‌ها */}
      <div className="mt-12">
        <PostCommentsSection postId={post.id} postSlug={postSlug} />
      </div>
    </main>
  );
}
