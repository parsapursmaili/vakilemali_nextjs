import { db } from "@/lib/db/mysql";

export default async function sitemap() {
  const baseUrl = "https://vakilemali.com";

  // گرفتن همه پست‌های منتشر شده
  const [posts] = await db.query(
    `SELECT slug, updated_at 
     FROM posts 
     WHERE status = 'published' 
     AND (redirect_url IS NULL OR redirect_url = '')`,
  );

  // گرفتن آخرین زمان ویرایش کل سایت
  const [latestResult] = await db.query(
    `SELECT MAX(updated_at) as lastUpdated 
     FROM posts 
     WHERE status = 'published' 
     AND (redirect_url IS NULL OR redirect_url = '')`,
  );

  const latestPostDate = latestResult[0]?.lastUpdated
    ? new Date(latestResult[0].lastUpdated)
    : new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...postUrls];
}
