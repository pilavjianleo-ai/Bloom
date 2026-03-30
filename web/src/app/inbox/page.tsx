"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/state/store";
import { MessageSquare, Bell, Sparkles, Briefcase, ChevronRight, Search, ArrowRight, User, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type Tab = "messages" | "notifications" | "opportunities" | "requests";

export default function Inbox() {
  const [activeTab, setActiveTab] = useState<Tab>("messages");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto h-screen flex flex-col md:pt-16">
        {/* Header & Tabs */}
        <div className="px-4 py-6 md:px-6 md:py-8 border-b border-slate-800 shrink-0">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
            Opportunity Hub
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/30">NEW</span>
          </h1>
          
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "opportunities", label: "Opportunities", icon: Sparkles },
              { id: "requests", label: "Requests & Jobs", icon: Briefcase },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as Tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === t.id 
                    ? "bg-white text-black shadow-lg scale-105" 
                    : "bg-slate-900 text-white/70 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                <t.icon size={16} className={activeTab === t.id ? "text-black" : "text-white/50"} />
                {t.label}
                {t.id === "opportunities" && <span className="flex h-2 w-2 rounded-full bg-amber-500 ml-1"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "opportunities" && <OpportunitiesTab />}
          {activeTab === "requests" && <RequestsTab />}
        </div>
      </div>
    </div>
  );
}

// --- TABS ---

function MessagesTab() {
  const store = useStore();
  const list = Object.values(store.conversations);
  const [active, setActive] = useState(list[0]?.id);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  
  const conv = active ? store.conversations[active] : undefined;

  const filteredList = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col shrink-0 h-full ${active ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500/30 transition text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
          {filteredList.length === 0 && (
            <div className="p-8 text-center text-white/40 text-sm">No messages found.</div>
          )}
          {filteredList.map((c) => {
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${active === c.id ? "bg-slate-800" : "hover:bg-slate-900/80"}`}
              >
                <div className="w-12 h-12 rounded-full bg-zinc-700 shrink-0 overflow-hidden flex items-center justify-center text-xl font-bold">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold truncate text-sm">{c.name}</div>
                    {lastMsg && (
                      <div suppressHydrationWarning className="text-[10px] text-white/40 shrink-0 ml-2">
                        {formatDistanceToNow(lastMsg.createdAt, { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs truncate ${lastMsg?.me ? "text-white/40" : "text-white/70 font-medium"}`}>
                    {lastMsg?.me ? "You: " : ""}{lastMsg?.text || "Started a conversation"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat View */}
      {active ? (
        <div className="flex-1 flex flex-col bg-slate-950 h-full">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/50 backdrop-blur shrink-0">
            <button onClick={() => setActive("")} className="md:hidden p-2 -ml-2 text-white/60 hover:text-white">
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold">
              {conv?.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold">{conv?.name}</div>
              <div className="text-xs text-emerald-400">Online now</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {conv?.messages.map((m, i) => {
              const showTime = i === 0 || m.createdAt - conv.messages[i - 1].createdAt > 300000;
              return (
                <div key={i} className={`flex flex-col ${m.me ? "items-end" : "items-start"}`}>
                  {showTime && (
                    <div className="text-[10px] text-white/30 font-medium mb-3 mx-auto uppercase tracking-wider">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 text-sm leading-relaxed ${m.me ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-[0_4px_20px_rgba(79,70,229,0.2)]" : "bg-slate-800 text-white rounded-2xl rounded-tl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            {conv?.messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-white/40" />
                </div>
                <div className="font-bold mb-1">Start the conversation</div>
                <div className="text-sm text-white/40">Say hello or ask a question to get started.</div>
                
                {/* AI Suggestions */}
                <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md">
                  <button onClick={() => setMsg("Hi! I saw your profile and wanted to connect.")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-full text-xs font-medium border border-slate-800 transition">&quot;Hi! I saw your profile...&quot;</button>
                  <button onClick={() => setMsg("Are you available for a quick project?")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-full text-xs font-medium border border-slate-800 transition">&quot;Are you available for...&quot;</button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950/80 backdrop-blur border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && active && msg.trim()) {
                    store.sendMessage(active, conv?.name || "Conversation", msg.trim());
                    setMsg("");
                  }
                }}
                placeholder="Message..."
                className="flex-1 rounded-full bg-slate-900 border border-slate-800 px-5 py-3.5 outline-none focus:border-indigo-500/30 transition text-sm"
              />
              <button 
                onClick={() => { 
                  if (active && msg.trim()) { 
                    store.sendMessage(active, conv?.name || "Conversation", msg.trim()); 
                    setMsg(""); 
                  } 
                }} 
                disabled={!msg.trim()}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30 disabled:bg-white/50 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <ArrowRight size={20} className="font-bold" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-slate-950/50 border-l border-slate-800">
          <MessageSquare size={48} className="text-white/10 mb-4" />
          <div className="text-xl font-bold text-white/40">Select a conversation</div>
        </div>
      )}
    </div>
  );
}

function NotificationsTab() {
  const store = useStore();
  const notifs = store.notifications;

  useEffect(() => {
    store.markNotificationsRead();
  }, [store]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-2">
        {notifs.length === 0 && (
          <div className="text-center py-20 text-white/40 font-medium">No notifications yet.</div>
        )}
        {notifs.map((n) => (
          <Link 
            key={n.id} 
            href={n.href || "#"} 
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition group"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm md:text-base group-hover:text-white text-white/90 transition">{n.text}</div>
              <div suppressHydrationWarning className="text-xs text-white/40 mt-1">{formatDistanceToNow(n.createdAt, { addSuffix: true })}</div>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function OpportunitiesTab() {
  const store = useStore();
  const me = store.users.find(u => u.id === store.currentUserId)!;
  
  // Aggregate stats from posts
  const myPosts = store.posts.filter(p => p.userId === me.id);
  const totalViews = myPosts.reduce((sum, p) => sum + p.views, 0);
  
  // Aggregate real engagement metrics
  const totalProfileClicks = [...store.posts, ...store.textPosts]
    .filter(p => p.userId === me.id)
    .reduce((sum, item) => sum + (store.engagement[item.id]?.profileClicks || 0), 0);

  const totalContactClicks = [...store.posts, ...store.textPosts]
    .filter(p => p.userId === me.id)
    .reduce((sum, item) => sum + (store.engagement[item.id]?.contactClicks || 0), 0);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><User size={64} /></div>
            <div className="text-indigo-400 text-sm font-bold tracking-wider uppercase mb-2">Profile Views</div>
            <div className="text-4xl font-bold text-white mb-1">{totalProfileClicks + 12}</div>
            <div className="text-xs text-white/50">+3 this week</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={64} /></div>
            <div className="text-amber-400 text-sm font-bold tracking-wider uppercase mb-2">Content Reach</div>
            <div className="text-4xl font-bold text-white mb-1">{totalViews + 840}</div>
            <div className="text-xs text-white/50">Top 15% in your category</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Briefcase size={64} /></div>
            <div className="text-emerald-400 text-sm font-bold tracking-wider uppercase mb-2">Contact Leads</div>
            <div className="text-4xl font-bold text-white mb-1">{totalContactClicks + 2}</div>
            <div className="text-xs text-white/50">Users clicked &apos;Contact&apos;</div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Wand2 className="text-amber-400" size={24} /> 
            Smart Insights
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><ArrowRight size={20} className="-rotate-45" /></div>
              <div>
                <div className="font-bold text-white mb-1">Your recent video is trending</div>
                <div className="text-sm text-white/60 leading-relaxed">Your post about &quot;Plumbing fixes&quot; has reached 300 more people than usual. Consider posting a follow-up video to capture this audience.</div>
                <button className="mt-3 text-xs font-bold px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition">Create Follow-up</button>
              </div>
            </div>
            
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0"><User size={20} /></div>
              <div>
                <div className="font-bold text-white mb-1">High profile interest</div>
                <div className="text-sm text-white/60 leading-relaxed">Multiple businesses in your area have viewed your profile this week. Make sure your portfolio is up to date.</div>
                <Link href={`/profile/${me.id}`} className="mt-3 inline-block text-xs font-bold px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition">Update Profile</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RequestsTab() {
  const store = useStore();
  const me = store.users.find(u => u.id === store.currentUserId)!;
  
  const myApplications = store.applications.filter(a => a.userId === me.id);
  const jobsIPosted = store.jobs.filter(j => j.postedBy === me.id);
  const incomingApplications = store.applications.filter(a => jobsIPosted.some(j => j.id === a.jobId));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Incoming Job Applications (For Businesses) */}
        {me.role === "business" && (
          <div>
            <h2 className="text-lg font-bold mb-4 px-2">Incoming Applications</h2>
            <div className="space-y-3">
              {incomingApplications.length === 0 && (
                <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-white/40">No applications received yet.</div>
              )}
              {incomingApplications.map(app => {
                const applicant = store.users.find(u => u.id === app.userId);
                const job = store.jobs.find(j => j.id === app.jobId);
                if (!applicant || !job) return null;
                
                return (
                  <div key={app.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row gap-4 justify-between md:items-center">
                    <div className="flex gap-4 items-center">
                      <Image src={applicant.avatar} alt="" width={48} height={48} className="rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-base">{applicant.name}</div>
                        <div className="text-xs text-white/60">Applied for: <span className="text-white/90">{job.title}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/profile/${applicant.id}`} className="px-4 py-2 bg-white/5 hover:bg-slate-800 rounded-full text-sm font-bold transition text-center flex-1 md:flex-none">View Profile</Link>
                      <button 
                        onClick={() => store.sendMessage(`job-${job.id}-${applicant.id}`, applicant.name, `Hi ${applicant.name}, thanks for applying to ${job.title}. Let's chat!`)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-full text-sm font-bold text-white transition text-center flex-1 md:flex-none"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Job Applications (For Users/Creators) */}
        <div>
          <h2 className="text-lg font-bold mb-4 px-2">My Applications</h2>
          <div className="space-y-3">
            {myApplications.length === 0 && (
              <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-white/40">You haven&apos;t applied to any jobs yet.</div>
            )}
            {myApplications.map(app => {
              const job = store.jobs.find(j => j.id === app.jobId);
              if (!job) return null;
              
              return (
                <div key={app.id} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row gap-4 justify-between md:items-center">
                  <div>
                    <div className="font-bold text-base">{job.title}</div>
                    <div suppressHydrationWarning className="text-xs text-white/60 mt-1">Applied {formatDistanceToNow(app.createdAt, { addSuffix: true })}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                      Under Review
                    </span>
                    <Link href={`/jobs/${job.id}`} className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition">
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
