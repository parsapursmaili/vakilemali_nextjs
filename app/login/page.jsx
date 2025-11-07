import { redirect } from "next/navigation";
import { isAuthenticated } from "@/actions/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "ورود به پنل مدیریت",
  description: "صفحه ورود برای ادمین سایت.",
};

export default async function LoginPage() {
  // اگر کاربر از قبل لاگین کرده بود، او را به پنل ادمین هدایت کن
  const isUserAdmin = await isAuthenticated();
  if (isUserAdmin) {
    redirect("/admin/statistics"); // یا هر آدرس دیگری برای داشبورد ادمین
  }

  // در غیر این صورت، فرم لاگین را نمایش بده
  return <LoginForm />;
}
