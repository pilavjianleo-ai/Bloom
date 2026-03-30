import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { StoreProvider } from "@/state/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixly — Video Services & Q&A",
  description: "Short-form video discovery for services, experts, and community Q&A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-full flex flex-col`}
      >
        <StoreProvider>
          <TopNav />
          <div className="flex-1 pb-16 md:pb-0">
            {children}
          </div>
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
