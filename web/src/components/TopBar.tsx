"use client";

import { CATEGORIES } from "@/data/posts";
import type { Category } from "@/types";
import { useMemo } from "react";

interface Props {
  active?: Category | "all";
  onCategoryChange: (cat: Category | "all") => void;
  query: string;
  onQuery: (q: string) => void;
}

export default function TopBar({
  active = "all",
  onCategoryChange,
  query,
  onQuery,
}: Props) {
  const cats = useMemo<
    Array<{ key: Category | "all"; label: string }>
  >(() => [{ key: "all" as Category | "all", label: "All" }].concat(CATEGORIES as any), []);

  return (
    <div className="absolute top-0 left-0 right-0 z-40 p-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="rounded-2xl bg-slate-950/40 backdrop-blur-md border border-slate-800 p-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <button
              key={c.key}
              onClick={() => onCategoryChange(c.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                active === c.key
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search businesses, captions…"
            className="w-full rounded-xl bg-white/10 text-white placeholder-white/60 px-3 py-2 outline-none focus:bg-white/15"
          />
        </div>
      </div>
    </div>
  );
}
