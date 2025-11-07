"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  LayoutDashboard,
  FilePenLine,
  BookText,
  MessagesSquare,
  ListChecks,
  LogOut,
} from "lucide-react";
import { logout } from "@/actions/auth";

export default function AdminBar() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  // آیکون ها با رنگ background (روشن) و هاور accent (طلایی)
  const iconBase =
    "h-5 w-5 transition-transform duration-200 text-background group-hover:text-accent group-focus:text-accent";

  const adminLinks = [
    {
      href: "/admin/statistics",
      title: "آمار و داشبورد",
      icon: <LayoutDashboard className={iconBase} />,
    },
    {
      href: "/admin/statistics/list",
      title: "لیست بازدیدها",
      icon: <ListChecks className={iconBase} />,
    },
    {
      href: "/admin/posts",
      title: "ویرایش پست‌ها",
      icon: <FilePenLine className={iconBase} />,
    },
    {
      href: "/admin/terms",
      title: "ویرایش ترم‌ها",
      icon: <BookText className={iconBase} />,
    },
    {
      href: "/admin/comments",
      title: "مدیریت کامنت‌ها",
      icon: <MessagesSquare className={iconBase} />,
    },
  ];

  return (
    // <header> تمام عرض، ثابت و بدون مارجین
    <header className="fixed inset-x-0 top-0 z-50 h-14 shadow-lg bg-primary/95 backdrop-blur-md">
      <nav className="mx-auto flex h-full w-full items-center justify-between px-6">
        {/* بخش لینک‌های مدیریتی */}
        <div className="flex items-center gap-x-6">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.title}
              className="group flex items-center p-1 transition-all duration-200 hover:scale-105"
            >
              <span className="cursor-pointer" aria-hidden>
                {link.icon}
              </span>
              <span className="sr-only">{link.title}</span>
            </Link>
          ))}
        </div>

        {/* دکمه خروج - اضافه شدن کلاس cursor-pointer */}
        <div className="flex items-center gap-x-3">
          <button
            onClick={handleLogout}
            disabled={isPending}
            title="خروج از حساب کاربری"
            // **اصلاح کورسور:** اضافه کردن cursor-pointer
            className={`flex items-center gap-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer
                        border-2 border-background text-background hover:bg-background/20 hover:border-accent hover:text-accent 
                        active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isPending ? "در حال خروج..." : "خروج امن"}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
