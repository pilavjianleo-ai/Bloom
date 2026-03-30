"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/state/store";
import Image from "next/image";

export default function TopNav() {
  const store = useStore();
  const theme = store.theme;

  useEffect(() => {
    const el = document.documentElement;
    if (theme === "dark") {
      el.classList.add("dark");
      el.classList.remove("light");
    } else {
      el.classList.remove("dark");
      el.classList.add("light");
    }
  }, [theme]);

  const hasUnread = store.notifications.some(n => !n.read);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="hidden md:block sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Fixly</Link>
        
        <div className="flex items-center gap-1 flex-1 justify-center max-w-xl">
          <Link href="/" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium transition text-sm">
            Home
          </Link>
          <Link href="/discover" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium transition text-sm">
            Explore
          </Link>
          <Link href="/groups" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium transition text-sm">
            Communities
          </Link>
          <Link href="/jobs" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium transition text-sm">
            Opportunities
          </Link>
          <Link href="/search" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium transition text-sm">
            Search
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 font-bold text-sm transition-all shadow-md hover:shadow-lg">
            Create
          </Link>
          <Link href="/dashboard" className="px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm transition font-medium">
            My Hub
          </Link>
          {store.users.find(u => u.id === store.currentUserId)?.role === "business" && (
            <Link href="/dashboard/hiring" className="px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 text-sm transition">
              Hiring
            </Link>
          )}
          <Link href="/inbox" className="px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 relative transition">
            <span className="text-lg">✉️</span>
            {mounted && hasUnread && <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-black"></span>}
          </Link>
          <button 
            onClick={() => store.setTheme(store.theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 transition text-lg"
            title="Toggle theme"
          >
            {store.theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link href={`/profile/${store.currentUserId}`} className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-white transition">
            <Image src={store.users.find(u => u.id === store.currentUserId)?.avatar || "/vercel.svg"} alt="Profile" fill className="object-cover" />
          </Link>
        </div>
      </div>
    </div>
  );
}
