"use client";

import { useEffect } from "react"; // دیگر نیازی به useState، Eye و formatViews نیست
import { incrementPostViews } from "@/[slug]/post";

export default function PostViews({ postId, initialViews }) {
  // 💡 این کامپوننت اکنون صرفاً برای افزایش بازدید در سمت سرور استفاده می‌شود و چیزی رندر نمی‌کند.
  useEffect(() => {
    // افزایش بازدید در سمت کلاینت برای جلوگیری از افزایش در رندر ISR
    if (postId) {
      // فراخوانی Server Action برای افزایش بازدید
      incrementPostViews(postId);
      // دیگر نیازی به setViews نیست زیرا چیزی نمایش داده نمی‌شود.
    }
  }, [postId]);

  // بازگرداندن null برای عدم نمایش در رابط کاربری
  return null;
}
