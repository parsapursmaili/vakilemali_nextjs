import { NextResponse } from "next/server";
import path from "path";
import { readdir, stat } from "fs/promises";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// تابع بازگشتی برای پیدا کردن تمام فایل‌های تصویر در پوشه‌ها
async function findImageFiles(dir) {
  let imageFiles = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // اگر ورودی یک پوشه بود، تابع را برای آن پوشه دوباره اجرا کن
        imageFiles = imageFiles.concat(await findImageFiles(fullPath));
      } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(entry.name)) {
        // اگر یک فایل تصویر بود، اطلاعات آن را اضافه کن
        const stats = await stat(fullPath);
        const relativePath = path.relative(
          path.join(process.cwd(), "public"),
          fullPath
        );

        imageFiles.push({
          url: `/${relativePath.replace(/\\/g, "/")}`, // اطمینان از اسلش‌های صحیح در URL
          name: entry.name,
          createdAt: stats.mtime.toISOString(),
        });
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // اگر پوشه وجود نداشت خطا نده، در غیر این صورت لاگ کن
      console.error(`Error reading directory ${dir}:`, error);
    }
  }
  return imageFiles;
}

export async function GET() {
  try {
    const allFiles = await findImageFiles(UPLOADS_DIR);

    // مرتب‌سازی همه فایل‌ها از جدیدترین به قدیمی‌ترین
    allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, files: allFiles });
  } catch (error) {
    console.error("Media API Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در خواندن فایل‌های رسانه." },
      { status: 500 }
    );
  }
}
