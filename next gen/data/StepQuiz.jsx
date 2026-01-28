import React from "react";
import { ChevronLeft } from "lucide-react";

const StepQuiz = ({ stepData, onSelect }) => {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2 leading-tight">
          {stepData.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium px-4">
          {stepData.subtitle}
        </p>
      </div>

      <div className="space-y-3 px-1 pb-2">
        {stepData.options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(stepData.id, option.id)}
              className="group w-full relative flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#C5A059] hover:bg-slate-50 dark:hover:bg-[#C5A059]/10 hover:shadow-md transition-all duration-200 cursor-pointer text-right outline-none focus:ring-2 focus:ring-[#C5A059]/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-white group-hover:bg-[#C5A059] transition-all duration-300 shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#C5A059] dark:group-hover:text-[#C5A059] transition-colors text-sm sm:text-base">
                  {option.label}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepQuiz;
