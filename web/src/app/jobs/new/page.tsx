"use client";

import { useState } from "react";
import { useStore } from "@/state/store";
import { useRouter } from "next/navigation";
import type { Category, Job } from "@/types";

export default function NewJob() {
  const store = useStore();
  const router = useRouter();
  const me = store.users.find((u) => u.id === store.currentUserId)!;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<Job["jobType"]>("full-time");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [questions, setQuestions] = useState("");

  function submit() {
    const job = {
      id: `job-${Date.now()}`,
      title,
      description,
      category,
      location,
      postedBy: me.id,
      createdAt: Date.now(),
      jobType,
      salary: salary || undefined,
      requirements: requirements ? requirements.split("\n").filter(Boolean) : [],
      deadline: deadline ? new Date(deadline).getTime() : undefined,
      questions: questions ? questions.split("\n").filter(Boolean) : [],
    };
    store.postJob(job);
    router.push("/jobs");
  }

  if (me.role !== "business") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-xl mx-auto p-4">
          <div className="text-sm text-white/60">Only businesses can post jobs.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto p-4 space-y-3">
        <h1 className="text-xl font-semibold">Post a job</h1>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={6} className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <div className="grid grid-cols-2 gap-2">
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-xl bg-slate-900 px-3 py-2 outline-none" />
         <select value={jobType} onChange={(e) => setJobType(e.target.value as "full-time" | "part-time" | "freelance" | "contract" | "collab")} className="rounded-xl bg-slate-900 border border-zinc-800 px-3 py-2 outline-none">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="collab">Collab</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
         <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="rounded-xl bg-slate-900 border border-zinc-800 px-3 py-2 outline-none">
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="beauty">Beauty</option>
            <option value="fitness">Fitness</option>
            <option value="cleaning">Cleaning</option>
            <option value="handyman">Handyman</option>
            <option value="auto">Auto</option>
            <option value="other">Other</option>
          </select>
          <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary (optional)" className="rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        </div>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requirements (one per line)" rows={4} className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Deadline (YYYY-MM-DD)" className="rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="Custom questions (one per line)" rows={4} className="w-full rounded-xl bg-slate-900 px-3 py-2 outline-none" />
        <button onClick={submit} className="w-full rounded-xl bg-white text-black py-3 font-medium">Publish</button>
      </div>
    </div>
  );
}
