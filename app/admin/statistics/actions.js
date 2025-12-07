"use server";

import { db } from "@/lib/db/mysql";
import moment from "jalali-moment";

export async function getDashboardStatistics() {
  try {
    // شرط مشترک برای شناسایی "پست‌های اصلی"
    // شامل: وضعیت منتشر شده، تایپ پست، و نداشتن ریدایرکت (خالی یا NULL)
    const mainPostCondition = `
      status = 'published' 
      AND type = 'post' 
      AND (redirect_url IS NULL OR redirect_url = '')
    `;

    const [
      kpiResults,
      allPostsDates,
      categoryPerformance,
      topPostsAll,
      topPostsMonth,
      topPostsDay,
      recentComments,
    ] = await Promise.all([
      // 1. KPIs
      db.query(`
        SELECT
          (SELECT COUNT(id) FROM posts WHERE ${mainPostCondition}) as totalPosts,
          (SELECT IFNULL(SUM(view_count), 0) FROM posts WHERE status = 'published') as totalViews,
          (SELECT IFNULL(SUM(view_count), 0) FROM post_view WHERE view_date = CURDATE()) as todayViews,
          (SELECT COUNT(id) FROM comments WHERE status = 'approved') as approvedComments,
          (SELECT COUNT(id) FROM comments WHERE status = 'pending') as pendingComments;
      `),
      // 2. Get dates ONLY for main posts (for the chart)
      db.query(`
        SELECT created_at FROM posts WHERE ${mainPostCondition}
      `),
      // 3. Category Performance Analysis (No changes needed based on previous request)
      db.query(`
        SELECT t.name, t.slug, COUNT(p.id) as post_count, IFNULL(SUM(p.view_count), 0) as total_views
        FROM terms t
        LEFT JOIN post_terms pt ON t.id = pt.term_id
        LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'published'
        GROUP BY t.id
        ORDER BY total_views DESC;
      `),
      // 4. Top posts (Keeping general published posts or you can apply mainPostCondition if needed)
      db.query(
        `SELECT id, title, slug, view_count as views FROM posts WHERE status = 'published' AND view_count > 0 ORDER BY view_count DESC LIMIT 5;`
      ),
      db.query(
        `SELECT p.id, p.title, p.slug, SUM(pv.view_count) as views FROM post_view pv JOIN posts p ON pv.post_id = p.id WHERE pv.view_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND p.status = 'published' GROUP BY p.id ORDER BY views DESC LIMIT 5;`
      ),
      db.query(
        `SELECT p.id, p.title, p.slug, SUM(pv.view_count) as views FROM post_view pv JOIN posts p ON pv.post_id = p.id WHERE pv.view_date = CURDATE() AND p.status = 'published' GROUP BY p.id ORDER BY views DESC LIMIT 5;`
      ),
      // 5. Recent Comments
      db.query(`
        SELECT c.id, c.author_name, c.content, p.title as post_title, p.slug as post_slug
        FROM comments c JOIN posts p ON c.post_id = p.id
        WHERE c.status = 'approved' ORDER BY c.created_at DESC LIMIT 3;
      `),
    ]);

    moment.locale("fa");

    const jalaliMonthlyCounts = {};

    for (const post of allPostsDates[0]) {
      const jalaliMonthKey = moment(post.created_at).format("jYYYY-jMM");
      if (jalaliMonthlyCounts[jalaliMonthKey]) {
        jalaliMonthlyCounts[jalaliMonthKey]++;
      } else {
        jalaliMonthlyCounts[jalaliMonthKey] = 1;
      }
    }

    const contentData = Object.keys(jalaliMonthlyCounts)
      .sort()
      .map((jalaliMonthKey) => {
        return {
          name: moment(jalaliMonthKey, "jYYYY-jMM").format("jMMMM jYYYY"),
          "تعداد پست": jalaliMonthlyCounts[jalaliMonthKey],
        };
      });

    return {
      kpis: kpiResults[0][0],
      contentTrend: contentData,
      categoryPerformance: categoryPerformance[0].map((cat) => ({
        ...cat,
        avg_views: cat.post_count > 0 ? cat.total_views / cat.post_count : 0,
      })),
      topPosts: {
        allTime: topPostsAll[0],
        month: topPostsMonth[0],
        day: topPostsDay[0],
      },
      recentComments: recentComments[0].map((c) => ({
        ...c,
        content_snippet: c.content.substring(0, 70) + "...",
      })),
    };
  } catch (error) {
    console.error("Dashboard Data Fetching Error:", error);
    return {
      kpis: {
        totalPosts: 0,
        totalViews: 0,
        todayViews: 0,
        approvedComments: 0,
        pendingComments: 0,
      },
      contentTrend: [],
      categoryPerformance: [],
      topPosts: { allTime: [], month: [], day: [] },
      recentComments: [],
      error: "خطا در دریافت اطلاعات داشبورد",
    };
  }
}
