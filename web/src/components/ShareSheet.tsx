"use client";

import { useEffect, useState } from "react";

export default function ShareSheet() {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ postId: string }>).detail;
      setPostId(detail?.postId);
      setOpen(true);
    }
    window.addEventListener("open-share", onOpen as EventListener);
    return () => window.removeEventListener("open-share", onOpen as EventListener);
  }, []);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl bg-slate-950 text-zinc-100 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="font-semibold">Share</div>
          <button
            className="h-8 w-8 rounded-full hover:bg-slate-800"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <button className="rounded-xl bg-white text-black py-3">Copy link</button>
          <button className="rounded-xl bg-slate-800 py-3">WhatsApp</button>
          <button className="rounded-xl bg-slate-800 py-3">Messenger</button>
          <button className="rounded-xl bg-slate-800 py-3">X</button>
          <button className="rounded-xl bg-slate-800 py-3">Email</button>
          <button className="rounded-xl bg-slate-800 py-3">Embed</button>
        </div>
        <div className="text-[10px] text-white/50 mt-2">
          Post: {postId}
        </div>
      </div>
    </div>
  );
}
