"use client";

import { Phone, Send } from "lucide-react";

/**
 * کامپوننت CTA شناور و چسبنده در پایین صفحه برای دسترسی سریع (نسخه نهایی)
 */
const FloatingCTA = ({ phoneNumber, telegramId }) => {
  // تبدیل ارقام فارسی به انگلیسی برای tel:
  const toEnglishDigits = (str) =>
    str
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
      .replace(/[^\d+]/g, "");

  // شماره برای لینک (همیشه انگلیسی و بدون فاصله)
  const phoneHref = `tel:${toEnglishDigits(phoneNumber)}`;

  // کلاس‌های مشترک برای دکمه‌ها
  const buttonClasses = `
    flex items-center justify-center gap-1 flex-1 
    px-3 py-1 sm:px-3 sm:py-1.5 
    rounded-lg font-bold 
    text-xs sm:text-sm 
    shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95
    whitespace-nowrap 
  `;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[100] 
        bg-primary dark:bg-[#1a1a1a] 
        shadow-[0_-5px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.3)]
        p-2 sm:p-2 
        border-t-4 border-accent dark:border-accent
        transition-all duration-300
      `}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* بخش اطلاعات تماس */}
        <div
          className={`
            flex items-center w-full text-white dark:text-foreground
            justify-between sm:justify-start 
          `}
        >
          {/* متن سمت راست */}
          <div className="flex items-center text-sm font-medium ml-2 sm:ml-0">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 ml-1" />
            <span className="text-sm sm:text-base text-primary-light dark:text-gray-300 font-extrabold">
              تماس فوری و <span className="text-accent">رایگان</span> با وکیل
              متخصص
            </span>
          </div>

          {/* شماره تماس - نمایش فارسی، لینک لاتین */}
          <a
            href={phoneHref}
            className={`
              font-extrabold text-lg sm:text-xl leading-none 
              text-left mr-1 
              !text-white !dark:text-white 
              hover:text-accent transition-colors
            `}
            dir="ltr"
          >
            {phoneNumber}
          </a>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* تماس فوری */}
          <a
            href={phoneHref}
            className={`${buttonClasses} bg-accent !text-white`}
          >
            <Phone className="h-4 w-4" />
            <span>تماس فوری</span>
          </a>

          {/* پیام‌رسان */}
          <a
            href={`https://t.me/${telegramId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClasses} bg-primary-light dark:bg-primary-light !text-white font-semibold`}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">تلگرام / ایتا</span>
            <span className="sm:hidden">پیام‌رسان</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
