"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/state/store";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, DollarSign, Star, Briefcase, FileText, Video, Send, CheckCircle2 } from "lucide-react";
import { USERS } from "@/data/users";
import Image from "next/image";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const store = useStore();
  const router = useRouter();
  
  const job = store.jobs.find((j) => j.id === id);
  const me = store.users.find((u) => u.id === store.currentUserId)!;
  const business = USERS.find(u => u.id === job?.postedBy);
  
  const myCV = store.cvs[me.id];
  const myVideos = useMemo(() => store.posts.filter((p) => p.userId === me.id), [store.posts, me.id]);
  
  const [cover, setCover] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => (job?.questions || []).map(() => ""));
  
  const [useSavedCV, setUseSavedCV] = useState(true);
  const [cvName, setCvName] = useState(myCV?.name || me.name);
  const [cvSummary, setCvSummary] = useState(myCV?.summary || "");
  const [skills, setSkills] = useState(myCV?.skills?.join(", ") || "");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/60 mb-4">Job not found or has been removed.</div>
          <Link href="/jobs" className="px-6 py-3 rounded-full bg-white text-black font-bold">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  const isSaved = !!store.saved[job.id];

  function submit() {
    if (job?.questions && job.questions.length > 0) {
      const allAnswered = answers.every((a) => a && a.trim().length > 0);
      if (!allAnswered) return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const finalCV = useSavedCV && myCV
        ? myCV
        : {
            name: cvName,
            summary: cvSummary,
            experience: [],
            education: [],
            skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
            certifications: [],
            links: [],
          };
      
      store.saveCV(finalCV);
      store.applyJob(job!.id, { coverLetter: cover, videoUrl, answers });
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto redirect to inbox after success
      setTimeout(() => {
        router.push("/inbox");
      }, 2000);
      
    }, 1000);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-bounce" style={{ animationDuration: "2s" }}>
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Application Sent!</h1>
        <p className="text-white/60 text-center max-w-md mb-8">
          Your profile and CV have been sent to {business?.name || "the employer"}. We are redirecting you to your Inbox to track your application.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-0">
      
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/jobs" className="flex items-center gap-2 text-white/70 hover:text-white transition font-medium">
            <ChevronLeft size={20} /> Back to Jobs
          </Link>
          <button 
            onClick={() => store.save(job.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition ${isSaved ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-white/5 text-white hover:bg-slate-800"}`}
          >
            <Star size={16} fill={isSaved ? "currentColor" : "none"} />
            <span className="hidden sm:inline">{isSaved ? "Saved" : "Save Job"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden relative shrink-0 border border-slate-800">
                <Image src={business?.avatar || "/vercel.svg"} alt="" fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-1">{job.title}</h1>
                <Link href={`/profile/${job.postedBy}`} className="text-white/60 hover:text-emerald-400 transition font-medium">
                  {business?.name || "Business"}
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8 relative z-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm font-medium">
                <MapPin size={16} className="text-emerald-400" /> {job.location}
              </div>
              {job.jobType && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm font-medium capitalize">
                  <Clock size={16} className="text-blue-400" /> {job.jobType}
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-bold">
                  <DollarSign size={16} /> {job.salary}
                </div>
              )}
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Briefcase size={20} className="text-white/40" /> The Role
                </h3>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-white/40" /> Requirements
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex gap-3 text-white/80">
                        <span className="text-emerald-400 mt-1 shrink-0">•</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Send size={20} className="text-emerald-400" /> Apply Now
            </h2>

            <div className="space-y-6">
              
              {/* CV Section */}
              <div>
                <label className="block text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Resume / CV
                </label>
                
                {myCV ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => setUseSavedCV(true)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${useSavedCV ? "bg-emerald-500/10 border-emerald-500/50 text-white" : "bg-slate-950/50 border-slate-800 text-white/60 hover:bg-slate-950"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${useSavedCV ? "border-emerald-400" : "border-white/40"}`}>
                          {useSavedCV && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Use Fixly Profile</div>
                          <div className="text-xs opacity-70">Updated recently</div>
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => setUseSavedCV(false)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${!useSavedCV ? "bg-emerald-500/10 border-emerald-500/50 text-white" : "bg-slate-950/50 border-slate-800 text-white/60 hover:bg-slate-950"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!useSavedCV ? "border-emerald-400" : "border-white/40"}`}>
                          {!useSavedCV && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Create custom CV</div>
                          <div className="text-xs opacity-70">Tailor for this job</div>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <div className="text-sm text-white/60 mb-3">You don&apos;t have a saved CV yet.</div>
                    <Link href={`/profile/${me.id}`} className="text-emerald-400 text-sm font-bold hover:underline">Build your profile first</Link>
                  </div>
                )}

                {!useSavedCV && (
                  <div className="mt-4 space-y-4 p-4 bg-slate-950/30 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Full Name</label>
                      <input value={cvName} onChange={e => setCvName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Professional Summary</label>
                      <textarea value={cvSummary} onChange={e => setCvSummary(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Skills (comma separated)</label>
                      <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Design..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">Cover Message</label>
                <textarea 
                  value={cover} 
                  onChange={(e) => setCover(e.target.value)} 
                  placeholder="Introduce yourself and why you&apos;re a good fit..." 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500 transition min-h-[120px] resize-none" 
                />
              </div>

              {/* Video Pitch (Unique Feature) */}
              <div>
                <label className="block text-sm font-bold text-white/80 mb-2 flex items-center gap-2">
                  <Video size={16} /> Video Pitch <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md ml-auto">Recommended</span>
                </label>
                {myVideos.length > 0 ? (
                  <select 
                    value={videoUrl} 
                    onChange={e => setVideoUrl(e.target.value)} 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500 transition appearance-none cursor-pointer"
                  >
                    <option value="">Don&apos;t include a video</option>
                    {myVideos.map(v => (
                      <option key={v.id} value={v.videoUrl}>Attach: &quot;{v.caption.substring(0, 30)}...&quot;</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                      <Video size={16} className="text-white/40" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">No videos found</div>
                      <div className="text-xs text-white/40">Post a video to use it as a pitch.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Questions */}
              {job.questions && job.questions.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="font-bold text-sm">Employer Questions</h3>
                  {job.questions.map((q, i) => (
                    <div key={i}>
                      <label className="block text-sm text-white/80 mb-2">{q}</label>
                      <input 
                        value={answers[i]} 
                        onChange={e => {
                          const n = [...answers];
                          n[i] = e.target.value;
                          setAnswers(n);
                        }} 
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition" 
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button 
                onClick={submit}
                disabled={isSubmitting || (!useSavedCV && !cvName.trim()) || (job.questions?.length ? answers.some(a => !a.trim()) : false)}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isSubmitting ? "Sending..." : "Submit Application"}
              </button>
              <p className="text-center text-xs text-white/40 mt-4">
                The employer will receive your profile and be able to message you directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

