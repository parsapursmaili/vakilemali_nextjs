"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updatePost,
  createPost, // تابع جدید برای ایجاد پست را ایمپورت می‌کنیم
  updateCommentStatus,
  performBulkAction,
} from "../actions";
import TiptapEditor from "../components/TiptapEditor";
import {
  Save,
  Trash2,
  Tag,
  LayoutList,
  Image as ImageIcon,
  MessageSquare,
  ChevronUp,
  Settings,
  Check,
  X,
  Clock,
  BarChart2,
  FileText,
  Loader2,
  Plus, // آیکون برای دکمه ایجاد
} from "lucide-react";

//================================================================================
// تابع کمکی برای ساخت اسلاگ از رشته فارسی و انگلیسی
//================================================================================
const generateSlug = (text) => {
  if (!text) return "";
  const decodedText = text.substring(0, 30); // ۳۰ کاراکتر اول
  return decodedText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // جایگزینی فاصله‌ها با "-"
    .replace(/[^\w\u0600-\u06FF-]+/g, "") // حذف کاراکترهای غیرمجاز (به جز حروف فارسی و انگلیسی)
    .replace(/--+/g, "-"); // حذف خط تیره های تکراری
};

//================================================================================
// کامپوننت سایدبار آکاردئونی (بدون تغییر)
//================================================================================
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

//================================================================================
// کامپوننت اصلی UI کلاینت
//================================================================================
export default function PostEditClientUI({
  initialPost,
  allCategories,
  allTags,
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isNewPost = !initialPost.id;

  // استفاده از state برای مدیریت محتوای فرم به صورت کنترل شده
  const [postData, setPostData] = useState(initialPost);
  const [content, setContent] = useState(initialPost.content || "");
  const [categorySearch, setCategorySearch] = useState("");

  // مدیریت تغییرات ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));

    // منطق جدید برای اسلاگ: فقط در صورتی که پست جدید باشد، اسلاگ را آپدیت کن
    if (name === "title" && isNewPost) {
      setPostData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleFormSubmit = (formData) => {
    formData.set("content", content);

    startTransition(async () => {
      const result = isNewPost
        ? await createPost(formData) // تابع جدید برای ایجاد
        : await updatePost(initialPost.id, formData); // تابع قبلی برای ویرایش

      alert(result.message);
      if (result.success) {
        if (isNewPost && result.postId) {
          router.push(`/admin/posts/${result.postId}`); // ریدایرکت به صفحه ویرایش پست جدید
        } else {
          router.refresh();
        }
      }
    });
  };

  const handleDeletePost = () => {
    if (
      !isNewPost &&
      confirm(
        "آیا از حذف کامل این پست مطمئن هستید؟ این عمل غیرقابل بازگشت است."
      )
    ) {
      startTransition(async () => {
        const result = await performBulkAction("delete", [initialPost.id]);
        alert(result.message);
        if (result.success) {
          router.push("/admin/posts");
        }
      });
    }
  };

  const handleCommentAction = (commentId, status) => {
    if (confirm(`آیا از تغییر وضعیت این دیدگاه مطمئن هستید؟`)) {
      startTransition(async () => {
        const result = await updateCommentStatus(commentId, status);
        alert(result.message);
        if (result.success) {
          router.refresh();
        }
      });
    }
  };

  // فیلتر کردن دسته‌بندی‌ها بر اساس جستجو
  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <form action={handleFormSubmit}>
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 p-4 z-10 backdrop-blur-sm -mx-4 md:-mx-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
          {isNewPost ? (
            "ایجاد پست جدید"
          ) : (
            <>
              ویرایش: <span className="text-primary">{initialPost.title}</span>
            </>
          )}
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          {!isNewPost && (
            <button
              type="button"
              onClick={handleDeletePost}
              className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-2"
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </button>
          )}
          <button
            type="submit"
            className="button-primary inline-flex items-center gap-2 min-w-[120px] justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>ذخیره...</span>
              </>
            ) : isNewPost ? (
              <>
                <Plus className="w-5 h-5" />
                <span>ایجاد پست</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>به‌روزرسانی</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div>
            <label htmlFor="title" className="text-sm font-medium mb-1 block">
              عنوان
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={postData.title}
              onChange={handleInputChange}
              className="!text-2xl !font-bold"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              محتوای اصلی
            </label>
            <TiptapEditor
              initialContent={content}
              onContentChange={setContent}
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <SidebarAccordion
            title="تنظیمات انتشار"
            icon={Settings}
            defaultOpen={true}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
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
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium mb-1"
                >
                  نامک (Slug)
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={postData.slug}
                  onChange={handleInputChange}
                  className="!text-left !direction-ltr"
                  dir="ltr" // این جهت باکس را چپ به راست می‌کند
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
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      name="categories"
                      value={cat.id}
                      defaultChecked={initialPost.categoryIds.includes(cat.id)}
                      className="!w-auto mr-2"
                    />
                    <label
                      htmlFor={`cat-${cat.id}`}
                      className="text-sm cursor-pointer"
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

          <SidebarAccordion title="برچسب‌ها" icon={Tag}>
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
              {allTags.map((tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    name="tags"
                    value={tag.id}
                    defaultChecked={initialPost.tagIds.includes(tag.id)}
                    className="!w-auto mr-2"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          </SidebarAccordion>

          <SidebarAccordion title="تصویر شاخص" icon={ImageIcon}>
            <input
              type="text"
              name="thumbnail"
              value={postData.thumbnail || ""}
              onChange={handleInputChange}
              placeholder="آدرس URL تصویر را وارد کنید"
              className="!text-left !direction-ltr"
              dir="ltr"
            />
            {postData.thumbnail && (
              <img
                src={postData.thumbnail}
                alt="پیش‌نمایش تصویر شاخص"
                className="mt-4 rounded-md w-full object-cover"
              />
            )}
          </SidebarAccordion>

          <SidebarAccordion title="خلاصه نوشته" icon={FileText}>
            <textarea
              name="excerpt"
              rows="4"
              value={postData.excerpt || ""}
              onChange={handleInputChange}
              className="w-full text-sm"
            ></textarea>
          </SidebarAccordion>

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
                          className="text-green-600 p-1 hover:bg-green-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isPending || comment.status === "spam"}
                          onClick={() =>
                            handleCommentAction(comment.id, "spam")
                          }
                          type="button"
                          className="text-red-600 p-1 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    هنوز دیدگاهی برای این پست ثبت نشده است.
                  </p>
                )}
              </div>
            </SidebarAccordion>
          )}
        </div>
      </div>
    </form>
  );
}
