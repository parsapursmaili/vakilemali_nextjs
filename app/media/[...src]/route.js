import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CACHE_DIR = path.join(PUBLIC_DIR, "image-cache");
const UPLOAD_DIRS = ["uploads"];
const FINAL_WIDTH = 720;
// کیفیت 75
const FINAL_QUALITY = 75;
// کش مرورگر (1 سال)
const CACHE_MAX_AGE = 31536000;

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

export async function GET(req, context) {
  const { params } = context;

  const { src } = params;

  if (!src || src.length === 0) {
    return new NextResponse("No path provided", { status: 400 });
  }

  let relPath = src.join("/");
  if (!isSafeRelative(relPath)) {
    return new NextResponse("Unsafe path", { status: 400 });
  }

  const originalExtension = path.extname(relPath);
  const pathWithoutExt = relPath.slice(0, -originalExtension.length);

  // 1. تعیین مسیر کش: همیشه با پسوند .webp
  const cacheFileName = pathWithoutExt + `.webp`;
  const cachePath = path.join(CACHE_DIR, cacheFileName);
  const cacheDir = path.dirname(cachePath);

  // 2. جستجو در کش
  if (await fileExists(cachePath)) {
    const stream = fs.createReadStream(cachePath);
    // سرویس دهی سریع از کش به همراه هدر کش مرورگر
    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
      },
    });
  }

  // 3. پیدا کردن فایل اصلی در uploads
  let originalPath = null;

  // لیست پسوندهای قابل جستجو برای فایل اصلی
  const possibleExtensions = [
    originalExtension,
    ".webp",
    ".jpg",
    ".jpeg",
    ".png",
    ".JPG",
    ".PNG",
  ];
  // حذف تکراری‌ها و یکسان‌سازی حروف کوچک برای جستجوی دقیق
  const uniqueSearchExtensions = [
    ...new Set(possibleExtensions.map((e) => e.toLowerCase())),
  ];

  const pathWithoutExtAndUploads = pathWithoutExt.startsWith("uploads/")
    ? pathWithoutExt.substring("uploads/".length)
    : pathWithoutExt;

  for (const dir of UPLOAD_DIRS) {
    for (const ext of uniqueSearchExtensions) {
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

  // 4. عملیات انتقال/بهینه‌سازی و ذخیره در کش

  await ensureDir(cacheDir);

  const foundExtension = path.extname(originalPath).toLowerCase();
  let finalImageBuffer;

  // اگر WebP بود: کپی مستقیم برای کش شدن
  if (foundExtension === ".webp") {
    // فقط برای کش شدن سریعتر در درخواست‌های بعدی، WebP اصلی را کپی می‌کنیم
    await fsp.copyFile(originalPath, cachePath);
    // خواندن فایل برای سرویس دهی (یا می‌توانستیم استریم را مستقیما سرویس دهیم)
    finalImageBuffer = await fsp.readFile(originalPath);

    // توجه: در این حالت، WebP بدون تغییر سایز/کیفیت سرویس داده می‌شود.
    // اگر می‌خواهید حتی WebP اصلی هم اجباراً به 720px تبدیل شود، باید از sharp استفاده کنید.
    // بر اساس درخواست "webp بود چون حتما قبلا اپتیمایز شده دست بهش نخوره" فرض بر عدم تغییر می‌گیریم.
  }
  // اگر غیر WebP بود: بهینه‌سازی
  else {
    // پردازش و تبدیل به WebP
    finalImageBuffer = await sharp(originalPath)
      .resize({
        width: FINAL_WIDTH,
        withoutEnlargement: true,
      })
      .webp({ quality: FINAL_QUALITY }) // کیفیت 75
      .toBuffer();

    // ذخیره در cache
    await fsp.writeFile(cachePath, finalImageBuffer, { mode: 0o644 });
  }

  // 5. ارسال خروجی
  return new NextResponse(finalImageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      // کش سمت سرور (فایل کش) و کش سمت مرورگر (هدر)
      "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
    },
  });
}
