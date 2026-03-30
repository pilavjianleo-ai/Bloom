"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/state/store";
import { USERS } from "@/data/users";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function PostDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const store = useStore();
  const post = useMemo(() => store.posts.find((p) => p.id === id), [id, store.posts]);
  const text = useMemo(() => store.textPosts.find((t) => t.id === id), [id, store.textPosts]);
  const comments = store.comments[id] || [];
  const [input, setInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [caption, setCaption] = useState("");

  if (!post && !text) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-2xl mx-auto p-4">
          <div className="text-sm text-white/60">Post not found.</div>
          <Link className="inline-block mt-3 px-3 py-2 rounded-xl bg-white text-black" href="/">Back</Link>
        </div>
      </div>
    );
  }
  const ownerId = (post?.userId || text?.userId)!;
  const owner = USERS.find((u) => u.id === ownerId);

  function addComment() {
    if (!input.trim()) return;
    store.addComment(id, input.trim());
    setInput("");
  }
  function addAnswer() {
    if (!post || !videoUrl.trim()) return;
    const p = {
      ...post,
      id: `post-${Date.now()}`,
      videoUrl: videoUrl.trim(),
      caption: caption || "Answer",
      likes: 0,
      views: 0,
      type: "answer" as const,
      threadId: id,
    };
    store.createVideo(p);
    setVideoUrl("");
    setCaption("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Link href="/" className="text-sm text-white/80 hover:underline">← Back</Link>
        <div className="rounded-2xl bg-slate-900 overflow-hidden">
          <div className="p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{post?.businessName || text?.businessName}</div>
              <div className="text-xs text-white/60">{owner?.role || "user"} • {post?.category || text?.category}</div>
            </div>
            <Link href={`/profile/${ownerId}`} className="text-xs px-3 py-1.5 rounded-full bg-white text-black">Profile</Link>
          </div>
          {post ? (
            <video src={post.videoUrl} controls className="w-full h-72 object-cover" />
          ) : (
            <div className="p-6 text-lg">{text?.text}</div>
          )}
          <div className="p-3 text-sm">{post?.caption || text?.caption}</div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-3">
          <div className="text-sm text-white/80 mb-2">Comments</div>
          <div className="space-y-2">
            {comments.map((c) => {
              const u = USERS.find((x) => x.id === c.userId);
              return (
                <div key={c.id} className="rounded-xl bg-slate-800 p-2 text-sm">
                  <div className="font-medium">{u?.name}</div>
                  <div>{c.text}</div>
                </div>
              );
            })}
            {comments.length === 0 && <div className="text-sm text-white/60">No comments</div>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a comment" className="flex-1 rounded-xl bg-slate-800 px-3 py-2 outline-none" />
            <button onClick={addComment} className="px-3 py-2 rounded-xl bg-white text-black">Send</button>
          </div>
        </div>

        {post && (
          <div className="rounded-2xl bg-slate-900 p-3">
            <div className="text-sm text-white/80 mb-2">Answer with a video</div>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none mb-2" />
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="w-full rounded-xl bg-slate-800 px-3 py-2 outline-none mb-2" />
            <button onClick={addAnswer} className="px-3 py-2 rounded-xl bg-white text-black">Post answer</button>
          </div>
        )}
      </div>
    </div>
  );
}

