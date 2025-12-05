import { getTerms } from "./actions";
import { TermsClient } from "./components";

export const metadata = {
  title: "مدیریت دسته‌بندی‌ها | پنل ادمین",
};

export default async function TermsPage() {
  const { success, data } = await getTerms();

  return (
    // p-3 for mobile to reduce waste, md:p-8 for desktop elegance
    <div
      className="min-h-screen bg-[--background] p-3 md:p-8 font-sans"
      dir="rtl"
    >
      <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[--input-border] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[--primary] tracking-tight">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            ساختار درختی و طبقه‌بندی محتوای وب‌سایت
          </p>
        </div>
        <div className="hidden md:block">
          <span className="bg-[--accent]/10 text-[--accent] px-4 py-2 rounded-xl text-sm font-bold border border-[--accent]/20">
            مجموع: {success ? data.length : 0} ترم
          </span>
        </div>
      </header>

      <main>
        <TermsClient initialTerms={success ? data : []} />
      </main>
    </div>
  );
}
