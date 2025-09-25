// app/posts/[slug]/page.jsx

import { getPostBySlug } from "./actions";
import PostContent from "@/components/post/PostContent";
import PostViews from "@/components/post/PostViews";
import PostComments from "@/components/post/PostComments";

// تنظیم صفحه به حالت Static Render با Revalidation
export const revalidate = 3600; // هر ۱ ساعت (۳۶۰۰ ثانیه) داده ها مجدداً واکشی شوند

/**
 * متادیتای دینامیک برای SEO
 */
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "پست یافت نشد",
      description: "متاسفانه پستی با این آدرس وجود ندارد.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.thumbnail],
    },
  };
}

export default async function SinglePostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-destructive text-center mt-12">
          ❌ پست مورد نظر یافت نشد
        </h1>
        <p className="text-center text-foreground/70 mt-4">
          مطمئن شوید آدرس صحیح است یا شاید پست حذف شده باشد.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-4xl">
      <article className="bg-white dark:bg-[#1a1a1a] shadow-xl rounded-lg overflow-hidden transition-colors">
        {/* تصویر شاخص */}
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-80 object-cover"
          />
        )}

        <header className="p-6 md:p-8 border-b dark:border-muted/30">
          <h1 className="text-5xl font-extrabold mb-4 leading-snug text-primary dark:text-primary-light">
            {post.title}
          </h1>
          <div className="flex justify-between items-center text-sm text-foreground/60">
            <span>
              تاریخ انتشار:{" "}
              {new Date(post.created_at).toLocaleDateString("fa-IR")}
            </span>
            {/* کامپوننت کلاینت برای مدیریت بازدید */}
            <PostViews postId={post.id} initialViews={post.view_count} />
          </div>
        </header>

        {/* محتوای اصلی پست (Server Component) */}
        <PostContent content={post.content} />

        {/* بخش کامنت‌ها (Client Component) */}
        <PostComments postId={post.id} />
      </article>
    </main>
  );
}
