"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/actions/auth";
import { KeyRound, LogIn, Loader2, TriangleAlert, Check } from "lucide-react";

/**
 * دکمه ارسال (SubmitButton)
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex w-full items-center justify-center gap-x-3 rounded-xl py-3 text-base font-semibold transition-all duration-300 shadow-md
bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg
disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      )}
      <span>{pending ? "درحال تأیید..." : "ورود به سیستم"}</span>
    </button>
  );
}

/**
 * کامپوننت اصلی فرم ورود (LoginForm)
 */
export default function LoginForm() {
  const initialState = { success: true, message: null };
  const [state, formAction] = useFormState(login, initialState);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans antialiased">
      <div className="w-full max-w-md">
        {/* کارت ورود */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl space-y-8">
          {/* عنوان و توضیحات */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-indigo-700">
              ورود به پنل مدیریت
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              لطفاً برای دسترسی به داشبورد، رمز عبور را وارد کنید.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {/* پیام هشدار / خطا */}
            {!state.success && state.message && (
              <div
                className="flex items-start gap-x-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 shadow-inner"
                role="alert"
              >
                <TriangleAlert className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                <p className="font-medium">{state.message}</p>
              </div>
            )}

            {/* فیلد رمز عبور */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="رمز عبور مدیریتی"
                className="peer w-full rounded-xl border border-gray-300 bg-gray-50 px-12 py-3 text-base text-gray-800 
                           placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none 
                           transition-all duration-300 shadow-sm hover:border-gray-400"
              />
              <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-600 transition-colors" />
            </div>

            {/* سوییچ جذاب "مرا به خاطر بسپار" (اصلاح شده) */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-me"
                className="flex items-center gap-x-3 cursor-pointer select-none"
              >
                {/* کانتینر اصلی سوییچ */}
                <div className="relative">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="peer sr-only" // مخفی کردن چک‌باکس اصلی
                  />
                  {/* پس‌زمینه سوییچ (هم‌سطح با input) */}
                  <div
                    className="h-7 w-14 rounded-full bg-gray-300 transition-colors duration-300 peer-checked:bg-indigo-600"
                    aria-hidden
                  ></div>
                  {/* اهرم متحرک سوییچ (هم‌سطح با input و دارای position absolute) */}
                  <div
                    className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md
                               text-transparent transition-all duration-300 ease-in-out
                               peer-checked:translate-x-7 peer-checked:text-indigo-600"
                    aria-hidden
                  >
                    {/* آیکون چک (رنگ خود را از والد به ارث می‌برد) */}
                    <Check className="h-4 w-4" />
                  </div>
                </div>

                <span className="text-sm font-medium text-gray-700">
                  مرا به خاطر بسپار
                </span>
              </label>
            </div>

            {/* دکمه ارسال */}
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
