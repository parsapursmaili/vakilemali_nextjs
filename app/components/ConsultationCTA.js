import { Phone, Send } from "lucide-react";
import Image from "next/image";

// دریافت شماره تماس و آیدی تلگرام به عنوان Props
const ConsultationCTA = ({ phoneNumber, telegramId }) => {
  return (
    <aside className="my-10 p-6 bg-gradient-to-tr from-muted/50 to-muted/20 dark:from-muted/20 dark:to-background rounded-2xl border-2 border-accent/60 shadow-lg shadow-accent/10 transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accent/20">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* بخش تصویر وکیل */}
        <div className="flex-shrink-0">
          <Image
            src="/lawyer-avatar.webp"
            alt="مرضیه توانگر - وکیل سرپرست موسسه"
            width={120}
            height={120}
            className="rounded-full border-4 border-white dark:border-muted/50 shadow-md object-cover"
            unoptimized
          />
        </div>

        {/* بخش متن و اطلاعات */}
        <div className="flex-grow text-center md:text-right">
          <h3 className="!mt-0 mb-2 font-extrabold text-2xl text-primary dark:text-foreground">
            با وکیل متخصص، مسیرتان را پیدا کنید
          </h3>
          <p className="text-foreground/80 leading-relaxed text-base">
            موسسه حقوقی ما به سرپرستی{" "}
            <strong className="font-semibold text-accent-dark">
              مرضیه توانگر
            </strong>{" "}
            (وکیل پایه یک دادگستری)، آماده ارائه مشاوره تخصصی در تمامی حوزه‌های
            حقوقی، کیفری و خانواده به شماست.
          </p>
        </div>

        {/* بخش دکمه‌ها */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
          <a
            href={`tel:${phoneNumber.replace(/ /g, "")}`} // استفاده از prop و حذف فواصل
            className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-accent !text-white rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105"
          >
            <Phone className="h-5 w-5" />
            <span>تماس فوری</span>
          </a>
          <a
            href={`https://t.me/${telegramId}`} // استفاده از prop
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-primary dark:bg-primary-light !text-white rounded-full font-semibold transition-transform hover:scale-105"
          >
            <Send className="h-5 w-5" />
            <span>تلگرام / ایتا</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default ConsultationCTA;
