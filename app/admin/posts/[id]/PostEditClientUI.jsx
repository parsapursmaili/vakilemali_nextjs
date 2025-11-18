"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updatePost,
  createPost,
  updateCommentStatus,
  performBulkAction,
} from "../actions";
// import TiptapEditor from "../components/TiptapEditor"; // <--- حذف شد
// ایمپورت کتابخانه اعلان
import { Toaster, toast } from "react-hot-toast";
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
  Plus,
  Library,
  Copy, // آیکون جدید برای کپی
  ExternalLink, // آیکون جدید برای لینک خارجی
} from "lucide-react";

// ایمپورت کامپوننت جدید کتابخانه رسانه
import MediaLibrary from "../components/MediaLibrary";

//================================================================================
// تابع کمکی برای ساخت اسلاگ (بدون تغییر)
//================================================================================
const generateSlug = (text) => {
  if (!text) return "";
  const decodedText = text.substring(0, 30);
  return decodedText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");
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
// کامپوننت اصلی UI کلاینت (نسخه نهایی و اصلاح شده)
//================================================================================
export default function PostEditClientUI({
  initialPost,
  allCategories,
  allTags,
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isNewPost = !initialPost.id;

  // ✨ فیلد video_link از initialPost دریافت می‌شود
  const [postData, setPostData] = useState(initialPost);
  // محتوای پست که اکنون قرار است کد HTML خام باشد
  const [content, setContent] = useState(initialPost.content || "");
  const [categorySearch, setCategorySearch] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const MAX_EXCERPT_LENGTH = 160;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "excerpt" && value.length > MAX_EXCERPT_LENGTH) return;
    setPostData((prev) => ({ ...prev, [name]: value }));
    if (name === "title" && isNewPost) {
      setPostData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setPostData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleFormSubmit = (formData) => {
    // محتوای (HTML خام) را از استیت content برداشته و به FormData اضافه می‌کنیم
    formData.set("content", content);
    formData.set("excerpt", postData.excerpt || "");
    formData.set("approved", postData.approved ? "1" : "0");
    // ✨ تغییر ۲: اضافه کردن فیلد video_link به FormData
    formData.set("video_link", postData.video_link || "");

    // =================================================================
    // <<< ✨✨✨ راه حل کلیدی مشکل ✨✨✨ >>>
    // این خط تضمین می‌کند که مقدار تصویر شاخص همیشه از استیت خوانده و ارسال شود،
    // حتی اگر آکاردئون آن بسته باشد و اینپوت مربوطه در DOM وجود نداشته باشد.
    formData.set("thumbnail", postData.thumbnail || "");
    // =================================================================

    startTransition(async () => {
      const promise = isNewPost
        ? createPost(formData)
        : updatePost(initialPost.id, formData);

      toast.promise(promise, {
        loading: "در حال ذخیره تغییرات...",
        success: (result) => {
          if (result.success) {
            if (isNewPost && result.postId) {
              router.push(`/admin/posts/${result.postId}`);
            } else {
              router.refresh();
            }
            return result.message;
          } else {
            throw new Error(result.message);
          }
        },
        error: (err) => `خطا: ${err.message}`,
      });
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
        const promise = performBulkAction("delete", [initialPost.id]);
        toast.promise(promise, {
          loading: "در حال حذف پست...",
          success: (result) => {
            if (result.success) {
              router.push("/admin/posts");
              return result.message;
            } else {
              throw new Error(result.message);
            }
          },
          error: (err) => `خطا: ${err.message}`,
        });
      });
    }
  };

  const handleCommentAction = (commentId, status) => {
    if (confirm(`آیا از تغییر وضعیت این دیدگاه مطمئن هستید؟`)) {
      startTransition(async () => {
        const promise = updateCommentStatus(commentId, status);
        toast.promise(promise, {
          loading: "در حال تغییر وضعیت دیدگاه...",
          success: (result) => {
            if (result.success) {
              router.refresh();
              return result.message;
            } else {
              throw new Error(result.message);
            }
          },
          error: (err) => `خطا: ${err.message}`,
        });
      });
    }
  };

  const handleCopyLink = () => {
    const link = `https://vakilemali.com/?p=${initialPost.id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      },
      (err) => {
        toast.error("خطا در کپی کردن لینک!");
        console.error("Failed to copy: ", err);
      }
    );
  };

  const handleImageSelect = (imageUrl) => {
    setPostData((prev) => ({ ...prev, thumbnail: imageUrl }));
    setIsMediaModalOpen(false);
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <form action={handleFormSubmit}>
      <Toaster position="bottom-left" reverseOrder={false} />

      {isMediaModalOpen && (
        <MediaLibrary
          onClose={() => setIsMediaModalOpen(false)}
          onSelectImage={handleImageSelect}
        />
      )}

      <header className="grid grid-cols-12 gap-6 md:gap-8 mb-8 sticky top-0 bg-gray-100/80 dark:bg-gray-900/80 p-4 z-10 backdrop-blur-sm -mx-4 md:-mx-8 border-b border-gray-200 dark:border-gray-700">
        <div className="col-span-12 lg:col-span-8 flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {isNewPost ? (
              "ایجاد پست جدید"
            ) : (
              <>
                ویرایش:{" "}
                <span className="text-primary">{initialPost.title}</span>
              </>
            )}
          </h1>
        </div>
        <div className="col-span-12 lg:col-span-4 flex items-center justify-start lg:justify-end gap-3 md:gap-4">
          <label
            htmlFor="approved"
            className="flex items-center cursor-pointer gap-2"
            title={
              !!postData.approved
                ? "وضعیت: تایید شده"
                : "وضعیت: در انتظار تایید"
            }
          >
            <div className="relative">
              <input
                type="checkbox"
                id="approved"
                name="approved"
                className="sr-only"
                checked={!!postData.approved}
                onChange={handleSwitchChange}
                disabled={isPending}
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  !!postData.approved
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  !!postData.approved ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span
              className={`text-sm font-semibold transition-colors hidden sm:inline ${
                !!postData.approved
                  ? "text-green-700 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {!!postData.approved ? "تایید شده" : "در انتظار"}
            </span>
          </label>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          {!isNewPost && (
            <button
              type="button"
              onClick={handleDeletePost}
              className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-2"
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">حذف</span>
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

          {!isNewPost && (
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  لینک کوتاه:
                </span>
                <code className="text-primary-light dark:text-sky-400 truncate">
                  {`https://vakilemali.com/?p=${initialPost.id}`}
                </code>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="کپی لینک کوتاه"
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-1.5 rounded-md transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`/${postData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-1.5 rounded-md transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  title="مشاهده پست در سایت"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* جایگزینی TiptapEditor با textarea برای ورود HTML خام */}
          {/* ========================================================================= */}
          <div>
            <label htmlFor="content" className="text-sm font-medium mb-1 block">
              محتوای اصلی (HTML خام)
            </label>
            <textarea
              id="content"
              name="content" // این name برای استفاده در صورت عدم استفاده از formData.set نیز مفید است
              rows="20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm p-4 h-[500px] !direction-ltr !text-left font-mono"
              placeholder="کد HTML محتوای اصلی پست را اینجا وارد کنید..."
              required // محتوا باید اجباری باشد
            ></textarea>
          </div>
          {/* ========================================================================= */}

          {/* ✨ تغییر ۲: باکس جدید محتوای ویدئویی */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200 mb-3">
              <Library className="w-5 h-5 text-gray-500" />
              <span>محتوای ویدئویی (کد HTML/iframe)</span>
            </div>
            <textarea
              name="video_link"
              rows="6"
              value={postData.video_link || ""}
              onChange={handleInputChange}
              className="w-full text-sm !direction-ltr !text-left font-mono"
              placeholder="کد embed ویدئو (مانند iframe یا کد HTML) را اینجا وارد کنید."
            ></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              این محتوا (مانند کد ویدئوهای یوتیوب یا آپارات) در بخش مشخصی از
              صفحه پست نمایش داده خواهد شد.
            </p>
          </div>
          {/* ========================================================================= */}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200 mb-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span>خلاصه نوشته (برای سئو)</span>
            </div>
            <textarea
              name="excerpt"
              rows="4"
              value={postData.excerpt || ""}
              onChange={handleInputChange}
              className="w-full text-sm"
              placeholder="یک خلاصه کوتاه و جذاب برای نمایش در نتایج گوگل بنویسید."
              maxLength={MAX_EXCERPT_LENGTH}
            ></textarea>
            <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-2">
              {postData.excerpt?.length || 0} / {MAX_EXCERPT_LENGTH}
            </p>
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
                  // ✨ تغییر ۳: بهبود استایل آیتم دسته بندی
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
                      // کلاس‌های بهتر برای سایز و ظاهر
                      className="!w-4 !h-4 ml-3 flex-shrink-0 text-primary-500 bg-gray-100 border-gray-300 dark:bg-gray-600 dark:border-gray-500 focus:ring-primary-500 rounded"
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

          <SidebarAccordion title="تصویر شاخص" icon={ImageIcon}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="thumbnail"
                value={postData.thumbnail || ""}
                onChange={handleInputChange}
                placeholder="آدرس URL یا از کتابخانه انتخاب کنید"
                className="!text-left !direction-ltr flex-grow"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(true)}
                title="باز کردن کتابخانه رسانه"
                className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Library className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            {postData.thumbnail && (
              <img
                src={postData.thumbnail}
                alt="پیش‌نمایش تصویر شاخص"
                className="mt-4 rounded-md w-full object-cover"
              />
            )}
          </SidebarAccordion>

          <SidebarAccordion title="برچسب‌ها" icon={Tag}>
            <div className="max-h-60 overflow-y-auto space-y-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-900">
              {allTags.map((tag) => (
                // ✨ تغییر ۳: بهبود استایل آیتم برچسب
                <div
                  key={tag.id}
                  className="flex items-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    name="tags"
                    value={tag.id}
                    defaultChecked={initialPost.tagIds.includes(tag.id)}
                    // کلاس‌های بهتر برای سایز و ظاهر
                    className="!w-4 !h-4 ml-3 flex-shrink-0 text-primary-500 bg-gray-100 border-gray-300 dark:bg-gray-600 dark:border-gray-500 focus:ring-primary-500 rounded"
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm cursor-pointer select-none text-gray-700 dark:text-gray-300 flex-grow"
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
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
