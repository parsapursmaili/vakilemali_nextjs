// JalaliDatePicker.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import moment from "jalali-moment";

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

export default function JalaliDatePicker({ onApply }) {
  const [range, setRange] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyClick = () => {
    if (range?.from && range?.to) {
      const from = moment(range.from).locale("fa").format("YYYY/MM/DD");
      const to = moment(range.to).locale("fa").format("YYYY/MM/DD");
      onApply({ startDate: from, endDate: to });
      setIsOpen(false);
    }
  };

  let buttonText = "انتخاب بازه سفارشی";
  if (range?.from && range?.to) {
    const from = moment(range.from).locale("fa").format("YYYY/MM/DD");
    const to = moment(range.to).locale("fa").format("YYYY/MM/DD");
    buttonText = `${from} – ${to}`;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-[250px] flex items-center justify-between gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm text-right"
      >
        <CalendarIcon />
        <span className="flex-grow">{buttonText}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-20 bg-[var(--background)] border border-[var(--muted)] rounded-lg shadow-xl p-2 w-max">
          <DayPicker
            dir="rtl"
            weekStartsOn={6} // Saturday
            className="jalali-date-picker-popup"
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={{ code: "fa", ...moment.localeData("fa") }}
            formatters={{
              formatCaption: (date) =>
                moment(date).locale("fa").format("MMMM jYYYY"),
              formatWeekdayName: (date) =>
                moment(date).locale("fa").format("dd"),
              formatDay: (date) => moment(date).locale("fa").format("jD"),
            }}
            footer={
              <div className="p-2 border-t border-[var(--muted)] flex justify-end">
                <button
                  onClick={handleApplyClick}
                  className="button-primary !py-1.5 !px-4 text-sm"
                  disabled={!range?.from || !range?.to}
                >
                  اعمال
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
