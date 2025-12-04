"use client";

import { useState, useTransition, Fragment } from "react";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Zap,
  Eye,
  ListFilter,
  BarChart,
  Layers,
} from "lucide-react";
import QuickEditForm from "./QuickEditForm";

const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-emerald-600 text-white shadow-emerald-200",
    draft: "bg-amber-500 text-white shadow-amber-200",
    archived: "bg-slate-500 text-white shadow-slate-200",
  };
  const labels = {
    published: "منتشر شده",
    draft: "پیش‌نویس",
    archived: "بایگانی",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${
        styles[status] || styles.draft
      }`}
    >
      {labels[status] || "نامشخص"}
    </span>
  );
};

function MobilePostCard({ post, selected, onSelect, onQuickEdit, onDelete }) {
  return (
    <div
      className={`relative bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden ${
        selected
          ? "border-blue-500 shadow-md bg-blue-50/30"
          : "border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-4 border-b border-gray-100 flex items-start gap-3">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(post.id)}
            className="w-6 h-6 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/admin/posts/${post.id}`}
            className="block text-lg font-extrabold text-gray-900 leading-snug mb-1 hover:text-blue-600"
          >
            {post.title}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={post.status} />
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {new Date(post.created_at).toLocaleDateString("fa-IR")}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50/50 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <BarChart className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-gray-800">
            {post.view_count.toLocaleString("fa-IR")}
          </span>
          <span className="text-xs">بازدید</span>
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px] font-medium">
            {post.categories ? post.categories : "بدون دسته‌بندی"}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-x-reverse divide-gray-200 border-t border-gray-200">
        <button
          onClick={() => onQuickEdit(post.id)}
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-amber-50 text-amber-700 transition-colors font-bold text-xs gap-1"
        >
          <Zap className="w-5 h-5" />
          سریع
        </button>
        <Link
          href={`/admin/posts/${post.id}`}
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-blue-50 text-blue-700 transition-colors font-bold text-xs gap-1"
        >
          <Edit className="w-5 h-5" />
          ویرایش
        </Link>
        <Link
          href={`/${post.slug}`}
          target="_blank"
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-emerald-50 text-emerald-700 transition-colors font-bold text-xs gap-1"
        >
          <Eye className="w-5 h-5" />
          مشاهده
        </Link>
        <button
          onClick={onDelete}
          className="flex flex-col items-center justify-center py-3 bg-white hover:bg-red-50 text-red-600 transition-colors font-bold text-xs gap-1"
        >
          <Trash2 className="w-5 h-5" />
          حذف
        </button>
      </div>
    </div>
  );
}

export default function PostsList({
  posts,
  performBulkAction,
  quickEditAction,
  allCategories,
}) {
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectAll = (e) =>
    setSelectedPostIds(e.target.checked ? posts.map((p) => p.id) : []);
  const handleSelectOne = (id) =>
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );

  const handleBulkAction = (e) => {
    const action = e.target.value;
    if (!action) return;
    if (selectedPostIds.length === 0) {
      alert("لطفاً حداقل یک آیتم را انتخاب کنید.");
      e.target.value = "";
      return;
    }
    if (
      confirm(
        `آیا از انجام عملیات روی ${selectedPostIds.length} مورد اطمینان دارید؟`
      )
    ) {
      startTransition(async () => {
        const result = await performBulkAction(action, selectedPostIds);
        if (result.success) setSelectedPostIds([]);
      });
    }
    e.target.value = "";
  };

  const handleQuickEditSubmit = (formData) => {
    startTransition(async () => {
      const result = await quickEditAction(formData);
      if (result.success) setEditingPostId(null);
    });
  };

  const isAllSelected =
    posts.length > 0 && selectedPostIds.length === posts.length;

  return (
    <div className="w-full space-y-6">
      {/* نوار ابزار عملیات گروهی */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            {/* آیکون به سمت چپ منتقل شد */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ListFilter className="w-5 h-5 text-gray-400" />
            </div>
            {/* پدینگ راست و چپ برای جلوگیری از تداخل متن و آیکون تنظیم شد */}
            <select
              onChange={handleBulkAction}
              disabled={selectedPostIds.length === 0 || isPending}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-lg focus:ring-0 focus:border-blue-500 disabled:opacity-50 cursor-pointer appearance-none transition-colors"
            >
              <option value="">انتخاب عملیات گروهی...</option>
              <option value="published">تغییر وضعیت: منتشر شده</option>
              <option value="draft">تغییر وضعیت: پیش‌نویس</option>
              <option value="archived">تغییر وضعیت: بایگانی</option>
              <option value="delete">حذف موارد انتخاب شده</option>
            </select>
          </div>
          {selectedPostIds.length > 0 && (
            <div className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold animate-in zoom-in">
              <span className="ml-1">{selectedPostIds.length}</span>انتخاب شده
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 font-medium hidden sm:block">
          نمایش {posts.length} نتیجه
        </div>
      </div>

      {/* لیست موبایل */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex items-center justify-between px-2">
          <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-gray-700">انتخاب همه</span>
          </label>
        </div>
        {posts.map((post) => (
          <Fragment key={post.id}>
            {editingPostId === post.id ? (
              <QuickEditForm
                post={post}
                categories={allCategories}
                onCancel={() => setEditingPostId(null)}
                action={handleQuickEditSubmit}
                isPending={isPending}
              />
            ) : (
              <MobilePostCard
                post={post}
                selected={selectedPostIds.includes(post.id)}
                onSelect={handleSelectOne}
                onQuickEdit={setEditingPostId}
                onDelete={() => {
                  if (confirm("حذف شود؟"))
                    startTransition(() =>
                      performBulkAction("delete", [post.id])
                    );
                }}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* جدول دسکتاپ */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="w-12 p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600">
                عنوان و مشخصات
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600 w-40 text-center">
                وضعیت
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600 w-64">
                دسته‌بندی‌ها
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600 w-32 text-center">
                آمار
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600 w-40">
                تاریخ
              </th>
              <th className="px-6 py-4 text-sm font-extrabold text-gray-600 w-48 text-left">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <Fragment key={post.id}>
                {editingPostId === post.id ? (
                  <tr>
                    <td colSpan="7" className="p-0">
                      <QuickEditForm
                        post={post}
                        categories={allCategories}
                        onCancel={() => setEditingPostId(null)}
                        action={handleQuickEditSubmit}
                        isPending={isPending}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr
                    className={`group transition-all hover:bg-gray-50 ${
                      selectedPostIds.includes(post.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={() => handleSelectOne(post.id)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-base font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1 truncate dir-ltr text-right font-sans">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {post.categories ? (
                          post.categories
                            .split(", ")
                            .slice(0, 3)
                            .map((cat, i) => (
                              <span
                                key={i}
                                className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                              >
                                {cat}
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            بدون دسته
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {post.view_count.toLocaleString("fa-IR")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-600">
                        {new Date(post.created_at).toLocaleDateString("fa-IR")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-100">
                        <button
                          onClick={() => setEditingPostId(post.id)}
                          className="p-2 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                          title="ویرایش سریع"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200"
                          title="نمایش"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                          title="ویرایش کامل"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("آیا مطمئن هستید؟"))
                              startTransition(() =>
                                performBulkAction("delete", [post.id])
                              );
                          }}
                          className="p-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {posts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">
            هیچ داده‌ای برای نمایش وجود ندارد.
          </p>
        </div>
      )}
    </div>
  );
}
