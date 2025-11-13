import { redirect } from "next/navigation";
import PostsSlider from "@/components/PostsSlider";
import {
  getLatestPosts,
  getPopularPosts,
  findPostSlugById,
} from "./actions/main-Page";

export default async function HomePage({ searchParams }) {
  const postId = (await searchParams)?.p;

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
