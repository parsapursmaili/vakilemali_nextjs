export async function GET(req, { params }) {
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
