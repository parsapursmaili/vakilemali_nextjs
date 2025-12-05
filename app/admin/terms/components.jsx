"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  createTerm,
  updateTerm,
  deleteTerm,
  getPostsForTerm,
  searchPostsToAdd,
  addPostToTerm,
  removePostFromTerm,
} from "./actions";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  FolderTree,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eraser,
  ChevronLeft,
  LayoutGrid,
  Tag,
  Link2,
} from "lucide-react";

// --- کامپوننت اصلی ---
export function TermsClient({ initialTerms }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const editingId = searchParams.get("editing");
  const selectedTerm = useMemo(
    () => initialTerms.find((t) => t.id === parseInt(editingId)) || null,
    [initialTerms, editingId]
  );

  const handleResetToNew = () => router.push(pathname);
  const handleEdit = (id) =>
    router.push(`${pathname}?editing=${id}`, { scroll: false });

  return (
    // اصلاح مارجین موبایل: p-0 در موبایل، p-6 در دسکتاپ
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full p-0 sm:p-2 lg:p-0">
      {/* 1. بخش فرم (Sticky Sidebar در دسکتاپ) */}
      <div className="w-full lg:w-[32%] xl:w-[28%] lg:sticky lg:top-6 order-1 z-20">
        <div className="bg-white border border-gray-100 dark:border-gray-800 lg:rounded-2xl shadow-xl overflow-hidden">
          {/* هدر فرم با گرادینت جذاب */}
          <div className="bg-gradient-to-r from-[--primary] to-[--primary-light] px-5 py-4 flex justify-between items-center shadow-md">
            <h2 className="text-white font-bold text-lg flex items-center gap-2 drop-shadow-md">
              {selectedTerm ? <Edit2 size={20} /> : <Plus size={20} />}
              <span>{selectedTerm ? "ویرایش ترم" : "ترم جدید"}</span>
            </h2>

            {selectedTerm && (
              <button
                onClick={handleResetToNew}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
              >
                <Eraser size={14} />
                <span>انصراف</span>
              </button>
            )}
          </div>

          <div className="p-5 bg-[--background]">
            <TermForm
              selectedTerm={selectedTerm}
              allTerms={initialTerms}
              onReset={handleResetToNew}
            />
          </div>
        </div>
      </div>

      {/* 2. بخش لیست (جدول) */}
      <div className="w-full lg:flex-1 order-2 min-w-0">
        <div className="bg-white border border-gray-100 dark:border-gray-800 lg:rounded-2xl shadow-xl flex flex-col h-full min-h-[600px] overflow-hidden">
          {/* هدر لیست */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="p-2.5 bg-[--primary]/10 text-[--primary] rounded-xl">
                <FolderTree size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[--foreground] text-lg">
                  لیست دسته‌بندی‌ها
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  مدیریت ساختار درختی سایت
                </p>
              </div>
            </div>

            {/* سرچ باکس مدرن - آیکون سمت چپ */}
            <div className="relative w-full sm:w-72 group">
              <input
                type="text"
                placeholder="جستجو در نام و اسلاگ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl focus:border-[--primary] focus:ring-4 focus:ring-[--primary]/10 outline-none transition-all text-sm font-medium text-[--foreground]"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[--primary] transition-colors"
                size={20}
              />
            </div>
          </div>

          {/* جدول */}
          <TermsList
            terms={initialTerms}
            searchQuery={searchQuery}
            editingId={selectedTerm?.id}
            onEdit={handleEdit}
            onDeleteSuccess={selectedTerm ? handleResetToNew : undefined}
          />
        </div>
      </div>
    </div>
  );
}

// --- فرم ---
function TermForm({ selectedTerm, allTerms, onReset }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);

  const parentOptions = useMemo(() => {
    const flatten = (items, parentId = null, depth = 0) => {
      let res = [];
      const children = items.filter((i) => i.parent_id === parentId);
      for (const child of children) {
        res.push({ ...child, depth });
        res = [...res, ...flatten(items, child.id, depth + 1)];
      }
      return res;
    };
    const flat = flatten(allTerms);
    return selectedTerm ? flat.filter((t) => t.id !== selectedTerm.id) : flat;
  }, [allTerms, selectedTerm]);

  async function onSubmit(formData) {
    setMsg(null);
    startTransition(async () => {
      const action = selectedTerm
        ? updateTerm.bind(null, selectedTerm.id)
        : createTerm;
      const res = await action(formData);

      if (res.success) {
        setMsg({ type: "success", text: res.message });
        if (!selectedTerm) document.getElementById("main-form").reset();
      } else {
        setMsg({ type: "error", text: res.message });
      }
    });
  }

  return (
    <div className="space-y-6">
      <form id="main-form" action={onSubmit} className="space-y-5">
        {/* اینپوت نام - آیکون چپ */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[--foreground] opacity-90">
            عنوان ترم
          </label>
          <div className="relative group">
            <input
              name="name"
              defaultValue={selectedTerm?.name}
              required
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none transition-all text-sm text-[--foreground]"
              placeholder="نام دسته‌بندی..."
            />
            <Tag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[--accent] transition-colors"
              size={18}
            />
          </div>
        </div>

        {/* اینپوت اسلاگ - آیکون چپ */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[--foreground] opacity-90">
            نامک (Slug)
          </label>
          <div className="relative group">
            <input
              name="slug"
              defaultValue={selectedTerm?.slug}
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none transition-all text-sm font-mono text-left dir-ltr text-[--foreground]"
              placeholder="category-slug"
            />
            <Link2
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[--accent] transition-colors"
              size={18}
            />
          </div>
        </div>

        {/* سلکت والد - آیکون چپ */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[--foreground] opacity-90">
            والد (Parent)
          </label>
          <div className="relative group">
            <select
              name="parent_id"
              key={selectedTerm ? selectedTerm.id : "new"}
              defaultValue={selectedTerm?.parent_id || ""}
              className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-xl focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none transition-all appearance-none cursor-pointer text-sm text-[--foreground]"
            >
              <option value="">-- ریشه (Root) --</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {"› ".repeat(opt.depth)} {opt.name}
                </option>
              ))}
            </select>
            <ChevronLeft
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 -rotate-90"
              size={18}
            />
          </div>
        </div>

        {/* دکمه ذخیره - با استایل متفاوت */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            style={{ backgroundColor: "var(--primary)", color: "#ffffff" }}
            className="w-full h-12 !bg-[--primary] hover:!bg-[--primary-light] !text-white font-bold text-base rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            <span>{selectedTerm ? "ذخیره تغییرات" : "افزودن ترم"}</span>
          </button>
        </div>

        {/* پیام وضعیت */}
        {msg && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {msg.text}
          </div>
        )}
      </form>

      {selectedTerm && (
        <div className="pt-6 border-t border-gray-200">
          <PostManager termId={selectedTerm.id} />
        </div>
      )}
    </div>
  );
}

// --- مدیریت پست‌ها ---
function PostManager({ termId }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    getPostsForTerm(termId).then((res) => res.success && setPosts(res.data));
  }, [termId]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (search.length > 2) {
        const res = await searchPostsToAdd(termId, search);
        if (res.success) setResults(res.data);
      } else setResults([]);
    }, 400);
    return () => clearTimeout(t);
  }, [search, termId]);

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-[--foreground] flex items-center gap-2 text-sm">
        <FileText size={18} className="text-[--accent]" />
        پست‌های متصل
        <span className="bg-[--accent]/10 text-[--accent] px-2 py-0.5 rounded-md text-xs border border-[--accent]/20">
          {posts.length}
        </span>
      </h4>

      {/* سرچ پست - آیکون چپ */}
      <div className="relative group">
        <input
          placeholder="جستجو جهت اتصال..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/10 outline-none transition-all"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[--primary]"
          size={16}
        />

        {results.length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={async () => {
                  await addPostToTerm(termId, p.id);
                  setPosts((prev) => [p, ...prev]);
                  setResults([]);
                  setSearch("");
                }}
                className="w-full text-right p-2.5 text-sm hover:bg-[--muted] rounded-lg flex justify-between items-center group/item transition-colors"
              >
                <span className="truncate text-gray-700 font-medium">
                  {p.title}
                </span>
                <Plus
                  size={16}
                  className="text-green-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-300 transition-all group"
          >
            <span className="truncate text-xs sm:text-sm text-[--foreground] font-medium">
              {p.title}
            </span>
            <button
              onClick={async () => {
                await removePostFromTerm(termId, p.id);
                setPosts((prev) => prev.filter((x) => x.id !== p.id));
              }}
              className="text-gray-400 hover:text-white hover:bg-red-500 p-1.5 rounded-md transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <span className="text-xs text-gray-400">بدون پست متصل</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- لیست درختی ---
function TermsList({ terms, searchQuery, editingId, onEdit, onDeleteSuccess }) {
  const [isPending, startTransition] = useTransition();

  const displayTerms = useMemo(() => {
    if (searchQuery) return terms.filter((t) => t.name.includes(searchQuery));
    const flatten = (items, parentId = null, depth = 0) => {
      let res = [];
      const children = items.filter((i) => i.parent_id === parentId);
      for (const child of children) {
        res.push({ ...child, depth });
        res = [...res, ...flatten(items, child.id, depth + 1)];
      }
      return res;
    };
    return flatten(terms);
  }, [terms, searchQuery]);

  return (
    <div className="overflow-x-auto flex-1 w-full">
      <table className="w-full text-right border-collapse min-w-[600px] lg:min-w-0">
        <thead className="bg-gray-50/80 backdrop-blur text-gray-500 text-xs font-bold sticky top-0 z-10 border-b border-gray-200">
          <tr>
            <th className="p-4 w-[40%]">عنوان دسته‌بندی</th>
            <th className="p-4 hidden md:table-cell w-[30%]">اسلاگ (شناسه)</th>
            <th className="p-4 text-center w-[15%]">آمار</th>
            <th className="p-4 text-center w-[15%]">مدیریت</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {displayTerms.map((term) => (
            <tr
              key={term.id}
              className={`
                group transition-all duration-200
                ${
                  editingId === term.id
                    ? "bg-[--primary]/5 border-r-4 border-[--primary]"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <td className="p-4">
                <div
                  className="flex items-center"
                  style={{ marginRight: searchQuery ? 0 : term.depth * 24 }}
                >
                  {!searchQuery && term.depth > 0 && (
                    <div className="w-4 h-8 border-b-2 border-r-2 border-gray-200 rounded-br-lg ml-2 -mt-4 opacity-50"></div>
                  )}

                  <span
                    className={`text-sm ${
                      term.depth === 0
                        ? "font-bold text-[--foreground]"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {term.name}
                  </span>
                </div>
              </td>

              <td className="p-4 text-xs font-mono text-gray-400 hidden md:table-cell dir-ltr text-right">
                {term.slug}
              </td>

              <td className="p-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                    term.post_count > 0
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <FileText size={12} />
                  {term.post_count}
                </span>
              </td>

              <td className="p-4">
                {/* دکمه‌های عملیات - جذاب و رنگی */}
                <div className="flex justify-center items-center gap-2.5">
                  <button
                    onClick={() => onEdit(term.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white hover:shadow-md hover:shadow-blue-500/30 transition-all active:scale-90"
                    title="ویرایش"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("حذف شود؟"))
                        startTransition(async () => {
                          const res = await deleteTerm(term.id);
                          if (
                            res.success &&
                            editingId === term.id &&
                            onDeleteSuccess
                          )
                            onDeleteSuccess();
                        });
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30 transition-all active:scale-90"
                    title="حذف"
                    disabled={isPending}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {displayTerms.length === 0 && (
            <tr>
              <td colSpan="4" className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <LayoutGrid size={40} className="text-[--foreground]" />
                  </div>
                  <span className="text-sm font-medium text-[--foreground]">
                    داده‌ای برای نمایش نیست
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
