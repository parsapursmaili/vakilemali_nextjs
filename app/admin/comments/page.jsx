"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trash2,
  CheckCircle,
  Clock,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Filter,
  LayoutList,
} from "lucide-react";
import { getComments, updateCommentsStatus, deleteComments } from "./actions";
import {
  DesktopCommentRow,
  MobileCommentCard,
  EditCommentModal,
  ReplyCommentModal,
} from "./components";

// ساختار درختی
function nestComments(flatComments) {
  const commentMap = {};
  const nested = [];
  flatComments.forEach((c) => (commentMap[c.id] = { ...c, children: [] }));
  flatComments.forEach((c) => {
    if (c.parent_id && commentMap[c.parent_id]) {
      commentMap[c.parent_id].children.push(commentMap[c.id]);
    } else if (!c.parent_id) {
      nested.push(commentMap[c.id]);
    }
  });
  return nested;
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState([]); // لیست فلت برای محاسبات ایندکس
  const [nestedData, setNestedData] = useState([]);
  const [total, setTotal] = useState(0);

  // وضعیت انتخاب
  const [selected, setSelected] = useState([]);
  const [lastSelectedId, setLastSelectedId] = useState(null); // برای شیفت کلیک

  const [editTarget, setEditTarget] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page")) || 1;

  const fetchData = () => {
    startTransition(async () => {
      const { comments: data, totalComments } = await getComments({
        filterStatus: statusFilter,
        page,
      });
      setComments(data);
      setNestedData(nestComments(data));
      setTotal(totalComments);
      setSelected([]);
      setLastSelectedId(null);
    });
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, page]);

  // --- هندل کردن انتخاب با پشتیبانی از Shift ---
  const handleSelect = (id, event) => {
    // اگر فقط چک باکس کلیک شده (بدون شیفت)
    if (!event?.nativeEvent?.shiftKey) {
      setSelected((prev) => {
        if (prev.includes(id)) return prev.filter((item) => item !== id);
        return [...prev, id];
      });
      setLastSelectedId(id);
      return;
    }

    // اگر شیفت نگه داشته شده و قبلاً چیزی انتخاب شده
    if (lastSelectedId && comments.some((c) => c.id === lastSelectedId)) {
      const lastIndex = comments.findIndex((c) => c.id === lastSelectedId);
      const currentIndex = comments.findIndex((c) => c.id === id);

      if (lastIndex === -1 || currentIndex === -1) return;

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      // گرفتن همه ID های بین بازه
      const rangeIds = comments.slice(start, end + 1).map((c) => c.id);

      // اضافه کردن به انتخاب‌های قبلی (یونیک)
      setSelected((prev) => [...new Set([...prev, ...rangeIds])]);
    } else {
      // حالت فال‌بک اگر lastSelectedId نبود
      setSelected([id]);
      setLastSelectedId(id);
    }
  };

  const handleBulkAction = (action, ids = selected) => {
    if (!ids.length) return;
    if (
      action === "delete" &&
      !confirm(`آیا از حذف ${ids.length} نظر اطمینان دارید؟`)
    )
      return;

    startTransition(async () => {
      const res =
        action === "delete"
          ? await deleteComments(ids)
          : await updateCommentsStatus(ids, action);

      if (res.success) {
        fetchData();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50 text-zinc-800 font-sans">
      {replyTarget && (
        <ReplyCommentModal
          parentComment={replyTarget}
          onClose={() => setReplyTarget(null)}
          onReplySuccess={fetchData}
        />
      )}
      {editTarget && (
        <EditCommentModal
          comment={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={fetchData}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-3">
              <LayoutList className="w-8 h-8 text-blue-600" />
              مدیریت نظرات
            </h1>
            <p className="text-zinc-500 mt-2 text-sm font-medium">
              مدیریت و پاسخ‌دهی به نظرات کاربران
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm text-sm font-medium flex items-center gap-2">
            <span className="text-zinc-500">تعداد کل:</span>
            <span className="text-blue-600 font-bold text-lg">{total}</span>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
          {/* نوار ابزار */}
          <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-20">
            {selected.length > 0 ? (
              <div className="w-full flex items-center justify-between bg-blue-50 text-blue-900 px-4 py-3 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelected([])}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-sm">
                    {selected.length} مورد انتخاب شده
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("approved")}
                    className="btn-icon text-emerald-600 hover:bg-white p-2 rounded-lg transition shadow-sm"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleBulkAction("pending")}
                    className="btn-icon text-amber-600 hover:bg-white p-2 rounded-lg transition shadow-sm"
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleBulkAction("spam")}
                    className="btn-icon text-rose-600 hover:bg-white p-2 rounded-lg transition shadow-sm"
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </button>
                  <div className="w-px h-6 bg-blue-200 mx-2 self-center"></div>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="btn-icon text-red-600 hover:bg-white p-2 rounded-lg transition shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-between items-center">
                <div className="text-sm font-bold text-zinc-500 mr-2">
                  فیلتر نمایش:
                </div>
                <div className="relative group w-48 sm:w-56">
                  {/* رفع مشکل افتادن آیکون روی متن با تنظیم پدینگ چپ و راست */}
                  <select
                    value={statusFilter}
                    onChange={(e) => router.push(`?status=${e.target.value}`)}
                    className="appearance-none w-full bg-zinc-50 border border-zinc-200 hover:border-blue-400 text-sm font-medium rounded-xl py-2.5 pl-10 pr-4 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer text-zinc-700"
                  >
                    <option value="all">همه نظرات</option>
                    <option value="pending">در انتظار تایید</option>
                    <option value="approved">تایید شده</option>
                    <option value="spam">اسپم</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-blue-500 transition-colors">
                    <Filter className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* جدول دسکتاپ */}
          <div className="hidden md:block overflow-x-auto min-h-[500px]">
            <table className="w-full text-sm text-right">
              <thead className="bg-zinc-50/80 text-zinc-500 font-semibold border-b border-zinc-100 backdrop-blur">
                <tr>
                  <th className="p-5 w-14 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      onChange={(e) => {
                        const allIds = comments.map((c) => c.id);
                        setSelected(e.target.checked ? allIds : []);
                        setLastSelectedId(null);
                      }}
                      checked={
                        comments.length > 0 &&
                        selected.length === comments.length
                      }
                    />
                  </th>
                  <th className="p-5">کاربر</th>
                  <th className="p-5">دیدگاه</th>
                  <th className="p-5">مطلب</th>
                  <th className="p-5">وضعیت</th>
                  <th className="p-5 w-32">عملیات</th>
                </tr>
              </thead>
              <tbody
                className={
                  isPending
                    ? "opacity-50 grayscale transition-all duration-300"
                    : ""
                }
              >
                {nestedData.length === 0 && !isPending ? (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 text-zinc-400">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                          <LayoutList className="w-10 h-10 opacity-50" />
                        </div>
                        <p className="font-medium">
                          هیچ نظری با این مشخصات یافت نشد.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  nestedData.map((c) => (
                    <DesktopCommentRow
                      key={c.id}
                      comment={c}
                      selected={selected.includes(c.id)}
                      onSelect={handleSelect} // استفاده از تابع جدید هندل سلکت
                      onEdit={setEditTarget}
                      onReply={setReplyTarget}
                      onDelete={(id) => handleBulkAction("delete", [id])}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* لیست موبایل */}
          <div className="md:hidden">
            {comments.map((c) => (
              <MobileCommentCard
                key={c.id}
                comment={c}
                selected={selected.includes(c.id)}
                onSelect={(id) => handleSelect(id)} // برای موبایل معمولاً شیفت نداریم ولی ساختار حفظ شود
                onEdit={setEditTarget}
                onReply={setReplyTarget}
                onDelete={(id) => handleBulkAction("delete", [id])}
                isSelectionActive={selected.length > 0}
              />
            ))}
          </div>

          {/* صفحه‌بندی */}
          {total > 0 && (
            <div className="flex items-center justify-between p-5 border-t border-zinc-100 bg-zinc-50/50">
              <div className="text-xs font-medium text-zinc-500">
                صفحه{" "}
                <span className="text-zinc-900 font-bold text-sm mx-1">
                  {page}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`?page=${page - 1}${
                    statusFilter !== "all" ? `&status=${statusFilter}` : ""
                  }`}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    page <= 1
                      ? "pointer-events-none opacity-50 bg-zinc-100 text-zinc-400 border-zinc-200"
                      : "bg-white hover:bg-white hover:shadow-md hover:-translate-y-0.5 border-zinc-200 text-zinc-700"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" /> قبلی
                </Link>
                <Link
                  href={`?page=${page + 1}${
                    statusFilter !== "all" ? `&status=${statusFilter}` : ""
                  }`}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    comments.length < 50
                      ? "pointer-events-none opacity-50 bg-zinc-100 text-zinc-400 border-zinc-200"
                      : "bg-white hover:bg-white hover:shadow-md hover:-translate-y-0.5 border-zinc-200 text-zinc-700"
                  }`}
                >
                  بعدی <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
