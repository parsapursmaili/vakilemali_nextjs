"use client";

import { Check, Layers, Zap, X } from "lucide-react";

export default function QuickEditForm({
  post,
  categories,
  onCancel,
  action,
  isPending,
}) {
  const postCategoryIds = post.categories
    ? post.categories
        .split(", ")
        .map((catName) => categories.find((c) => c.name === catName)?.id)
        .filter(Boolean)
    : [];

  return (
    <div className="w-full bg-blue-50/90 border-y-2 border-blue-500 p-4 animate-in fade-in slide-in-from-top-2">
      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-extrabold text-gray-800 text-sm md:text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
          ویرایش سریع:{" "}
          <span className="text-blue-700 truncate max-w-[200px]" dir="auto">
            {post.title}
          </span>
        </h4>
        <button
          onClick={onCancel}
          className="md:hidden text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form action={action}>
        <input type="hidden" name="postId" value={post.id} />

        {/* ردیف فیلدها */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              عنوان
            </label>
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              required
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              نامک
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={post.slug}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white text-left dir-ltr"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              وضعیت
            </label>
            <select
              name="status"
              defaultValue={post.status}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white cursor-pointer"
            >
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
              <option value="archived">بایگانی شده</option>
            </select>
          </div>
        </div>

        {/* بخش دسته‌بندی‌ها - اصلاح شده */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            دسته‌بندی‌ها
          </label>

          <div className="bg-white border border-gray-200 rounded p-2.5">
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="
                    inline-flex items-center gap-2
                    bg-gray-50 border border-gray-200 
                    px-2.5 py-1.5 rounded cursor-pointer 
                    hover:bg-gray-100 hover:border-gray-300
                    has-[:checked]:bg-blue-100 has-[:checked]:border-blue-400 has-[:checked]:text-blue-900
                    transition-colors duration-150
                  "
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat.id}
                    defaultChecked={postCategoryIds.includes(cat.id)}
                    className="
                      w-4 h-4 
                      text-blue-600 rounded border-gray-400 
                      focus:ring-blue-500 focus:ring-1 focus:ring-offset-0
                      cursor-pointer accent-blue-600
                    "
                  />
                  <span className="text-xs font-medium select-none whitespace-nowrap">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-200/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            لغو
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-light)] rounded shadow-sm flex items-center gap-1.5"
          >
            {isPending ? (
              "..."
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> ذخیره
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
