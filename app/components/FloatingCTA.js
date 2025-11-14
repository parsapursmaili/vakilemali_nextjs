// FloatingCTA.js (Final Version - Enhanced Typography and Sizing)
"use client";

import { Phone, Send } from "lucide-react";

/**
 * کامپوننت CTA شناور و چسبنده در پایین صفحه برای دسترسی سریع (نسخه نهایی)
 * @param {object} props
 * @param {string} props.phoneNumber - شماره تلفن با ارقام فارسی یا انگلیسی (مثلا: 09002450090)
 * @param {string} props.telegramId - آیدی تلگرام/ایتا بدون @ (مثلا: MyLawyerID)
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
    px-3 py-1.5 sm:px-4 sm:py-2 
    rounded-lg font-bold 
    text-xs sm:text-base 
    shadow-md transition-transform duration-200 hover:scale-[1.03] active:scale-95
    whitespace-nowrap 
  `;

  // کلاس برای فونت متن راهنما: افزایش اندازه در موبایل و دسکتاپ
  const guideTextClass = "text-xs xs:text-sm sm:text-base md:text-lg";

  // کلاس برای فونت شماره تلفن: افزایش اندازه در موبایل و دسکتاپ
  const telFontClass =
    "font-extrabold text-lg xs:text-xl sm:text-2xl leading-none";

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[100] 
        bg-primary dark:bg-gray-800 
        shadow-[0_-5px_20px_rgba(0,0,0,0.2)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.4)]
        p-2 sm:p-3 
        border-t-4 border-accent
        transition-all duration-300
      `}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* بخش اطلاعات تماس و دکمه‌ها */}
        <div
          className={`flex w-full items-center justify-between gap-3 sm:gap-4`}
        >
          {/* متن اصلی - سمت راست */}
          <div className="flex items-center flex-shrink text-white dark:text-foreground/90">
            {/* اندازه آیکون افزایش یافت */}
            <Phone className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-accent flex-shrink-0 ml-1" />
            <span
              className={`${guideTextClass} text-primary-light dark:text-gray-300 font-bold`}
            >
              تماس فوری و <span className="text-accent">رایگان</span> با وکیل
            </span>
          </div>

          {/* شماره تماس - نمایش فارسی، لینک لاتین */}
          <a
            href={phoneHref}
            className={`${telFontClass} text-left mr-1 !text-white hover:text-accent transition-colors`}
            dir="ltr"
          >
            {phoneNumber}
          </a>
        </div>

        {/* دکمه‌های اقدام - در موبایل زیر اطلاعات قرار می‌گیرند و عرض کامل دارند */}
        <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
          {/* تماس فوری */}
          <a
            href={phoneHref}
            className={`${buttonClasses} bg-accent !text-white`}
          >
            {/* اندازه آیکون افزایش یافت */}
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
            {/* اندازه آیکون افزایش یافت */}
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">تلگرام / ایتا</span>
            <span className="inline sm:hidden">پیام‌رسان</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
