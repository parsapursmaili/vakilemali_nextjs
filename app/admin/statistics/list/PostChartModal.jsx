// PostChartModal.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getPostChartData } from "./statistics";

const ChartLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-12 h-12 border-4 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></div>
  </div>
);

export default function PostChartModal({ post, isOpen, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isOpen && post) {
      const fetchChartData = async () => {
        setIsLoading(true);
        const period = searchParams.get("period") || "week";
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const data = await getPostChartData({
          postId: post.id,
          period,
          startDate,
          endDate,
        });
        setChartData(data);
        setIsLoading(false);
      };
      fetchChartData();
    }
  }, [isOpen, post, searchParams]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--background)] rounded-xl shadow-2xl p-6 w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-[var(--muted)] pb-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              آمار بازدید روزانه
            </h3>
            <p className="text-sm text-[var(--foreground)] opacity-80">
              {post.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-[var(--destructive)]"
          >
            &times;
          </button>
        </div>
        <div className="h-80">
          {isLoading ? (
            <ChartLoader />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
                <XAxis dataKey="date" tick={{ fill: "var(--foreground)" }} />
                <YAxis tick={{ fill: "var(--foreground)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--muted)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="بازدید"
                  stroke="var(--primary-light)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center pt-16">
              داده‌ای برای نمایش نمودار در این بازه وجود ندارد.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
