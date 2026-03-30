"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/state/store";
import Image from "next/image";
import { Search, Plus, Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const store = useStore();
  const theme = store.theme;
  const router = useRouter();
  const [q, setQ] = useState("");

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
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shrink-0">
      
      {/* Left: Logo (If needed, or just let sidebar handle it. We will add a nice logo here) */}
      <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
        FIXLY.
      </Link>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <form onSubmit={handleSearch} className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for skills, people, or jobs..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-full pl-12 pr-4 py-2.5 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500"
          />
        </form>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-4 shrink-0">
        <Link 
          href="/upload" 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Create
        </Link>
        
        <button 
          onClick={() => store.setTheme(store.theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Toggle theme"
        >
          {store.theme === "dark" ? "☀️" : "🌙"}
        </button>

        <Link href="/inbox" className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative">
          <Bell size={20} />
          {mounted && hasUnread && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></span>}
        </Link>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

        <Link href={`/profile/${store.currentUserId}`} className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all shadow-sm">
          <Image src={store.users.find(u => u.id === store.currentUserId)?.avatar || "/vercel.svg"} alt="Profile" fill className="object-cover" />
        </Link>
      </div>
    </div>
  );
}
