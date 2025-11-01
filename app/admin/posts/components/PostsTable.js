"use client";

import { useState, useTransition, Fragment } from "react";
import Link from "next/link";
import { Edit, Trash2, Zap, Eye, Tag, Calendar, BarChart2 } from "lucide-react";

// کامپوننت ردیف ویرایش سریع (بدون تغییر)
function QuickEditRow({ post, categories, onCancel, action, isPending }) {
  const postCategoryIds = post.categories
    ? post.categories
        .split(", ")
        .map((catName) => categories.find((c) => c.name === catName)?.id)
        .filter(Boolean)
    : [];
  return (
    <tr className="bg-blue-50 dark:bg-gray-700/50">
      <td colSpan="5" className="p-4">
        <h4 className="font-bold mb-4 text-lg text-gray-800 dark:text-gray-200">
          <Zap className="inline-block w-5 h-5 mr-2 text-yellow-500" /> ویرایش
          سریع: {post.title}
        </h4>
        <form action={action}>
          <input type="hidden" name="postId" value={post.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <label
                htmlFor={`title-${post.id}`}
                className="block text-sm font-medium mb-1"
              >
                عنوان
              </label>
              <input
                type="text"
                id={`title-${post.id}`}
                name="title"
                defaultValue={post.title}
                className="w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor={`slug-${post.id}`}
                className="block text-sm font-medium mb-1"
              >
                نامک (Slug)
              </label>
              <input
                type="text"
                id={`slug-${post.id}`}
                name="slug"
                defaultValue={post.slug}
                className="w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor={`status-${post.id}`}
                className="block text-sm font-medium mb-1"
              >
                وضعیت
              </label>
              <select
                id={`status-${post.id}`}
                name="status"
                defaultValue={post.status}
                className="w-full"
              >
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی شده</option>
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium mb-1">
                دسته‌بندی‌ها
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 border rounded-md max-h-32 overflow-y-auto bg-white dark:bg-gray-800">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat-quick-${post.id}-${cat.id}`}
                      name="categories"
                      value={cat.id}
                      defaultChecked={postCategoryIds.includes(cat.id)}
                      className="!w-auto mr-2"
                    />
                    <label
                      htmlFor={`cat-quick-${post.id}-${cat.id}`}
                      className="text-sm"
                    >
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button
              type="submit"
              className="button-primary"
              disabled={isPending}
            >
              {isPending ? "در حال ذخیره..." : "به‌روزرسانی نوشته"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              لغو
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

// کامپوننت اصلی جدول
export default function PostsTable({
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
    if (action && selectedPostIds.length > 0) {
      if (
        confirm(
          `آیا مطمئن هستید که می‌خواهید عملیات '${action}' را روی ${selectedPostIds.length} مورد انجام دهید؟`
        )
      ) {
        startTransition(async () => {
          const result = await performBulkAction(action, selectedPostIds);
          alert(result.message);
          if (result.success) setSelectedPostIds([]);
        });
      }
    }
    e.target.value = "";
  };

  const handleQuickEditSubmit = (formData) => {
    startTransition(async () => {
      const result = await quickEditAction(formData);
      alert(result.message);
      if (result.success) setEditingPostId(null);
    });
  };

  const isAllSelected =
    selectedPostIds.length === posts.length && posts.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            onChange={handleBulkAction}
            disabled={selectedPostIds.length === 0 || isPending}
            className="input-base"
          >
            <option value="">عملیات گروهی</option>
            <option value="published">منتشر کردن</option>
            <option value="draft">پیش‌نویس کردن</option>
            <option value="archived">بایگانی کردن</option>
            <option value="delete">حذف</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">
          {selectedPostIds.length} مورد انتخاب شده
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllSelected}
                  className="!w-auto"
                />
              </th>
              <th scope="col" className="px-6 py-3">
                عنوان
              </th>
              <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                دسته‌بندی‌ها
              </th>
              <th scope="col" className="px-6 py-3">
                وضعیت / تاریخ
              </th>
              <th scope="col" className="px-6 py-3 text-left">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <Fragment key={post.id}>
                {editingPostId === post.id ? (
                  <QuickEditRow
                    post={post}
                    categories={allCategories}
                    onCancel={() => setEditingPostId(null)}
                    action={handleQuickEditSubmit}
                    isPending={isPending}
                  />
                ) : (
                  <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 group">
                    <td className="w-4 p-4">
                      <input
                        type="checkbox"
                        checked={selectedPostIds.includes(post.id)}
                        onChange={() => handleSelectOne(post.id)}
                        className="!w-auto"
                      />
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs font-normal text-gray-500 mt-1 flex items-center gap-2">
                        <BarChart2 className="w-3 h-3" /> {post.view_count}{" "}
                        بازدید
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Tag className="w-4 h-4" />
                        <span>{post.categories || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs rounded-full self-start font-semibold ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : post.status === "archived"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status === "published"
                            ? "منتشر"
                            : post.status === "draft"
                            ? "پیش‌نویس"
                            : "بایگانی"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />{" "}
                          {new Date(post.created_at).toLocaleDateString(
                            "fa-IR"
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingPostId(post.id)}
                          title="ویرایش سریع"
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Zap className="w-4 h-4 text-yellow-500" />
                        </button>
                        <Link
                          href={`/${post.slug}`}
                          target="_blank"
                          title="مشاهده پست"
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          title="ویرایش کامل"
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 text-green-600" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("آیا از حذف این پست مطمئن هستید؟")) {
                              startTransition(async () => {
                                await performBulkAction("delete", [post.id]);
                                alert("پست حذف شد.");
                              });
                            }
                          }}
                          title="حذف"
                          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
    </div>
  );
}
