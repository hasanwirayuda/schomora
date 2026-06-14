import type { Metadata } from "next";
import { Cal_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

const calSans = Cal_Sans({
  weight: "400",
  variable: "--font-cal-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "Schomora — Adaptive Learning Platform",
  description:
    "Belajar lebih cerdas dengan quiz adaptif yang menyesuaikan kemampuanmu",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Schomora",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={calSans.variable}>
      <body className="antialiased">
        <ServiceWorkerRegister />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
