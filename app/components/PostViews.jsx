"use client";

import { useEffect, useState } from "react";
import { incrementPostViews } from "@/[slug]/post"; // از Server Action پست ایمپورت می‌شود
import { Eye } from "lucide-react";

export default function PostViews({ postId, initialViews }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // 💡 افزایش بازدید در سمت کلاینت برای جلوگیری از افزایش در رندر ISR
    if (postId) {
      incrementPostViews(postId).then((success) => {
        if (success) {
          // تنها در صورت موفقیت، بازدید UI را افزایش می‌دهیم
          setViews((v) => v + 1);
        }
      });
    }
  }, [postId]);

  const formatViews = (num) => {
    // تبدیل عدد به فرمت فارسی
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <div className="flex items-center space-x-1 space-x-reverse text-sm font-medium text-foreground/70">
      <Eye className="w-4 h-4 ml-1 text-accent" />
      <span>{formatViews(views)} بازدید</span>
    </div>
  );
}
