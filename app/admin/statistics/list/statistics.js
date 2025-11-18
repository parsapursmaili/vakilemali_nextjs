// statisticsActions.js
"use server";

import { db } from "@/lib/db/mysql";
import moment from "jalali-moment";

function toGregorian(jalaliDateStr) {
  if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(jalaliDateStr)) {
    return moment().format("YYYY-MM-DD");
  }
  return moment.from(jalaliDateStr, "fa", "YYYY/MM/DD").format("YYYY-MM-DD");
}

export async function getStatisticsData({
  period = "week",
  startDate: jalaliStartDate,
  endDate: jalaliEndDate,
}) {
  try {
    moment.locale("en");
    const today = moment().endOf("day").format("YYYY-MM-DD");
    let startDate, endDate;

    if (period === "custom" && jalaliStartDate && jalaliEndDate) {
      startDate = toGregorian(jalaliStartDate);
      endDate = toGregorian(jalaliEndDate);
    } else {
      switch (period) {
        case "today":
          startDate = moment().startOf("day").format("YYYY-MM-DD");
          endDate = today;
          break;
        // تغییر: افزودن منطق برای بازه "دیروز"
        case "yesterday":
          startDate = moment()
            .subtract(1, "day")
            .startOf("day")
            .format("YYYY-MM-DD");
          endDate = moment()
            .subtract(1, "day")
            .endOf("day")
            .format("YYYY-MM-DD");
          break;
        case "month":
          startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
          endDate = today;
          break;
        case "year":
          startDate = moment().subtract(1, "year").format("YYYY-MM-DD");
          endDate = today;
          break;
        case "all":
          break;
        default:
          startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
          endDate = today;
          break;
      }
    }

    const [[{ first_date }]] = await db.query(
      "SELECT MIN(view_date) as first_date FROM post_view"
    );

    let totalViews = 0,
      posts = [],
      topPost = null;

    if (period === "all") {
      const [[{ total }]] = await db.query(
        "SELECT SUM(view_count) as total FROM posts WHERE status = 'published'"
      );
      totalViews = total || 0;
      const [postRows] = await db.query(
        `SELECT id, title, slug, view_count as period_views FROM posts WHERE status = 'published' AND view_count > 0 ORDER BY period_views DESC`
      );
      posts = postRows;
      if (posts.length > 0)
        topPost = { title: posts[0].title, views: posts[0].period_views };
    } else {
      const [[{ total }]] = await db.query(
        `SELECT SUM(view_count) as total FROM post_view WHERE view_date BETWEEN ? AND ?`,
        [startDate, endDate]
      );
      totalViews = total || 0;
      const [postRows] = await db.query(
        `SELECT p.id, p.title, p.slug, SUM(pv.view_count) as period_views FROM post_view pv JOIN posts p ON pv.post_id = p.id WHERE pv.view_date BETWEEN ? AND ? GROUP BY p.id ORDER BY period_views DESC`,
        [startDate, endDate]
      );
      posts = postRows;
      if (posts.length > 0)
        topPost = { title: posts[0].title, views: posts[0].period_views };
    }

    // اصلاح نهایی و قطعی برای نمایش تاریخ شمسی در earliestDateJalali و range
    moment.locale("fa");
    return {
      totalViews,
      topPost,
      posts,
      earliestDateJalali: first_date
        ? moment(first_date).format("jYYYY/jMM/jDD")
        : "نامشخص",
      range:
        period === "all"
          ? "کل دوران"
          : `از ${moment(startDate, "YYYY-MM-DD").format(
              "jYYYY/jMM/jDD"
            )} تا ${moment(endDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD")}`,
    };
  } catch (error) {
    console.error("Statistics Data Error:", error.message);
    return {
      totalViews: 0,
      topPost: null,
      posts: [],
      earliestDateJalali: "",
      range: "خطا در پردازش",
    };
  }
}

// تابع نمودار
export async function getPostChartData({
  postId,
  period,
  startDate: jalaliStartDate,
  endDate: jalaliEndDate,
}) {
  if (period === "all" || !postId) return [];
  moment.locale("en");
  const today = moment().endOf("day").format("YYYY-MM-DD");
  let startDate, endDate;
  if (period === "custom" && jalaliStartDate && jalaliEndDate) {
    startDate = toGregorian(jalaliStartDate);
    endDate = toGregorian(jalaliEndDate);
  } else {
    switch (period) {
      case "today":
        startDate = moment().format("YYYY-MM-DD");
        endDate = today;
        break;
      // تغییر: افزودن منطق برای بازه "دیروز"
      case "yesterday":
        startDate = moment()
          .subtract(1, "day")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().subtract(1, "day").endOf("day").format("YYYY-MM-DD");
        break;
      case "month":
        startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
        endDate = today;
        break;
      case "year":
        startDate = moment().subtract(1, "year").format("YYYY-MM-DD");
        endDate = today;
        break;
      default:
        startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
        endDate = today;
        break;
    }
  }

  const [dailyData] = await db.query(
    `SELECT view_date, view_count FROM post_view WHERE post_id = ? AND view_date BETWEEN ? AND ? ORDER BY view_date ASC`,
    [postId, startDate, endDate]
  );
  moment.locale("fa");
  return dailyData.map((d) => ({
    date: moment(d.view_date).format("jYYYY/jM/jD"),
    views: d.view_count,
  }));
}
