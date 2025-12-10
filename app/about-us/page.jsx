import AboutHero from "./AboutHero";
import AboutDetails from "./AboutDetails";
import ConsultationCTA from "@/components/ConsultationCTA";

export const metadata = {
  title: "درباره موسسه حقوقی وکیل مالی | به سرپرستی مرضیه توانگر",
  description:
    "موسسه حقوقی وکیل مالی با ۱۳ سال سابقه وکالت تخصصی مرضیه توانگر. با بیش از ۲۰۰۰ پرونده موفق در زمینه ملکی، چک، قراردادها و ارث. تلفن: ۰۹۰۰۲۴۵۰۰۹۰",
};

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": "https://vakilemali.com/#organization",
        name: "موسسه حقوقی وکیل مالی",
        url: "https://vakilemali.com",
        logo: "https://vakilemali.com/logo.png",
        image: "https://vakilemali.com/images/lawyer-full.jpg",
        description: "مرکز تخصصی دعاوی ملکی، مالی و ارث در تهران",
        telephone: "+989002450090",
        email: "info@vakilemali.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "تهران",
          addressRegion: "تهران",
          addressCountry: "IR",
          streetAddress:
            "تهران، خیابان شریعتی، خروجی همت، روبروی پارک کوروش، نبش پیروز، ساختمان شریعتی، طبقه همکف، واحد ۴",
        },
        founder: {
          "@type": "Person",
          "@id": "https://vakilemali.com/#attorney",
          name: "مرضیه توانگر",
          jobTitle: "وکیل پایه یک دادگستری و مدیر موسسه",
          image: "https://vakilemali.com/images/lawyer-full.jpg",
          knowsAbout: [
            "دعاوی ملکی",
            "چک و سفته",
            "تنظیم قرارداد",
            "انحصار وراثت و ارث",
          ],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="bg-[var(--background)] min-h-screen">
        <AboutHero />
        <AboutDetails />

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <ConsultationCTA phoneNumber="09002450090" telegramId="vakilemali" />
        </div>
      </main>
    </>
  );
}
