"use client";

import { useStore } from "@/state/store";
import { useState } from "react";

export default function CVBuilder() {
  const store = useStore();
  const me = store.users.find((u) => u.id === store.currentUserId)!;
  const existing = store.cvs[me.id];
  const [name, setName] = useState(existing?.name || me.name);
  const [summary, setSummary] = useState(existing?.summary || "");
  const [skills, setSkills] = useState(existing?.skills?.join(", ") || "");
  const [links, setLinks] = useState((existing?.links || []).join(", "));

  function save() {
    store.saveCV({
      name,
      summary,
      experience: existing?.experience || [],
      education: existing?.education || [],
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: existing?.certifications || [],
      links: links ? links.split(",").map((l) => l.trim()).filter(Boolean) : [],
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto p-4 space-y-3">
        <h1 className="text-xl font-semibold">CV</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary" rows={5} className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <input value={links} onChange={(e) => setLinks(e.target.value)} placeholder="Links (comma separated)" className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <button onClick={save} className="w-full rounded-xl bg-white text-black py-3 font-medium">Save CV</button>
      </div>
    </div>
  );
}
