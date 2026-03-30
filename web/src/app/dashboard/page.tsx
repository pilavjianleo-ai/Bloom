 "use client";
import { useStore } from "@/state/store";
import Link from "next/link";
import { Users, Activity, Eye, Briefcase, Zap, Star, Bell, Calendar, CheckCircle2, MessageSquare, ArrowUpRight, Flame, BrainCircuit, TrendingUp, MapPin, PlusCircle, Settings, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const store = useStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const me = store.users.find((u) => u.id === store.currentUserId)!;
  
  // Real Analytics
  const myVideos = store.posts.filter((p) => p.userId === me.id || p.businessId === me.id);
  const myTexts = store.textPosts.filter((t) => t.userId === me.id);
  const views = myVideos.reduce((a, b) => a + b.views, 0) + myTexts.reduce((a, b) => a + b.views, 0);
  const likes = myVideos.reduce((a, b) => a + b.likes, 0) + myTexts.reduce((a, b) => a + b.likes, 0);
  const totalContactClicks = [...myVideos, ...myTexts].reduce((sum, item) => sum + (store.engagement[item.id]?.contactClicks || 0), 0);
  const followers = me.followers;
  
  const leads = totalContactClicks + Math.floor(views * 0.005);
  
  // Mock Data for "Live" feeling
  const incomingRequests = [
    { id: 1, type: "booking", name: "Sarah J.", text: "Requested a quote for bathroom renovation.", time: "10m ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, type: "collab", name: "Mike's Plumbing", text: "Wants to collaborate on a video.", time: "1h ago", avatar: "https://i.pravatar.cc/150?u=mike" },
    { id: 3, type: "job", name: "TechCorp", text: "Viewed your application for Senior Tech.", time: "2h ago", avatar: "https://i.pravatar.cc/150?u=tech" }
  ];

  const savedItems = Object.keys(store.saved).slice(0, 3); // Get latest 3 saved

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-0">
      
      {/* Premium Header */}
      <div className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 py-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] md:px-8 md:py-8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden relative ring-2 ring-white/20">
              <Image src={me.avatar} alt={me.name} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight flex items-center gap-2">
                My Hub {me.verified && <CheckCircle2 size={16} className="text-blue-400" />}
              </h1>
              <p className="text-sm text-white/60">Your activity & opportunities center.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings" className="p-3 rounded-full bg-white/5 hover:bg-slate-800 transition relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

        {/* Top Analytics Grid (Real Data) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 hover:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Eye size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Views</span>
            </div>
            <div className="text-3xl font-black">{views.toLocaleString()}</div>
            {views > 0 && <div className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={12}/> +{Math.floor(views * 0.1)}% this week</div>}
          </div>
          
          <div className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 hover:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Flame size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Engagement</span>
            </div>
            <div className="text-3xl font-black">{likes.toLocaleString()}</div>
            {likes > 0 && <div className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={12}/> +{Math.floor(likes * 0.15)}% this week</div>}
          </div>

          <div className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 hover:bg-slate-900 transition-colors">
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Users size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Followers</span>
            </div>
            <div className="text-3xl font-black">{followers.toLocaleString()}</div>
            <div className="text-xs text-white/40 font-bold mt-2 flex items-center gap-1">Growing steadily</div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-colors cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap size={100} />
            </div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2 relative z-10">
              <Zap size={16} /> <span className="text-sm font-bold uppercase tracking-wider">{me.role === "business" ? "Leads" : "Opportunities"}</span>
            </div>
            <div className="text-3xl font-black relative z-10">{leads.toLocaleString()}</div>
            <div className="text-xs text-indigo-300 font-bold mt-2 flex items-center gap-1 relative z-10">Generated from content</div>
          </div>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Requests & Leads */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Action Center / Requests Panel */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bell className="text-amber-400" /> Action Required
                </h2>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">3 New</span>
              </div>
              
              <div className="space-y-3">
                {incomingRequests.map(req => (
                  <div key={req.id} className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 flex flex-col sm:flex-row gap-4 hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                        <Image src={req.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold">{req.name}</div>
                        <div className="text-sm text-white/70 line-clamp-1">{req.text}</div>
                        <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                          <span className="capitalize text-indigo-400 font-bold">{req.type}</span> • {req.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => store.addNotification("Request accepted!")} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold transition">
                        Accept
                      </button>
                      <button onClick={() => store.addNotification("Request declined")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-slate-800 text-white text-sm font-bold transition">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Skill Matches (New) */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <BrainCircuit className="text-indigo-500 dark:text-indigo-400" /> AI Opportunity Matches
                </h2>
                <Link href="/jobs" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">View all</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock Match 1 */}
                <Link href="/jobs" className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group shadow-sm hover:shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20" />
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-100 dark:border-transparent">P</div>
                    <span className="text-xs font-black uppercase tracking-wider text-white bg-indigo-500 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <TrendingUp size={12} /> 98% Match
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Commercial Pipe Installation</h3>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1"><Briefcase size={14}/> $5,000 Contract</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                    <span className="font-bold text-slate-900 dark:text-white">Why it matches:</span> Your recent skill demo &quot;Pipe Repair&quot; perfectly aligns with the requirements.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-800">Pipe Repair</span>
                    <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-800">Commercial</span>
                  </div>
                </Link>
                
                {/* Mock Match 2 */}
                <Link href="/jobs" className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all group shadow-sm hover:shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-bl-[100px] -z-10 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20" />
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold border border-emerald-100 dark:border-transparent">H</div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-3 py-1 rounded-lg">
                      85% Match
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Home Renovation Lead</h3>
                  <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1"><MapPin size={14}/> Local Lead</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
                    <span className="font-bold text-slate-900 dark:text-white">Why it matches:</span> A homeowner in your area is looking for an expert with your high activity score.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-800">Local Lead</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Opportunity Signals (New) */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Star className="text-amber-400" /> Opportunity Signals
                </h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Eye className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-amber-400">A company is interested in you</div>
                    <div className="text-sm text-amber-100/70">&quot;PlumbPro Services&quot; viewed your profile 3 times this week after watching your Skill Demo.</div>
                  </div>
                  <Link href="/profile/b-plumbpro" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition">
                    View
                  </Link>
                </div>
                <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Your skill ranking is up!</div>
                    <div className="text-sm text-white/60">You are now in the top 15% of professionals for &quot;Pipe Repair&quot;.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/inbox" className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-900 hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <div className="font-bold">Messages</div>
                  <div className="text-xs text-white/50">{Object.keys(store.conversations).length} active</div>
                </div>
              </Link>
              
              <Link href="/jobs" className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-900 hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase size={24} />
                </div>
                <div>
                  <div className="font-bold">Applications</div>
                  <div className="text-xs text-white/50">{store.applications.length} sent</div>
                </div>
              </Link>

              <Link href="/groups" className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-900 hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div>
                  <div className="font-bold">Network</div>
                  <div className="text-xs text-white/50">{followers} connections</div>
                </div>
              </Link>

              <div className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-900 hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => store.addNotification("Calendar sync coming soon")}>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="font-bold">Bookings</div>
                  <div className="text-xs text-white/50">Schedule</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Saved & Activity */}
          <div className="space-y-6">
            
            {/* Daily Content Engine Panel */}
            <div className="rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                  <Flame className="text-amber-500 dark:text-amber-400" size={18} /> Daily Streak: 3 Days
                </h3>
              </div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">You haven&apos;t posted today! Keep your audience engaged to maintain your streak.</div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">Today&apos;s Prompts</div>
                <Link href="/upload" className="block w-full text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                  💡 Share a quick tip about your trade
                </Link>
                <Link href="/upload" className="block w-full text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                  📸 Show a before/after of a recent job
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="text-amber-400" size={18} /> Saved Items
                </h3>
                <span className="text-xs text-white/40">{Object.keys(store.saved).length} total</span>
              </div>
              
              {savedItems.length > 0 ? (
                <div className="space-y-3">
                  {savedItems.map(id => {
                    const post = store.posts.find(p => p.id === id) || store.textPosts.find(p => p.id === id);
                    if (!post) return null;
                    return (
                      <Link key={id} href={`/post/${id}`} className="block p-3 rounded-2xl bg-white/5 hover:bg-slate-800 transition group">
                        <div className="font-medium text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">{post.caption || ('text' in post ? post.text : 'Saved post')}</div>
                        <div className="text-xs text-white/40 mt-1">{post.businessName} • {post.category}</div>
                      </Link>
                    )
                  })}
                  <Link href="/saved" className="block text-center text-sm font-bold text-white/50 hover:text-white transition mt-4 pt-2 border-t border-slate-800">
                    View all saved
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-white/40 text-sm">
                  No saved items yet.<br/>Tap the star on posts to save them here.
                </div>
              )}
            </div>

            {/* Performance Mini-Panel */}
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity className="text-emerald-400" size={18} /> Recent Performance
              </h3>
              <div className="space-y-4">
                {[...myVideos, ...myTexts].sort((a, b) => b.views - a.views).slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="text-sm font-medium line-clamp-1 text-white/80">{p.caption || ('text' in p ? p.text : 'Post')}</div>
                      <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                        <span>👁 {p.views.toLocaleString()}</span>
                        {(store.engagement[p.id]?.contactClicks || 0) > 0 && <span className="text-indigo-400 font-bold">• {store.engagement[p.id].contactClicks} Leads</span>}
                      </div>
                    </div>
                    <Link href="/settings" className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition shrink-0">
                      Boost
                    </Link>
                  </div>
                ))}
                {myVideos.length === 0 && myTexts.length === 0 && (
                  <div className="text-sm text-white/40 text-center py-4">Post content to see performance here.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
