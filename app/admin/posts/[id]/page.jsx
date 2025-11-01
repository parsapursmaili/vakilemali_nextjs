import { getPostByIdForEditPage, getAllTerms } from "../actions";
import PostEditClientUI from "./PostEditClientUI"; // کامپوننت کلاینت را ایمپورت می‌کنیم

//================================================================================
// 1. کامپوننت سرور اصلی (Server Component)
// این کامپوننت اصلاح شده تا هم صفحه "ایجاد" و هم "ویرایش" را مدیریت کند.
//================================================================================
export default async function EditPostPage({ params }) {
  const { id } = params;
  const isNewPost = id === "new";

  // اگر در حال ایجاد پست جدید هستیم، یک پست پیش‌فرض خالی ایجاد می‌کنیم
  if (isNewPost) {
    const termsResult = await getAllTerms();

    if (!termsResult.success) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300">
          <h3 className="font-bold">خطا در بارگذاری دسته‌بندی‌ها</h3>
          <p className="mt-2 text-sm">{termsResult.error}</p>
        </div>
      );
    }

    const newPostTemplate = {
      id: null,
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      status: "draft",
      view_count: 0,
      updated_at: new Date().toISOString(),
      categoryIds: [],
      tagIds: [],
      comments: [],
    };

    return (
      <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <PostEditClientUI
          initialPost={newPostTemplate}
          allCategories={termsResult.categories}
          allTags={termsResult.tags}
        />
      </div>
    );
  }

  // اگر در حال ویرایش هستیم، اطلاعات پست موجود را فراخوانی می‌کنیم
  const [postResult, termsResult] = await Promise.all([
    getPostByIdForEditPage(id),
    getAllTerms(),
  ]);

  // مدیریت خطا در صورتی که یکی از فراخوانی‌ها ناموفق باشد
  if (!postResult.success || !termsResult.success) {
    const error = postResult.error || termsResult.error || "Post not found.";
    return (
      <div className="p-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300">
        <h3 className="font-bold">خطا در بارگذاری اطلاعات</h3>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  // ارسال داده‌های آماده به کامپوننت کلاینت
  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <PostEditClientUI
        initialPost={postResult.post}
        allCategories={termsResult.categories}
        allTags={termsResult.tags}
      />
    </div>
  );
}
