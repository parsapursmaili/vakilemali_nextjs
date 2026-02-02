import { getPostByIdForEditPage, getAllTerms } from "../actions";
import PostEditClientUI from "../components/post-edit/PostEditClientUI";

export default async function EditPostPage({ params }) {
  // 👇 تغییر اصلی اینجا انجام شد: اضافه کردن await قبل از params
  const { id } = await params;

  const isNewPost = id === "new";

  if (isNewPost) {
    const termsResult = await getAllTerms();

    if (!termsResult.success) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300 max-w-lg mx-auto mt-20">
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
      status: "published",
      approved: 0,
      view_count: 0,
      updated_at: new Date().toISOString(),
      categoryIds: [],
      comments: [],
      video_link: "",
      redirect_url: "",
    };

    return (
      <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <PostEditClientUI
          initialPost={newPostTemplate}
          allCategories={termsResult.categories}
        />
      </div>
    );
  }

  const [postResult, termsResult] = await Promise.all([
    getPostByIdForEditPage(id),
    getAllTerms(),
  ]);

  if (!postResult.success || !termsResult.success) {
    const error = postResult.error || termsResult.error || "Post not found.";
    return (
      <div className="p-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300 max-w-lg mx-auto mt-20">
        <h3 className="font-bold">خطا در بارگذاری اطلاعات</h3>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PostEditClientUI
        initialPost={postResult.post}
        allCategories={termsResult.categories}
      />
    </div>
  );
}
