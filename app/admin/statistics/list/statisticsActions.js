"use server";

import { db } from "@/lib/db/mysql";
import moment from "jalali-moment";

const toGregorian = (jalaliDateStr) => {
  try {
    return moment.from(jalaliDateStr, "fa", "YYYY/MM/DD").format("YYYY-MM-DD");
  } catch (e) {
    return moment().format("YYYY-MM-DD");
  }
};

export async function getStatisticsData({
  period = "today",
  startDate,
  endDate,
}) {
  try {
    moment.locale("en");
    let start,
      end = moment().format("YYYY-MM-DD");

    const ranges = {
      today: 0,
      yesterday: 1,
      week: 7,
      month: 30,
      year: 365,
      all: 1000, // فرض برای کل دوران
    };

    if (period === "custom" && startDate && endDate) {
      start = toGregorian(startDate);
      end = toGregorian(endDate);
    } else {
      start = moment()
        .subtract(ranges[period] || 0, "days")
        .format("YYYY-MM-DD");
      if (period === "yesterday") end = start;
    }

    // آمار کل بازه انتخابی
    const [[{ totalViews }]] = await db.query(
      `SELECT IFNULL(SUM(view_count), 0) as totalViews FROM post_view WHERE view_date BETWEEN ? AND ?`,
      [start, end]
    );

    const [posts] = await db.query(
      `SELECT p.id, p.title, p.slug, SUM(pv.view_count) as period_views 
       FROM post_view pv JOIN posts p ON pv.post_id = p.id 
       WHERE pv.view_date BETWEEN ? AND ? 
       GROUP BY p.id ORDER BY period_views DESC`,
      [start, end]
    );

    // منطق نمودار: اگر بازه کمتر از ۳۰ روز است، ۳۰ روز نشان بده. اگر بیشتر است (مثل سال)، همان بازه را نشان بده.
    const diffInDays = moment(end).diff(moment(start), "days");
    const chartDays = Math.max(30, diffInDays);
    const chartStart = moment(end)
      .subtract(chartDays, "days")
      .format("YYYY-MM-DD");

    const [overallTrend] = await db.query(
      `SELECT view_date as date, SUM(view_count) as views 
       FROM post_view WHERE view_date BETWEEN ? AND ? 
       GROUP BY view_date ORDER BY view_date ASC`,
      [chartStart, end]
    );

    // تبدیل تاریخ به شمسی با فرمت صحیح
    const formatJalali = (date) =>
      moment(date, "YYYY-MM-DD").locale("fa").format("jYYYY/jMM/jDD");

    return {
      totalViews,
      posts,
      overallTrend: overallTrend.map((d) => ({
        date: moment(d.date).locale("fa").format("jMM/jDD"),
        views: d.views,
      })),
      rangeLabel: `از ${formatJalali(start)} تا ${formatJalali(end)}`,
      topPost: posts[0] || null,
      currentPeriod: period,
    };
  } catch (error) {
    console.error(error);
    return { error: "خطا در بارگذاری داده‌ها" };
  }
}

export async function getPostChartData({ postId, period }) {
  moment.locale("en");
  const end = moment().format("YYYY-MM-DD");

  // اگر بازه سالانه است ۳۶۵ روز، در غیر این صورت حداقل ۳۰ روز
  const days = period === "year" ? 365 : 30;
  const start = moment(end).subtract(days, "days").format("YYYY-MM-DD");

  const [dailyData] = await db.query(
    `SELECT view_date, view_count FROM post_view 
     WHERE post_id = ? AND view_date BETWEEN ? AND ? 
     ORDER BY view_date ASC`,
    [postId, start, end]
  );

  return dailyData.map((d) => ({
    date: moment(d.view_date).locale("fa").format("jMM/jDD"),
    views: d.view_count,
  }));
}
