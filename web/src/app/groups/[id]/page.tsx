"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/state/store";
import { useState } from "react";
import Link from "next/link";
import TextCard from "@/components/TextCard";
import type { GroupPost } from "@/types";
import { ChevronLeft, Users, MessageSquare, Check, Star, Hash, Share2, Zap, HelpCircle } from "lucide-react";
import CommentSheet from "@/components/CommentSheet";

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  const group = store.groups.find(g => g.id === id);
  const me = store.users.find(u => u.id === store.currentUserId)!;
  const isMember = group?.members.includes(me.id);
  
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  if (!group) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white/50">Group not found</div>
    </div>
  );

  const posts = store.groupPosts.filter(p => p.groupId === id).sort((a, b) => b.id.localeCompare(a.id));

  function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!postText.trim() || !isMember) return;
    
    setIsPosting(true);
    setTimeout(() => {
      const post: GroupPost = {
        id: `gp-${Date.now()}`,
        groupId: group!.id,
        userId: me.id,
        text: postText.trim(),
        caption: "Community Discussion",
        category: group!.category === "general" ? "other" : group!.category,
        likes: 0,
        views: 0,
        businessName: me.name,
        profileImage: me.avatar,
      };
      store.createGroupPost(post);
      setPostText("");
      setIsPosting(false);
      store.addNotification("Discussion posted successfully");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white pb-20">
      
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-indigo-50 dark:bg-gradient-to-tr dark:from-indigo-900 dark:via-zinc-900 dark:to-black overflow-hidden border-b border-indigo-100 dark:border-slate-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent" />
        
        <div className="absolute top-4 left-4 z-20">
          <Link href="/groups" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-950/40 backdrop-blur border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-950/60 transition shadow-sm">
            <ChevronLeft size={16} /> Communities
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1 shadow-sm">
                  <Hash size={12} /> {group.category}
                </span>
                <span className="text-slate-600 dark:text-white/60 text-sm font-bold flex items-center gap-1">
                  <Users size={14} /> {group.members.length} members
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-transparent">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 12 Online
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 text-slate-900 dark:text-white">{group.name}</h1>
              <p className="text-slate-700 dark:text-white/80 text-lg max-w-2xl font-medium">{group.description}</p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => store.addNotification("Link copied to clipboard")} className="p-3 rounded-full bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-transparent backdrop-blur transition shadow-sm">
                <Share2 size={20} className="text-slate-700 dark:text-white" />
              </button>
              {!isMember ? (
                <button 
                  onClick={() => {
                    store.joinGroup(group.id);
                    store.addNotification(`Welcome to ${group.name}!`);
                  }}
                  className="px-8 py-3 rounded-full bg-indigo-600 dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-105 transition-transform shadow-md"
                >
                  Join Community
                </button>
              ) : (
                <button 
                  onClick={() => store.leaveGroup(group.id)}
                  className="px-8 py-3 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-lg border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition flex items-center gap-2 shadow-sm"
                >
                  <Check size={20} /> Joined
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Composer */}
          {isMember ? (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-all">
              <form onSubmit={submitPost} className="relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden relative border border-slate-200 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={postText}
                      onChange={e => setPostText(e.target.value)}
                      placeholder={posts.length === 0 ? "Be the first to ask a question..." : "Start a discussion, ask a question, or share a tip..."}
                      className="w-full bg-transparent text-lg outline-none resize-none min-h-[80px] placeholder-slate-400 dark:placeholder-white/40 text-slate-900 dark:text-white"
                      autoFocus={posts.length === 0}
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex gap-2 text-slate-500 dark:text-white/40">
                        {/* Action hints */}
                        <span className="text-xs font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-600 dark:text-white/60 px-3 py-1.5 rounded-lg flex items-center gap-1"><HelpCircle size={14}/> Ask</span>
                        <span className="text-xs font-bold bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-600 dark:text-white/60 px-3 py-1.5 rounded-lg flex items-center gap-1"><Zap size={14}/> Tip</span>
                      </div>
                      <button 
                        type="submit"
                        disabled={!postText.trim() || isPosting}
                        className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
                      >
                        {isPosting ? "Posting..." : <><MessageSquare size={18} /> Post</>}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-8 text-center shadow-sm">
              <Star className="mx-auto text-indigo-500 dark:text-indigo-400 mb-3" size={32} />
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Join to participate</h3>
              <p className="text-slate-600 dark:text-white/60 mb-6">Become a member of this community to ask questions and share your knowledge.</p>
              <button 
                onClick={() => store.joinGroup(group.id)}
                className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md"
              >
                Join Now
              </button>
            </div>
          )}

          {/* Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Discussions</h2>
              <select className="bg-transparent text-sm font-bold text-slate-500 dark:text-white/60 outline-none cursor-pointer">
                <option>Newest first</option>
                <option>Top voted</option>
                <option>Unanswered</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {posts.map(p => (
                <div key={p.id} className="rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative h-[400px] md:h-[500px]">
                  <TextCard post={p} />
                </div>
              ))}
            </div>
            
            {posts.length === 0 && (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                <MessageSquare className="mx-auto text-slate-300 dark:text-white/20 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-700 dark:text-white/60 mb-2">No discussions yet</h3>
                <p className="text-slate-500 dark:text-white/40 mb-6">Be the first to start a discussion in this community!</p>
                {isMember && (
                  <button 
                    onClick={() => document.querySelector('textarea')?.focus()}
                    className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md"
                  >
                    Start first discussion
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-500 dark:text-white/50">About this community</h3>
            <p className="text-slate-600 dark:text-white/80 leading-relaxed text-sm mb-6">{group.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Users size={20} /></div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{group.members.length}</div>
                  <div className="text-slate-500 dark:text-white/50">Active Members</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400"><MessageSquare size={20} /></div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{posts.length}</div>
                  <div className="text-slate-500 dark:text-white/50">Discussions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-500 dark:text-white/50">Active Now</h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.pravatar.cc/150?u=active${i}`} alt="user" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-white/50 border-2 border-slate-200 dark:border-slate-700">
                +{group.members.length > 6 ? group.members.length - 6 : 0}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold uppercase tracking-wider text-sm text-slate-500 dark:text-white/50">Upcoming Events</h3>
              <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">AUG</span>
                  <span className="text-lg font-black text-indigo-700 dark:text-indigo-300 leading-none">12</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">Expert Q&A Session</div>
                  <div className="text-xs text-slate-500 dark:text-white/60">Online • 18:00 PM</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">AUG</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 leading-none">24</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">Local Meetup</div>
                  <div className="text-xs text-slate-500 dark:text-white/60">New York • 14:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-500 dark:text-white/50">Rules</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-white/80">
              <li className="flex gap-3"><span className="text-indigo-500 dark:text-indigo-400 font-bold">1.</span> Be respectful and helpful</li>
              <li className="flex gap-3"><span className="text-indigo-500 dark:text-indigo-400 font-bold">2.</span> No direct self-promotion</li>
              <li className="flex gap-3"><span className="text-indigo-500 dark:text-indigo-400 font-bold">3.</span> Share value before asking</li>
            </ul>
          </div>
        </div>
      </div>
      <CommentSheet />
    </div>
  );
}