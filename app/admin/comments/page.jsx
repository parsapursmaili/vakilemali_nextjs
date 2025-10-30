"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Edit,
} from "lucide-react";
import {
  getComments,
  updateCommentsStatus,
  deleteComments,
  updateCommentDetails,
} from "./actions";

const COMMENTS_PER_PAGE = 50;

// =================================================================================
// کامپوننت‌های کمکی
// =================================================================================

function StatusBadge({ status }) {
  const config = {
    approved: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: "تایید شده",
      color:
        "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900",
    },
    pending: {
      icon: <Clock className="w-4 h-4" />,
      text: "در انتظار",
      color:
        "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900",
    },
    spam: {
      icon: <AlertTriangle className="w-4 h-4" />,
      text: "اسپم",
      color: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900",
    },
  }[status] || {
    icon: <Clock className="w-4 h-4" />,
    text: "در انتظار",
    color: "text-yellow-800 bg-yellow-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
}

function EditCommentModal({ comment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    author_name: comment.author_name,
    author_email: comment.author_email || "",
    content: comment.content,
  });
  const [isPending, startTransition] = useTransition();
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateCommentDetails(comment.id, formData);
      if (result.success) {
        onSave({ ...comment, ...formData });
        onClose();
      } else {
        alert(result.error || "خطایی رخ داد.");
      }
    });
  };
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-2xl border border-muted/30"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-muted/30">
          <h2 className="text-xl font-bold text-primary">ویرایش نظر</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted/50"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="author_name"
                  className="block text-sm font-medium mb-1"
                >
                  نام نویسنده
                </label>
                <input
                  type="text"
                  id="author_name"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="author_email"
                  className="block text-sm font-medium mb-1"
                >
                  ایمیل (اختیاری)
                </label>
                <input
                  type="email"
                  id="author_email"
                  name="author_email"
                  value={formData.author_email}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
                متن نظر
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="input"
                required
              ></textarea>
            </div>
          </div>
          <footer className="flex items-center justify-end gap-3 p-4 bg-muted/50 dark:bg-muted/20 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-semibold border hover:bg-muted"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-primary hover:bg-primary-light disabled:opacity-60"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Pagination({ totalItems, itemsPerPage, currentPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `/admin/comments?${params.toString()}`;
  };
  return (
    <nav className="flex items-center justify-center gap-4 p-4 border-t border-muted/30">
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
          currentPage === 1
            ? "text-muted-foreground bg-muted/50 pointer-events-none"
            : "hover:bg-muted"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
        <span>قبلی</span>
      </Link>
      <span className="text-sm text-foreground/80">
        صفحه <strong className="font-bold text-primary">{currentPage}</strong>{" "}
        از <strong className="font-bold">{totalPages}</strong>
      </span>
      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
          currentPage === totalPages
            ? "text-muted-foreground bg-muted/50 pointer-events-none"
            : "hover:bg-muted"
        }`}
      >
        <span>بعدی</span>
        <ChevronLeft className="w-4 h-4" />
      </Link>
    </nav>
  );
}

function DesktopView({
  comments,
  selectedComments,
  onSelectComment,
  onEditComment,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-muted/50 dark:bg-muted/20">
          <tr>
            <th className="p-4 w-12"></th>
            <th className="p-4">نویسنده</th>
            <th className="p-4">متن نظر</th>
            <th className="p-4">در پاسخ به</th>
            <th className="p-4">وضعیت</th>
            <th className="p-4">تاریخ</th>
            <th className="p-4">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr
              key={comment.id}
              className={`border-b border-muted/30 transition-colors ${
                selectedComments.includes(comment.id)
                  ? "bg-primary/10"
                  : "hover:bg-muted/40"
              }`}
            >
              <td className="p-4">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary/50"
                  checked={selectedComments.includes(comment.id)}
                  onChange={(e) => onSelectComment(comment.id, e)}
                />
              </td>
              <td className="p-4 align-top">
                <div className="font-bold">{comment.author_name}</div>
                {comment.author_email && (
                  <div className="text-xs text-foreground/70 mt-1">
                    {comment.author_email}
                  </div>
                )}
              </td>
              <td className="p-4 align-top max-w-sm">
                <p className="leading-relaxed">{comment.content}</p>
              </td>
              <td className="p-4 align-top">
                <Link
                  href={`/${comment.post_slug}`}
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  {comment.post_title}
                </Link>
              </td>
              <td className="p-4 align-top">
                <StatusBadge status={comment.status} />
              </td>
              <td className="p-4 align-top text-xs whitespace-nowrap">
                {new Date(comment.created_at).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="p-4 align-top">
                <button
                  onClick={() => onEditComment(comment)}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCommentCard({
  comment,
  isSelected,
  onSelect,
  onEdit,
  isSelectionActive,
  onActivateSelection,
  onSingleAction,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pressTimer = useRef();
  const handlePressStart = () => {
    if (!isSelectionActive)
      pressTimer.current = setTimeout(
        () => onActivateSelection(comment.id),
        500
      );
  };
  const handlePressEnd = () => clearTimeout(pressTimer.current);
  const handleClick = () => {
    if (isSelectionActive) onSelect(comment.id);
  };
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    onSingleAction(action, [comment.id]);
    setIsMenuOpen(false);
  };
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(comment);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`relative p-4 border-b border-muted/30 transition-colors ${
        isSelected ? "bg-primary/10" : "bg-transparent"
      }`}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onContextMenu={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {isSelectionActive && (
          <div className="mt-1">
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center border-2 ${
                isSelected ? "bg-primary border-primary" : "border-muted"
              }`}
            >
              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-foreground">{comment.author_name}</p>
              {comment.author_email && (
                <p className="text-xs text-foreground/70">
                  {comment.author_email}
                </p>
              )}
            </div>
            {!isSelectionActive && (
              <div className="relative">
                <button
                  onClick={handleMenuClick}
                  className="p-2 -mr-2 rounded-full hover:bg-muted"
                >
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
                {isMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl border border-muted/30 z-10">
                    <button
                      onClick={handleEditClick}
                      className="w-full text-right flex items-center gap-3 px-4 py-2 hover:bg-muted/50"
                    >
                      <Edit className="w-4 h-4" /> ویرایش
                    </button>
                    <hr className="dark:border-muted/30" />
                    <button
                      onClick={(e) => handleActionClick(e, "approved")}
                      className="w-full text-right flex items-center gap-3 px-4 py-2 hover:bg-muted/50"
                    >
                      <ShieldCheck className="w-4 h-4 text-green-500" /> تایید
                      کردن
                    </button>
                    <button
                      onClick={(e) => handleActionClick(e, "spam")}
                      className="w-full text-right flex items-center gap-3 px-4 py-2 hover:bg-muted/50"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500" /> اسپم
                    </button>
                    <hr className="dark:border-muted/30" />
                    <button
                      onClick={(e) => handleActionClick(e, "delete")}
                      className="w-full text-right flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" /> حذف
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="my-3 text-foreground/90 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center justify-between text-xs">
            <Link
              href={`/${comment.post_slug}`}
              className="text-primary hover:underline truncate max-w-[150px]"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
            >
              {comment.post_title}
            </Link>
            <StatusBadge status={comment.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileView({ comments, ...props }) {
  return (
    <div>
      {comments.map((comment) => (
        <MobileCommentCard key={comment.id} comment={comment} {...props} />
      ))}
    </div>
  );
}

// =================================================================================
// کامپوننت اصلی و نهایی صفحه
// =================================================================================
export default function CommentsAdminPage() {
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [selectedComments, setSelectedComments] = useState([]);
  const [lastSelectedId, setLastSelectedId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [isPending, startTransition] = useTransition();
  const selectAllCheckboxRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatusFilter = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;

  const isSelectionActive = selectedComments.length > 0;

  useEffect(() => {
    startTransition(async () => {
      const { comments: fc, totalComments: ft } = await getComments({
        filterStatus: currentStatusFilter,
        page: currentPage,
      });
      setComments(fc);
      setTotalComments(ft);
      setSelectedComments([]);
      setLastSelectedId(null);
      window.scrollTo(0, 0);
    });
  }, [currentStatusFilter, currentPage]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        isSelectionActive && selectedComments.length < comments.length;
    }
  }, [selectedComments, comments, isSelectionActive]);

  const handleSelectComment = (clickedId, event) => {
    if (event?.nativeEvent.shiftKey && lastSelectedId) {
      const lastIndex = comments.findIndex((c) => c.id === lastSelectedId);
      const currentIndex = comments.findIndex((c) => c.id === clickedId);
      if (lastIndex === -1 || currentIndex === -1) return;
      const from = Math.min(lastIndex, currentIndex);
      const to = Math.max(lastIndex, currentIndex);
      const rangeIds = comments.slice(from, to + 1).map((c) => c.id);
      setSelectedComments((prev) => [...new Set([...prev, ...rangeIds])]);
    } else {
      setSelectedComments((prev) =>
        prev.includes(clickedId)
          ? prev.filter((id) => id !== clickedId)
          : [...prev, clickedId]
      );
    }
    setLastSelectedId(clickedId);
  };

  const handleSelectAll = (e) =>
    setSelectedComments(e.target.checked ? comments.map((c) => c.id) : []);
  const handleFilterChange = (e) =>
    router.push(`/admin/comments?status=${e.target.value}`);

  const handleBulkAction = (action, commentIds = selectedComments) => {
    if (commentIds.length === 0) return;

    startTransition(async () => {
      let result;
      if (action === "delete") {
        if (!confirm(`آیا از حذف ${commentIds.length} کامنت مطمئن هستید؟`))
          return;
        result = await deleteComments(commentIds);
        if (result.success) {
          // **FIX:** به‌روزرسانی فوری لیست کامنت‌ها و تعداد کل
          setComments((prev) => prev.filter((c) => !commentIds.includes(c.id)));
          setTotalComments((prev) => prev - result.affectedRows);
        }
      } else {
        result = await updateCommentsStatus(commentIds, action);
        if (result.success) {
          // **FIX:** به‌روزرسانی فوری وضعیت کامنت‌ها در لیست
          setComments((prev) =>
            prev.map((c) =>
              commentIds.includes(c.id) ? { ...c, status: action } : c
            )
          );
        }
      }

      if (result.success) {
        setSelectedComments([]); // پاک کردن انتخاب‌ها پس از عملیات موفق
      } else {
        alert(result.error || "خطایی در انجام عملیات رخ داد.");
      }
    });
  };

  const handleSaveEdit = (updatedComment) =>
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );

  return (
    <>
      {editingComment && (
        <EditCommentModal
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSave={handleSaveEdit}
        />
      )}
      <div className="p-0 sm:p-6 md:p-8 bg-background text-foreground min-h-screen">
        <header className="mb-8 px-4 sm:px-0 pt-4 sm:pt-0">
          <h1 className="text-3xl font-bold text-primary">مدیریت نظرات</h1>
          <p className="text-muted-foreground mt-2">
            مجموعاً{" "}
            <span className="font-bold text-foreground">{totalComments}</span>{" "}
            نظر یافت شد.
          </p>
        </header>
        <div className="bg-white dark:bg-[#1a1a1a] sm:rounded-xl shadow-lg border-y sm:border border-muted/30 overflow-hidden">
          <div className="p-4 border-b border-muted/30 flex items-center justify-between gap-4 h-auto md:h-[68px] flex-wrap">
            {isSelectionActive ? (
              <div className="w-full flex justify-between items-center">
                <button
                  onClick={() => setSelectedComments([])}
                  className="flex items-center gap-2 text-sm font-semibold text-primary p-2 -ml-2 rounded-md hover:bg-muted/50"
                >
                  <X className="w-5 h-5" />
                  <span>لغو</span>
                </button>
                <span className="font-bold text-primary">
                  {selectedComments.length} مورد انتخاب شد
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3">
                  <input
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    className="form-checkbox h-5 w-5"
                    onChange={handleSelectAll}
                    checked={
                      comments.length > 0 &&
                      selectedComments.length === comments.length
                    }
                  />
                  <span>انتخاب همه</span>
                </div>
                <div className="relative">
                  <select
                    value={currentStatusFilter}
                    onChange={handleFilterChange}
                    className="min-w-[160px] appearance-none cursor-pointer bg-transparent rounded-lg border border-muted/50 py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="pending">در انتظار</option>
                    <option value="approved">تایید شده</option>
                    <option value="spam">اسپم</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}
          </div>
          {isSelectionActive && (
            <div className="p-4 border-b border-muted/30 flex flex-wrap items-center justify-center gap-2 bg-primary/5">
              <button
                onClick={() => handleBulkAction("approved")}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 text-green-600" /> تایید
              </button>
              <button
                onClick={() => handleBulkAction("pending")}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
              >
                <Clock className="w-4 h-4 text-yellow-600" /> انتظار
              </button>
              <button
                onClick={() => handleBulkAction("spam")}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4 text-orange-600" /> اسپم
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-500/10 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          )}
          <div
            className={`min-h-[400px] transition-opacity duration-300 ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
          >
            <div className="hidden md:block">
              <DesktopView
                comments={comments}
                selectedComments={selectedComments}
                onSelectComment={handleSelectComment}
                onEditComment={setEditingComment}
              />
            </div>
            <div className="md:hidden">
              <MobileView
                comments={comments}
                selectedComments={selectedComments}
                onSelect={handleSelectComment}
                onEdit={setEditingComment}
                onSingleAction={handleBulkAction}
                isSelectionActive={isSelectionActive}
                onActivateSelection={(id) => setSelectedComments([id])}
              />
            </div>
            {comments.length === 0 && !isPending && (
              <div className="text-center p-10 text-muted-foreground">
                هیچ نظری مطابق با فیلتر شما یافت نشد.
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={totalComments}
            itemsPerPage={COMMENTS_PER_PAGE}
          />
        </div>
      </div>
    </>
  );
}
