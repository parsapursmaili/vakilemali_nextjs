import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { isAuthenticated } from "@/actions/auth"; // ایمپورت سیستم احراز هویت

// تنظیمات امنیتی
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 مگابایت
const ALLOWED_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

const sanitizeFilename = (filename) => {
  const { name, ext } = path.parse(filename || "");
  const cleanName = decodeURIComponent(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // تبدیل فاصله به خط تیره
    .replace(/[^\w\u0600-\u06FF-]+/g, "") // فقط حروف الفبا (فارسی/انگلیسی)، اعداد و خط تیره
    .replace(/-+/g, "-"); // حذف خط تیره‌های تکراری

  return { cleanName, ext: ext.toLowerCase() };
};

export async function POST(req) {
  try {
    // 1. لایه امنیتی اول: بررسی احراز هویت
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "عدم دسترسی." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    // 2. اعتبارسنجی اولیه فایل
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "فایل نامعتبر است." },
        { status: 400 }
      );
    }

    // 3. بررسی حجم فایل (جلوگیری از پر شدن حافظه/دیسک)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "حجم فایل بیش از حد مجاز است." },
        { status: 400 }
      );
    }

    // 4. بررسی نوع فایل (امنیت در برابر فایل‌های مخرب)
    const mimeType = file.type;
    const validExtension = ALLOWED_MIME_TYPES[mimeType];
    const { cleanName, ext: fileExt } = sanitizeFilename(file.name);

    // اگر MIME تایپ مجاز نبود یا اکستنشن فایل با محتوا همخوانی نداشت
    if (
      !validExtension ||
      (fileExt &&
        fileExt !== validExtension &&
        fileExt !== ".jpg") /* jpg/jpeg fix */
    ) {
      return NextResponse.json(
        { success: false, error: "فرمت فایل غیرمجاز است." },
        { status: 400 }
      );
    }

    // تولید مسیر زمانی
    const now = new Date();
    const relativeDir = path.join(
      "uploads",
      now.getFullYear().toString(),
      (now.getMonth() + 1).toString().padStart(2, "0")
    );
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);

    // ساخت پوشه
    await mkdir(absoluteDir, { recursive: true });

    // 5. ساخت نام یکتا (جلوگیری از جایگزینی فایل‌های هم‌نام)
    // ترکیب نام تمیز شده + عدد رندوم زمانی + پسوند
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const finalFilename = `${cleanName}-${uniqueSuffix}${validExtension}`;
    const savePath = path.join(absoluteDir, finalFilename);

    // تبدیل به بافر و ذخیره سازی
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(savePath, buffer);

    // نرمال‌سازی URL برای کلاینت
    const publicUrl = `/${relativeDir
      .split(path.sep)
      .join("/")}/${finalFilename}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Secure Upload Error:", error);
    return NextResponse.json(
      { success: false, error: "خطای سیستمی در آپلود." },
      { status: 500 }
    );
  }
}
