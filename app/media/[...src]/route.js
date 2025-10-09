import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

// 📁 مسیرهای ثابت
const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR = path.join(PUBLIC_DIR, "image-cache");
const UPLOAD_DIRS = ["uploads"]; // اگر فولدر دیگه‌ای داری، اضافه کن اینجا

// 🔹 بررسی وجود فایل
async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// 🔹 ساخت پوشه در صورت نیاز
async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

// 🔹 جلوگیری از مسیر ناامن
function isSafeRelative(relPath) {
  return relPath && !relPath.includes("..") && !path.isAbsolute(relPath);
}

// 🧩 Route Handler اصلی
export async function GET(req, context) {
  const { params } = await context;

  if (!params?.src || params.src.length === 0) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  const relPath = params.src.join("/");

  if (!isSafeRelative(relPath)) {
    return NextResponse.json({ error: "Unsafe path" }, { status: 400 });
  }

  // خواندن پارامترهای width و quality
  const { searchParams } = new URL(req.url);
  const width = parseInt(searchParams.get("w")) || 1200;
  const quality = parseInt(searchParams.get("q")) || 75;

  const cachePath = path.join(CACHE_DIR, relPath.replace(/\.[^.]+$/, ".webp"));
  const cacheDir = path.dirname(cachePath);

  // ✅ اگر فایل cache شده وجود داره، همونو بده
  if (await fileExists(cachePath)) {
    const stream = fs.createReadStream(cachePath);
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // 🔍 پیدا کردن فایل اصلی در uploads
  let originalPath = null;
  for (const dir of UPLOAD_DIRS) {
    const candidate = path.join(PUBLIC_DIR, dir, relPath);
    if (await fileExists(candidate)) {
      originalPath = candidate;
      break;
    }
  }

  if (!originalPath) {
    console.error("❌ Original image not found:", relPath);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // ✅ پردازش تصویر با sharp
  const buffer = await fsp.readFile(originalPath);
  const optimizedBuffer = await sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();

  // ذخیره در cache
  await ensureDir(cacheDir);
  await fsp.writeFile(cachePath, optimizedBuffer, { mode: 0o644 });

  // ارسال خروجی
  return new NextResponse(optimizedBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
