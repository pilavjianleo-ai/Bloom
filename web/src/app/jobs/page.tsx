"use client";

import Link from "next/link";
import { useStore } from "@/state/store";
import { useMemo, useState } from "react";
import { Briefcase, Search, MapPin, DollarSign, Clock, Filter, Star, Sparkles, Video } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/data/users";

export default function Jobs() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [viewSaved, setViewSaved] = useState(false);
  
  const jobs = useMemo(() => {
    const term = q.trim().toLowerCase();
    return store.jobs.filter((j) => {
      const matchQ = term.length === 0 || j.title.toLowerCase().includes(term) || j.description.toLowerCase().includes(term);
      const matchT = type === "all" ? true : j.jobType === type;
      const matchSaved = viewSaved ? !!store.saved[j.id] : true;
      return matchQ && matchT && matchSaved;
    });
  }, [store.jobs, q, type, viewSaved, store.saved]);
  
  const me = store.users.find((u) => u.id === store.currentUserId)!;
  
  // Get trending jobs (just first 3 for demo)
  const trendingJobs = store.jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-0">
      
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-emerald-50 dark:bg-gradient-to-tr dark:from-emerald-900 dark:via-zinc-900 dark:to-black overflow-hidden border-b border-emerald-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="text-emerald-600 dark:text-emerald-400" size={28} />
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Opportunities</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-200 text-lg max-w-xl">Find jobs, freelance projects, leads, and services.</p>
            </div>
            
            {me.role === "business" ? (
              <div className="shrink-0 flex gap-2">
                <Link href="/upload" className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400 font-bold text-sm hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] inline-block">
                  Post Opportunity
                </Link>
              </div>
            ) : (
              <div className="shrink-0 flex gap-2">
                <Link href="/upload" className="px-6 py-3 rounded-full bg-emerald-500 text-white dark:text-black font-bold text-sm hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(16,185,129,0.3)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] inline-block">
                  Offer a Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-2 rounded-3xl flex flex-col md:flex-row gap-2 sticky top-2 z-30 backdrop-blur-xl shadow-sm dark:shadow-2xl">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search roles, skills, or companies..." 
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-transparent pl-12 pr-4 py-4 outline-none focus:border-emerald-500/50 focus:bg-white dark:focus:bg-slate-950 transition text-lg text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40" 
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                className="w-full md:w-48 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent pl-12 pr-4 py-4 outline-none focus:border-emerald-500/50 transition appearance-none font-medium cursor-pointer text-slate-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="freelance">Freelance</option>
                <option value="service">Service / Lead</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            
            <button 
              onClick={() => setViewSaved(!viewSaved)} 
              className={`shrink-0 px-6 py-4 rounded-2xl font-bold transition flex items-center gap-2 ${viewSaved ? "bg-amber-400 text-black shadow-[0_4px_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"}`}
            >
              <Star size={18} fill={viewSaved ? "currentColor" : "none"} />
              <span className="hidden sm:inline">Saved</span>
            </button>
          </div>
        </div>

        {/* Content Area Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Job List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                {viewSaved ? "Saved Jobs" : q ? "Search Results" : "Latest Opportunities"}
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-500 dark:text-slate-400">{jobs.length}</span>
              </h2>
            </div>

            <div className="space-y-4">
              {jobs.map((j) => {
                const isSaved = !!store.saved[j.id];
                const business = USERS.find(u => u.id === j.postedBy);
                
                return (
                  <div key={j.id} className="group rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800 transition-all flex flex-col md:flex-row gap-6 relative shadow-sm">
                    
                    <button 
                      onClick={() => store.save(j.id)}
                      className="absolute top-6 right-6 p-2 text-slate-300 dark:text-slate-600 hover:text-amber-400 dark:hover:text-amber-400 transition group-hover:text-slate-400 dark:group-hover:text-white/40 z-10"
                    >
                      <Star size={24} fill={isSaved ? "#fbbf24" : "none"} className={isSaved ? "text-amber-400" : ""} />
                    </button>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0 border border-slate-200 dark:border-transparent">
                          <Image src={business?.avatar || "/vercel.svg"} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{business?.name || "Business"}</div>
                          <Link href={`/jobs/${j.id}`} className="font-bold text-xl md:text-2xl text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1 pr-10">
                            {j.title}
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm font-medium mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-700 dark:text-slate-200">
                          <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" /> {j.location}
                        </span>
                        {j.jobType && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-700 dark:text-slate-200 capitalize">
                            <Clock size={14} className="text-blue-500 dark:text-blue-400" /> {j.jobType}
                          </span>
                        )}
                        {j.salary && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <DollarSign size={14} /> {j.salary}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1">
                        {j.description}
                      </p>

                      <div className="flex items-center gap-3 mt-auto">
                        <Link href={`/jobs/${j.id}`} className="flex-1 text-center px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400 font-bold hover:scale-[1.02] transition-transform shadow-sm">
                          Apply Now
                        </Link>
                        <Link href={`/profile/${j.postedBy}`} className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition">
                          View Company
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {jobs.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-400 dark:text-slate-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No opportunities found</h3>
                  <p className="text-slate-500 dark:text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Smart Matching Box */}
            <div className="rounded-3xl bg-indigo-50 dark:bg-gradient-to-br dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/20 p-6 relative overflow-hidden shadow-sm">
              <Sparkles className="absolute top-4 right-4 text-indigo-200 dark:text-indigo-400/20" size={64} />
              <h3 className="text-lg font-bold mb-2 relative z-10 flex items-center gap-2 text-slate-900 dark:text-white">
                <Sparkles size={18} className="text-indigo-500 dark:text-indigo-400" /> Smart Match
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10">We noticed you frequently post about plumbing. Make sure your CV highlights these skills.</p>
              <Link href={`/profile/${me.id}`} className="block w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-center font-bold text-sm transition relative z-10 shadow-md">
                Update Profile
              </Link>
            </div>

            {/* Trending Jobs */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold uppercase tracking-wider text-sm text-slate-500 dark:text-slate-400 mb-4">Trending Now</h3>
              <div className="space-y-4">
                {trendingJobs.map(tj => (
                  <Link key={`trend-${tj.id}`} href={`/jobs/${tj.id}`} className="group block">
                    <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{tj.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center justify-between">
                      <span>{tj.location}</span>
                      <span className="text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1">
                        Hot <Sparkles size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Video Pitch CTA */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={20} className="text-emerald-600 dark:text-white" />
              </div>
              <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Stand out with Video</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Did you know? Applications with a short video pitch get 3x more responses.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

