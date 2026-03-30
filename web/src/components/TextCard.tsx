"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { TextPost } from "@/types";
import ContactModal from "@/components/ContactModal";
import { useStore } from "@/state/store";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, Check, Send, Repeat } from "lucide-react";

interface Props {
  post: TextPost;
  onShare?: () => void;
}

export default function TextCard({ post, onShare }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [open, setOpen] = useState(false);
  const store = useStore();
  const user = store.users.find((u) => u.id === post.userId);
  const role = user?.role || "user";
  const me = store.users.find((u) => u.id === store.currentUserId)!;

  const likes = liked ? post.likes + 1 : post.likes;

  useEffect(() => {
    store.bumpExposure(post.id, 3);
    // run once per mount for this post id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  return (
    <div className="relative flex items-end justify-center w-full h-full bg-black">
      {/* Container (Fullscreen edge-to-edge) */}
      <div className="relative w-full h-full lg:max-w-[450px] overflow-hidden bg-gradient-to-br from-zinc-900 to-black shrink-0">
        
        {post.userId === store.currentUserId && (
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button
              onClick={() => {
                const next = prompt("Edit text", post.text || "");
                if (next !== null) store.editItem(post.id, { text: next });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-black shadow-lg"
            >
              Edit
            </button>
            <button
              onClick={() => store.deleteItem(post.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-950/50 backdrop-blur border border-slate-800 text-white shadow-lg"
            >
              Delete
            </button>
          </div>
        )}

        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent top-1/2 pointer-events-none z-0" />

        {/* Top Header: User Info */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] lg:pt-6 flex items-start justify-between z-20">
          <Link
            href={`/profile/${post.userId}`}
            onClick={() => store.trackProfileClick(post.id)}
            className="flex items-center gap-3 pointer-events-auto group/profile"
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20 group-hover/profile:ring-white/80 transition-all shadow-lg">
              <Image
                src={post.profileImage}
                alt={post.businessName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col drop-shadow-md">
              <div className="text-white font-bold text-base leading-tight flex items-center gap-1.5">
                {post.businessName}
                {user?.verified && <Check size={14} className="text-blue-400 bg-white rounded-full p-0.5" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
                <span className="capitalize text-emerald-400">{role}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{"location" in post ? (post as any).location : "Remote"}</span>
              </div>
            </div>
          </Link>

          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            {"sponsored" in post && (post as any).sponsored && (
              <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-amber-500/30">
                Sponsored
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="h-full w-full flex items-center justify-center px-6 relative z-10 pointer-events-auto cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent("open-comments", { detail: { postId: post.id } }))}>
          <div className="flex flex-col items-center gap-4 hover:scale-[1.02] transition-transform">
            <p className="text-white text-3xl font-black text-center leading-snug drop-shadow-xl max-w-sm">
              {post.text}
            </p>
            {"type" in post && (post as any).type === "question" && (
              <div className="px-4 py-2 bg-indigo-500 text-white font-bold text-sm rounded-full shadow-lg flex items-center gap-2">
                <MessageCircle size={16} /> Answer this question
              </div>
            )}
            {"type" in post && (post as any).type === "discussion" && (
              <div className="px-4 py-2 bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-full shadow-lg flex items-center gap-2">
                <MessageCircle size={16} /> Join the discussion
              </div>
            )}
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-16 lg:right-16 p-4 pb-[calc(env(safe-area-inset-bottom)+5rem)] lg:pb-6 z-20 flex flex-col justify-end gap-3 pointer-events-none">
          
          {/* Micro-Feedback System (Simulated live signals) */}
          <div className="flex flex-col gap-1 mb-2 pointer-events-auto">
            {post.views > 1000 && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 w-fit px-2 py-0.5 rounded-md backdrop-blur-md border border-indigo-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Trending conversation
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            <span className="px-3 py-1 rounded-lg bg-slate-950/40 backdrop-blur-md border border-slate-800 text-white/90 text-xs font-bold shadow-lg">
              #{post.category}
            </span>
            {"type" in post && (post as any).type && (
              <span className="px-3 py-1 rounded-lg bg-slate-950/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold capitalize">
                {(post as any).type}
              </span>
            )}
          </div>

          {/* Caption */}
          <Link href={`/post/${post.id}`} className="block pointer-events-auto">
            <p className="text-white text-base font-medium leading-snug drop-shadow-lg line-clamp-2 hover:line-clamp-none transition-all">
              {post.caption}
            </p>
          </Link>

          {/* Strong Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto pt-2">
            {"type" in post && (post as any).type === "job" ? (
              <Link 
                href={`/jobs/${post.id}`}
                className="px-6 py-3 rounded-2xl text-sm font-black bg-emerald-500 text-black shadow-md hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Apply Now
              </Link>
            ) : (
              post.userId !== store.currentUserId && (
                <>
                  <button
                    onClick={() => {
                      setFollowed((v) => !v);
                      if (user) store.follow(user.id);
                    }}
                    className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-md flex items-center gap-2 ${followed ? "bg-slate-100/10 text-white border border-slate-200/20 backdrop-blur-md" : "bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95"}`}
                  >
                    {followed ? <Check size={16} /> : <UserPlus size={16} />}
                    {followed ? "Following" : "Follow"}
                  </button>

                  <button
                    onClick={() => {
                      store.trackContactClick(post.id);
                      setOpen(true);
                    }}
                    className="px-6 py-3 rounded-2xl text-sm font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Send size={16} />
                    {role === "business" || role === "expert" ? "Work with me" : "Message"}
                  </button>
                </>
              )
            )}
          </div>
        </div>

        {/* Mobile Vertical Engagement Bar */}
        <div className="absolute right-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-20 flex flex-col items-center gap-5 pointer-events-auto shrink-0">
          
          <button
            aria-label="Like"
            className="group flex flex-col items-center gap-1"
            onClick={() => {
              setLiked((v) => !v);
              store.like(post.id);
            }}
          >
            <div className={`h-12 w-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800 flex items-center justify-center transition-all group-active:scale-90 shadow-lg ${liked ? "bg-slate-950/60 border-red-500/30" : "hover:bg-slate-950/60"}`}>
              <Heart size={24} className={`transition-colors ${liked ? "text-red-500" : "text-white"}`} fill={liked ? "currentColor" : "none"} />
            </div>
            <span className="text-white font-bold text-xs drop-shadow-md">{likes}</span>
          </button>

          <button
            aria-label="Comments"
            className="group flex flex-col items-center gap-1"
            onClick={() => window.dispatchEvent(new CustomEvent("open-comments", { detail: { postId: post.id } }))}
          >
            <div className="h-12 w-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800 hover:bg-slate-950/60 flex items-center justify-center transition-all group-active:scale-90 shadow-lg">
              <MessageCircle size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-xs drop-shadow-md">{(post.likes % 42) + 5}</span>
          </button>

          <button
            aria-label="Repost"
            className="group flex flex-col items-center gap-1"
            onClick={() => {
              const note = prompt("Add a comment to your quote (optional)", "");
              const t = {
                id: `text-${Date.now()}`,
                userId: me.id,
                text: note ? `${note} // QT: "${post.text}"` : `QT: "${post.text}"`,
                caption: "Repost",
                category: post.category,
                likes: 0,
                views: 0,
                businessName: me.name,
                profileImage: me.avatar,
              };
              store.createText(t as TextPost);
              store.addNotification("Reposted a post");
            }}
          >
            <div className="h-12 w-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800 hover:bg-slate-950/60 flex items-center justify-center transition-all group-active:scale-90 shadow-lg">
              <Repeat size={24} className="text-white" />
            </div>
            <span className="text-white font-bold text-xs drop-shadow-md">Repost</span>
          </button>

          <button
            aria-label="Save"
            className="group flex flex-col items-center gap-1"
            onClick={() => {
              setSaved((v) => !v);
              store.save(post.id);
            }}
          >
            <div className={`h-12 w-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800 flex items-center justify-center transition-all group-active:scale-90 shadow-lg ${saved ? "bg-slate-950/60 border-amber-400/30" : "hover:bg-slate-950/60"}`}>
              <Bookmark size={24} className={`transition-colors ${saved ? "text-amber-400" : "text-white"}`} fill={saved ? "currentColor" : "none"} />
            </div>
            <span className="text-white font-bold text-xs drop-shadow-md">Save</span>
          </button>

          {onShare && (
            <button
              aria-label="Share"
              className="group flex flex-col items-center gap-1"
              onClick={onShare}
            >
              <div className="h-12 w-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800 hover:bg-slate-950/60 flex items-center justify-center transition-all group-active:scale-90 shadow-lg">
                <Share2 size={24} className="text-white" />
              </div>
              <span className="text-white font-bold text-xs drop-shadow-md">Share</span>
            </button>
          )}

        </div>
      </div>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        recipientId={post.userId}
        recipientName={post.businessName}
      />
    </div>
  );
}
