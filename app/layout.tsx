import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "חנות הפרימיום | חוויית קנייה מתקדמת",
  description: "גלו את מיטב מוצרי הפרימיום עבור אורח החיים המודרני. איכות, עיצוב וטכנולוגיה תחת קורת גג אחת.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="scroll-smooth">
      <body
        className={`${rubik.variable} font-sans antialiased bg-[#0a0a0a] text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
