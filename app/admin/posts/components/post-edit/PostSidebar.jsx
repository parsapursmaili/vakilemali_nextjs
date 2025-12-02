"use client";

import { useState, useEffect, useRef } from "react";
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
  Link as LinkIcon,
  Search,
  Loader2,
  FileText,
  CornerDownLeft,
  Globe,
} from "lucide-react";
import { searchPostsList } from "../../actions";

const imageApiLoader = ({ src }) => {
  if (src.startsWith("http")) return src;
  const relativePath = src.startsWith("/uploads/")
    ? src.substring("/uploads/".length)
    : src;
  return `/api/image/${relativePath}`;
};

function SidebarAccordion({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge = null,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isOpen ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-transparent transition-colors relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-primary dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-700 dark:text-gray-200 text-sm md:text-base">
            {title}
          </span>
          {badge && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronUp
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out origin-top ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700/50">
          <div className="pt-4">{children}</div>
        </div>
      </div>
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
  const [redirectResults, setRedirectResults] = useState([]);
  const [isSearchingRedirect, setIsSearchingRedirect] = useState(false);
  const [showRedirectDropdown, setShowRedirectDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRedirectDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRedirectChange = (e) => {
    const value = e.target.value;
    handleInputChange(e);

    if (value.length > 1) {
      setShowRedirectDropdown(true);
      setIsSearchingRedirect(true);
      const timeoutId = setTimeout(async () => {
        const result = await searchPostsList(value);
        if (result.success) {
          setRedirectResults(result.posts);
        }
        setIsSearchingRedirect(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setShowRedirectDropdown(false);
      setRedirectResults([]);
    }
  };

  const selectRedirectPost = (slug) => {
    const syntheticEvent = {
      target: {
        name: "redirect_url",
        value: slug,
      },
    };
    handleInputChange(syntheticEvent);
    setShowRedirectDropdown(false);
  };

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <SidebarAccordion
        title="تنظیمات انتشار"
        icon={Settings}
        defaultOpen={true}
      >
        <div className="space-y-5">
          <div className="relative">
            <label
              htmlFor="status"
              className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
            >
              وضعیت نمایش
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={postData.status}
                onChange={handleInputChange}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-right"
              >
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی شده</option>
              </select>
              <ChevronUp className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-180" />
            </div>
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
            >
              نامک (Slug)
            </label>
            <div className="relative group">
              <input
                type="text"
                id="slug"
                name="slug"
                value={postData.slug}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm font-mono text-left focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                dir="ltr"
                required
              />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
            </div>
          </div>

          {!isNewPost && (
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2 border border-dashed border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>آخرین ویرایش:</span>
                </div>
                <span className="font-medium font-mono">
                  {new Date(initialPost.updated_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>تعداد بازدید:</span>
                </div>
                <span className="font-medium bg-white dark:bg-gray-800 px-2 py-0.5 rounded text-primary dark:text-primary-light">
                  {initialPost.view_count.toLocaleString("fa-IR")}
                </span>
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
        <div className="relative mb-3 group">
          <input
            type="text"
            placeholder="جستجو در دسته‌بندی‌ها..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-primary/10 text-right placeholder:text-gray-400"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>

        <div className="max-h-60 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors select-none"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat.id}
                    defaultChecked={initialPost.categoryIds.includes(cat.id)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-500 rounded transition-colors checked:bg-primary checked:border-primary"
                  />
                  <Check className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="mr-3 text-sm text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </label>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <LayoutList className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs">هیچ دسته‌بندی یافت نشد</p>
            </div>
          )}
        </div>
      </SidebarAccordion>

      <SidebarAccordion
        title="تنظیمات ریدارکت"
        icon={LinkIcon}
        defaultOpen={true}
      >
        <div className="relative" ref={dropdownRef}>
          <label
            htmlFor="redirect_url"
            className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
          >
            هدف ریدارکت (مقصد)
          </label>

          <div className="relative group z-20">
            <input
              type="text"
              id="redirect_url"
              name="redirect_url"
              value={postData.redirect_url || ""}
              onChange={handleRedirectChange}
              onFocus={() => {
                if (postData.redirect_url?.length > 1)
                  setShowRedirectDropdown(true);
              }}
              placeholder="جستجوی مقاله یا درج لینک..."
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right placeholder:text-gray-400"
              autoComplete="off"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-primary transition-colors">
              {isSearchingRedirect ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CornerDownLeft className="w-4 h-4" />
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent inline-block"></span>
            نام مقاله را جستجو کنید یا لینک خارجی را کامل وارد نمایید.
          </p>

          {showRedirectDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {redirectResults.length > 0 ? (
                <ul className="max-h-[240px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
                  {redirectResults.map((post) => (
                    <li
                      key={post.id}
                      className="border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => selectRedirectPost(post.slug)}
                        className="w-full text-right px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/20 flex items-start gap-3 transition-colors group"
                      >
                        <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:text-primary group-hover:bg-white transition-colors shadow-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary transition-colors">
                            {post.title}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono truncate text-left dir-ltr opacity-70 group-hover:opacity-100">
                            /{post.slug}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                !isSearchingRedirect && (
                  <div className="px-4 py-8 flex flex-col items-center justify-center text-gray-400">
                    <Search className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-xs">
                      نتیجه‌ای برای این جستجو یافت نشد.
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </SidebarAccordion>

      <SidebarAccordion title="تصویر شاخص" icon={ImageIcon}>
        <div className="space-y-3">
          {postData.thumbnail ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <Image
                loader={imageApiLoader}
                src={postData.thumbnail}
                alt="پیش‌نمایش"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={postData.thumbnail.startsWith("http")}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={openMediaLibrary}
                  className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
                  title="تغییر تصویر"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const e = { target: { name: "thumbnail", value: "" } };
                    handleInputChange(e);
                  }}
                  className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
                  title="حذف تصویر"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openMediaLibrary}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all gap-2"
            >
              <ImageIcon className="w-8 h-8 opacity-50" />
              <span className="text-xs font-medium">انتخاب تصویر شاخص</span>
            </button>
          )}

          <div className="relative group">
            <input
              type="text"
              name="thumbnail"
              value={postData.thumbnail || ""}
              onChange={handleInputChange}
              placeholder="لینک مستقیم تصویر (اختیاری)"
              className="w-full bg-gray-50 dark:bg-gray-900 border-none text-xs text-gray-500 py-2 pl-10 pr-3 rounded focus:ring-1 focus:ring-primary/20 text-left dir-ltr"
              dir="ltr"
            />
            <LinkIcon className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
        </div>
      </SidebarAccordion>

      {!isNewPost && (
        <SidebarAccordion
          title="دیدگاه‌ها"
          icon={MessageSquare}
          badge={
            initialPost.comments.length > 0 ? initialPost.comments.length : null
          }
        >
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {initialPost.comments.length > 0 ? (
              initialPost.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="group p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                        {comment.author_name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString(
                          "fa-IR"
                        )}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                        comment.status === "approved"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : comment.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {comment.status === "approved"
                        ? "تایید شده"
                        : comment.status === "pending"
                        ? "در انتظار"
                        : "اسپم"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {comment.status !== "approved" && (
                      <button
                        disabled={isPending}
                        onClick={() =>
                          handleCommentAction(comment.id, "approved")
                        }
                        className="text-green-600 p-1.5 hover:bg-green-100 rounded-md transition-colors"
                        title="تایید"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {comment.status !== "spam" && (
                      <button
                        disabled={isPending}
                        onClick={() => handleCommentAction(comment.id, "spam")}
                        className="text-red-500 p-1.5 hover:bg-red-100 rounded-md transition-colors"
                        title="اسپم"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">هنوز دیدگاهی ثبت نشده است.</p>
              </div>
            )}
          </div>
        </SidebarAccordion>
      )}
    </div>
  );
}
