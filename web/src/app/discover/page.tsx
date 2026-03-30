"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/posts";
import { USERS } from "@/data/users";
import { useState, useMemo } from "react";
import { Search, TrendingUp, Users, Briefcase, MapPin, Sparkles, Compass, Zap } from "lucide-react";
import Image from "next/image";

export default function Discover() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"user" | "expert" | "business" | "creator" | "all">("all");
  const [location] = useState("");
  
  const suggestedUsers = useMemo(() => {
    return USERS.filter((u) => (role === "all" ? true : u.role === role))
      .filter((u) => location ? (u.location || "").toLowerCase().includes(location.toLowerCase()) : true)
      .filter((u) => q ? u.name.toLowerCase().includes(q.toLowerCase()) || (u.bio || "").toLowerCase().includes(q.toLowerCase()) : true)
      .slice(0, 6);
  }, [role, location, q]);

  const trendingTopics = [
    { tag: "homerenovation", count: "12.4K" },
    { tag: "plumbinghacks", count: "8.2K" },
    { tag: "electricaltips", count: "5.1K" },
    { tag: "landscaping", count: "4.8K" },
    { tag: "diy", count: "15.9K" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-0">
      
      {/* Header & Search */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 md:px-8 md:py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black flex items-center gap-2">
              <Compass className="text-indigo-500 dark:text-indigo-400" size={32} />
              Explore
            </h1>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search creators, topics, or jobs..." 
              className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-12 pr-4 py-4 outline-none focus:border-indigo-500/50 transition text-lg shadow-sm" 
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/groups" className="group relative h-32 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-white/30 hover:scale-[1.02] transition-all bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/20 dark:to-purple-500/20 shadow-sm">
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 group-hover:bg-transparent dark:group-hover:bg-slate-950/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <Users size={28} className="text-indigo-600 dark:text-indigo-400 drop-shadow-sm dark:drop-shadow-lg" />
              <span className="font-bold text-lg text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow">Communities</span>
            </div>
          </Link>
          <Link href="/jobs" className="group relative h-32 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-white/30 hover:scale-[1.02] transition-all bg-emerald-50 dark:bg-gradient-to-br dark:from-emerald-500/20 dark:to-teal-500/20 shadow-sm">
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 group-hover:bg-transparent dark:group-hover:bg-slate-950/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <Briefcase size={28} className="text-emerald-600 dark:text-emerald-400 drop-shadow-sm dark:drop-shadow-lg" />
              <span className="font-bold text-lg text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow">Opportunities</span>
            </div>
          </Link>
          <Link href="/?category=plumbing" className="group relative h-32 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-white/30 hover:scale-[1.02] transition-all bg-amber-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20 shadow-sm">
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 group-hover:bg-transparent dark:group-hover:bg-slate-950/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <TrendingUp size={28} className="text-amber-600 dark:text-amber-400 drop-shadow-sm dark:drop-shadow-lg" />
              <span className="font-bold text-lg text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow">Trending</span>
            </div>
          </Link>
          <Link href="/settings" className="group relative h-32 rounded-3xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-white/30 hover:scale-[1.02] transition-all bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20 shadow-sm">
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 group-hover:bg-transparent dark:group-hover:bg-slate-950/20 transition-colors" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <Zap size={28} className="text-blue-600 dark:text-blue-400 drop-shadow-sm dark:drop-shadow-lg" />
              <span className="font-bold text-lg text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow">Monetize</span>
            </div>
          </Link>
        </div>

        {/* Two Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Search Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Compass className="text-indigo-500 dark:text-indigo-400" size={20} /> Discover
                </h2>
              </div>
              
              {suggestedUsers.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400 dark:text-slate-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No results found</h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-6">We couldn&apos;t find anyone matching your search.</p>
                  <button 
                    onClick={() => {setQ(""); setRole("all");}}
                    className="px-6 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition shadow-lg inline-block"
                  >
                    Clear Search
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <select value={role} onChange={(e) => setRole(e.target.value as "user" | "expert" | "business" | "creator" | "all")} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm px-3 py-2 outline-none shadow-sm">
                  <option value="all">All Roles</option>
                  <option value="expert">Experts</option>
                  <option value="business">Businesses</option>
                  <option value="creator">Creators</option>
                </select>
              </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedUsers.map((u) => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="group p-5 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-start gap-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 border border-slate-100 dark:border-transparent">
                      <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{u.name}</h3>
                        {u.verified && <Sparkles size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2 capitalize flex items-center gap-2">
                        {u.role} • <MapPin size={12} /> {u.location || "Remote"}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-2">{u.bio}</p>
                    </div>
                  </Link>
                ))}
              </div>

            {/* Categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Browse by Category</h2>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    href={`/?category=${c.key}`}
                    className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium shadow-sm"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* Trending Topics */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500 dark:text-indigo-400" /> Trending Topics
              </h3>
              <div className="space-y-4">
                {trendingTopics.map((t, i) => (
                  <Link key={t.tag} href={`/?q=${t.tag}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300 dark:text-slate-600 font-bold text-sm">{i + 1}</span>
                      <span className="font-medium text-slate-700 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">#{t.tag}</span>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{t.count} posts</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Monetization / Promote Banner */}
            <div className="rounded-3xl bg-amber-50 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200 dark:border-amber-500/30 p-6 relative overflow-hidden shadow-sm">
              <Sparkles className="absolute top-4 right-4 text-amber-200 dark:text-amber-400/20" size={64} />
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg mb-3 uppercase tracking-wider">
                  Grow your business
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Want more leads?</h3>
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                  Boost your posts or profile to reach thousands of potential clients in your area.
                </p>
                <Link href="/settings" className="block w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-center font-bold transition shadow-lg shadow-amber-500/20">
                  Boost Content
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
