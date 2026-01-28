import React, { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  User,
  Phone,
  FileSignature,
} from "lucide-react";

const StepLeadCapture = ({ setFormData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormData((prev) => ({ ...prev, ...localData }));

    // شبیه‌سازی ارسال به پنل کارشناس
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-10 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-white/5"></div>
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-[#C5A059] border-t-transparent animate-spin"></div>
          <FileSignature className="absolute inset-0 m-auto w-10 h-10 text-[#C5A059] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
          در حال ثبت درخواست...
        </h3>
        <p className="text-sm text-slate-500 animate-pulse">
          اطلاعات شما جهت بررسی به کارشناس حقوقی ارجاع می‌شود.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold mb-4 border border-slate-200 dark:border-white/20">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          مرحله آخر: اطلاعات تماس
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
          درخواست بررسی توسط کارشناس
        </h3>
        <p className="text-sm text-slate-500 px-4 leading-relaxed">
          کارشناسان ما پس از بررسی اولیه، جهت ارائه مشاوره با شما تماس می‌گیرند.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-1 flex-1">
        <div className="space-y-4">
          {/* Input Name - Icon Left */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" />
            <input
              type="text"
              required
              placeholder="نام و نام خانوادگی"
              // pl-12 for icon space on left, pr-4 for text start on right
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-right focus:outline-none focus:border-[#C5A059] focus:bg-white dark:focus:bg-white/10 focus:shadow-md transition-all duration-300"
              value={localData.name}
              onChange={(e) =>
                setLocalData({ ...localData, name: e.target.value })
              }
            />
          </div>

          {/* Input Phone - Icon Left */}
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" />
            <input
              type="tel"
              required
              pattern="09[0-9]{9}"
              placeholder="شماره موبایل (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
              // dir-ltr for phone number typing, but text alignment handling
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white dark:focus:bg-white/10 focus:shadow-md transition-all duration-300 dir-ltr text-right font-bold tracking-wide placeholder:font-normal placeholder:tracking-normal"
              value={localData.phone}
              onChange={(e) =>
                setLocalData({ ...localData, phone: e.target.value })
              }
            />
          </div>

          {/* Textarea */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2 mr-1">
              <FileSignature className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-bold text-slate-500">
                توضیح کوتاه (اختیاری)
              </label>
            </div>
            <textarea
              rows="3"
              placeholder="اگر نکته خاصی هست، اینجا بنویسید..."
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white dark:focus:bg-white/10 focus:shadow-md transition-all resize-none"
              value={localData.note}
              onChange={(e) =>
                setLocalData({ ...localData, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* Disclaimer / Safety Valve */}
        <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20 mt-2">
          <p className="text-[11px] text-amber-700 dark:text-amber-500 text-center leading-5">
            <span className="font-bold">توجه:</span> بررسی اولیه پرونده صرفاً
            جهت امکان‌سنجی است و به معنای قبول قطعی وکالت نیست.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1B5E20] to-[#2e7d32] hover:to-[#1B5E20] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <span>ثبت درخواست و تماس کارشناس</span>
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mt-3 opacity-60">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <p className="text-[10px] text-slate-400">
            اطلاعات شما محرمانه باقی می‌ماند.
          </p>
        </div>
      </form>
    </div>
  );
};

export default StepLeadCapture;
