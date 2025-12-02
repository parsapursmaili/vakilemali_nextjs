"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updatePost,
  createPost,
  updateCommentStatus,
  performBulkAction,
} from "../../actions";
import { Toaster, toast } from "react-hot-toast";
import { Save, Trash2, Loader2, Plus } from "lucide-react";
import MediaLibrary from "../MediaLibrary";
import PostMainContent from "./PostMainContent";
import PostSidebar from "./PostSidebar";

// تابع ساخت اسلاگ با محدودیت 60 کاراکتر برای سئو
const generateSlug = (text) => {
  if (!text) return "";
  const decodedText = text.substring(0, 60);
  return decodedText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");
};

export default function PostEditClientUI({ initialPost, allCategories }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isNewPost = !initialPost.id;

  const [postData, setPostData] = useState(initialPost);
  const [content, setContent] = useState(initialPost.content || "");
  const [categorySearch, setCategorySearch] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // ✨✨✨ راه حل مشکل بازگشت وضعیت:
  // وقتی router.refresh() انجام می‌شود، initialPost جدید از سرور می‌آید.
  // این useEffect باعث می‌شود فرم ما با اطلاعات جدید سرور (شامل وضعیت جدید) همگام شود.
  useEffect(() => {
    setPostData(initialPost);
    setContent(initialPost.content || "");
  }, [initialPost]);

  // هندلر تغییر ورودی‌ها
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // محدودیت خلاصه
    if (name === "excerpt" && value.length > 160) return;

    setPostData((prev) => {
      const newData = { ...prev, [name]: value };

      // منطق اسلاگ: فقط اگر پست جدید است یا اسلاگ فعلی خالی است، اسلاگ را آپدیت کن
      if (name === "title") {
        if (isNewPost || !prev.slug) {
          newData.slug = generateSlug(value);
        }
      }
      return newData;
    });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setPostData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
  };

  const handleFormSubmit = (formData) => {
    formData.set("content", content);
    formData.set("excerpt", postData.excerpt || "");
    formData.set("approved", postData.approved ? "1" : "0");
    formData.set("video_link", postData.video_link || "");
    formData.set("thumbnail", postData.thumbnail || "");

    // اطمینان از ارسال وضعیت انتخاب شده در لحظه سابمیت
    formData.set("status", postData.status);

    startTransition(async () => {
      const promise = isNewPost
        ? createPost(formData)
        : updatePost(initialPost.id, formData);

      toast.promise(promise, {
        loading: "در حال ذخیره تغییرات...",
        success: (result) => {
          if (result.success) {
            if (isNewPost && result.postId) {
              // برای پست جدید ریدارکت می‌کنیم
              router.push(`/admin/posts/${result.postId}`);
            } else {
              // برای ویرایش، رفرش می‌کنیم تا اطلاعات جدید (مثل وضعیت تغییر یافته) بیاید
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
    if (!isNewPost && confirm("آیا از حذف کامل این پست مطمئن هستید؟")) {
      startTransition(async () => {
        const promise = performBulkAction("delete", [initialPost.id]);
        toast.promise(promise, {
          loading: "در حال حذف...",
          success: (result) => {
            if (result.success) {
              router.push("/admin/posts");
              return result.message;
            } else throw new Error(result.message);
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
          loading: "در حال تغییر...",
          success: (r) => {
            if (r.success) {
              router.refresh();
              return r.message;
            } else throw new Error(r.message);
          },
          error: (e) => e.message,
        });
      });
    }
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
          onSelectImage={(url) => {
            setPostData((prev) => ({ ...prev, thumbnail: url }));
            setIsMediaModalOpen(false);
          }}
        />
      )}

      {/* Header */}
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
            title={postData.approved ? "تایید شده" : "در انتظار"}
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
                  postData.approved
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  postData.approved ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span
              className={`text-sm font-semibold hidden sm:inline ${
                postData.approved
                  ? "text-green-700 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {postData.approved ? "تایید شده" : "در انتظار"}
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
              <Trash2 className="w-4 h-4" />{" "}
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
        <PostMainContent
          postData={postData}
          handleInputChange={handleInputChange}
          content={content}
          setContent={setContent}
          isNewPost={isNewPost}
          initialPostId={initialPost.id}
        />
        <PostSidebar
          postData={postData}
          handleInputChange={handleInputChange}
          isNewPost={isNewPost}
          initialPost={initialPost}
          allCategories={allCategories}
          categorySearch={categorySearch}
          setCategorySearch={setCategorySearch}
          filteredCategories={filteredCategories}
          openMediaLibrary={() => setIsMediaModalOpen(true)}
          handleCommentAction={handleCommentAction}
          isPending={isPending}
        />
      </div>
    </form>
  );
}
