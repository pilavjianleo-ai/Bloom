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
    <div className="flex-1 w-full bg-black text-white flex overflow-hidden">
      
      {/* Centered Feed Wrapper */}
      <div className="flex-1 relative flex justify-center h-full bg-black">
        
        {/* Mobile TopBar */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-40 pointer-events-none">
          <div className="p-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex items-center justify-between pointer-events-auto">
            <div className="text-xl font-black tracking-tighter drop-shadow-md">FIXLY.</div>
            <Link href="/search" className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white">
              <Search size={20} />
            </Link>
          </div>
        </div>

        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
              setLimit((n) => Math.min(n + 6, 120));
            }
          }}
          className="h-full w-full max-w-[500px] overflow-y-scroll snap-y snap-mandatory no-scrollbar relative bg-black"
        >
          {!mounted ? (
            <div className="h-full w-full flex items-center justify-center snap-start snap-always shrink-0 bg-black" />
          ) : data.length > 0 ? (
            <div className="flex flex-col">
              {data.map((item) => {
                if ("videoUrl" in item) {
                  return (
                    <div key={item.id} className="h-full w-full snap-start snap-always relative shrink-0 flex items-center justify-center bg-black">
                      <VideoCard post={item} onShare={() => setActiveShare(item.id)} />
                    </div>
                  );
                }
                return (
                  <div key={item.id} className="h-full w-full snap-start snap-always relative shrink-0 flex items-center justify-center bg-black">
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
          <CommentSheet />
          <ShareSheet />
          <OnboardingOverlay />
        </div>
      </div>
    </div>
  );
}
