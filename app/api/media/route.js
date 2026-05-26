import { NextResponse } from "next/server";
import path from "path";
import { readdir, stat } from "fs/promises";
import { isAuthenticated } from "@/actions/auth";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

async function scanDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);

  const tasks = entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return scanDirectory(fullPath);
    }

    if (entry.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
      try {
        const fileStat = await stat(fullPath);
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

  const results = await Promise.all(tasks);
  return results.flat();
}

export async function GET() {
  try {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "عدم دسترسی مجاز." },
        { status: 401 },
      );
    }

    const files = await scanDirectory(UPLOADS_DIR);

    files.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(
      { success: true, files },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Media API Error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش فایل‌ها." },
      { status: 500 },
    );
  }
}
