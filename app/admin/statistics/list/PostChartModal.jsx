"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPostChartData } from "./statisticsActions";
import { X, TrendingUp } from "lucide-react";

export default function PostChartModal({ post, isOpen, onClose, period }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setLoading(true);
      getPostChartData({ postId: post.id, period }).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen, post, period]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 w-full max-w-4xl shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-[var(--primary)] flex items-center gap-2">
              <TrendingUp className="text-[var(--accent)]" /> تحلیل روند بازدید
            </h3>
            <p className="text-gray-500 font-bold mt-1 text-sm md:text-base">
              {post.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-64 md:h-80 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center font-bold text-gray-400">
              در حال دریافت داده‌ها...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--accent)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 600 }}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                    direction: "rtl",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="بازدید"
                  stroke="var(--accent)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPost)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
