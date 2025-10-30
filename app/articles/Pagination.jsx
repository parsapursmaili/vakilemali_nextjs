// app/articles/Pagination.jsx

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, currentPage }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-center gap-4 mt-12">
      {/* دکمه قبلی */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`px-4 py-2 rounded-lg bg-muted ${
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        قبلی
      </Link>

      <span className="text-foreground">
        صفحه {currentPage} از {totalPages}
      </span>

      {/* دکمه بعدی */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`px-4 py-2 rounded-lg bg-muted ${
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        بعدی
      </Link>
    </nav>
  );
}
