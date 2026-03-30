"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/state/store";
import { Home, Compass, Users, Briefcase, MessageSquare, User, Search } from "lucide-react";

export default function BottomNav() {
  const path = usePathname();
  const store = useStore();
  
  const items = [
    { 
      href: "/", 
      text: "Home",
      icon: <Home size={22} className="mb-1" />
    },
    { 
      href: "/search", 
      text: "Explore",
      icon: <Search size={22} className="mb-1" />
    },
    { 
      href: "/groups", 
      text: "Community",
      icon: <Users size={22} className="mb-1" />
    },
    { 
      href: "/jobs", 
      text: "Jobs",
      icon: <Briefcase size={22} className="mb-1" />
    },
    { 
      href: "/inbox", 
      text: "Inbox",
      icon: <MessageSquare size={22} className="mb-1" />
    },
    { 
      href: `/profile/${store.currentUserId}`, 
      text: "Profile",
      icon: <User size={22} className="mb-1" />
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map((it) => {
          const active = path === it.href || (it.href !== "/" && path.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center justify-center w-full h-12 transition-all ${active ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"}`}
            >
              {it.icon}
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{it.text}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
