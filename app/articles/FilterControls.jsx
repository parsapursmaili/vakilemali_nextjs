"use client";

import { useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

export default function FilterControls({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ تغییر: از categorySlug به categoryId تغییر نام داده شد و مقدار آن را از پارامتر 'category' می خواند
  const currentCategoryId = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const handleFilterChange = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ تغییر: جستجوی نام دسته‌بندی انتخاب‌شده بر اساس ID
  const selectedCategoryName =
    categories.find((c) => String(c.id) === currentCategoryId)?.name ||
    "همه دسته‌بندی‌ها";

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="relative w-full md:w-72">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-muted text-foreground rounded-lg border"
        >
          <span>{selectedCategoryName}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          // تغییر اصلی اینجاست: bg-card به bg-background تغییر کرد
          <div className="absolute z-10 top-full mt-2 w-full bg-background border rounded-lg shadow-lg p-2">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="جستجوی دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 bg-muted border rounded-md text-sm"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto">
              <li
                onClick={() => {
                  handleFilterChange("category", "");
                  setIsDropdownOpen(false);
                }}
                className="px-3 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer"
              >
                همه دسته‌بندی‌ها
              </li>
              {filteredCategories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    // ✅ تغییر: ارسال cat.id به جای cat.slug
                    handleFilterChange("category", cat.id);
                    setIsDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
        <SortButton
          label="جدیدترین"
          value="newest"
          currentValue={currentSort}
          onClick={() => handleFilterChange("sort", "newest")}
        />
        <SortButton
          label="پربازدیدترین"
          value="popular"
          currentValue={currentSort}
          onClick={() => handleFilterChange("sort", "popular")}
        />
        <SortButton
          label="تصادفی"
          value="random"
          currentValue={currentSort}
          onClick={() => handleFilterChange("sort", "random")}
        />
      </div>
    </div>
  );
}

function SortButton({ label, value, currentValue, onClick }) {
  const isActive = value === currentValue;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "hover:bg-background/50 text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
