// StatisticsClient.jsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "jalali-moment";
import { Eye, Trophy, PieChart } from "lucide-react";
import PostChartModal from "./PostChartModal";

export default function StatisticsClient({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [modalPost, setModalPost] = useState(null);

  // تغییر: محاسبه تاریخ امروز شمسی برای استفاده در stateهای پیش‌فرض
  const todayJalali = moment().locale("fa").format("YYYY/MM/DD");

  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  // تغییر: مقداردهی اولیه stateهای بازه سفارشی با تاریخ امروز شمسی
  const [customStartDate, setCustomStartDate] = useState(todayJalali);
  const [customEndDate, setCustomEndDate] = useState(todayJalali);

  const customRangeRef = useRef(null);
  const activePeriod = searchParams.get("period") || "today";

  // بستن پاپ‌آپ با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        customRangeRef.current &&
        !customRangeRef.current.contains(event.target)
      ) {
        setIsCustomRangeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodChange = (period) => {
    if (period === "custom") {
      setIsCustomRangeOpen(true);
      return;
    }
    setIsCustomRangeOpen(false);
    // بازنشانی تاریخ‌های سفارشی به امروز هنگام تغییر بازه به غیر سفارشی
    setCustomStartDate(todayJalali);
    setCustomEndDate(todayJalali);

    const params = new URLSearchParams(window.location.search);
    params.set("period", period);
    params.delete("startDate");
    params.delete("endDate");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const handleDateRangeApply = () => {
    if (customStartDate && customEndDate) {
      setIsCustomRangeOpen(false);
      const params = new URLSearchParams();
      params.set("period", "custom");
      params.set("startDate", customStartDate);
      params.set("endDate", customEndDate);
      startTransition(() => router.push(`?${params.toString()}`));
    }
  };

  const periods = [
    { key: "today", label: "امروز" },
    // تغییر: افزودن بازه دیروز
    { key: "yesterday", label: "دیروز" },
    { key: "week", label: "هفته اخیر" },
    { key: "month", label: "ماه اخیر" },
    { key: "year", label: "سال اخیر" },
    { key: "all", label: "کل دوران" },
  ];

  return (
    <div
      className={`p-4 md:p-6 overflow-x-hidden transition-opacity duration-300 ${
        isPending ? "opacity-60" : "opacity-100"
      }`}
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          آمار بازدید‌ها
        </h1>
        <p className="text-sm text-[var(--foreground)] opacity-70 mt-1">
          شمارش از تاریخ: {initialData.earliestDateJalali}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--muted)] p-5 rounded-lg flex items-center gap-4">
          <Eye className="h-6 w-6" />
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-80">
              کل بازدید ({initialData.range})
            </p>
            <p className="text-2xl font-bold text-[var(--primary)]">
              {initialData.totalViews.toLocaleString("fa-IR")}
            </p>
          </div>
        </div>
        <div className="bg-[var(--muted)] p-5 rounded-lg flex items-center gap-4">
          <Trophy className="h-6 w-6" />
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-80">
              پربازدیدترین پست
            </p>
            {/* تغییر: حذف truncate و title برای نمایش کامل متن در خطوط بیشتر */}
            <p className="text-base font-semibold text-[var(--primary)] whitespace-normal">
              {initialData.topPost
                ? `${
                    initialData.topPost.title
                  } (${initialData.topPost.views.toLocaleString(
                    "fa-IR"
                  )} بازدید)`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--muted)] p-3 rounded-lg flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 flex-wrap">
          {periods.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handlePeriodChange(key)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activePeriod === key
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-opacity-80"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="relative" ref={customRangeRef}>
            <button
              onClick={() => handlePeriodChange("custom")}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activePeriod === "custom"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-opacity-80"
              }`}
            >
              انتخاب بازه
            </button>
            {isCustomRangeOpen && (
              <div className="absolute top-full right-0 mt-2 z-10 bg-[var(--background)] border border-[var(--muted)] rounded-lg shadow-lg p-4 w-72 space-y-3">
                <p className="text-sm text-center">
                  تاریخ امروز:{" "}
                  <span className="font-semibold">{todayJalali}</span>
                </p>
                <input
                  type="text"
                  placeholder="شروع: YYYY/MM/DD"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="پایان: YYYY/MM/DD"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={handleDateRangeApply}
                  className="button-primary w-full !py-2 text-sm"
                >
                  اعمال
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="overflow-x-auto bg-[var(--background)] rounded-lg border border-[var(--muted)]">
        <table className="w-full text-right">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="p-4 font-semibold text-sm w-12">#</th>
              <th className="p-4 font-semibold text-sm text-right">
                عنوان پست
              </th>
              <th className="p-4 font-semibold text-sm w-32 text-center">
                بازدید در بازه
              </th>
              <th className="p-4 font-semibold text-sm w-40 text-center">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {initialData.posts.map((post, index) => (
              <tr
                key={post.id}
                className="border-t border-[var(--muted)] hover:bg-[var(--muted)] transition-colors"
              >
                <td className="p-4 font-bold text-[var(--primary)]">
                  {index + 1}
                </td>
                <td className="p-4 font-semibold">
                  <a
                    href={`/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {post.title}
                  </a>
                </td>
                <td className="p-4 text-center font-mono font-bold text-lg text-[var(--accent)]">
                  {post.period_views.toLocaleString("fa-IR")}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setModalPost(post)}
                    className="button-secondary !py-1.5 !px-3 text-sm flex items-center justify-center mx-auto"
                    disabled={activePeriod === "all"}
                    title={
                      activePeriod === "all"
                        ? "نمودار برای کل دوران در دسترس نیست"
                        : "نمایش نمودار بازدید"
                    }
                  >
                    <PieChart className="h-5 w-5 ml-1" /> نمودار{" "}
                  </button>
                </td>
              </tr>
            ))}
            {initialData.posts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-8">
                  هیچ پستی در این بازه زمانی بازدید نداشته است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PostChartModal
        post={modalPost}
        isOpen={!!modalPost}
        onClose={() => setModalPost(null)}
      />
    </div>
  );
}
