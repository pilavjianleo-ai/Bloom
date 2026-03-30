"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/state/store";
import { Home, Compass, Users, Briefcase, MessageSquare, User, PlusCircle } from "lucide-react";
import Image from "next/image";

export default function DesktopSidebar() {
  const path = usePathname();
  const store = useStore();
  const me = store.users.find((u) => u.id === store.currentUserId);

  const items = [
    { href: "/", text: "Home", icon: <Home size={24} /> },
    { href: "/search", text: "Explore", icon: <Compass size={24} /> },
    { href: "/groups", text: "Communities", icon: <Users size={24} /> },
    { href: "/jobs", text: "Jobs", icon: <Briefcase size={24} /> },
    { href: "/inbox", text: "Inbox", icon: <MessageSquare size={24} /> },
    { href: `/profile/${store.currentUserId}`, text: "Profile", icon: <User size={24} /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto no-scrollbar py-6 px-4">
      {/* Brand Logo inside Sidebar? User wanted it in Top Bar, but we can put it here or just leave it for TopBar. Let's put a small logo or leave it empty and let TopBar handle it. The user said: "LEFT SIDEBAR: Home, Explore, Communities, Jobs, Inbox, Profile. TOP BAR: Logo, Search, Create button, User menu." */}
      <nav className="flex flex-col gap-2 mt-4">
        {items.map((it) => {
          const active = path === it.href || (it.href !== "/" && path.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                active 
                  ? "bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-white" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {it.icon}
              <span className="text-lg">{it.text}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-8 px-2">
        <Link 
          href="/upload" 
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-all shadow-md hover:shadow-lg"
        >
          <PlusCircle size={24} />
          Create
        </Link>
      </div>
      
      {/* User profile snippet at bottom */}
      {me && (
        <div className="mt-auto pt-6 px-2">
          <Link href={`/profile/${me.id}`} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
              <Image src={me.avatar} alt={me.name} width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{me.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">View Profile</div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}