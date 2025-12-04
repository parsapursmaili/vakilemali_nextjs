"use client";

import { Search, Filter } from "lucide-react";

export default function PostFilters({ query, status }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-all hover:shadow-md">
      <form className="flex flex-col md:flex-row gap-4 items-end md:items-center">
        {/* اینپوت جستجو */}
        <div className="flex-1 w-full">
          <label
            htmlFor="search-input"
            className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider"
          >
            جستجو
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              id="search-input"
              name="q"
              defaultValue={query}
              placeholder="عنوان، محتوا..."
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* سلکت وضعیت */}
        <div className="w-full md:w-48">
          <label
            htmlFor="status-filter"
            className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider"
          >
            وضعیت
          </label>
          <select
            id="status-filter"
            name="status"
            defaultValue={status}
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all cursor-pointer"
          >
            <option value="all">همه</option>
            <option value="published">منتشر شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="archived">بایگانی</option>
          </select>
        </div>

        {/* دکمه اعمال */}
        <div className="w-full md:w-auto">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-[var(--secondary)] hover:opacity-90 text-white rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 h-[42px] mt-auto"
          >
            <Filter className="w-4 h-4" />
            <span>اعمال</span>
          </button>
        </div>
      </form>
    </div>
  );
}
