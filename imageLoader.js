// src/components/imageLoader.js
// 🛑 "use server" را حذف کنید
// 🛑 'async' را حذف کنید

export default function customImageLoader({ src, width, quality }) {
  // 'async' حذف شده
  try {
    if (src.includes("/upload")) {
      const idx = src.search(/uploads?\//i);
      if (idx === -1) return src;

      const relPath = src.slice(idx + (src[idx + 7] === "s" ? 8 : 7));
      // width و quality هم می‌توانند به URL اضافه شوند اگر API شما از آنها پشتیبانی کند
      // در API شما این پارامترها فعلاً استفاده نمی‌شوند، اما می‌توانید آنها را در لودر پاس دهید
      return `/api/image/${encodeURI(relPath)}?w=${width || 1200}&q=${
        quality || 75
      }`;
    }

    // برای سایر تصاویر که از مسیر /upload نیستند
    return src;
  } catch {
    // در صورت بروز خطا، مسیر اصلی را برگردان
    return src;
  }
}
