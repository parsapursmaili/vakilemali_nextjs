// app/media/[...src]/route.js (نسخه نهایی با ریسایز عرض ثابت و نام فایل ساده)
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

// 📁 تنظیمات ثابت
const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR = path.join(PUBLIC_DIR, "image-cache");
const UPLOAD_DIRS = ["uploads"];
const FINAL_WIDTH = 720; // 💡 عرض ثابت نهایی
const FINAL_QUALITY = 85;
const CACHE_MAX_AGE = 31536000; 

// 🔹 توابع کمکی
async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}
function isSafeRelative(relPath) {
  return relPath && !relPath.includes("..") && !path.isAbsolute(relPath);
}

// 🧩 Route Handler اصلی
export async function GET(req, context) {
  const { params } = context;
  const { src } = params;

  if (!src || src.length === 0) {
    return new NextResponse("No path provided", { status: 400 });
  }

  let relPath = src.join("/");
  if (!isSafeRelative(relPath)) {
    return new NextResponse("Unsafe path", { status: 400 });
  } // 💡 نام فایل کش نهایی: حذف پارامترهای سایز و تبدیل پسوند به .webp

  const originalExtension = path.extname(relPath);
  const pathWithoutExt = relPath.slice(0, -originalExtension.length); // 💡 نام کش فقط پسوند .webp را می‌گیرد
  const cacheFileName = pathWithoutExt + `.webp`;
  const cachePath = path.join(CACHE_DIR, cacheFileName);
  const cacheDir = path.dirname(cachePath); // ✅ 1. جستجو در کش

  if (await fileExists(cachePath)) {
    const stream = fs.createReadStream(cachePath);
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
      },
    });
  } // 🔍 2. پیدا کردن فایل اصلی در uploads

  let originalPath = null;
  const possibleExtensions = [
    originalExtension,
    ".webp",
    ".jpg",
    ".jpeg",
    ".png",
    ".JPG",
    ".PNG",
  ]; // 💡 حذف "uploads/" از ابتدای مسیر برای جلوگیری از تکرار در path.join

  const pathWithoutExtAndUploads = pathWithoutExt.startsWith("uploads/")
    ? pathWithoutExt.substring("uploads/".length)
    : pathWithoutExt;

  for (const dir of UPLOAD_DIRS) {
    for (const ext of possibleExtensions) {
      const finalSearchPath = path.join(
        PUBLIC_DIR,
        dir,
        pathWithoutExtAndUploads + ext
      );

      if (await fileExists(finalSearchPath)) {
        originalPath = finalSearchPath;
        break;
      }
    }
    if (originalPath) break;
  }

  if (!originalPath) {
    return new NextResponse("Image not found", { status: 404 });
  }

  await ensureDir(cacheDir); // 💡 3. پردازش: فقط ریسایز به عرض 720 پیکسل (بدون کراپ) و تبدیل به WebP

  const optimizedBuffer = await sharp(originalPath)
    .resize({
      width: FINAL_WIDTH,
      withoutEnlargement: true, // 💡 از بزرگنمایی تصاویر کوچک جلوگیری می‌کند
    })
    .webp({ quality: FINAL_QUALITY })
    .toBuffer(); // ذخیره در cache

  await fsp.writeFile(cachePath, optimizedBuffer, { mode: 0o644 }); // ارسال خروجی

  return new NextResponse(optimizedBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
    },
  });
}
