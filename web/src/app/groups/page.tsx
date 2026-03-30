"use client";

import Link from "next/link";
import { useStore } from "@/state/store";
import { useState } from "react";
import type { Category } from "@/types";
import { CATEGORIES } from "@/data/posts";
import { Search, Users, MessageSquare, Compass, TrendingUp, PlusCircle, ArrowRight, Zap, Coffee, Flame, HelpCircle, Camera } from "lucide-react";

export default function GroupsList() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  const groups = store.groups.filter(g => {
    const matchQ = g.name.toLowerCase().includes(q.toLowerCase()) || g.description.toLowerCase().includes(q.toLowerCase());
    const matchCat = cat === "all" || g.category === cat;
    return matchQ && matchCat;
  });

  const me = store.users.find(u => u.id === store.currentUserId);
  const myGroups = store.groups.filter(g => g.members.includes(store.currentUserId));

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto p-4 pt-[calc(env(safe-area-inset-top)+1rem)] md:p-8 space-y-10">
        
        {/* Header Section (Warm Welcome) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
              Good afternoon, {me?.name.split(' ')[0] || 'there'} <Coffee className="text-amber-500 dark:text-amber-400" size={28} />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">What&apos;s happening in your network today?</p>
          </div>
          <div className="flex gap-2">
            <Link href="/groups/new" className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md flex items-center gap-2">
              <PlusCircle size={20} /> Create Space
            </Link>
          </div>
        </div>

        {/* Live Activity Row (New) */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-none bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">12 people are discussing Plumbing right now</span>
          </div>
          <div className="flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <MessageSquare size={16} className="text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">3 new replies in Renovation Pros</span>
          </div>
          <div className="flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
            <Flame size={16} className="text-amber-500 dark:text-amber-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Electricians Hub is trending today</span>
          </div>
        </div>

        {/* Quick Post Box (New) */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-all">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {me && <img src={me.avatar} alt="Me" className="w-full h-full object-cover" />}
            </div>
            <button className="flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition rounded-2xl px-5 py-4 text-left text-slate-500 dark:text-slate-400 text-lg shadow-inner">
              Ask the community something...
            </button>
          </div>
          <div className="flex flex-wrap gap-3 pl-16">
            <button className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition flex items-center gap-2">
              <HelpCircle size={16} className="text-indigo-500" /> Ask Question
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Share Tip
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition flex items-center gap-2">
              <Camera size={16} className="text-emerald-500" /> Upload Demo
            </button>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: My Groups & Discover */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Active Groups */}
            {myGroups.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="text-indigo-500 dark:text-indigo-400" size={20} /> Your Spaces
                </h2>
                <div className="space-y-3">
                  {myGroups.map(g => (
                    <Link key={`my-${g.id}`} href={`/groups/${g.id}`} className="group flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-105 transition-transform border border-indigo-100 dark:border-transparent">
                        {g.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{g.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{g.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-500 group-hover:text-white text-slate-400 dark:text-white transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search & Discover */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Compass className="text-amber-500 dark:text-amber-400" size={20} /> Discover Communities
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input 
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                    placeholder="Search topics..." 
                    className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-12 pr-4 py-4 outline-none focus:border-indigo-500/50 transition shadow-sm" 
                  />
                </div>
                <select 
                  value={cat} 
                  onChange={e => setCat(e.target.value as Category | "all")} 
                  className="sm:w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-4 outline-none focus:border-indigo-500/50 transition appearance-none font-medium cursor-pointer shadow-sm text-slate-900 dark:text-white"
                >
                  <option value="all">All Topics</option>
                  <option value="hobbies">Hobbies</option>
                  <option value="learning">Learning</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="business">Business</option>
                  <option value="support">Support</option>
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.filter(g => !myGroups.find(mg => mg.id === g.id)).map(g => {
                  return (
                    <div key={g.id} className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800 transition-all flex flex-col h-full shadow-sm group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{g.name}</h3>
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                          {g.category}
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">{g.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, g.members.length))].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`https://i.pravatar.cc/150?u=${g.id}${i}`} alt="user" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 z-10">
                            +{g.members.length}
                          </div>
                        </div>
                        <button 
                          onClick={() => store.joinGroup(g.id)}
                          className="px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl transition-all shadow-sm"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  );
                })}
                {groups.filter(g => !myGroups.find(mg => mg.id === g.id)).length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-center py-12 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Compass className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">You&apos;ve joined them all!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Or try searching for something else.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Trending Discussions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-emerald-500 dark:text-emerald-400" size={20} /> Trending Posts
              </h2>
              <div className="space-y-4">
                {store.groupPosts.slice(0, 4).map(p => {
                  const author = store.users.find(u => u.id === p.userId);
                  const group = store.groups.find(g => g.id === p.groupId);
                  if (!author || !group) return null;
                  return (
                    <Link key={p.id} href={`/groups/${group.id}`} className="block group">
                      <div className="text-xs text-slate-500 dark:text-slate-500 mb-1 font-medium">{group.name}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
                        {p.text}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={author.avatar} alt="" className="w-4 h-4 rounded-full" />
                        <span>{author.name.split(' ')[0]}</span>
                        <span>•</span>
                        <span>{p.likes} likes</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}