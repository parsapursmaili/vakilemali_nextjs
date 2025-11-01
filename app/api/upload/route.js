import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// تابع برای پاک‌سازی نام فایل (بدون تغییر)
const sanitizeFilename = (filename) => {
  if (!filename) return "";
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext;
  const decodedName = decodeURIComponent(name);

  return (
    decodedName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "")
      .replace(/--+/g, "-") + ext
  );
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "فایلی انتخاب نشده است." },
        { status: 400 }
      );
    }

    // --- منطق جدید برای مدیریت تاریخ ---
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // ماه از 0 شروع می‌شود، پس +1 می‌کنیم

    // مسیر دایرکتوری بر اساس تاریخ
    const relativeDir = path.join("uploads", year, month);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);

    // اطمینان از وجود دایرکتوری
    await mkdir(absoluteDir, { recursive: true });
    // ------------------------------------

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedFilename = sanitizeFilename(file.name);

    // مسیر کامل ذخیره‌سازی فایل
    const savePath = path.join(absoluteDir, sanitizedFilename);

    // ذخیره فایل
    await writeFile(savePath, buffer);

    // آدرس عمومی فایل برای استفاده در کلاینت
    const publicUrl = `/${relativeDir.replace(
      /\\/g,
      "/"
    )}/${sanitizedFilename}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش آپلود." },
      { status: 500 }
    );
  }
}
