"use client";

import { Search, Filter } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function PostFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("q");
    const status = formData.get("status");

    const params = new URLSearchParams(searchParams);

    // تنظیم پارامتر جستجو
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }

    // تنظیم پارامتر وضعیت
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // بازنشانی به صفحه اول
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-all hover:shadow-md">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 items-end"
      >
        {/* اینپوت جستجو */}
        <div className="flex-1 w-full">
          <label
            htmlFor="search-input"
            className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider text-right"
          >
            جستجو
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              id="search-input"
              name="q"
              defaultValue={searchParams.get("q")?.toString()}
              placeholder="عنوان، محتوا..."
              className="w-full h-[42px] pl-10 pr-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-right"
            />
          </div>
        </div>

        {/* سلکت وضعیت */}
        <div className="w-full md:w-48">
          <label
            htmlFor="status-filter"
            className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider text-right"
          >
            وضعیت
          </label>
          <div className="relative">
            <select
              id="status-filter"
              name="status"
              defaultValue={searchParams.get("status")?.toString() || "all"}
              className="w-full h-[42px] px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all cursor-pointer text-right appearance-none"
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
              <option value="archived">بایگانی</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* دکمه اعمال - افزودن cursor-pointer */}
        <div className="w-full md:w-auto flex-shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto h-[42px] px-6 bg-[var(--secondary)] hover:bg-opacity-90 text-white rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>اعمال فیلتر</span>
          </button>
        </div>
      </form>
    </div>
  );
}
