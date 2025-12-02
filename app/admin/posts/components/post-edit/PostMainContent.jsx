"use client";

import { Check, Copy, ExternalLink, Library, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function PostMainContent({
  postData,
  handleInputChange,
  content,
  setContent,
  isNewPost,
  initialPostId,
}) {
  const [isCopied, setIsCopied] = useState(false);
  const MAX_EXCERPT_LENGTH = 160;

  const handleCopyLink = () => {
    const link = `https://vakilemali.com/?p=${initialPostId}`;
    navigator.clipboard.writeText(link).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      },
      (err) => toast.error("خطا در کپی کردن لینک!")
    );
  };

  return (
    <div className="col-span-12 lg:col-span-8 space-y-6">
      {/* Title */}
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
        <div className="mt-1 text-xs text-gray-500 flex justify-end">
          <span>{postData.title?.length || 0} کاراکتر</span>
        </div>
      </div>

      {/* Shortlink (Existing Posts Only) */}
      {!isNewPost && (
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              لینک کوتاه:
            </span>
            <code className="text-primary-light dark:text-sky-400 truncate">
              {`https://vakilemali.com/?p=${initialPostId}`}
            </code>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              title="کپی لینک کوتاه"
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 transition-colors"
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
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        <label htmlFor="content" className="text-sm font-medium mb-1 block">
          محتوای اصلی (HTML خام)
        </label>
        <textarea
          id="content"
          name="content"
          rows="20"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-sm p-4 h-[500px] !direction-ltr !text-left font-mono"
          placeholder="کد HTML محتوای اصلی پست را اینجا وارد کنید..."
          required
        ></textarea>
      </div>

      {/* Video Content */}
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
          placeholder="کد embed ویدئو..."
        ></textarea>
      </div>

      {/* Excerpt */}
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
          placeholder="یک خلاصه کوتاه..."
          maxLength={MAX_EXCERPT_LENGTH}
        ></textarea>
        <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-2">
          {postData.excerpt?.length || 0} / {MAX_EXCERPT_LENGTH}
        </p>
      </div>
    </div>
  );
}
