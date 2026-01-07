import { NextResponse } from "next/server";
import path from "path";
import { readdir, stat } from "fs/promises";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

async function scanDirectory(dir) {
  // استفاده از catch داخلی برای جلوگیری از توقف کل پروسه در صورت خطای دسترسی به یک پوشه خاص
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);

  // پردازش موازی تمام ورودی‌ها
  const tasks = entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return scanDirectory(fullPath);
    }

    // امنیت: اطمینان از اینکه ورودی فقط فایل است (Symlink ها نادیده گرفته می‌شوند)
    if (entry.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
      try {
        const fileStat = await stat(fullPath);
        // ساخت URL استاندارد و مستقل از سیستم عامل
        const relativePath = path.relative(PUBLIC_DIR, fullPath);
        const url = "/" + relativePath.split(path.sep).join("/");

        return [
          {
            url,
            name: entry.name,
            createdAt: fileStat.mtime.toISOString(),
          },
        ];
      } catch {
        return [];
      }
    }
    return [];
  });

  // تجمیع نتایج موازی
  const results = await Promise.all(tasks);
  return results.flat();
}

export async function GET() {
  try {
    const files = await scanDirectory(UPLOADS_DIR);

    // بهینه‌سازی مرتب‌سازی با مقایسه عددی تایم‌استمپ
    files.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(
      { success: true, files },
      {
        headers: {
          // امنیت و پرفورمنس: جلوگیری از درخواست‌های مکرر به دیسک
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("Media API Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش فایل‌ها." },
      { status: 500 }
    );
  }
}
