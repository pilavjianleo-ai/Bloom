"use client";
import { useEffect, useState } from "react";
import { USERS } from "@/data/users";
import type { Comment } from "@/types";
import Image from "next/image";
import { useStore } from "@/state/store";

export default function CommentSheet() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [postId, setPostId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ postId: string }>).detail;
      const id = detail?.postId;
      setPostId(id);
      const arr = id ? store.comments[id] || [] : [];
      // Sort comments: Helpful ones first, then by likes, then newest
      const sorted = [...arr].sort((a, b) => {
        if (a.isHelpful && !b.isHelpful) return -1;
        if (!a.isHelpful && b.isHelpful) return 1;
        if ((b.likes || 0) !== (a.likes || 0)) return (b.likes || 0) - (a.likes || 0);
        return b.createdAt - a.createdAt;
      });
      setThread(sorted);
      setOpen(true);
    }
    window.addEventListener("open-comments", onOpen as EventListener);
    return () => window.removeEventListener("open-comments", onOpen as EventListener);
  }, [store.comments]);

  function submit() {
    if (!text.trim() || !postId) return;
    if (replyTo) {
      store.addReply(postId, replyTo.id, text.trim());
    } else {
      store.addComment(postId, text.trim());
    }
    const arr = store.comments[postId] || [];
    // Sort comments after submit too
    const sorted = [...arr].sort((a, b) => {
      if (a.isHelpful && !b.isHelpful) return -1;
      if (!a.isHelpful && b.isHelpful) return 1;
      if ((b.likes || 0) !== (a.likes || 0)) return (b.likes || 0) - (a.likes || 0);
      return b.createdAt - a.createdAt;
    });
    setThread(sorted);
    setText("");
    setReplyTo(null);
  }

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-slate-950/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full sm:max-w-md rounded-t-[2rem] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-zinc-100 p-4 md:p-6 pb-safe shadow-2xl animate-in slide-in-from-bottom-full duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-1 mb-4">
          <div className="font-bold text-lg">Discussion</div>
          <button
            className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto mt-2 space-y-5 pr-2 no-scrollbar">
          {thread.map((c) => {
            const u = USERS.find((x) => x.id === c.userId);
            return (
              <div key={c.id} className="flex flex-col gap-2 group">
                <div className="flex items-start gap-3">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                    <Image
                      src={u?.avatar || "/vercel.svg"}
                      alt={u?.name || "User"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                      <div className="font-bold mb-1">{u?.name}</div>
                      {c.isHelpful && <span className="inline-block text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md mb-1 border border-emerald-100 dark:border-transparent">Best Answer</span>}
                      <div className="text-slate-700 dark:text-white/80">{c.text}</div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 px-2">
                      <div className="text-[10px] font-medium text-slate-500 dark:text-white/50">
                        {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <button 
                        onClick={() => setReplyTo({ id: c.id, name: u?.name || "User" })}
                        className="text-[10px] text-slate-500 dark:text-white/50 font-bold hover:text-indigo-600 dark:hover:text-white transition"
                      >
                        Reply
                      </button>
                      <button 
                        onClick={() => {
                          if (postId) store.likeComment(postId, c.id);
                        }}
                        className="text-[10px] text-slate-500 dark:text-white/50 font-bold hover:text-red-500 dark:hover:text-white flex items-center gap-1 transition"
                      >
                        <span className={c.likes && c.likes > 0 ? "text-red-500" : ""}>♥</span> {c.likes || 0}
                      </button>
                      {!c.isHelpful && store.posts.find(p => p.id === postId)?.userId === store.currentUserId && (
                        <button 
                          onClick={() => {
                            if (postId) store.markHelpful(postId, c.id);
                          }}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400/70 font-bold hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                        >
                          Mark Helpful
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {c.replies && c.replies.length > 0 && (
                  <div className="pl-11 space-y-3 mt-1">
                    {c.replies.map(r => {
                      const ru = USERS.find((x) => x.id === r.userId);
                      return (
                        <div key={r.id} className="flex items-start gap-2">
                          <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                            <Image src={ru?.avatar || "/vercel.svg"} alt={ru?.name || "User"} fill sizes="24px" className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                              <span className="font-bold mr-2">{ru?.name}</span>
                              {r.isHelpful && <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md mr-1">Best Answer</span>}
                              <span className="text-slate-700 dark:text-white/80">{r.text}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 px-2">
                              <div className="text-[10px] font-medium text-slate-500 dark:text-white/50">
                                {new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <button 
                                onClick={() => {
                                  if (postId) store.likeComment(postId, r.id);
                                }}
                                className="text-[10px] text-slate-500 dark:text-white/50 font-bold hover:text-red-500 dark:hover:text-white flex items-center gap-1 transition"
                              >
                                <span className={r.likes && r.likes > 0 ? "text-red-500" : ""}>♥</span> {r.likes || 0}
                              </button>
                              {!r.isHelpful && store.posts.find(p => p.id === postId)?.userId === store.currentUserId && (
                                <button 
                                  onClick={() => {
                                    if (postId) store.markHelpful(postId, r.id);
                                  }}
                                  className="text-[10px] text-emerald-600 dark:text-emerald-400/70 font-bold hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                                >
                                  Mark Helpful
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {thread.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-white/60 text-center py-8 font-medium">Be the first to join the discussion</div>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          {replyTo && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60 mb-2 px-3 bg-slate-100 dark:bg-slate-900/50 py-1.5 rounded-lg w-fit border border-slate-200 dark:border-transparent">
              <span>Replying to <span className="font-bold text-slate-900 dark:text-white">{replyTo.name}</span></span>
              <button onClick={() => setReplyTo(null)} className="ml-2 hover:text-slate-900 dark:hover:text-white font-bold">✕</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={replyTo ? "Write a reply..." : "Add to the discussion..."}
              className="flex-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-md"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
