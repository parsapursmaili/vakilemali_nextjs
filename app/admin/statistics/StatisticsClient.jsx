// StatisticsClient.jsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import PostChartModal from "./PostChartModal";
import "./jalali-picker-styles.css"; // Import the custom styles

// Dynamic import for the NEW JalaliDatePicker to ensure it's client-side only
const JalaliDatePicker = dynamic(() => import("./JalaliDatePicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[40px] w-[250px] bg-white border border-gray-300 rounded-md animate-pulse"></div>
  ),
});

// Icons
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l7 3-7 3v7m0-7l-7 3 7-3"
    />
  </svg>
);
const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 12H12V2.252z" />
  </svg>
);

export default function StatisticsClient({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [modalPost, setModalPost] = useState(null); // This state is crucial for the modal

  const activePeriod = searchParams.get("period") || "week";

  const handlePeriodChange = (period) => {
    const params = new URLSearchParams(window.location.search);
    params.set("period", period);
    params.delete("startDate");
    params.delete("endDate");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const handleDateRangeApply = ({ startDate, endDate }) => {
    const params = new URLSearchParams();
    params.set("period", "custom");
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const periods = [
    { key: "today", label: "امروز" },
    { key: "week", label: "هفته اخیر" },
    { key: "month", label: "ماه اخیر" },
    { key: "year", label: "سال اخیر" },
    { key: "all", label: "کل دوران" },
  ];

  return (
    <div
      className={`p-4 md:p-6 transition-opacity duration-300 ${
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
          <EyeIcon />
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
          <TrophyIcon />
          <div>
            <p className="text-sm text-[var(--foreground)] opacity-80">
              پربازدیدترین پست
            </p>
            <p
              className="text-lg font-semibold text-[var(--primary)] truncate"
              title={initialData.topPost?.title}
            >
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
        <nav className="flex items-center gap-2">
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
        </nav>
        <JalaliDatePicker onApply={handleDateRangeApply} />
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
                    href={`/blog/${post.slug}`}
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
                    <ChartIcon /> نمودار
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
