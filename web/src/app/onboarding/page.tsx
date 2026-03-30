"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/posts";

export default function Onboarding() {
  const [role, setRole] = useState<"user" | "expert" | "business">("user");
  const [interests, setInterests] = useState<string[]>([]);
  const router = useRouter();

  function toggle(i: string) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  }

  function done() {
    try {
      localStorage.setItem(
        "onboarding",
        JSON.stringify({ role, interests })
      );
    } catch {}
    router.push("/upload");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Welcome</h1>
        <p className="text-sm text-white/70">
          Choose your role and interests to personalize your feed.
        </p>
        <div className="mt-4">
          <div className="text-sm mb-2">Your role</div>
          <div className="flex gap-2">
            {(["user", "expert", "business"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-2 rounded-xl ${role === r ? "bg-white text-black" : "bg-white/10"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm mb-2">Interests</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => toggle(c.key)}
                className={`px-3 py-2 rounded-xl ${interests.includes(c.key) ? "bg-white text-black" : "bg-white/10"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={done}
          className="mt-8 w-full rounded-xl bg-white text-black py-3 font-medium"
        >
          Continue
        </button>
        <div className="text-xs text-white/60 mt-2">
          Optionally create your first post on the next screen.
        </div>
      </div>
    </div>
  );
}
