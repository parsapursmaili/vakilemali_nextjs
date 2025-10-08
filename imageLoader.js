// imageLoader.js
export default function customImageLoader({ src }) {
  try {
    if (src.includes("/upload")) {
      const idx = src.search(/uploads?\//i);
      if (idx === -1) return src;

      const relPath = src.slice(idx + (src[idx + 7] === "s" ? 8 : 7));
      // 🔹 encodeURI لازم است تا حروف فارسی در URL امن بمانند
      return `/api/image/${encodeURI(relPath)}`;
    }

    return src;
  } catch {
    return src;
  }
}
