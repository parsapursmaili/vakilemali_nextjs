"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState(null);
  const src = "/uploads/elementor/test.webp"; // تصویر تست توی public/uploads

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold text-center">
        🧩 تست لودر سفارشی Next.js
      </h1>

      <p className="text-gray-600 text-center max-w-md">
        اگر لودر سفارشی به‌درستی کار کنه، این تصویر از مسیر{" "}
        <code>/api/image/elementor/test.webp</code> لود می‌شه و باید در شبکه
        (Network) دیده بشه.
      </p>

      <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={src}
          alt="Test image"
          width={400}
          height={300}
          className="object-cover"
          onError={() => setError("❌ خطا در بارگذاری تصویر!")}
        />
      </div>

      {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}

      <p className="text-sm text-gray-500 mt-4">
        مسیر تست: <code>{src}</code>
      </p>
    </div>
  );
}
