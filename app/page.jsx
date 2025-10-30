import { redirect } from "next/navigation"; // ۱. وارد کردن تابع redirect
import PostsSlider from "@/components/PostsSlider";
// ۲. وارد کردن تابع جدید از فایل اکشن
import {
  getLatestPosts,
  getPopularPosts,
  findPostSlugById,
} from "./actions/main-Page";

// ۳. دریافت searchParams به عنوان پراپ
export default async function HomePage({ searchParams }) {
  // ۴. منطق اصلی برای ریدایرکت
  const postId = searchParams?.p;

  // فقط در صورتی که پارامتر p وجود داشته باشد و یک عدد معتبر باشد، این بلوک اجرا می‌شود
  if (postId && !isNaN(postId)) {
    const post = await findPostSlugById(Number(postId));

    if (post && post.slug) {
      redirect(`/${post.slug}`);
    }
  }

  const [latestPostsData, popularPostsData, morePostsData] = await Promise.all([
    getLatestPosts({ limit: 6 }),
    getPopularPosts({ limit: 12 }),
    getLatestPosts({ limit: 12, offset: 6 }),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background">
      <div className="w-full space-y-16 py-5">
        <PostsSlider title="جدیدترین مطالب" posts={latestPostsData.posts} />
        <PostsSlider title="پربازدیدترین‌ها" posts={popularPostsData.posts} />
        <PostsSlider title="بیشتر بخوانید" posts={morePostsData.posts} />
      </div>
    </main>
  );
}
