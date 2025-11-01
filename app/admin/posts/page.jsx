import { Suspense } from "react";
import Link from "next/link";
import {
  getPosts,
  performBulkAction,
  quickEditPost,
  getAllTerms,
} from "./actions";
import PostsTable from "./components/PostsTable";
import { Plus, Search, Filter, List, FileText } from "lucide-react";

function TableSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
      <div className="overflow-x-auto">
        <div className="p-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24 hidden md:block"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24 hidden lg:block"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, searchParams }) {
  if (totalPages <= 1) return null;
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };
  return (
    <nav
      className="flex justify-center items-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-primary text-white shadow-lg"
              : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}

async function PostsDataWrapper({ query, currentPage, status, sortBy, order }) {
  const postsPromise = getPosts({
    query,
    page: currentPage,
    status,
    sortBy,
    order,
  });
  const termsPromise = getAllTerms();
  const [
    { posts, total, pages, success: postsSuccess, error: postsError },
    { categories, success: termsSuccess, error: termsError },
  ] = await Promise.all([postsPromise, termsPromise]);

  if (!postsSuccess || !termsSuccess)
    return (
      <div className="p-8 text-center text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300">
        <h3 className="font-bold">خطا در بارگذاری اطلاعات</h3>
        <p className="mt-2 text-sm">{postsError || termsError}</p>
      </div>
    );
  if (posts.length === 0)
    return (
      <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold">هیچ پستی یافت نشد</h3>
        <p className="mt-2">
          برای شروع، یک{" "}
          <Link
            href="/admin/posts/new"
            className="text-primary hover:underline"
          >
            نوشته جدید ایجاد کنید
          </Link>
          .
        </p>
      </div>
    );

  return (
    <>
      <PostsTable
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

export default function PostsDashboardPage({ searchParams }) {
  const query = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status || "all";
  const sortBy = searchParams?.sortBy || "created_at";
  const order = searchParams?.order || "desc";

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <div className="max-w-screen-xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <List className="w-8 h-8" />
            مدیریت نوشته‌ها
          </h1>
          <Link
            href="/admin/posts/new"
            className="button-primary inline-flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>نوشته جدید</span>
          </Link>
        </header>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <label
                htmlFor="search-input"
                className="text-sm font-medium mb-1 block"
              >
                جستجو
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="search-input"
                  name="q"
                  defaultValue={query}
                  placeholder="جستجو در عنوان و محتوای نوشته‌ها..."
                  className="w-full !pl-10 !pr-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status-filter"
                className="text-sm font-medium mb-1 block"
              >
                وضعیت
              </label>
              <select
                id="status-filter"
                name="status"
                defaultValue={status}
                className="w-full"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی شده</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="button-secondary w-full inline-flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                اعمال فیلتر
              </button>
            </div>
          </form>
        </div>

        <main>
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
