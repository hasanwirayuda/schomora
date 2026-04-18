import type { Metadata } from "next";
import { Cal_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const calSans = Cal_Sans({
  weight: "400",
  variable: "--font-cal-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schomora — Adaptive Learning Platform",
  description:
    "Belajar lebih cerdas dengan quiz adaptif yang menyesuaikan kemampuanmu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={calSans.variable}>
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
