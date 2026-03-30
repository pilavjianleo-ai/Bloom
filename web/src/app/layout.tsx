import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 h-[100dvh] flex overflow-hidden`}
      >
        <StoreProvider>
          <DesktopSidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
            <TopNav />
            <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative w-full">
              {children}
            </main>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
