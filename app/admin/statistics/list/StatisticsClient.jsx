"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  Calendar,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import PostChartModal from "./PostChartModal";
import {
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function StatisticsClient({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [modalPost, setModalPost] = useState(null);
  const [showMainChart, setShowMainChart] = useState(false);

  const activePeriod = searchParams.get("period") || "today";

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) =>
      v ? params.set(k, v) : params.delete(k)
    );
    startTransition(() => router.push(`?${params.toString()}`));
  };

  return (
    <div
      className={`space-y-6 md:space-y-8 animate-in fade-in duration-500 ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-[var(--muted)] shadow-sm flex flex-col justify-between min-h-[280px]">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[var(--primary)] mb-2">
              گزارش بازدیدها
            </h1>
            <p className="text-gray-500 font-bold flex items-center gap-2 text-sm md:text-base">
              <Calendar size={18} className="text-[var(--accent)]" />{" "}
              {initialData.rangeLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 md:mt-8">
            {[
              { id: "today", label: "امروز" },
              { id: "yesterday", label: "دیروز" },
              { id: "week", label: "هفته" },
              { id: "month", label: "ماه" },
              { id: "year", label: "سال" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => updateParams({ period: p.id })}
                className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                  activePeriod === p.id
                    ? "bg-[var(--primary)] text-white shadow-md scale-105"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setShowMainChart(!showMainChart)}
              className="px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-black bg-[var(--accent)] text-white flex items-center gap-2 shadow-md hover:opacity-90"
            >
              <BarChart3 size={16} />{" "}
              {showMainChart ? "نمایش لیست" : "نمودار کلی"}
            </button>
          </div>
        </div>

        <div className="bg-[var(--primary)] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl flex flex-col justify-center items-center relative overflow-hidden min-h-[280px]">
          <Eye className="absolute -bottom-6 -left-6 w-32 md:w-48 h-32 md:h-48 opacity-10 text-white" />
          <p className="text-xs md:text-sm font-bold text-blue-200 mb-2 uppercase tracking-widest relative z-10">
            مجموع بازدید بازه
          </p>
          <h2 className="!text-5xl md:text-9xl font-black italic relative z-10 leading-none !text-blue-100">
            {(Number(initialData.totalViews) || 0).toLocaleString("fa-IR")}
          </h2>
        </div>
      </div>

      {showMainChart ? (
        <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-[var(--muted)] h-[400px] md:h-[500px] shadow-sm animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-black flex items-center gap-2 text-[var(--primary)]">
              <TrendingUp size={24} className="text-[var(--accent)]" />
              روند ترافیک سایت ({activePeriod === "year"
                ? "یک سال"
                : "۳۰ روز"}{" "}
              اخیر)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={initialData.overallTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  direction: "rtl",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
                formatter={(val) => [
                  val.toLocaleString("fa-IR") + " بازدید",
                  "",
                ]}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--primary)"
                strokeWidth={4}
                fill="var(--primary)"
                fillOpacity={0.05}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-[var(--muted)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 md:p-6 text-xs font-bold text-gray-400 uppercase w-16">
                    #
                  </th>
                  <th className="p-4 md:p-6 text-xs font-bold text-gray-400 uppercase text-right">
                    عنوان محتوا
                  </th>
                  <th className="p-4 md:p-6 text-xs font-bold text-gray-400 uppercase text-center w-32">
                    بازدید
                  </th>
                  <th className="p-4 md:p-6 text-xs font-bold text-gray-400 uppercase text-center w-40">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialData.posts &&
                  initialData.posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="group hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4 md:p-6 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="p-4 md:p-6">
                        <a
                          href={`/${post.slug}`}
                          target="_blank"
                          className="font-semibold text-sm md:text-base text-gray-900 hover:text-[var(--primary-light)] transition-colors flex items-center gap-2"
                        >
                          {post.title}{" "}
                          <ArrowUpRight
                            size={14}
                            className="hidden md:block opacity-0 group-hover:opacity-100"
                          />
                        </a>
                      </td>
                      <td className="p-4 md:p-6 text-center font-mono font-bold text-base md:text-lg text-gray-700">
                        {Number(post.period_views).toLocaleString()}
                      </td>
                      <td className="p-4 md:p-6 text-center">
                        <button
                          onClick={() => setModalPost(post)}
                          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[11px] font-bold hover:border-[var(--primary)] hover:shadow-md transition-all flex items-center gap-2 mx-auto text-gray-600"
                        >
                          <BarChart3
                            size={16}
                            className="text-[var(--accent)]"
                          />{" "}
                          <span>نمودار اختصاصی</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                {(!initialData.posts || initialData.posts.length === 0) && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-16 text-center text-gray-400 font-medium"
                    >
                      داده‌ای برای نمایش یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PostChartModal
        post={modalPost}
        isOpen={!!modalPost}
        onClose={() => setModalPost(null)}
        period={activePeriod}
      />
    </div>
  );
}
