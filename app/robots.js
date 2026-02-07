// app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login", "/*?*"],
      },
    ],
    sitemap: "https://vakilemali.com/sitemap.xml",
  };
}
