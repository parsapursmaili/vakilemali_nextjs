"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  ShieldAlert,
  X,
  Pencil,
  Trash2,
  Reply,
  CornerDownRight,
  MoreVertical,
  Edit,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { updateCommentDetails, addCommentReply } from "./actions";

// --- آواتار رنگی ---
function Avatar({ name }) {
  const char = name ? name.charAt(0) : "?";
  // رنگ‌های ملایم و مدرن
  const colors = [
    "bg-rose-100 text-rose-600 border-rose-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
  ];
  const idx = name ? name.length % colors.length : 0;

  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border shadow-sm ${colors[idx]}`}
    >
      {char}
    </div>
  );
}

// --- بج وضعیت ---
export function StatusBadge({ status }) {
  const config = {
    approved: {
      icon: CheckCircle,
      text: "تایید شده",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      icon: Clock,
      text: "در انتظار",
      style: "bg-amber-50 text-amber-700 border-amber-200",
    },
    spam: {
      icon: ShieldAlert,
      text: "اسپم",
      style: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };
  const { icon: Icon, text, style } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shadow-sm ${style}`}
    >
      <Icon className="w-3.5 h-3.5" /> {text}
    </span>
  );
}

// --- مودال پایه (Reusable) ---
function ModalBase({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// --- مودال ویرایش ---
export function EditCommentModal({ comment, onClose, onSave }) {
  const [formData, setFormData] = useState({
    author_name: comment.author_name || "",
    author_email: comment.author_email || "",
    content: comment.content || "",
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateCommentDetails(comment.id, formData);
      if (res.success) {
        onSave({ ...comment, ...formData });
        onClose();
      } else alert(res.error);
    });
  };

  return (
    <ModalBase title="ویرایش نظر" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <User className="w-4 h-4 text-zinc-400" /> نام نویسنده
            </label>
            <input
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Mail className="w-4 h-4 text-zinc-400" /> ایمیل
            </label>
            <input
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              type="email"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <MessageSquare className="w-4 h-4 text-zinc-400" /> متن نظر
          </label>
          <textarea
            rows="6"
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

// --- مودال پاسخ ---
export function ReplyCommentModal({ parentComment, onClose, onReplySuccess }) {
  const [formData, setFormData] = useState({
    author_name: "ادمین",
    author_email: "",
    content: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addCommentReply({
        parent_id: parentComment.id,
        post_id: parentComment.post_id,
        ...formData,
      });
      if (res.success) {
        onReplySuccess();
        onClose();
      } else alert(res.error);
    });
  };

  return (
    <ModalBase title="ارسال پاسخ" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* بخش نقل قول والد */}
        <div className="relative p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
          <div className="absolute top-4 right-4 text-zinc-300">
            <MessageSquare className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-xs font-bold text-zinc-500 mb-1">
            پاسخ به {parentComment.author_name}:
          </p>
          <p className="text-sm text-zinc-700 italic line-clamp-2 leading-relaxed opacity-80">
            "{parentComment.content}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">نام شما</label>
            <input
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              ایمیل (اختیاری)
            </label>
            <input
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              type="email"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">متن پاسخ</label>
          <textarea
            rows="5"
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-medium bg-zinc-900 hover:bg-black text-white rounded-xl shadow-lg shadow-zinc-500/20 transition-all disabled:opacity-70"
          >
            {isPending ? "..." : "ارسال پاسخ"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

// --- ردیف جدول دسکتاپ ---
export function DesktopCommentRow({
  comment,
  level = 0,
  selected,
  onSelect,
  onEdit,
  onReply,
  onDelete,
}) {
  const isReply = level > 0;

  return (
    <>
      <tr
        className={`group transition-all duration-200 border-b border-zinc-100 dark:border-zinc-800 ${
          selected ? "bg-blue-50/60 dark:bg-blue-900/10" : "hover:bg-zinc-50/60"
        }`}
      >
        {/* ستون چک‌باکس با خط اتصال درختی */}
        <td className="py-5 pr-4 pl-2 relative w-14 align-top">
          <div className="relative z-10">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-transform active:scale-90"
              checked={selected}
              onChange={(e) => onSelect(comment.id, e)}
            />
          </div>
        </td>

        {/* اطلاعات نویسنده با Indentation */}
        <td className="py-5 px-3 align-top w-1/5">
          <div
            className="flex gap-3"
            style={{ paddingRight: `${level * 28}px` }}
          >
            {isReply && (
              <div className="relative -mr-4 mt-2 text-zinc-300">
                <CornerDownRight className="w-5 h-5" />
              </div>
            )}
            <div className="shrink-0">
              <Avatar name={comment.author_name} />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="font-bold text-sm text-zinc-800 truncate block">
                {comment.author_name}
              </span>
              <span className="text-xs text-zinc-400 truncate block font-mono mt-0.5">
                {comment.author_email || "-"}
              </span>
            </div>
          </div>
        </td>

        {/* متن نظر */}
        <td className="py-5 px-3 align-top max-w-md">
          <p className="text-sm text-zinc-600 leading-7 line-clamp-3">
            {comment.content}
          </p>
        </td>

        {/* لینک مطلب */}
        <td className="py-5 px-3 align-top w-48">
          <Link
            href={`/${comment.post_slug}`}
            target="_blank"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-blue-200 underline-offset-4 line-clamp-2"
          >
            {comment.post_title}
          </Link>
        </td>

        {/* وضعیت و تاریخ */}
        <td className="py-5 px-3 align-top w-36">
          <div className="flex flex-col items-start gap-2">
            <StatusBadge status={comment.status} />
            <span className="text-[10px] text-zinc-400 px-1">
              {new Date(comment.created_at).toLocaleDateString("fa-IR")}
            </span>
          </div>
        </td>

        {/* عملیات */}
        <td className="py-5 px-3 align-top w-32">
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onReply(comment)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              title="پاسخ"
            >
              <Reply className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(comment)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              title="ویرایش"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {comment.children?.map((child) => (
        <DesktopCommentRow
          key={child.id}
          comment={child}
          level={level + 1}
          selected={selected}
          onSelect={onSelect}
          onEdit={onEdit}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

// --- کارت موبایل ---
export function MobileCommentCard({
  comment,
  selected,
  onSelect,
  onEdit,
  onReply,
  onDelete,
  isSelectionActive,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isReply = !!comment.parent_id;

  return (
    <div
      className={`p-4 border-b border-zinc-100 relative ${
        selected ? "bg-blue-50" : "bg-white"
      } ${isReply ? "pr-8" : ""}`}
      onClick={() => isSelectionActive && onSelect(comment.id)}
    >
      {isReply && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-zinc-200/50"></div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {isSelectionActive && (
            <div className="shrink-0">
              {selected ? (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              ) : (
                <div className="w-5 h-5 border-2 border-zinc-300 rounded-md"></div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Avatar name={comment.author_name} />
            <div>
              <div className="font-bold text-sm text-zinc-800">
                {comment.author_name}
              </div>
              <div className="text-xs text-zinc-400">
                {new Date(comment.created_at).toLocaleDateString("fa-IR")}
              </div>
            </div>
          </div>
        </div>

        {!isSelectionActive && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 hover:bg-zinc-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </button>
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                ></div>
                <div className="absolute left-0 top-full mt-1 w-32 bg-white shadow-xl border border-zinc-100 rounded-xl z-20 overflow-hidden py-1">
                  <button
                    onClick={() => {
                      onReply(comment);
                      setIsOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm hover:bg-zinc-50 flex gap-2"
                  >
                    <Reply className="w-4 h-4" /> پاسخ
                  </button>
                  <button
                    onClick={() => {
                      onEdit(comment);
                      setIsOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm hover:bg-zinc-50 flex gap-2"
                  >
                    <Edit className="w-4 h-4" /> ویرایش
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setIsOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> حذف
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-zinc-700 leading-relaxed mb-3">
        {comment.content}
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-dashed border-zinc-200">
        <span className="text-xs text-zinc-500 truncate max-w-[50%]">
          {comment.post_title}
        </span>
        <StatusBadge status={comment.status} />
      </div>
    </div>
  );
}
