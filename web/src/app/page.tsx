"use client";
import { useMemo, useState, useEffect } from "react";
import type { Category, Post, FeedItem, TextPost, User } from "@/types";
import VideoCard from "@/components/VideoCard";
import TextCard from "@/components/TextCard";
import TopBar from "@/components/TopBar";
import CommentSheet from "@/components/CommentSheet";
import ShareSheet from "@/components/ShareSheet";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { useStore } from "@/state/store";
import { CATEGORIES } from "@/data/posts";
import { Home as HomeIcon, Compass, Briefcase, Users, TrendingUp, Sparkles, Star, LayoutDashboard, Search, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const store = useStore();
  const initialParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialQuery = initialParams.get("q") || "";
  const initialCategory = (initialParams.get("category") as Category | "all") || "all";
  const initialRole = (initialParams.get("role") as User["role"]) || undefined;
  const initialLocation = initialParams.get("location") || undefined;
  const [category, setCategory] = useState<Category | "all">(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [limit, setLimit] = useState(8);
  const [activeShare, setActiveShare] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const data = useMemo<FeedItem[]>(() => {
    const q = query.trim().toLowerCase();
    const videos: Post[] = [...store.posts].filter((p) => {
      const byCat = category === "all" ? true : p.category === category;
      const byQuery =
        q.length === 0 ||
        p.businessName.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q);
      const user = store.users.find((u) => u.id === p.userId);
      const roleOk = initialRole ? (user?.role || (p.businessId ? "business" : "user")) === initialRole : true;
      const loc = user?.location;
      const locOk = initialLocation ? (loc || "").toLowerCase().includes(initialLocation.toLowerCase()) : true;
      return byCat && byQuery && roleOk && locOk;
    });
    const texts: TextPost[] = store.textPosts.filter((t) => {
      const byCat = category === "all" ? true : t.category === category;
      const byQuery =
        q.length === 0 ||
        t.businessName.toLowerCase().includes(q) ||
        t.text.toLowerCase().includes(q) ||
        t.caption.toLowerCase().includes(q);
      const user = store.users.find((u) => u.id === t.userId);
      const roleOk = initialRole ? (user?.role || "user") === initialRole : true;
      const loc = user?.location;
      const locOk = initialLocation ? (loc || "").toLowerCase().includes(initialLocation.toLowerCase()) : true;
      return byCat && byQuery && roleOk && locOk;
    });
    const merged: FeedItem[] = [...videos, ...texts];
    const scored = merged
      .map((item) => {
        const eg = store.engagement[item.id] || { watchTime: 0, exposures: 0, profileClicks: 0, contactClicks: 0 };
        const likes = "videoUrl" in item ? item.likes : item.likes;
        const views = "videoUrl" in item ? item.views : item.views;
        
        // Fair Distribution Algorithm
        // 1. Initial exposure base score
        // 2. High weight on deep actions (contact, profile clicks)
        // 3. Medium weight on engagement (likes)
        // 4. Watch time normalizes view count
        const deepActionScore = (eg.contactClicks * 20) + (eg.profileClicks * 10);
        const engagementScore = (likes * 5) + (eg.watchTime * 0.5);
        const exposurePenalty = (eg.exposures * 0.1); // slightly penalize if seen too much without interaction
        
        const score = deepActionScore + engagementScore + (views * 0.1) - exposurePenalty;
        
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
    return scored.slice(0, limit);
  }, [category, query, store.posts, store.textPosts, limit, initialRole, initialLocation, store.engagement, store.users]);

  return (
    <div className="h-[100dvh] w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex overflow-hidden">
      
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:flex flex-col w-[280px] shrink-0 p-6 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 z-10 relative">
        <div className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter px-2">FIXLY.</div>
        
        <nav className="flex flex-col gap-2 mb-10">
          <Link href="/" className="px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-white/10 text-indigo-600 dark:text-white font-bold flex items-center gap-4 transition-colors">
            <HomeIcon size={24}/> For You
          </Link>
          <Link href="/discover" className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-4 transition-colors">
            <Compass size={24}/> Explore
          </Link>
          <Link href="/groups" className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-4 transition-colors relative group">
            <Users size={24}/> Communities
            <span className="absolute right-4 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/jobs" className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-4 transition-colors">
            <Briefcase size={24}/> Opportunities
          </Link>
          <Link href="/dashboard" className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-4 transition-colors relative">
            <LayoutDashboard size={24}/> My Hub
          </Link>
          <Link href="/inbox" className="px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-4 transition-colors relative">
            <MessageSquare size={24}/> Inbox
            {store.notifications.some(n => !n.read) && <span className="absolute right-4 w-2 h-2 rounded-full bg-red-500" />}
          </Link>
        </nav>

        <div className="px-4 mb-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Categories</div>
        <div className="flex flex-col gap-1 mb-10">
          <button onClick={() => setCategory('all')} className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-colors ${category === 'all' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            All Content
          </button>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)} className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-colors ${category === c.key ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Discovery Layer */}
        <div className="px-4 mb-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Trending Now</div>
        <div className="flex flex-col gap-3 px-4">
          <Link href="/?q=renovation" className="group">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> #renovation</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">12.4K posts</div>
          </Link>
          <Link href="/?q=plumbing" className="group">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2"><Sparkles size={14} className="text-emerald-500" /> #plumbing</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">8.2K posts</div>
          </Link>
          <Link href="/discover" className="group">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex items-center gap-2"><Star size={14} className="text-amber-500" /> Top Creators</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">Discover experts</div>
          </Link>
        </div>
      </div>

      {/* Centered Feed Wrapper */}
      <div className="flex-1 relative flex justify-center h-full bg-white dark:bg-slate-950/95">
        
        {/* Subtle Background Glow for immersion */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        {/* Mobile TopBar */}
        <div className="lg:hidden">
          <TopBar
            active={category}
            onCategoryChange={setCategory}
            query={query}
            onQuery={setQuery}
          />
        </div>

        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
              setLimit((n) => Math.min(n + 6, 120));
            }
          }}
          className="h-full w-full max-w-[800px] overflow-y-scroll snap-y snap-mandatory no-scrollbar relative"
        >
          {!mounted ? (
            <div className="h-full w-full flex items-center justify-center snap-start shrink-0" />
          ) : data.length > 0 ? (
            <div className="flex flex-col">
              {data.map((item) => {
                if ("videoUrl" in item) {
                  return (
                    <div key={item.id} className="h-[100dvh] w-full snap-start snap-always relative shrink-0 flex items-center justify-center lg:py-6">
                      <VideoCard post={item} onShare={() => setActiveShare(item.id)} />
                    </div>
                  );
                }
                return (
                  <div key={item.id} className="h-[100dvh] w-full snap-start snap-always relative shrink-0 flex items-center justify-center lg:py-6">
                    <TextCard post={item} onShare={() => setActiveShare(item.id)} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center snap-start shrink-0">
            <div className="text-center bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full mx-4 shadow-sm">
              <div className="w-20 h-20 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-400 dark:text-slate-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No content found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setCategory("all");
                  setQuery("");
                }}
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 transition shadow-md"
              >
                Clear Filters
              </button>
            </div>
          </div>
          )}
          <a
            href="https://trae.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 text-[10px] font-bold text-white/30 hover:text-white/80 transition-colors uppercase tracking-widest bg-slate-950/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-800"
          >
            Built with Trae
          </a>
          <CommentSheet />
          <ShareSheet />
          <OnboardingOverlay />
        </div>
      </div>
    </div>
  );
}
