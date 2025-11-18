// src/components/LazyVideoEmbed.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import parse from "html-react-parser"; // برای تبدیل رشته HTML به المنت‌های React

/**
 * کامپوننتی برای نمایش تنبل (Lazy Load) محتوای ویدیویی iframe.
 * این کامپوننت از Intersection Observer استفاده می‌کند تا بارگذاری محتوای iframe
 * را تا زمانی که نزدیک دید کاربر قرار بگیرد، به تعویق بیندازد.
 */
export default function LazyVideoEmbed({ embedHtml }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!embedHtml || !containerRef.current || shouldLoad) return;

    // بارگذاری محتوا در سمت کلاینت
    const parsedContent = parse(String(embedHtml), {
      // اختیاری: تنظیمات اضافی parse (اگر نیاز به تغییر تگ‌ها باشد)
    });
    setContent(parsedContent);

    // تنظیم Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target); // پس از مشاهده، از حالت مشاهده خارج می‌شود
          }
        });
      },
      {
        rootMargin: "200px 0px", // 200 پیکسل زودتر شروع به بارگذاری کند
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

  // منطق نمایش
  if (!embedHtml) {
    return null;
  }

  // اگر هنوز نباید لود شود، یک Placeholder با ابعاد صحیح نمایش داده می‌شود
  if (!shouldLoad) {
    // استفاده از style های آپارات برای نسبت ابعاد (16:9)
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

  // پس از لود شدن، محتوای اصلی نمایش داده می‌شود
  return (
    <div ref={containerRef} className="my-6">
      {/* 
        توجه: از آنجایی که کد آپارات شامل <style> و <div> پدر است، 
        نیازی به افزودن کلاس‌های پاسخگو نیست. 
        parse() آن را به طور کامل رندر می‌کند.
      */}
      {content}
    </div>
  );
}
