// src/components/LazyVideoEmbed.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import parse from "html-react-parser"; // برای تبدیل رشته HTML به المنت‌های React

export default function LazyVideoEmbed({ embedHtml }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!embedHtml || !containerRef.current || shouldLoad) return;

    const parsedContent = parse(String(embedHtml), {});
    setContent(parsedContent);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [embedHtml, shouldLoad]);

  if (!embedHtml) {
    return null;
  }

  if (!shouldLoad) {
    return (
      <div
        ref={containerRef}
        className="
          relative w-full max-w-full mx-auto my-6 
          bg-gray-200 dark:bg-gray-700 rounded-lg 
          h-0 animate-pulse overflow-hidden !px-3 sm:!px-0
        "
        style={{ paddingBottom: "57%" }} // نسبت 16:9 (9/16 * 100% ≈ 56.25% - 57% استاندارد آپارات)
      >
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          در حال بارگذاری ویدیو...
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="my-6">
      {content}
    </div>
  );
}
