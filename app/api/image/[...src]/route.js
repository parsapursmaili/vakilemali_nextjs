import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

// --- مسیرهای اصلی پروژه ---
const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR_NAME = "image-cache";
const UPLOAD_DIR_NAMES = ["uploads"]; // لیست پوشه‌های منبع تصاویر

/**
 * بررسی می‌کند که آیا یک مسیر نسبی امن است (برای جلوگیری از حملات Directory Traversal).
 * @param {string} relPath - مسیر نسبی فایل.
 * @returns {boolean}
 */
function isSafeRelativePath(relPath) {
  if (!relPath) return false;
  // جلوگیری از مسیرهای شامل '..' یا مسیرهای مطلق
  return !relPath.includes("..") && !path.isAbsolute(relPath);
}

/**
 * اطمینان حاصل می‌کند که دایرکتوری مورد نظر وجود دارد، در غیر این صورت آن را می‌سازد.
 * @param {string} dirPath - مسیر دایرکتوری.
 */
async function ensureDirExists(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // اگر دایرکتوری از قبل وجود داشته باشد، خطا را نادیده بگیر.
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * فایل اصلی تصویر را در پوشه‌های منبع جستجو می‌کند.
 * @param {string} relPath - مسیر نسبی فایل.
 * @returns {Promise<string|null>} مسیر کامل فایل در صورت یافتن، در غیر این صورت null.
 */
async function findOriginalImagePath(relPath) {
  for (const uploadDir of UPLOAD_DIR_NAMES) {
    const fullPath = path.join(PUBLIC_DIR, uploadDir, relPath);
    try {
      await fsp.access(fullPath);
      return fullPath;
    } catch {
      // فایل در این پوشه وجود ندارد، ادامه جستجو
      continue;
    }
  }
  return null;
}

export async function GET(req, { params }) {
  try {
    const relPath = params?.src?.join("/");

    if (!relPath) {
      return NextResponse.json(
        { error: "Image path is required." },
        { status: 400 }
      );
    }

    if (!isSafeRelativePath(relPath)) {
      return NextResponse.json(
        { error: "Invalid or unsafe path." },
        { status: 400 }
      );
    }

    const cacheFullPath = path.join(PUBLIC_DIR, CACHE_DIR_NAME, relPath);
    const cacheDir = path.dirname(cacheFullPath);

    // ۱. ابتدا بررسی کن آیا نسخه کش شده تصویر وجود دارد یا خیر
    try {
      await fsp.access(cacheFullPath);
      const stream = fs.createReadStream(cacheFullPath);
      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable", // هدر کش برای مرورگر
        },
      });
    } catch {
      // فایل در کش وجود ندارد، ادامه بده تا ساخته شود.
    }

    // ۲. فایل اصلی را پیدا کن
    const originalPath = await findOriginalImagePath(relPath);

    if (!originalPath) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    // اطمینان از وجود پوشه کش
    await ensureDirExists(cacheDir);

    const isOriginalWebP = path.extname(originalPath).toLowerCase() === ".webp";

    // ۳. پردازش و کش کردن تصویر
    if (isOriginalWebP) {
      // اگر فرمت اصلی webp است، فقط آن را در پوشه کش کپی کن
      await fsp.copyFile(originalPath, cacheFullPath);
    } else {
      // در غیر این صورت، تصویر را به webp با کیفیت ۷۵ تبدیل کن
      const imageBuffer = await fsp.readFile(originalPath);
      await sharp(imageBuffer).webp({ quality: 75 }).toFile(cacheFullPath);
    }

    // ۴. فایل کش شده جدید را برای کاربر ارسال کن
    const newCacheStream = fs.createReadStream(cacheFullPath);
    return new NextResponse(newCacheStream, {
      status: 200, // ارسال با موفقیت
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Image API Error:", err);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
