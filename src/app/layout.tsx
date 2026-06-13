import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Milano Bellaka 2005 — Menu",
  description: "Digital Menu for Milano Bellaka Restaurant in DZD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${tajawal.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111111] text-[#E8E8E8]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
