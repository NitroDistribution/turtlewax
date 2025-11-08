import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultLocale } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turtle Wax Azərbaycan",
  description:
    "Rəsmi Turtle Wax Azərbaycan saytı: avtomobiliniz üçün premium qulluq məhsulları və məsləhətlər.",
  metadataBase: new URL("https://turtlewax.az"),
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
