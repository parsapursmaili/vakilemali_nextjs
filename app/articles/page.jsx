import PostsSlider from "@/components/PostsSlider";
import FilterControls from "./FilterControls";
import Pagination from "./Pagination";
import { getCategories, getPaginatedPosts } from "./actions";

export const metadata = {
  title: "وبلاگ وکیل مالی | جدیدترین مقالات حقوقی ",
  description:
    "جدیدترین مقالات حقوقی در حوزه مالیات، طلاق و خانواده، چک و سفته، ارث و میراث، دعاوی کیفری، قراردادها و … به قلم وکلای پایه یک دادگستری. آموزش رایگان + راهکارهای عملی.",
};

export default async function ArticlesPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const sort = searchParams.sort || "newest";
  const categoryId = searchParams.category || null; // ✅ تغییر: دریافت category ID به جای category slug

  const [categories, { posts, totalPages, currentPage }] = await Promise.all([
    getCategories(),
    getPaginatedPosts({ page, sortBy: sort, categoryId: categoryId }), // ✅ تغییر: ارسال categoryId به جای categorySlug
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
