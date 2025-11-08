import type { Metadata } from "next";
import { Inter, Exo } from "next/font/google";
import { defaultLocale } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
  weight: ["400", "700"],
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
        className={`${inter.variable} ${exo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
