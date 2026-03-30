"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/state/store";
import { Home, Compass, Users, Briefcase, MessageSquare, User, Plus } from "lucide-react";

export default function BottomNav() {
  const path = usePathname();
  const store = useStore();
  
  const items = [
    { href: "/", text: "Home", icon: <Home size={22} className="mb-1" /> },
    { href: "/search", text: "Explore", icon: <Compass size={22} className="mb-1" /> },
    { href: "/groups", text: "Groups", icon: <Users size={22} className="mb-1" /> },
    { href: "/upload", isCreate: true },
    { href: "/jobs", text: "Jobs", icon: <Briefcase size={22} className="mb-1" /> },
    { href: "/inbox", text: "Inbox", icon: <MessageSquare size={22} className="mb-1" /> },
    { href: `/profile/${store.currentUserId}`, text: "Profile", icon: <User size={22} className="mb-1" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map((it, i) => {
          if (it.isCreate) {
            return (
              <Link
                key="create"
                href="/upload"
                className="flex flex-col items-center justify-center -mt-6 mx-1 z-10"
              >
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all">
                  <Plus size={28} />
                </div>
              </Link>
            );
          }
          
          const active = path === it.href || (it.href !== "/" && path.startsWith(it.href!));
          return (
            <Link
              key={it.href}
              href={it.href!}
              className={`flex flex-col items-center justify-center w-full h-12 transition-all ${
                active 
                  ? "text-indigo-600 dark:text-white" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {it.icon}
              <span className={`text-[9px] ${active ? "font-bold" : "font-medium"} truncate max-w-[40px] text-center`}>{it.text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
