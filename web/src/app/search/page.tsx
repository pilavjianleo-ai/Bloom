"use client";

import { useStore } from "@/state/store";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, Users, Video, FileText, Briefcase, Hash, MapPin, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

type SearchTab = "all" | "people" | "content" | "jobs" | "groups";

export default function Search() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<SearchTab>("all");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const users = store.users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        (u.location || "").toLowerCase().includes(term) ||
        (u.bio || "").toLowerCase().includes(term) ||
        (u.skills || []).some(s => s.toLowerCase().includes(term))
    );
    const posts = store.posts.filter(
      (p) =>
        p.caption.toLowerCase().includes(term) ||
        p.businessName.toLowerCase().includes(term) ||
        (p.skillTags || []).some(s => s.toLowerCase().includes(term))
    );
    const texts = store.textPosts.filter(
      (t) => t.text.toLowerCase().includes(term) || t.businessName.toLowerCase().includes(term)
    );
    const jobs = store.jobs.filter(
      (j) => j.title.toLowerCase().includes(term) || j.description.toLowerCase().includes(term) || j.location.toLowerCase().includes(term)
    );
    const groups = store.groups.filter(
      (g) => g.name.toLowerCase().includes(term) || g.description.toLowerCase().includes(term)
    );
    return { users, posts, texts, jobs, groups };
  }, [q, store.users, store.posts, store.textPosts, store.jobs, store.groups]);

  const hasSearch = q.trim().length > 0;
  const hasResults = results.users.length > 0 || results.posts.length > 0 || results.texts.length > 0 || results.jobs.length > 0 || results.groups.length > 0;

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white pb-24 md:pb-8">
      
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 pt-[calc(env(safe-area-inset-top)+1rem)] md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`} size={20} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for people, skills, jobs, or communities..."
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl pl-12 pr-12 py-4 outline-none transition-all shadow-sm text-lg font-medium placeholder-slate-400 dark:placeholder-slate-500"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>
          
          {/* Tabs */}
          {hasSearch && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
              {[
                { id: "all", label: "All Results" },
                { id: "people", label: "People", count: results.users.length },
                { id: "content", label: "Content", count: results.posts.length + results.texts.length },
                { id: "jobs", label: "Jobs", count: results.jobs.length },
                { id: "groups", label: "Communities", count: results.groups.length }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as SearchTab)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${tab === t.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  {t.label} {t.count !== undefined && <span className="ml-1 opacity-60">({t.count})</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* --- DISCOVERY HOME (No Search) --- */}
        {!hasSearch && (
          <div className="space-y-12 animate-in fade-in duration-500">
            
            {/* Trending */}
            <section>
              <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={16} /> Trending Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {["Plumbing Services", "React Developer", "Local Meetups", "Renovation Tips", "Electrician Hiring"].map(t => (
                  <button key={t} onClick={() => setQ(t)} className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 group">
                    <SearchIcon size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" /> {t}
                  </button>
                ))}
              </div>
            </section>

            {/* AI Suggested People */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" /> Suggested for you
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {store.users.slice(0, 4).map(u => (
                  <Link key={u.id} href={`/profile/${u.id}`} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all group">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{u.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.role || "Member"}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {(u.skills || []).slice(0, 2).map(s => (
                          <span key={s} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Communities */}
            <section>
              <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Hash size={16} /> Growing Communities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {store.groups.slice(0, 3).map(g => (
                  <Link key={g.id} href={`/groups/${g.id}`} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:shadow-md transition-all group flex flex-col h-full">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{g.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{g.description}</div>
                    <div className="flex items-center justify-between text-xs font-bold mt-auto">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Users size={14} /> {g.members.length} members</span>
                      <span className="text-indigo-600 dark:text-indigo-400">Join</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- SEARCH RESULTS --- */}
        {hasSearch && (
          <div className="animate-in fade-in duration-300">
            {!hasResults ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon size={40} className="text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No exact matches found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">We couldn&apos;t find anything matching &quot;{q}&quot;. Try adjusting your search or explore these categories instead.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button onClick={() => setQ("Developer")} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold shadow-sm">Developer</button>
                  <button onClick={() => setQ("Plumbing")} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold shadow-sm">Plumbing</button>
                  <button onClick={() => setQ("Design")} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold shadow-sm">Design</button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* PEOPLE RESULTS */}
                {(tab === "all" || tab === "people") && results.users.length > 0 && (
                  <section>
                    {tab === "all" && <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users size={20} className="text-indigo-500" /> People</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.users.map(u => (
                        <div key={u.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                          <Link href={`/profile/${u.id}`} className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 hover:opacity-80 transition">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/profile/${u.id}`} className="font-bold text-lg text-slate-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block">{u.name}</Link>
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">{u.role || "Member"} {u.location && `• ${u.location}`}</div>
                            <div className="flex items-center gap-2">
                              {(u.skills || []).slice(0, 2).map(s => (
                                <span key={s} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">{s}</span>
                              ))}
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold text-sm rounded-xl transition-colors">
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* JOBS RESULTS */}
                {(tab === "all" || tab === "jobs") && results.jobs.length > 0 && (
                  <section>
                    {tab === "all" && <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase size={20} className="text-emerald-500" /> Opportunities</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.jobs.map(j => (
                        <Link key={j.id} href={`/jobs/${j.id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all group flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-black text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">{j.title}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md shrink-0 ml-2">{j.jobType}</div>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4"><MapPin size={14} /> {j.location}</div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-6 flex-1">{j.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Posted recently</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">Apply <ArrowRight size={14} /></span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* CONTENT RESULTS */}
                {(tab === "all" || tab === "content") && (results.posts.length > 0 || results.texts.length > 0) && (
                  <section>
                    {tab === "all" && <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Video size={20} className="text-pink-500" /> Content</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.posts.map(p => (
                        <Link key={p.id} href={`/post/${p.id}`} className="bg-slate-900 rounded-3xl overflow-hidden relative aspect-[3/4] group hover:scale-[1.02] transition-transform shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.profileImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white text-xs font-bold">
                            <Video size={12} /> Video
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="font-bold text-white line-clamp-2 mb-2">{p.caption}</div>
                            <div className="flex items-center gap-2 text-xs text-white/70">
                              <div className="w-5 h-5 rounded-full bg-slate-800 overflow-hidden"><img src={p.profileImage} alt="" className="w-full h-full object-cover" /></div>
                              {p.businessName}
                            </div>
                          </div>
                        </Link>
                      ))}
                      {results.texts.map(t => (
                        <Link key={t.id} href={`/post/${t.id}`} className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-5 flex flex-col relative group hover:scale-[1.02] transition-transform shadow-md aspect-[3/4]">
                          <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white text-xs font-bold">
                            <FileText size={12} /> Post
                          </div>
                          <div className="flex-1 flex items-center justify-center mt-6">
                            <div className="font-black text-xl text-white text-center line-clamp-4 leading-tight">{t.text}</div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/70 mt-auto pt-4">
                            <div className="w-5 h-5 rounded-full bg-white/20 overflow-hidden"><img src={t.profileImage} alt="" className="w-full h-full object-cover" /></div>
                            {t.businessName}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* GROUPS RESULTS */}
                {(tab === "all" || tab === "groups") && results.groups.length > 0 && (
                  <section>
                    {tab === "all" && <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Hash size={20} className="text-blue-500" /> Communities</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.groups.map(g => (
                        <div key={g.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Hash size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link href={`/groups/${g.id}`} className="font-bold text-lg text-slate-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">{g.name}</Link>
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{g.members.length} members</div>
                          </div>
                          <button onClick={() => store.joinGroup(g.id)} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 transition">
                            Join
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
