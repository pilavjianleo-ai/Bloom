"use client";
import { useStore } from "@/state/store";
export default function Opportunities() {
  const store = useStore();
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Opportunities</h1>
        <p className="text-sm text-white/70">Jobs, gigs, and collaboration requests</p>
        <div className="mt-4 space-y-3">
          {store.jobs.map((j) => (
            <div key={j.id} className="rounded-2xl bg-slate-900 p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-xs text-white/60">{j.location}{j.jobType ? ` • ${j.jobType}` : ""}{j.salary ? ` • ${j.salary}` : ""}</div>
              </div>
              <div className="flex gap-2">
                <a href={`/jobs/${j.id}`} className="px-3 py-2 rounded-xl bg-white text-black text-sm">View</a>
                <a href={`/jobs/${j.id}`} className="px-3 py-2 rounded-xl bg-slate-800 text-white text-sm">Apply</a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-white/60">For full application flow with CV, cover letter, and questions, open the job and apply.</div>
      </div>
    </div>
  );
}
