"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import type { Post } from "@/types";
import ContactModal from "@/components/ContactModal";
import { USERS } from "@/data/users";
import { useStore } from "@/state/store";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, Check, Send, Play } from "lucide-react";

interface Props {
  post: Post;
  onShare?: () => void;
}

export default function VideoCard({ post, onShare }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [ready, setReady] = useState(false);
  const user = USERS.find((u) => u.id === post.userId);
  const role = user?.role ?? (post.businessId ? "business" : "user");
  const store = useStore();

  const likes = liked ? post.likes + 1 : post.likes;

  const [isPlaying, setIsPlaying] = useState(true);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            v.play().catch(() => {});
            setIsPlaying(true);
          } else {
            v.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) io.observe(videoRef.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            store.bumpExposure(post.id, 5);
          }
        });
      },
      { threshold: 0.7 }
    );
    if (videoRef.current) io.observe(videoRef.current);
    return () => io.disconnect();
  }, [store, post.id]);

  return (
    <div className="relative flex items-end justify-center w-full h-full">
      {/* Container (Mobile: full width/height. Desktop: centered, rounded, 600px max) */}
      <div className="relative w-full h-full lg:w-[600px] lg:h-full lg:rounded-[2rem] overflow-hidden bg-slate-950 shadow-2xl shrink-0 group">
        
        {post.userId === store.currentUserId && (
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button
              onClick={() => {
                const next = prompt("Edit caption", post.caption || "");
                if (next !== null) store.editItem(post.id, { caption: next });
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

        <video
          ref={videoRef}
          src={post.videoUrl}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted
          onLoadedMetadata={() => videoRef.current?.play().catch(() => {})}
          onLoadedData={() => setReady(true)}
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && ready && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-slate-950/20 transition-all">
            <div className="w-20 h-20 bg-slate-950/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 shadow-2xl">
              <Play size={32} className="ml-2" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-32 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent top-1/2 pointer-events-none z-0" />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
          </div>
        )}

        {/* Top Header: User Info */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe-top lg:pt-6 flex items-start justify-between z-20">
          <Link
            href={`/profile/${post.businessId || post.userId}`}
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
            {post.sponsored && (
              <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-amber-500/30">
                Sponsored
              </div>
            )}
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-16 lg:right-0 p-4 pb-24 lg:pb-6 z-20 flex flex-col justify-end gap-3 pointer-events-none">
          
          {/* Micro-Feedback System (Simulated live signals) */}
          <div className="flex flex-col gap-1 mb-2 pointer-events-auto">
            {post.views > 1000 && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 w-fit px-2 py-0.5 rounded-md backdrop-blur-md border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Gaining traction
              </div>
            )}
            {post.likes > 50 && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 w-fit px-2 py-0.5 rounded-md backdrop-blur-md border border-amber-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Trending skill
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {post.type === "skill_demo" && (
              <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                <Check size={12} /> Verified Skill
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-slate-950/40 backdrop-blur-md border border-slate-800 text-white/90 text-xs font-bold shadow-lg">
              #{post.category}
            </span>
            {post.skillTags && post.skillTags.slice(0, 2).map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-slate-950/40 backdrop-blur-md border border-slate-800 text-white/90 text-xs font-bold shadow-lg">
                {tag}
              </span>
            ))}
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
                className="px-6 py-3 rounded-2xl text-sm font-black bg-emerald-500 text-black shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
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

        {/* Mobile Vertical Engagement Bar (Hidden on Desktop) */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5 pointer-events-auto shrink-0 lg:hidden">
          
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

      {/* Desktop Vertical Engagement Bar (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col items-center gap-5 pointer-events-auto shrink-0 ml-6 mb-6">
        <button
          aria-label="Like"
          className="group flex flex-col items-center gap-2"
          onClick={() => {
            setLiked((v) => !v);
            store.like(post.id);
          }}
        >
          <div className={`h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 shadow-xl ${liked ? "border-red-500/50 bg-red-500/10" : "hover:bg-slate-800"}`}>
            <Heart size={24} className={`transition-colors ${liked ? "text-red-500" : "text-white"}`} fill={liked ? "currentColor" : "none"} />
          </div>
          <span className="text-white/60 font-bold text-xs">{likes}</span>
        </button>

        <button
          aria-label="Comments"
          className="group flex flex-col items-center gap-2"
          onClick={() => window.dispatchEvent(new CustomEvent("open-comments", { detail: { postId: post.id } }))}
        >
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 shadow-xl hover:bg-slate-800">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white/60 font-bold text-xs">{(post.likes % 42) + 5}</span>
        </button>

        <button
          aria-label="Save"
          className="group flex flex-col items-center gap-2"
          onClick={() => {
            setSaved((v) => !v);
            store.save(post.id);
          }}
        >
          <div className={`h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 shadow-xl ${saved ? "border-amber-400/50 bg-amber-400/10" : "hover:bg-slate-800"}`}>
            <Bookmark size={24} className={`transition-colors ${saved ? "text-amber-400" : "text-white"}`} fill={saved ? "currentColor" : "none"} />
          </div>
          <span className="text-white/60 font-bold text-xs">Save</span>
        </button>

        {onShare && (
          <button
            aria-label="Share"
            className="group flex flex-col items-center gap-2"
            onClick={onShare}
          >
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 shadow-xl hover:bg-slate-800">
              <Share2 size={24} className="text-white" />
            </div>
            <span className="text-white/60 font-bold text-xs">Share</span>
          </button>
        )}
      </div>

      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        recipientId={post.businessId || post.userId}
        recipientName={post.businessName}
      />
    </div>
  );
}
