import PostsSlider from "@/components/PostsSlider";
import FilterControls from "./FilterControls";
import Pagination from "./Pagination";
import { getCategories, getPaginatedPosts } from "./actions";

export default async function ArticlesPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const sort = searchParams.sort || "newest";
  const category = searchParams.category || null;

  const [categories, { posts, totalPages, currentPage }] = await Promise.all([
    getCategories(),
    getPaginatedPosts({ page, sortBy: sort, categorySlug: category }),
  ]);

  return (
    <section className="w-full py-10">
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">
          آرشیو مقالات
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          جدیدترین مطالب ما را در دسته‌بندی‌های مختلف جستجو و مطالعه کنید.
        </p>

        <FilterControls categories={categories} />

        {posts && posts.length > 0 ? (
          <PostsSlider posts={posts} />
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
            <h3 className="text-2xl font-semibold">مقاله‌ای یافت نشد!</h3>
            <p className="text-muted-foreground mt-2">
              لطفاً فیلترهای خود را تغییر دهید و دوباره تلاش کنید.
            </p>
          </div>
        )}

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </section>
  );
}
