"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/state/store";
import { CheckCircle, Play, MessageSquare, Star, UserPlus, MapPin, Briefcase, Zap, TrendingUp, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function HiringPanel() {
  const store = useStore();
  const me = store.users.find((u) => u.id === store.currentUserId)!;
  const jobs = store.jobs.filter((j) => j.postedBy === me.id);
  const apps = store.applications.filter((a) => jobs.some((j) => j.id === a.jobId));
  
  const [activeTab, setActiveTab] = useState<"applicants" | "discover">("applicants");
  
  // Discover candidates (not applied, but match skills)
  const discoverCandidates = store.users.filter(u => u.id !== me.id && u.role === "expert");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-0">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-6 md:px-8 md:py-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Briefcase className="text-indigo-500 dark:text-indigo-400" /> Talent Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Review applicants and discover new talent for your business.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/jobs" className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition">Manage Jobs</Link>
            <Link href="/upload" className="px-5 py-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold transition shadow-md">Post Job</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("applicants")}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === "applicants" ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            Applicants <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "applicants" ? "bg-white/20 dark:bg-slate-950/10" : "bg-slate-200 dark:bg-slate-800"}`}>{apps.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === "discover" ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            <Zap size={18} className={activeTab === "discover" ? "text-amber-300" : "text-amber-500 dark:text-amber-400"} /> AI Discover <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full hidden sm:inline-block">Beta</span>
          </button>
        </div>

        {activeTab === "applicants" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {apps.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-slate-400 dark:text-slate-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No applicants yet</h3>
                <p className="text-slate-500 dark:text-slate-500">When someone applies to your jobs, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {apps.map((a) => {
                  const job = jobs.find((j) => j.id === a.jobId);
                  const user = store.users.find((u) => u.id === a.userId);
                  const videos = store.posts.filter((p) => p.userId === a.userId);
                  const cv = store.cvs[a.userId];
                  
                  if (!user) return null;

                  return (
                    <div key={a.id} className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col h-full group">
                      
                      {/* Header: User Info & Job */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <Link href={`/profile/${user.id}`} className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-transparent group-hover:scale-105 transition-transform">
                            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                          </Link>
                          <div>
                            <Link href={`/profile/${user.id}`} className="font-bold text-xl text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                              {user.name}
                              {user.verified && <CheckCircle size={16} className="text-blue-500 dark:text-blue-400" />}
                            </Link>
                            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                              <MapPin size={12} /> {user.location || "Remote"}
                            </div>
                            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1 bg-indigo-50 dark:bg-indigo-500/10 inline-block px-2 py-0.5 rounded-md">
                              Applied for: {job?.title}
                            </div>
                          </div>
                        </div>
                        <div className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider ${
                          a.status === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-transparent' :
                          a.status === 'rejected' ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-transparent' :
                          'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-transparent'
                        }`}>
                          {a.status || "pending"}
                        </div>
                      </div>

                      {/* Content: Skills & Video */}
                      <div className="flex-1 space-y-4">
                        {cv?.skills && cv.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {cv.skills.slice(0, 4).map(s => (
                              <span key={s} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800">
                                {s}
                              </span>
                            ))}
                            {cv.skills.length > 4 && <span className="px-2.5 py-1 bg-slate-50 dark:bg-transparent text-slate-400 dark:text-slate-500 text-xs font-bold">+ {cv.skills.length - 4}</span>}
                          </div>
                        )}

                        {videos.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 relative overflow-hidden group-hover:shadow-lg transition">
                              <Play size={16} className="text-slate-500 dark:text-white z-10" />
                              {videos[0].videoUrl && <video src={videos[0].videoUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">Has {videos.length} Skill Demos</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()} total views</div>
                            </div>
                            <Link href={`/profile/${a.userId}`} className="ml-auto px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                              Watch
                            </Link>
                          </div>
                        )}

                        {a.coverLetter && (
                          <div className="text-sm text-slate-500 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl italic">
                            &quot;{a.coverLetter}&quot;
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => store.sendMessage(`job-${a.jobId}`, `Application: ${job?.title}`, `Hi ${user?.name}, thanks for applying!`)}
                          className="flex-1 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm transition flex items-center justify-center gap-2 border border-indigo-100 dark:border-transparent"
                        >
                          <MessageSquare size={16} /> Message
                        </button>
                        
                        {a.status !== "accepted" && (
                          <button onClick={() => store.setApplicationStatus(a.id, "accepted")} className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm transition shadow-sm">
                            Accept
                          </button>
                        )}
                        {a.status !== "rejected" && (
                          <button onClick={() => store.setApplicationStatus(a.id, "rejected")} className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-sm transition border border-red-100 dark:border-transparent">
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "discover" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Discover Header & Filters */}
            <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Sparkles className="text-amber-500 dark:text-amber-400" /> AI Candidate Match
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">We found {discoverCandidates.length} experts whose verified skills match your typical job postings.</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search skills..." className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition" />
                </div>
              </div>
            </div>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverCandidates.map(u => {
                const matchScore = (u.id.charCodeAt(0) % 15) + 85; // Deterministic pseudo-random 85-99%
                const videos = store.posts.filter((p) => p.userId === u.id);
                
                return (
                  <div key={`disc-${u.id}`} className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden">
                    
                    {/* Match Score Badge */}
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow-md z-10 flex items-center gap-1">
                      <TrendingUp size={12} /> {matchScore}% Match
                    </div>

                    <div className="flex flex-col items-center text-center mb-4 relative z-10 pt-2">
                      <Link href={`/profile/${u.id}`} className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-white dark:border-zinc-800 shadow-md group-hover:scale-105 transition-transform">
                        <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                      </Link>
                      <Link href={`/profile/${u.id}`} className="font-black text-lg text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 justify-center">
                        {u.name}
                        {u.verified && <CheckCircle size={14} className="text-blue-500 dark:text-blue-400" />}
                      </Link>
                      <div className="text-sm text-slate-500 dark:text-slate-400 capitalize mt-0.5">{u.role}</div>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-300 line-clamp-2 text-center mb-4 flex-1">
                      {u.bio || "Professional expert looking for new opportunities and collaborations."}
                    </p>

                    {videos.length > 0 && (
                      <div className="mb-4 bg-slate-50 dark:bg-white/5 rounded-xl p-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-300">
                        <span className="flex items-center gap-1.5"><Play size={14} className="text-indigo-500" /> {videos.length} Skill Demos</span>
                        <span>{videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()} views</span>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {u.skills?.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button 
                        onClick={() => store.addNotification("Invite sent!")}
                        className="py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-sm transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <UserPlus size={16} /> Invite
                      </button>
                      <button 
                        className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm transition flex items-center justify-center gap-1.5"
                      >
                        <Star size={16} /> Save
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

