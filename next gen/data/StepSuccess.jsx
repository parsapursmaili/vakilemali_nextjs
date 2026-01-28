import React from "react";
import { CheckCircle2, Phone, ArrowLeft, Clock } from "lucide-react";

const StepSuccess = ({ onClose, userPhone }) => {
  return (
    <div className="flex flex-col items-center text-center animate-in zoom-in duration-500 pt-4 h-full">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shadow-sm relative z-10">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
        </div>
      </div>

      <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
        درخواست شما ثبت شد
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-7 px-2">
        اطلاعات به واحد حقوقی ارجاع شد. همکاران ما در ساعات اداری با شماره{" "}
        <span className="font-bold dir-ltr inline-block bg-slate-100 dark:bg-white/10 px-2 rounded mx-1 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
          {userPhone}
        </span>{" "}
        تماس می‌گیرند.
      </p>

      {/* Decision Making Section */}
      <div className="w-full space-y-4">
        {/* Option 1: Urgent */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 text-right relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">
                وضعیت اضطراری دارید؟
              </h4>
            </div>
            <span className="text-[10px] bg-white dark:bg-white/10 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full border border-red-100 dark:border-white/5">
              اقدام فوری
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-5 mb-3">
            اگر مهلت تجدیدنظر تمام شده یا خطر جلب وجود دارد، منتظر تماس نمانید.
          </p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-red-900/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Phone className="w-4 h-4" />
            تماس مستقیم (خط ویژه)
          </button>
        </div>

        {/* Divider text */}
        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] text-slate-400">
            در غیر این صورت
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
        </div>

        {/* Option 2: Normal Wait */}
        <button
          onClick={onClose}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          منتظر تماس کارشناس می‌مانم
        </button>
      </div>
    </div>
  );
};

export default StepSuccess;
