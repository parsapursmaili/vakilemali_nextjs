import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR_NAME = "cache"; // public/cache
const UPLOAD_DIR_NAMES = ["upload", "uploads"]; // public/upload یا public/uploads

// بررسی امنیت مسیر (جلوگیری از دسترسی به فایل‌های خارج از public)
function isSafeRelative(p) {
  const normalized = path.posix.normalize(p);
  return !normalized.split("/").some((segment) => segment === "..");
}

// ساخت دایرکتوری اگر وجود ندارد
async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

// چک کن فایل وجود دارد یا نه
async function fileExists(filePath) {
  try {
    const st = await fsp.stat(filePath);
    return st.isFile();
  } catch {
    return false;
  }
}

export async function GET(req, { params }) {
  try {
    if (!params?.src || params.src.length === 0) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    const rawSegments = params.src.map((seg) => decodeURIComponent(seg));
    const relPath = rawSegments.join("/");

    // مسیر امن باشه
    if (!isSafeRelative(relPath)) {
      return NextResponse.json({ error: "Unsafe path" }, { status: 400 });
    }

    // مسیر کامل کش و آپلود
    const cacheFullPath = path.join(PUBLIC_DIR, CACHE_DIR_NAME, relPath);
    const cacheDirForFile = path.dirname(cacheFullPath);

    // اگر فایل webp کش شده وجود دارد => همان را بده
    if (await fileExists(cacheFullPath)) {
      const stream = fs.createReadStream(cacheFullPath);
      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable", // کش مرورگر تا 1 سال
        },
      });
    }

    // در پوشه‌های upload دنبال فایل بگرد
    let foundOriginal = null;
    for (const up of UPLOAD_DIR_NAMES) {
      const candidate = path.join(PUBLIC_DIR, up, relPath);
      if (await fileExists(candidate)) {
        foundOriginal = candidate;
        break;
      }
    }

    // اگه فایل اصلی نبود
    if (!foundOriginal) {
      return NextResponse.json(
        { error: "Original not found" },
        { status: 404 }
      );
    }

    // آماده کردن مسیر کش
    await ensureDir(cacheDirForFile);

    // خواندن فایل اصلی
    const imageBuffer = await fsp.readFile(foundOriginal);

    // تبدیل به webp (حتی اگه خودش webp باشه برای اطمینان دوباره می‌سازه)
    const convertedBuffer = await sharp(imageBuffer)
      .webp({ quality: 75 })
      .toBuffer();

    // ذخیره در کش
    await fsp.writeFile(cacheFullPath, convertedBuffer, { mode: 0o644 });

    // برگردوندن تصویر به کاربر
    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(convertedBuffer.length),
        "Cache-Control": "public, max-age=31536000, immutable", // کش مرورگر تا 1 سال
      },
    });
  } catch (err) {
    console.error("image-api-error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
