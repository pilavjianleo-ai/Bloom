"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/state/store";
import type { Category, Group } from "@/types";
import { CATEGORIES } from "@/data/posts";
import Link from "next/link";
import { Users } from "lucide-react";

export default function NewGroup() {
  const store = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState<Category | "general">("general");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const g: Group = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      description: desc.trim(),
      category: cat,
      members: [store.currentUserId],
    };

    store.createGroup(g);
    router.push(`/groups/${g.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20">
      <div className="max-w-xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-indigo-500" /> Create Community
          </h1>
          <Link href="/groups" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Cancel</Link>
        </div>

        <form onSubmit={submit} className="space-y-6 bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-slate-900 dark:text-white"
              placeholder="e.g. Plumbing Pros"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-slate-900 dark:text-white resize-none"
              placeholder="What is this group about?"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Category</label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as Category | "general")}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-slate-900 dark:text-white appearance-none cursor-pointer"
            >
              <option value="general">General</option>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 mt-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-50 transition shadow-md"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}