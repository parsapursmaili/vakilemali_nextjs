import { Suspense } from "react";
import Link from "next/link";
import { Plus, Layers, FileX2 } from "lucide-react";

// ایمپورت اکشن‌ها
import {
  getPosts,
  performBulkAction,
  quickEditPost,
  getAllTerms,
} from "./actions";

// ایمپورت کامپوننت‌های جدا شده
import PostsList from "./components/PostsList";
import PostFilters from "./components/PostFilters";

// --- کامپوننت اسکلتون بارگذاری ---
function TableSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-12 bg-white dark:bg-gray-800 rounded-xl w-full md:w-1/2"></div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border-b border-gray-100 h-20"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- کامپوننت صفحه‌بندی (اصلاح شده: رنگ و ریسپانسیو) ---
function Pagination({ currentPage, totalPages, searchParams }) {
  if (totalPages <= 1) return null;

  const createPageURL = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    // اصلاح: اضافه شدن flex-wrap برای جلوگیری از اسکرول افقی در موبایل
    <div className="flex flex-wrap justify-center mt-8 gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`
            min-w-[2.5rem] h-10 px-3 flex items-center justify-center rounded-md text-sm font-bold transition-all border
            ${
              currentPage === page
                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md transform scale-105" // حالت فعال: آبی تیره تم و متن سفید
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" // حالت عادی
            }
          `}
        >
          {page}
        </Link>
      ))}
    </div>
  );
}

// --- رپر داده‌ها (Data Wrapper) ---
async function PostsDataWrapper({ query, currentPage, status, sortBy, order }) {
  const [postData, categoryData] = await Promise.all([
    getPosts({ query, page: currentPage, status, sortBy, order }),
    getAllTerms(),
  ]);

  const {
    posts,
    total,
    pages,
    success: postsSuccess,
    error: postsError,
  } = postData;
  const { categories, success: termsSuccess, error: termsError } = categoryData;

  if (!postsSuccess || !termsSuccess) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <h3 className="font-bold">خطا در دریافت اطلاعات</h3>
        <p className="mt-2 text-sm opacity-80">{postsError || termsError}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
        <FileX2 className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">هیچ پستی یافت نشد</h3>
        <div className="mt-6 flex gap-3">
          <Link
            href="/admin/posts"
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            پاک کردن فیلترها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PostsList
        posts={posts}
        performBulkAction={performBulkAction}
        quickEditAction={quickEditPost}
        allCategories={categories}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        searchParams={{ q: query, status, sortBy, order, page: currentPage }}
      />
    </>
  );
}

// --- صفحه اصلی داشبورد ---
export default function PostsDashboardPage({ searchParams }) {
  const query = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status || "all";
  const sortBy = searchParams?.sortBy || "created_at";
  const order = searchParams?.order || "desc";

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 text-[var(--foreground)] pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* هدر صفحه */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] dark:text-white flex items-center gap-3 tracking-tight">
              <Layers className="w-8 h-8 text-[var(--primary)]" />
              مدیریت نوشته‌ها
            </h1>
            <p className="text-sm text-gray-500 mt-1 mr-1">
              مدیریت، ویرایش و انتشار محتوای وب‌سایت
            </p>
          </div>

          {/* دکمه نوشته جدید - اصلاح رنگ */}
          <Link
            href="/admin/posts/new"
            className="w-full sm:w-auto px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-lg font-medium shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>نوشته جدید</span>
          </Link>
        </header>

        <main>
          <PostFilters query={query} status={status} />

          <Suspense fallback={<TableSkeleton />}>
            <PostsDataWrapper
              query={query}
              currentPage={currentPage}
              status={status}
              sortBy={sortBy}
              order={order}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
