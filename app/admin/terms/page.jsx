"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  getFilteredTerms,
  createTerm,
  updateTerm,
  deleteTerm,
  getPostsForTerm,
  searchPostsToAdd,
  addPostToTerm,
  removePostFromTerm,
} from "./actions";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Tag,
  Folder,
  X,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react";

// A custom hook for debouncing input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Main Page Component
export default function TermsManagementPage() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("editing");

  const fetchTerms = useCallback(() => {
    startTransition(async () => {
      setIsLoading(true);
      const result = await getFilteredTerms({
        query: debouncedSearchQuery,
        type: filterType,
      });
      if (result.success) {
        setTerms(result.data);
      }
      setIsLoading(false);
    });
  }, [debouncedSearchQuery, filterType]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  useEffect(() => {
    if (editingId && terms.length > 0) {
      const termToEdit = terms.find((t) => t.id === parseInt(editingId));
      setSelectedTerm(termToEdit || null);
    } else {
      setSelectedTerm(null);
    }
  }, [editingId, terms]);

  const handleSetEditingTerm = (termId) => {
    router.push(`${pathname}?editing=${termId}`);
  };

  const handleClearEditing = () => {
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            مدیریت ترم‌ها
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            دسته‌بندی‌ها و برچسب‌های وبسایت خود را از اینجا مدیریت کنید.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <TermForm
              key={selectedTerm ? selectedTerm.id : "new"}
              selectedTerm={selectedTerm}
              onCreationSuccess={handleClearEditing}
              onUpdateSuccess={fetchTerms}
              onCancel={handleClearEditing}
              onDataRefresh={fetchTerms}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-[--background] border border-[--input-border] rounded-xl shadow-sm">
              <div className="p-4 flex flex-col md:flex-row gap-4 border-b border-[--input-border]">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو در نام ترم‌ها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="!pl-10 !pr-4"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[--muted] p-1 rounded-lg">
                  {[
                    { value: "all", label: "همه" },
                    { value: "category", label: "دسته‌بندی" },
                    { value: "tag", label: "برچسب" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFilterType(value)}
                      className={`flex-1 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out ${
                        filterType === value
                          ? "bg-[--primary] text-[--background] shadow-md transform scale-105"
                          : "text-[--foreground] opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <TermsList
                terms={terms}
                isLoading={isLoading || isPending}
                onEdit={handleSetEditingTerm}
                onDeleteSuccess={fetchTerms}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermForm({
  selectedTerm,
  onCreationSuccess,
  onUpdateSuccess,
  onCancel,
  onDataRefresh,
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  // FINAL FIX: This logic now correctly handles success for both create and update.
  const formAction = async (formData) => {
    setMessage(null);
    startTransition(async () => {
      const isUpdate = !!selectedTerm;
      const action = isUpdate
        ? updateTerm.bind(null, selectedTerm.id)
        : createTerm;
      const result = await action(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        if (isUpdate) {
          // For updates, just refresh the main list data. DON'T navigate away.
          onUpdateSuccess();
        } else {
          // For creations, reset the form and navigate away (clear URL params).
          document.getElementById("term-form").reset();
          onCreationSuccess();
        }
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  if (!selectedTerm && useSearchParams().get("editing")) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[--background] border border-[--input-border] rounded-xl shadow-sm transition-all duration-300">
      <header className="p-4 border-b border-[--input-border] flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
          {selectedTerm ? <Edit size={20} /> : <PlusCircle size={20} />}
          {selectedTerm ? "ویرایش ترم" : "افزودن ترم جدید"}
        </h2>
        {selectedTerm && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full text-gray-500 hover:bg-[--muted] hover:text-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </header>

      <form id="term-form" action={formAction} className="p-4 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300"
          >
            نام
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={selectedTerm?.name}
            required
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300"
          >
            اسلاگ (اختیاری)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={selectedTerm?.slug}
            placeholder="از روی نام ساخته می‌شود"
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300"
          >
            نوع
          </label>
          <select
            id="type"
            name="type"
            defaultValue={selectedTerm?.type || "category"}
          >
            <option value="category">دسته‌بندی</option>
            <option value="tag">برچسب</option>
          </select>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="button-primary w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" size={18} />}
            {selectedTerm ? "ذخیره تغییرات" : "ایجاد ترم"}
          </button>
        </div>
        {message && (
          <div
            className={`p-3 rounded-lg text-sm flex items-center gap-3 border ${
              message.type === "error"
                ? "bg-[--error-background] text-red-800 border-red-200 dark:text-red-200"
                : "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle2 size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </form>

      {selectedTerm && (
        <PostManager term={selectedTerm} onDataRefresh={onDataRefresh} />
      )}
    </div>
  );
}

function PostManager({ term, onDataRefresh }) {
  const [posts, setPosts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const fetchAssociatedPosts = useCallback(async () => {
    const res = await getPostsForTerm(term.id);
    if (res.success) setPosts(res.data);
  }, [term.id]);

  useEffect(() => {
    fetchAssociatedPosts();
  }, [fetchAssociatedPosts]);

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearchQuery.length > 2) {
        setIsSearching(true);
        const res = await searchPostsToAdd(term.id, debouncedSearchQuery);
        if (res.success) setSearchResults(res.data);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }
    performSearch();
  }, [debouncedSearchQuery, term.id]);

  const handleAddPost = async (postId) => {
    await addPostToTerm(term.id, postId);
    fetchAssociatedPosts();
    setSearchQuery("");
    setSearchResults([]);
    onDataRefresh();
  };

  const handleRemovePost = async (postId) => {
    await removePostFromTerm(term.id, postId);
    setPosts(posts.filter((p) => p.id !== postId));
    onDataRefresh();
  };

  return (
    <div className="p-4 border-t border-[--input-border] space-y-4">
      <h3 className="font-bold text-gray-800 dark:text-gray-200">
        مدیریت پست‌ها
      </h3>
      <div className="relative">
        <input
          type="search"
          placeholder="جستجو در عنوان و محتوای پست‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}

        {searchResults.length > 0 && !isSearching && (
          <ul className="absolute z-10 w-full mt-1 bg-[--input-background] border border-[--input-border] rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((post) => (
              <li
                key={post.id}
                className="p-2.5 text-sm flex justify-between items-center hover:bg-[--muted] cursor-pointer transition-colors"
                onClick={() => handleAddPost(post.id)}
              >
                <span className="truncate">{post.title}</span>
                <Plus size={16} className="text-green-500" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400">
          پست‌های فعلی ({posts.length}):
        </h4>
        {posts.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex justify-between items-center text-sm p-2 bg-[--muted] rounded-lg"
              >
                <span className="truncate flex-1">{post.title}</span>
                <button
                  onClick={() => handleRemovePost(post.id)}
                  className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p className="text-sm">هنوز پستی به این ترم اضافه نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TermsList({ terms, isLoading, onEdit, onDeleteSuccess }) {
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = (termId) => {
    if (
      window.confirm(
        "آیا برای حذف این ترم مطمئن هستید؟ این عمل غیرقابل بازگشت است."
      )
    ) {
      startTransition(async () => {
        await deleteTerm(termId);
        onDeleteSuccess();
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[--primary]" />
      </div>
    );
  if (terms.length === 0)
    return (
      <div className="text-center py-20">
        <LayoutGrid className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          موردی یافت نشد
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          سعی کنید عبارت جستجو یا فیلتر خود را تغییر دهید.
        </p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="p-3 text-right font-bold text-gray-600 dark:text-gray-300">
              نام
            </th>
            <th className="p-3 text-right font-bold text-gray-600 dark:text-gray-300">
              اسلاگ
            </th>
            <th className="p-3 text-center font-bold text-gray-600 dark:text-gray-300">
              پست‌ها
            </th>
            <th className="p-3 text-center font-bold text-gray-600 dark:text-gray-300">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[--input-border]">
          {terms.map((term) => (
            <tr
              key={term.id}
              className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
            >
              <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2 rounded-full ${
                      term.type === "category"
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                        : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
                    }`}
                  >
                    {term.type === "category" ? (
                      <Folder size={16} />
                    ) : (
                      <Tag size={16} />
                    )}
                  </span>
                  <span>{term.name}</span>
                </div>
              </td>
              <td className="p-3 text-gray-500 dark:text-gray-400 font-mono">
                {term.slug}
              </td>
              <td className="p-3 text-center text-gray-600 dark:text-gray-300 font-medium">
                {term.post_count}
              </td>
              <td className="p-3">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => onEdit(term.id)}
                    className="flex items-center gap-1.5 font-semibold text-[--primary-light] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Edit size={16} /> ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(term.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 font-semibold text-red-500 hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={16} /> حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
