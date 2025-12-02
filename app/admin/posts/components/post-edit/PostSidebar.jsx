"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Settings,
  LayoutList,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  BarChart2,
  ChevronUp,
  Library,
  Check,
  X,
} from "lucide-react";

// لودر برای نمایش تصاویر آپلود شده
const imageApiLoader = ({ src }) => {
  if (src.startsWith("http")) return src; // برای لینک‌های خارجی مستقیم
  const relativePath = src.startsWith("/uploads/")
    ? src.substring("/uploads/".length)
    : src;
  return `/api/image/${relativePath}`;
};

// کامپوننت آکاردئون
function SidebarAccordion({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-500" />
          <span>{title}</span>
        </div>
        <ChevronUp
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function PostSidebar({
  postData,
  handleInputChange,
  isNewPost,
  initialPost,
  allCategories,
  categorySearch,
  setCategorySearch,
  filteredCategories,
  openMediaLibrary,
  handleCommentAction,
  isPending,
}) {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      {/* Settings & Status */}
      <SidebarAccordion
        title="تنظیمات انتشار"
        icon={Settings}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              وضعیت
            </label>
            <select
              id="status"
              name="status"
              value={postData.status}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
              <option value="archived">بایگانی شده</option>
            </select>
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              نامک (Slug)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={postData.slug}
              onChange={handleInputChange}
              className="!text-left !direction-ltr"
              dir="ltr"
              required
            />
          </div>
          {!isNewPost && (
            <div className="text-xs text-gray-500 flex flex-col gap-2 border-t pt-3 mt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  بروزرسانی:{" "}
                  {new Date(initialPost.updated_at).toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                <span>{initialPost.view_count} بازدید</span>
              </div>
            </div>
          )}
        </div>
      </SidebarAccordion>

      {/* Categories */}
      <SidebarAccordion
        title="دسته‌بندی‌ها"
        icon={LayoutList}
        defaultOpen={true}
      >
        <input
          type="text"
          placeholder="جستجوی دسته‌بندی..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full mb-3 text-sm"
        />
        <div className="max-h-60 overflow-y-auto space-y-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  id={`cat-${cat.id}`}
                  name="categories"
                  value={cat.id}
                  defaultChecked={initialPost.categoryIds.includes(cat.id)}
                  className="!w-4 !h-4 ml-3 flex-shrink-0 rounded"
                />
                <label
                  htmlFor={`cat-${cat.id}`}
                  className="text-sm cursor-pointer select-none text-gray-700 dark:text-gray-300 flex-grow"
                >
                  {cat.name}
                </label>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-gray-500 py-2">
              موردی یافت نشد.
            </p>
          )}
        </div>
      </SidebarAccordion>

      {/* Thumbnail */}
      <SidebarAccordion title="تصویر شاخص" icon={ImageIcon}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="thumbnail"
            value={postData.thumbnail || ""}
            onChange={handleInputChange}
            placeholder="آدرس URL یا انتخاب از کتابخانه"
            className="!text-left !direction-ltr flex-grow"
            dir="ltr"
          />
          <button
            type="button"
            onClick={openMediaLibrary}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Library className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        {postData.thumbnail && (
          <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* استفاده از کامپوننت Image برای پیش‌نمایش */}
            <Image
              loader={imageApiLoader}
              src={postData.thumbnail}
              alt="پیش‌نمایش تصویر شاخص"
              fill
              className="object-cover"
              unoptimized={postData.thumbnail.startsWith("http")} // اگر لینک خارجی است بهینه سازی نکند مگر اینکه کانفیگ شده باشد
            />
          </div>
        )}
      </SidebarAccordion>

      {/* Comments (Existing Posts Only) */}
      {!isNewPost && (
        <SidebarAccordion
          title={`دیدگاه‌ها (${initialPost.comments.length})`}
          icon={MessageSquare}
        >
          <div className="space-y-4 max-h-80 overflow-y-auto p-1">
            {initialPost.comments.length > 0 ? (
              initialPost.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm border dark:border-gray-600"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{comment.author_name}</p>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        comment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : comment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-2 border-t dark:border-gray-600 pt-2">
                    <button
                      disabled={isPending || comment.status === "approved"}
                      onClick={() =>
                        handleCommentAction(comment.id, "approved")
                      }
                      type="button"
                      className="text-green-600 p-1 hover:bg-green-100 rounded-full disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      disabled={isPending || comment.status === "spam"}
                      onClick={() => handleCommentAction(comment.id, "spam")}
                      type="button"
                      className="text-red-600 p-1 hover:bg-red-100 rounded-full disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                هنوز دیدگاهی ثبت نشده است.
              </p>
            )}
          </div>
        </SidebarAccordion>
      )}
    </div>
  );
}
