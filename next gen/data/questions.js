import {
  Scale,
  Gavel,
  Users,
  Home,
  Briefcase,
  AlertOctagon,
  FileWarning,
  Scroll,
  History,
  ShieldAlert,
  HelpCircle,
  Banknote,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const QUIZ_STEPS = [
  {
    id: "category",
    title: "موضوع پرونده شما مرتبط با کدام حوزه است؟",
    subtitle: "جهت ارجاع به کارشناس متخصص همان بخش",
    options: [
      {
        id: "financial",
        label: "دعاوی مالی و تجاری (چک، سفته، قراردادها)",
        icon: Banknote,
      },
      {
        id: "real_estate",
        label: "ملکی و ثبتی (مالک و مستاجر، سند، مشارکت)",
        icon: Home,
      },
      {
        id: "family",
        label: "خانواده و ارث (طلاق، مهریه، انحصار وراثت)",
        icon: Users,
      },
      {
        id: "criminal",
        label: "کیفری و جرایم (کلاهبرداری، سرقت، خیانت)",
        icon: ShieldAlert,
      },
      {
        id: "labor",
        label: "اداره کار و بیمه (روابط کارگر و کارفرما)",
        icon: Briefcase,
      },
      {
        id: "other",
        label: "سایر موارد / نیاز به راهنمایی کلی",
        icon: HelpCircle,
      },
    ],
  },
  {
    id: "status",
    title: "پرونده در چه مرحله‌ای قرار دارد؟",
    subtitle: "دانستن مرحله پرونده برای ارائه راهکار دقیق ضروری است",
    options: [
      {
        id: "pre_litigation",
        label: "هنوز شکایتی ثبت نشده (مشکل ایجاد شده)",
        icon: AlertTriangle,
      },
      {
        id: "police_station",
        label: "در کلانتری یا دادسرا (مرحله تحقیقات)",
        icon: FileWarning,
      },
      {
        id: "court_primary",
        label: "در دادگاه بدوی (جلسات رسیدگی)",
        icon: Gavel,
      },
      { id: "appeal", label: "اعتراض به رای / دادگاه تجدیدنظر", icon: Scale },
      { id: "execution", label: "حکم قطعی شده / اجرای احکام", icon: Scroll },
    ],
  },
  {
    id: "urgency",
    title: "آیا مهلت قانونی یا اخطار فوری دارید؟",
    subtitle: "برای اولویت‌بندی زمان تماس کارشناسان ما",
    options: [
      {
        id: "critical",
        label: "بله، زمان بسیار کم است (نیاز به اقدام فوری)",
        icon: AlertOctagon,
      },
      {
        id: "urgent",
        label: "بله، اخیراً ابلاغیه دریافت کرده‌ام",
        icon: Clock,
      },
      {
        id: "normal",
        label: "خیر، فعلاً در حال بررسی و مشاوره هستم",
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: "value",
    title: "ارزش تقریبی موضوع پرونده چقدر است؟",
    subtitle: "برای تشخیص صلاحیت دادگاه (شورای حل اختلاف یا دادگاه عمومی)",
    options: [
      {
        id: "under_1b",
        label: "دعاوی خرد و متوسط (زیر ۱ میلیارد)",
        icon: Banknote,
      },
      { id: "1b_to_5b", label: "بین ۱ تا ۵ میلیارد تومان", icon: Banknote },
      { id: "5b_to_20b", label: "بین ۵ تا ۲۰ میلیارد تومان", icon: Briefcase },
      { id: "over_20b", label: "بالای ۲۰ میلیارد تومان", icon: Home },
      {
        id: "non_monetary",
        label: "موضوع غیرمالی است (مثل حضانت یا حیثیت)",
        icon: Scale,
      },
    ],
  },
  {
    id: "history",
    title: "آیا قبلاً وکیل داشته‌اید؟",
    subtitle: "جهت بررسی امکان ورود مجدد به پرونده",
    options: [
      {
        id: "fresh",
        label: "خیر، اولین بار است اقدام می‌کنم",
        icon: CheckCircle2,
      },
      {
        id: "has_lawyer",
        label: "وکیل داشتم ولی کار به نتیجه نرسید",
        icon: History,
      },
      {
        id: "self_defense",
        label: "شخصاً پیگیری کردم (بدون وکیل)",
        icon: FileWarning,
      },
    ],
  },
];
