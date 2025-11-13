// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        destructive: "var(--destructive)",
        error: "var(--error)",
        "error-background": "var(--error-background)",
        "error-border": "var(--error-border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      fontSize: {
        base: "var(--font-size-base)",
        h1: "var(--font-size-h1)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        h4: "var(--font-size-h4)",
        h5: "var(--font-size-h5)",
        h6: "var(--font-size-h6)",
      },
      lineHeight: {
        base: "var(--line-height-base)",
        headings: "var(--line-height-headings)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      // ✅ --- این بخش برای اصلاح استایل لیست‌ها در خروجی نهایی اضافه شده است ---
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // حذف مارجین بالا و پایین از پاراگراف‌های داخل آیتم لیست
            "ul > li > p:first-of-type, ol > li > p:first-of-type": {
              marginTop: "0",
            },
            "ul > li > p:last-of-type, ol > li > p:last-of-type": {
              marginBottom: "0",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
