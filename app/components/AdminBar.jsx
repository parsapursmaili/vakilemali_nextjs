"use client";

import Link from "next/link";
import { useTransition, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FilePenLine,
  BookText,
  MessagesSquare,
  ListChecks,
  LogOut,
  Pen,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { logout, isAuthenticated } from "@/actions/auth";
import { getPostIdBySlug } from "@/actions/adminBar";

export function AdminBar() {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setAuthenticated(auth);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading || !authenticated) {
    return null;
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const handleEditCurrentPage = () => {
    startTransition(async () => {
      if (pathname.startsWith("/admin") || pathname === "/") {
        router.push("/admin/posts");
        return;
      }
      try {
        const postId = await getPostIdBySlug(pathname);
        if (postId) {
          router.push(`/admin/posts/${postId}`);
        } else {
          router.push("/admin/posts");
        }
      } catch (error) {
        router.push("/admin/posts");
      }
    });
  };

  const NavLink = ({ href, icon, title }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        title={title}
        className={`relative flex items-center justify-center rounded-xl transition-all duration-300 group
          w-8 h-8 sm:w-10 sm:h-10
          ${
            isActive
              ? "bg-[#c5892f] !text-white shadow-[0_0_10px_rgba(197,137,47,0.6)] scale-105" // ✅ !text-white اضافه شد
              : "!text-gray-400 hover:bg-white/10 hover:!text-white hover:scale-105" // ✅ !text-gray-400 و hover:!text-white اضافه شد
          }
        `}
      >
        <span className="transform transition-transform duration-300">
          <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
            {icon}
          </span>
        </span>

        <span className="hidden sm:block absolute top-full mt-3 px-2 py-1 bg-[#0f172a] text-white text-[10px] rounded border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-50 shadow-xl pointer-events-none">
          {title}
        </span>
      </Link>
    );
  };

  const navItems = [
    { href: "/admin/statistics", title: "داشبورد", icon: <LayoutDashboard /> },
    {
      href: "/admin/statistics/list",
      title: "لیست بازدیدها",
      icon: <ListChecks />,
    },
    { href: "/admin/posts", title: "مدیریت پست‌ها", icon: <FilePenLine /> },
    { href: "/admin/comments", title: "نظرات", icon: <MessagesSquare /> },
    { href: "/admin/terms", title: "دسته‌ها", icon: <BookText /> },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[999] transition-all duration-500 border-b
        ${
          scrolled
            ? "h-14 sm:h-16 bg-[#0f172a]/95 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
            : "h-14 sm:h-16 bg-[#0f172a] border-white/5 shadow-md"
        }
      `}
    >
      <nav className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-2 sm:px-6">
        {/* سمت راست */}
        <div className="flex items-center gap-2 sm:gap-5 h-full shrink-0">
          <div className="hidden lg:flex items-center gap-3 select-none">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#c5892f] to-[#7a5216] shadow-lg border border-[#c5892f]/50">
              <ShieldCheck className="w-5 h-5 text-white drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-100 tracking-wide leading-tight">
                پنل مدیریت
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-white/10"></div>

          <button
            onClick={handleEditCurrentPage}
            disabled={isPending}
            className={`
              relative flex items-center justify-center gap-2 rounded-lg transition-all duration-300 group overflow-hidden
              w-9 h-9 sm:w-auto sm:px-4 sm:h-9
              ${isPending ? "cursor-wait opacity-80" : "cursor-pointer"}
            `}
          >
            <div className="absolute inset-0 bg-[#c5892f]/10 border border-[#c5892f]/40 rounded-lg group-hover:bg-[#c5892f] group-hover:border-[#c5892f] transition-all duration-300"></div>

            <span className="relative z-10 flex items-center gap-2">
              {isPending ? (
                <Loader2 className="w-4 h-4 text-[#c5892f] animate-spin !text-[#c5892f] group-hover:!text-white" />
              ) : (
                <Pen className="w-4 h-4 text-[#c5892f] group-hover:!text-white transition-colors duration-300" />
              )}
              <span className="hidden sm:inline text-xs font-bold text-[#c5892f] group-hover:!text-white transition-colors duration-300 pt-[1px]">
                {isPending ? "جستجو..." : "ویرایش صفحه"}
              </span>
            </span>
          </button>
        </div>

        {/* منوی وسط */}
        <div
          className={`
            flex items-center justify-center gap-1 sm:gap-3 
            bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/5 backdrop-blur-md
            px-1 py-1 mx-1 sm:px-4 sm:py-1.5 sm:mx-0
            md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        `}
        >
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        {/* سمت چپ */}
        <div className="flex items-center h-full shrink-0">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="group flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-xl !text-gray-400 hover:!text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <span className="hidden sm:inline text-xs font-medium pt-[1px] opacity-80 group-hover:opacity-100">
              خروج
            </span>
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
        </div>
      </nav>
    </header>
  );
}
