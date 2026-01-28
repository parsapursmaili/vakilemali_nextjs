import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsp } from "fs";
import sharp from "sharp";

// Configuration
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const CACHE_DIR = path.join(PUBLIC_DIR, "image-cache");
const UPLOAD_DIRS = ["uploads"];
const CONFIG = {
  width: 720,
  quality: 80,
  maxAge: 31536000,
};

// Helper: Ensure path is within PUBLIC_DIR to prevent traversal attacks
function isSafePath(targetPath) {
  const resolvedPath = path.resolve(targetPath);
  return resolvedPath.startsWith(PUBLIC_DIR);
}

// Helper: Stream optimized WebP files
function streamFile(filePath, size) {
  const stream = fs.createReadStream(filePath);
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": size.toString(),
      "Cache-Control": `public, max-age=${CONFIG.maxAge}, immutable`,
      Vary: "Accept",
    },
  });
}

export async function GET(_, { params }) {
  try {
    const { src } = params;
    if (!src?.length) return new NextResponse("Bad Request", { status: 400 });

    // 1. Sanitize and normalize path
    const rawPath = src.map((s) => decodeURIComponent(s)).join("/");
    if (rawPath.includes("\0"))
      return new NextResponse("Malicious Path", { status: 400 });

    const normalizedPath = path
      .normalize(rawPath)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const ext = path.extname(normalizedPath);
    const nameNoExt = normalizedPath.slice(0, -ext.length || undefined);

    // 2. Check Cache
    const cachePath = path.join(CACHE_DIR, `${nameNoExt}.webp`);
    if (!isSafePath(cachePath))
      return new NextResponse("Forbidden", { status: 403 });

    try {
      const stats = await fsp.stat(cachePath);
      if (stats.isFile()) return streamFile(cachePath, stats.size);
    } catch {
      // Cache miss, proceed to look for original
    }

    // 3. Search for original file in upload directories
    let originalPath = null;
    const searchExts = [ext.toLowerCase(), ".webp", ".jpg", ".jpeg", ".png"];

    // Smart search: Check relative path and paths inside specific upload dirs
    const candidatePaths = [nameNoExt];
    for (const dir of UPLOAD_DIRS) {
      if (nameNoExt.startsWith(dir + "/") || nameNoExt.startsWith(dir + "\\")) {
        candidatePaths.push(nameNoExt.substring(dir.length + 1));
      }
    }

    searchLoop: for (const dir of UPLOAD_DIRS) {
      for (const candidate of candidatePaths) {
        for (const searchExt of searchExts) {
          if (!searchExt && !ext) continue;
          const testPath = path.join(
            PUBLIC_DIR,
            dir,
            `${candidate}${searchExt}`
          );

          if (isSafePath(testPath)) {
            try {
              await fsp.access(testPath, fs.constants.F_OK);
              originalPath = testPath;
              break searchLoop;
            } catch {
              continue;
            }
          }
        }
      }
    }

    // 4. Handle Missing File (Fallback Logic)
    if (!originalPath) {
      const fallbackPath = path.join(PUBLIC_DIR, "uploads", "default.png");
      try {
        const fallbackStats = await fsp.stat(fallbackPath);
        const fallbackStream = fs.createReadStream(fallbackPath);

        // Serve default.png directly with short cache (to allow healing)
        return new NextResponse(fallbackStream, {
          headers: {
            "Content-Type": "image/png",
            "Content-Length": fallbackStats.size.toString(),
            "Cache-Control": "public, max-age=60",
          },
        });
      } catch (e) {
        // Even fallback is missing
        return new NextResponse("Not Found", { status: 404 });
      }
    }

    // 5. Process Image (Optimized & Safe)
    await fsp.mkdir(path.dirname(cachePath), { recursive: true });

    // Use temp file to prevent race conditions during concurrent requests
    const tempCachePath = `${cachePath}.${Date.now()}.${Math.random()
      .toString(36)
      .slice(2)}.tmp`;

    try {
      if (path.extname(originalPath).toLowerCase() === ".webp") {
        await fsp.copyFile(originalPath, tempCachePath);
      } else {
        await sharp(originalPath)
          .resize({
            width: CONFIG.width,
            withoutEnlargement: true,
            fit: "inside",
          })
          .webp({ quality: CONFIG.quality, effort: 4 })
          .toFile(tempCachePath);
      }

      // Atomic rename
      await fsp.rename(tempCachePath, cachePath);
    } catch (err) {
      try {
        await fsp.unlink(tempCachePath);
      } catch {}
      console.error("Processing Error:", err);
      return new NextResponse("Server Error", { status: 500 });
    }

    const finalStats = await fsp.stat(cachePath);
    return streamFile(cachePath, finalStats.size);
  } catch (error) {
    console.error("Image Route Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
