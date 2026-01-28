"use client";

import React, { useState, useEffect } from "react";
import { X, Scale, ChevronRight } from "lucide-react";
import { QUIZ_STEPS } from "./data/questions";
import StepQuiz from "./data/StepQuiz";
import StepLeadCapture from "./data/StepLeadCapture";
import StepSuccess from "./data/StepSuccess";

const ConsultationModal = ({ isOpen, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [view, setView] = useState("quiz");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStepIndex(0);
        setView("quiz");
        setFormData({});
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = QUIZ_STEPS.length + 1;
  const currentStepNum =
    stepIndex + (view === "capture" ? 1 : 0) + (view === "success" ? 2 : 0);
  const currentProgress = Math.min((currentStepNum / totalSteps) * 100, 100);

  const handleQuizSelect = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (stepIndex < QUIZ_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setView("capture");
    }
  };

  const handleBack = () => {
    if (view === "capture") {
      setView("quiz");
    } else if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-[500px] bg-white dark:bg-[#111] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100 dark:border-white/10"
        dir="rtl"
      >
        {/* Header (Fixed) */}
        <div className="bg-white dark:bg-[#1a1a1a] px-5 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C5A059]/10 text-[#C5A059]">
              <Scale className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
                دستیار هوشمند حقوقی
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                بررسی تخصصی پرونده
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="group p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Progress Bar (Fixed) */}
        <div className="w-full h-1.5 bg-slate-50 dark:bg-white/5 shrink-0">
          <div
            className="h-full bg-gradient-to-l from-[#C5A059] to-[#96783d] transition-all duration-700 ease-out rounded-r-full shadow-[0_0_10px_#C5A059]"
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50/50 dark:bg-[#0a0a0a]">
          {/* Back Button */}
          {(stepIndex > 0 || view === "capture") && view !== "success" && (
            <div className="sticky top-0 right-0 z-10 w-full px-6 pt-4 pb-2 bg-gradient-to-b from-slate-50/90 to-transparent dark:from-[#0a0a0a] backdrop-blur-[2px]">
              <button
                onClick={handleBack}
                className="text-xs font-bold text-slate-400 hover:text-[#C5A059] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                بازگشت به مرحله قبل
              </button>
            </div>
          )}

          <div
            className={`px-6 pb-8 ${view === "quiz" && stepIndex === 0 ? "pt-8" : "pt-2"}`}
          >
            {view === "quiz" && (
              <StepQuiz
                stepData={QUIZ_STEPS[stepIndex]}
                onSelect={handleQuizSelect}
              />
            )}

            {view === "capture" && (
              <StepLeadCapture
                setFormData={setFormData}
                onSuccess={() => setView("success")}
              />
            )}

            {view === "success" && (
              <StepSuccess onClose={onClose} userPhone={formData.phone} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
