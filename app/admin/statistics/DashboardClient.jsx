"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  Eye,
  MessageSquare,
  Clock,
  BookOpen,
  Star,
  ArrowLeft,
} from "lucide-react";

// کامپوننت کارت آمار (با تاکید بر فارسی‌سازی اعداد)
const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-[var(--muted)] p-4 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300 min-h-[125px]">
    <div className="flex items-start justify-between text-[var(--foreground)] opacity-70">
      <p className="font-semibold text-sm">{title}</p>
      {icon}
    </div>
    <div className="flex flex-col items-center justify-center flex-grow">
      <p className="text-4xl font-bold text-[var(--primary)]">
        {(Number(value) || 0).toLocaleString("fa-IR")}
      </p>
    </div>
    <div className="h-4 text-center">
      {subtitle && (
        <p className="text-xs text-[var(--foreground)] opacity-60">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// ویجت پست‌های برتر (با دکمه نمایش بیشتر)
const TopPostsWidget = ({ topPosts }) => {
  const [period, setPeriod] = useState("day");
  const activeData = topPosts[period] || [];

  return (
    <div className="bg-[var(--muted)] p-4 rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2 text-lg">
          <Star size={20} className="text-yellow-500" /> پست‌های برتر
        </h3>
        <div className="flex items-center text-xs bg-[var(--background)] p-1 rounded-lg">
          <button
            onClick={() => setPeriod("day")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              period === "day"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "hover:bg-white/50"
            }`}
          >
            امروز
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              period === "month"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "hover:bg-white/50"
            }`}
          >
            ماه
          </button>
          <button
            onClick={() => setPeriod("allTime")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              period === "allTime"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "hover:bg-white/50"
            }`}
          >
            کل
          </button>
        </div>
      </div>
      <div className="space-y-1 flex-grow">
        {activeData.length > 0 ? (
          activeData.map((post) => (
            <a
              key={post.id}
              href={`/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--background)] transition-colors text-sm"
            >
              <p className="font-medium truncate">{post.title}</p>
              <div className="flex items-center gap-2 shrink-0">
                <Eye size={14} className="text-[var(--accent)]" />
                <span className="font-mono font-bold text-[var(--foreground)]">
                  {post.views.toLocaleString("fa-IR")}
                </span>
              </div>
            </a>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-sm opacity-60">
            <p>داده‌ای برای نمایش یافت نشد.</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/admin/statistics/list"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors"
        >
          <span>مشاهده آمار کامل بازدیدها</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
};

// کامپوننت سفارشی برای Tooltip نمودار
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--background)] p-3 rounded-lg shadow-lg border border-[var(--muted)]">
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-[var(--primary)] mt-1">
          تعداد پست:{" "}
          <span className="font-bold">
            {payload[0].value.toLocaleString("fa-IR")}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// کامپوننت اصلی داشبورد
export default function DashboardClient({ initialStats: stats }) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const formatYAxis = (tickItem) => tickItem.toLocaleString("fa-IR");

  return (
    <div className="p-4 md:p-6 bg-[var(--background)] text-[var(--foreground)]">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">داشبورد تحلیلی</h1>
        <p className="text-md text-gray-500 mt-1">
          نمای کلی و به‌روز از آمار وب‌سایت شما
        </p>
      </header>

      <main className="grid grid-cols-12 gap-5">
        {/* نوار آمار کلیدی (با جابجایی "کل بازدیدها" و "بازدید امروز") */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="پست‌های منتشر شده"
            value={stats.kpis.totalPosts}
            icon={<FileText size={20} className="text-gray-400" />}
          />
          {/* "بازدید امروز" به جایگاه دوم منتقل شد */}
          <StatCard
            title="بازدید امروز"
            value={stats.kpis.todayViews}
            icon={<Clock size={20} className="text-gray-400" />}
          />
          {/* "کل بازدیدها" به جایگاه سوم منتقل شد */}
          <StatCard
            title="کل بازدیدها"
            value={stats.kpis.totalViews}
            icon={<Eye size={20} className="text-gray-400" />}
          />
          <StatCard
            title="دیدگاه‌ها"
            value={stats.kpis.approvedComments}
            subtitle={`${(stats.kpis.pendingComments || 0).toLocaleString(
              "fa-IR"
            )} در انتظار تایید`}
            icon={<MessageSquare size={20} className="text-gray-400" />}
          />
        </div>

        {/* پست‌های پربازدید (به ردیف اول منتقل شد) */}
        <div className="col-span-12 lg:col-span-7">
          <TopPostsWidget topPosts={stats.topPosts} />
        </div>

        {/* تحلیل دسته‌بندی‌ها (در کنار پست‌های پربازدید در ردیف اول قرار گرفت) */}
        <div className="col-span-12 lg:col-span-5 bg-[var(--muted)] p-5 rounded-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
            <BookOpen size={20} className="text-blue-500" /> تحلیل دسته‌بندی‌ها
          </h3>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 text-xs text-gray-500 font-semibold px-2 pb-2 border-b border-[var(--background)]">
              <div className="col-span-3">عنوان دسته‌بندی</div>
              <div className="text-center">پست‌ها</div>
              <div className="text-center">بازدید کل</div>
            </div>
            <div className="space-y-1">
              {stats.categoryPerformance.slice(0, 5).map((cat) => (
                <div
                  key={cat.slug}
                  className="grid grid-cols-5 gap-4 items-center p-2 rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  <div className="col-span-3 font-semibold text-sm text-[var(--foreground)]">
                    {cat.name}
                  </div>
                  <div className="text-center font-mono text-sm">
                    {cat.post_count.toLocaleString("fa-IR")}
                  </div>
                  <div className="text-center font-mono font-bold text-sm text-[var(--accent)]">
                    {cat.total_views.toLocaleString("fa-IR")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* روند تولید محتوا (نمودار پویا) (به ردیف دوم منتقل شد) */}
        <div className="col-span-12 lg:col-span-8 bg-[var(--muted)] p-5 rounded-xl">
          <h3 className="font-bold mb-5 text-lg">روند تولید محتوا از ابتدا</h3>
          <div className="h-72">
            {stats.contentTrend.some((d) => d["تعداد پست"] > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.contentTrend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: "var(--foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.floor(stats.contentTrend.length / 10)}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "var(--foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "var(--primary)",
                      strokeWidth: 1,
                      strokeDasharray: "3 3",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="تعداد پست"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                هنوز پستی منتشر نشده است.
              </div>
            )}
          </div>
        </div>

        {/* دیدگاه‌های اخیر (در کنار روند تولید محتوا در ردیف دوم قرار گرفت) */}
        <div className="col-span-12 lg:col-span-4 bg-[var(--muted)] p-5 rounded-xl">
          <h3 className="font-bold mb-5 text-lg">دیدگاه‌های اخیر</h3>
          <div className="space-y-4">
            {stats.recentComments.length > 0 ? (
              stats.recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 text-sm border-b border-[var(--background)] pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(comment.author_name)}
                  </div>
                  <div className="flex-grow">
                    <p className="leading-normal">
                      <span className="font-bold">{comment.author_name}</span>{" "}
                      در
                      <a
                        href={`/${comment.post_slug}`}
                        className="text-[var(--primary-light)] hover:underline mx-1 font-semibold"
                      >
                        {comment.post_title}
                      </a>
                    </p>
                    <p className="text-sm text-[var(--foreground)] opacity-70 italic mt-1.5">
                      "{comment.content_snippet}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500 pt-10">
                هنوز دیدگاهی ثبت نشده است.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
