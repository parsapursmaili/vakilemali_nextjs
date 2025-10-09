import { NextResponse } from "next/server";
import path from "path";
import fs, { promises as fsp } from "fs";
import sharp from "sharp";

// === توابع و ثوابت کمکی تعریف شده در همین فایل ===

// 1. ثوابت مورد نیاز
const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR_NAME = "image-cache";
const UPLOAD_DIR_NAMES = ["uploads"]; // اگر پوشه‌های دیگری دارید، اینجا اضافه کنید

// 2. توابع کمکی

/**
 * بررسی می‌کند که آیا فایلی به صورت آسنکرون وجود دارد.
 * @param {string} filePath - مسیر کامل فایل.
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * اطمینان حاصل می‌کند که یک دایرکتوری وجود دارد و اگر نه، آن را می‌سازد.
 * @param {string} dirPath - مسیر دایرکتوری.
 * @returns {Promise<void>}
 */
async function ensureDir(dirPath) {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * بررسی می‌کند که آیا یک مسیر نسبی امن است (از حملات directory traversal جلوگیری می‌کند).
 * @param {string} relPath - مسیر نسبی تصویر.
 * @returns {boolean}
 */
function isSafeRelative(relPath) {
  if (!relPath) return false;
  // بررسی الگوهای رایج ناامنی مثل '..'
  return !relPath.includes("..") && !path.isAbsolute(relPath);
}

// === تابع اصلی Route Handler ===

export async function GET(req, props) {
  // 🛑 رفع ایراد اصلی Next.js 15: آبجکت props باید await شود.
  const { params } = await props;

  try {
    if (!params?.src || params.src.length === 0) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    // مسیر بدون decode دوباره
    const relPath = params.src.join("/");

    // بررسی امنیت مسیر
    if (!isSafeRelative(relPath)) {
      return NextResponse.json({ error: "Unsafe path" }, { status: 400 });
    }

    // ... بقیه منطق کد شما بدون تغییر

    // مسیر کش
    const cacheFullPath = path.join(PUBLIC_DIR, CACHE_DIR_NAME, relPath);
    const cacheDirForFile = path.dirname(cacheFullPath);

    if (await fileExists(cacheFullPath)) {
      const stream = fs.createReadStream(cacheFullPath);
      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // در پوشه uploads دنبال فایل بگرد
    let foundOriginal = null;
    for (const up of UPLOAD_DIR_NAMES) {
      const candidate = path.join(PUBLIC_DIR, up, relPath);
      if (await fileExists(candidate)) {
        foundOriginal = candidate;
        break;
      }
    }

    if (!foundOriginal) {
      console.error("❌ File not found:", relPath);
      return NextResponse.json(
        { error: "Original not found" },
        { status: 404 }
      );
    }

    await ensureDir(cacheDirForFile);
    const imageBuffer = await fsp.readFile(foundOriginal);

    const convertedBuffer = await sharp(imageBuffer)
      .webp({ quality: 75 })
      .toBuffer();

    await fsp.writeFile(cacheFullPath, convertedBuffer, { mode: 0o644 });

    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(convertedBuffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
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
