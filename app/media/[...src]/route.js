import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const CACHE_DIR = path.join(PUBLIC_DIR, "image-cache");
const UPLOAD_DIRS = ["uploads"];
const CONFIG = { width: 720, quality: 75, maxAge: 31536000 };

// پاسخ‌دهی به صورت Stream برای جلوگیری از پر شدن RAM
function streamFile(filePath, size) {
  const stream = fs.createReadStream(filePath);
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": size.toString(),
      "Cache-Control": `public, max-age=${CONFIG.maxAge}, immutable`,
    },
  });
}

export async function GET(_, { params }) {
  try {
    const { src } = params;
    if (!src?.length)
      return new NextResponse("Invalid request", { status: 400 });

    // امنیت: دیکد کردن، حذف کاراکترهای مخرب و Null Byte
    const rawPath = src.map(decodeURIComponent).join("/");
    if (rawPath.includes("\0"))
      return new NextResponse("Malicious path", { status: 400 });

    // نرمال‌سازی مسیر برای جلوگیری از Directory Traversal
    const relPath = path.normalize(rawPath).replace(/^(\.\.(\/|\\|$))+/, "");
    const ext = path.extname(relPath);
    const nameNoExt = relPath.slice(0, -ext.length);

    // مسیر فایل کش شده
    const cachePath = path.join(CACHE_DIR, `${nameNoExt}.webp`);

    // امنیت: اطمینان از اینکه مسیر نهایی حتماً داخل پوشه Public است
    if (!cachePath.startsWith(PUBLIC_DIR))
      return new NextResponse("Forbidden", { status: 403 });

    // 1. اگر فایل در کش موجود است، سریعاً استریم کن
    try {
      const stats = await fsp.stat(cachePath);
      if (stats.isFile()) return streamFile(cachePath, stats.size);
    } catch {
      /* ادامه پردازش در صورت نبود کش */
    }

    // 2. جستجوی فایل اصلی در دایرکتوری‌ها
    let originalPath = null;
    const searchExts = new Set([
      ext.toLowerCase(),
      ".webp",
      ".jpg",
      ".jpeg",
      ".png",
    ]);
    const cleanName = nameNoExt.replace(/^uploads[\/\\]/, ""); // حذف پیشوند احتمالی

    searchLoop: for (const dir of UPLOAD_DIRS) {
      for (const searchExt of searchExts) {
        const testPath = path.join(PUBLIC_DIR, dir, `${cleanName}${searchExt}`);
        // جلوگیری از خروج از Public در هنگام جستجو
        if (!testPath.startsWith(PUBLIC_DIR)) continue;

        try {
          await fsp.access(testPath, fs.constants.F_OK);
          originalPath = testPath;
          break searchLoop;
        } catch {
          continue;
        }
      }
    }

    if (!originalPath) return new NextResponse("Not Found", { status: 404 });

    // 3. پردازش و ذخیره در کش
    await fsp.mkdir(path.dirname(cachePath), { recursive: true });

    if (path.extname(originalPath).toLowerCase() === ".webp") {
      // کپی مستقیم برای WebP (سریع‌ترین حالت)
      await fsp.copyFile(originalPath, cachePath);
    } else {
      // تبدیل و بهینه‌سازی مستقیم روی دیسک (بدون اشغال Buffer در رم)
      await sharp(originalPath)
        .resize({ width: CONFIG.width, withoutEnlargement: true })
        .webp({ quality: CONFIG.quality })
        .toFile(cachePath);
    }

    const finalStats = await fsp.stat(cachePath);
    return streamFile(cachePath, finalStats.size);
  } catch (error) {
    console.error("IMG API Error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
