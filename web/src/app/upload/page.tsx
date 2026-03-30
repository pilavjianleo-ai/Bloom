"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import type { Category, Post, ContentType, TextPost, Job } from "@/types";
import { CATEGORIES } from "@/data/posts";
import { useStore } from "@/state/store";
import { 
  Camera, FileText, HelpCircle, Briefcase, X, Upload as UploadIcon, Check, MapPin, 
  Sparkles, Wand2, Scissors, Image as ImageIcon, Music, VolumeX, Type, LayoutTemplate, 
  Zap, Gauge, Sliders, Hash, Play, ArrowRight
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import TextCard from "@/components/TextCard";

type PostType = "video" | "text" | "question" | "job";
type Phase = "intent" | "studio" | "enhance" | "success";

export default function CreatorStudio() {
  const store = useStore();
  const router = useRouter();
  const me = store.users.find(u => u.id === store.currentUserId)!;

  const [phase, setPhase] = useState<Phase>("intent");
  const [postType, setPostType] = useState<PostType>("video");

  // Content state
  const [videoUrl, setVideoUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [title, setTitle] = useState(""); // Caption for video, Title for Question/Job
  
  // Enhance state
  const [category, setCategory] = useState<Category | "">("");
  const [type, setType] = useState<ContentType | "skill_demo" | "service">("solution");
  const [location, setLocation] = useState("");
  const [skillTags, setSkillTags] = useState("");
  
  // Advanced Video State
  const [isMuted, setIsMuted] = useState(false);
  const [filter, setFilter] = useState("none");
  const [captionOverlay, setCaptionOverlay] = useState("");

  // Job specific state
  const [jobType, setJobType] = useState<Job["jobType"]>("full-time");
  const [salary, setSalary] = useState("");

  // AI & Feedback
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simulatedViews, setSimulatedViews] = useState(0);
  const [simulatedLikes, setSimulatedLikes] = useState(0);
  const [simulatedSignals, setSimulatedSignals] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "success") {
      interval = setInterval(() => {
        setSimulatedViews(v => v + Math.floor(Math.random() * 12) + 3);
        if (Math.random() > 0.5) setSimulatedLikes(l => l + 1);
        if (Math.random() > 0.8) {
          setSimulatedSignals(prev => [...prev, "Someone is interested in your skill!"]);
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Quality Score Calculation
  const qualityScore = useMemo(() => {
    let score = 30; // Base score
    if (postType === "video" && videoUrl) score += 30;
    if ((postType === "text" || postType === "question") && textContent.length > 50) score += 30;
    if (postType === "job" && title && textContent.length > 20) score += 30;
    if (category) score += 15;
    if (location) score += 10;
    if (title.length > 5) score += 15;
    return Math.min(score, 100);
  }, [postType, videoUrl, textContent, category, location, title]);

  const scoreColor = qualityScore > 80 ? "text-emerald-400 bg-emerald-500/20" : qualityScore > 50 ? "text-amber-400 bg-amber-500/20" : "text-red-400 bg-red-500/20";
  
  const getQualityFeedback = () => {
    if (qualityScore < 50) return "Add a stronger hook or more details to get better reach.";
    if (qualityScore < 80) return "Looking good! Add a category or location to boost visibility.";
    return "Perfect! This post has high engagement potential.";
  };

  function applyTemplate(template: string) {
    if (template === "tip") {
      setPostType("video");
      setTitle("Quick tip: How to fix this common issue! 💡");
      setCategory("plumbing");
      setType("solution");
    } else if (template === "question") {
      setPostType("question");
      setTitle("Need advice on this project");
      setTextContent("I'm running into an issue with... Does anyone have experience with this?");
    } else if (template === "showcase") {
      setPostType("video");
      setTitle("Just finished this installation! Very happy with the result. 🔥");
    } else if (template === "job") {
      setPostType("job");
      setTitle("Looking for an experienced sub-contractor");
      setTextContent("We need an extra pair of hands for a big project starting next week.");
    }
  }

  function runAIAssistant() {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (postType === "video" || postType === "text") {
        if (!title) setTitle("Here is an inside look at my latest work! Check out these details. 🚀");
        if (!category) setCategory("other");
        setTextContent(prev => prev + (prev ? "\n\n" : "") + "Let me know your thoughts in the comments!");
      }
    }, 1500);
  }

  function publish() {
    const now = new Date().getTime();
    if (postType === "video") {
      const tags = skillTags.split(",").map(t => t.trim()).filter(t => t.length > 0);
      const post: Post = {
        id: `local-vid-${now}`,
        videoUrl: videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
        businessName: me.name,
        profileImage: me.avatar,
        caption: title || "New creation",
        category: (category as Category) || "other",
        likes: 0,
        views: 0,
        businessId: me.role === "business" ? me.id : "",
        userId: me.id,
        description: textContent,
        type,
        skillTags: tags.length > 0 ? tags : undefined,
        sponsored: false,
      };
      store.createVideo(post);
    } else if (postType === "text" || postType === "question") {
      const post: TextPost = {
        id: `local-txt-${now}`,
        userId: me.id,
        text: textContent,
        caption: title || (postType === "question" ? "Question" : "Update"),
        category: (category as Category) || "other",
        likes: 0,
        views: 0,
        businessName: me.name,
        profileImage: me.avatar,
      };
      store.createText(post);
    } else if (postType === "job") {
      const job: Job = {
        id: `local-job-${now}`,
        title: title || "Hiring",
        description: textContent,
        category: (category as Category) || "other",
        location: location || "Remote",
        postedBy: me.id,
        createdAt: now,
        jobType,
        salary: salary || undefined,
        requirements: [],
        questions: [],
      };
      store.postJob(job);
    }
    store.addNotification("Your post is live and getting views!");
    setPhase("success");
  }

  const isPublishDisabled = useMemo(() => {
    if (postType === "video" && !videoUrl) return true;
    if ((postType === "text" || postType === "question") && !textContent.trim()) return true;
    if (postType === "job" && (!title.trim() || !textContent.trim() || !category)) return true;
    return false;
  }, [postType, videoUrl, textContent, title, category]);

  const mockPost = useMemo(() => {
    return {
      id: "preview",
      userId: me.id,
      businessName: me.name,
      profileImage: me.avatar,
      businessId: me.id,
      caption: title || (postType === "video" ? "Write a caption..." : "Post title"),
      text: textContent || "Your text will appear here...",
      category: category || "other",
      likes: 0,
      views: 0,
      videoUrl: videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
      type,
    };
  }, [me, title, textContent, category, videoUrl, type, postType]);

  // --- RENDERS ---

  if (phase === "intent") {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col h-full overflow-y-auto animate-in fade-in duration-300">
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur z-20 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">What do you want to create?</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 text-center mb-12 max-w-xl mx-auto">Choose a starting point. We&apos;ll set everything up for you.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Action Cards */}
            <button 
              onClick={() => { applyTemplate("tip"); setPhase("studio"); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-left hover:scale-[1.02] hover:shadow-xl transition-all group shadow-sm flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                <Zap size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Share a tip</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1">Help others by sharing a quick solution or hack from your experience.</p>
              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Start creating <ArrowRight size={16} /></div>
            </button>

            <button 
              onClick={() => { applyTemplate("showcase"); setPhase("studio"); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-left hover:scale-[1.02] hover:shadow-xl transition-all group shadow-sm flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                <Camera size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Show what you do</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1">Upload a video of your latest project or a before/after transformation.</p>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Start creating <ArrowRight size={16} /></div>
            </button>

            <button 
              onClick={() => { applyTemplate("question"); setPhase("studio"); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-left hover:scale-[1.02] hover:shadow-xl transition-all group shadow-sm flex flex-col"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-colors">
                <HelpCircle size={32} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Ask a question</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1">Stuck on a problem? Ask the community for advice and solutions.</p>
              <div className="text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Start creating <ArrowRight size={16} /></div>
            </button>

            {(me.role === "business" || me.role === "expert") && (
              <>
                <button 
                  onClick={() => { setPostType("video"); setTitle("Check out our premium services! Available for booking now."); setType("service"); setPhase("studio"); }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-left hover:scale-[1.02] hover:shadow-xl transition-all group shadow-sm flex flex-col"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                    <Sparkles size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Promote your service</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1">Create a post designed to get clients and showcase your expertise.</p>
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Start creating <ArrowRight size={16} /></div>
                </button>

                <button 
                  onClick={() => { applyTemplate("job"); setPhase("studio"); }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-left hover:scale-[1.02] hover:shadow-xl transition-all group shadow-sm flex flex-col lg:col-span-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                    <Briefcase size={32} className="text-slate-700 dark:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Post an opportunity</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">Looking to hire or find a sub-contractor? Create a job post to reach qualified experts in the network.</p>
                  <div className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Start creating <ArrowRight size={16} /></div>
                </button>
              </>
            )}

          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => { setPostType("text"); setTitle(""); setTextContent(""); setPhase("studio"); }}
              className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition"
            >
              Or start from a blank canvas
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="fixed inset-0 z-[100] bg-white text-slate-900 flex flex-col h-full items-center justify-center p-6 relative overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(16,185,129,0.4)] animate-bounce" style={{ animationDuration: "2s" }}>
          <Check size={56} className="text-white" />
        </div>
        
        <h2 className="text-4xl font-black mb-4 text-center">Your post is live!</h2>
        <p className="text-slate-500 text-lg mb-12 text-center max-w-md">Your content has been optimized and pushed to the network. It&apos;s already getting traction.</p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-4xl font-black text-indigo-600">{simulatedViews}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Views</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-4xl font-black text-pink-600">{simulatedLikes}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Likes</div>
          </div>
        </div>

        {simulatedSignals.length > 0 && (
          <div className="w-full max-w-sm space-y-2 mb-8">
            {simulatedSignals.slice(-3).map((sig, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-4">
                <Sparkles size={16} className="text-amber-500" /> {sig}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button onClick={() => router.push("/")} className="flex-1 py-4 bg-slate-900 hover:bg-slate-200 dark:bg-slate-800 text-white font-bold rounded-2xl transition shadow-lg">
            Go to Feed
          </button>
          <button onClick={() => {
            setPhase("studio");
            setPostType("video");
            setVideoUrl("");
            setTextContent("");
            setTitle("");
            setCategory("");
            setSimulatedViews(0);
            setSimulatedLikes(0);
            setSimulatedSignals([]);
          }} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl transition border border-slate-200">
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      
      {/* TOP NAV */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-slate-800 rounded-full transition">
            <X size={24} />
          </button>
          <div className="font-bold text-lg tracking-wide flex items-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} />
            Show what you can do
          </div>
        </div>

        {/* Format Switcher */}
        <div className="hidden md:flex bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-200 dark:border-slate-800">
          {[
            { id: "video", icon: Camera, label: "Skill Demo / Video" },
            { id: "text", icon: FileText, label: "Post" },
            { id: "question", icon: HelpCircle, label: "Question" },
            ...(me.role === "business" ? [{ id: "job", icon: Briefcase, label: "Job" }] : [])
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setPostType(t.id as PostType)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${postType === t.id ? "bg-white dark:bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-transparent" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-200 dark:bg-slate-800"}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-24 flex justify-end">
          <button 
            onClick={runAIAssistant}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-full text-sm font-bold transition disabled:opacity-50 border border-indigo-100 dark:border-transparent"
          >
            <Wand2 size={16} className={isAiLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isAiLoading ? "Thinking..." : "AI Assist"}</span>
          </button>
        </div>
      </div>

      {/* MOBILE FORMAT SWITCHER */}
      <div className="md:hidden flex bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-200 dark:border-slate-800 p-2 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: "video", icon: Camera, label: "Skill Demo" },
          { id: "text", icon: FileText, label: "Post" },
          { id: "question", icon: HelpCircle, label: "Question" },
          ...(me.role === "business" ? [{ id: "job", icon: Briefcase, label: "Job" }] : [])
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setPostType(t.id as PostType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${postType === t.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900"}`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* MAIN STUDIO AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: LIVE PREVIEW */}
        <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 relative border-r border-slate-200 dark:border-slate-200 dark:border-slate-800 shrink-0">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold z-10">
            <Zap size={16} className="text-amber-500 dark:text-amber-400" /> Live Preview
          </div>

          {/* Inspiration / Confidence Tooltip */}
          <div className="absolute top-4 right-6 max-w-xs bg-indigo-600/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl z-10 text-xs font-bold animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-amber-300" /> 
              Trending in your network
            </div>
            <div className="font-normal text-indigo-100 line-clamp-2">
              People are looking for &quot;How-to&quot; guides today. Try explaining a simple process!
            </div>
          </div>

          <div className="w-full max-w-[380px] h-[75vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden border-[8px] border-white dark:border-slate-900 shadow-xl relative bg-black shrink-0">
            {/* Filter Overlay */}
            {filter === "warm" && <div className="absolute inset-0 bg-orange-500/20 mix-blend-overlay pointer-events-none z-10" />}
            {filter === "cool" && <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay pointer-events-none z-10" />}
            
            {postType === "video" ? (
              videoUrl ? (
                <>
                  <VideoCard post={mockPost as Post} />
                  {captionOverlay && (
                    <div className="absolute top-1/3 left-0 right-0 text-center z-20 px-4">
                      <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg inline-block">
                        {captionOverlay}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 m-4 rounded-3xl" style={{ width: 'calc(100% - 32px)', height: 'calc(100% - 32px)' }}>
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-6">
                    <Camera size={32} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">Select a video to preview</p>
                </div>
              )
            ) : postType === "job" ? (
              <div className="p-6 bg-white dark:bg-slate-900 h-full flex flex-col text-slate-900 dark:text-white">
                <div className="text-2xl font-bold mb-2">{title || "Job Title"}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold mb-6 flex gap-2 items-center text-sm">
                  <Briefcase size={16} /> {jobType} • {salary || "Salary"} • {location || "Location"}
                </div>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto">{textContent || "Write a description to attract the best talent..."}</p>
              </div>
            ) : (
              <div className="h-full flex items-center bg-slate-50 dark:bg-slate-950">
                <TextCard post={mockPost as TextPost} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: EDITING TOOLS */}
        <div className="flex-1 bg-white dark:bg-slate-950 overflow-y-auto no-scrollbar relative flex flex-col">
          <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-10 pb-32">
            
            {/* AI Assistant Row */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Wand2 size={20} className={isAiLoading ? "animate-spin" : ""} />
                </div>
                <div>
                  <div className="font-bold text-sm text-indigo-900 dark:text-indigo-100">AI Hook Builder</div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300">The first 3 seconds matter. Let&apos;s make them count.</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={runAIAssistant}
                  disabled={isAiLoading}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl border border-indigo-100 dark:border-indigo-500/30 hover:bg-indigo-50 transition shadow-sm"
                >
                  Generate Hooks
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={14} /> Viral Hook Templates
              </label>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button onClick={() => { setPostType("video"); setTitle("Stop doing [X]... Do this instead. 👇"); }} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-bold whitespace-nowrap transition text-slate-700 dark:text-slate-200">&quot;Stop doing this...&quot;</button>
                <button onClick={() => { setPostType("video"); setTitle("This will help you if you struggle with [X]..."); }} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-bold whitespace-nowrap transition text-slate-700 dark:text-slate-200">&quot;This will help you if...&quot;</button>
                <button onClick={() => { setPostType("video"); setTitle("Nobody talks about this, but... 🤫"); }} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-bold whitespace-nowrap transition text-slate-700 dark:text-slate-200">&quot;Nobody talks about...&quot;</button>
                <button onClick={() => { setPostType("video"); setTitle("Here is how I achieved [X] in [Y] days."); }} className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-sm font-bold whitespace-nowrap transition text-slate-700 dark:text-slate-200">&quot;Here&apos;s how I did...&quot;</button>
              </div>
            </div>

            {/* Video Editor */}
            {postType === "video" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 dark:bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white"><UploadIcon size={20} className="text-indigo-500 dark:text-indigo-400"/> Step 1: Add your video</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Keep it short and simple. Show your work in action.</p>
                  {!videoUrl ? (
                    <button onClick={() => setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4")} className="w-full py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-200 dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-slate-500 transition group">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition"><Camera size={24} className="text-slate-500 dark:text-white" /></div>
                      <span className="font-bold text-slate-700 dark:text-white">Upload or Record</span>
                      <span className="text-sm text-slate-500 dark:text-slate-500 mt-1">Example: show your work (under 60s)</span>
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-white dark:bg-slate-100 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center"><Play size={20} className="text-indigo-400"/></div>
                          <div>
                            <div className="font-medium text-sm">video_clip_01.mp4</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">0:15s • 1080x1920</div>
                          </div>
                        </div>
                        <button onClick={() => setVideoUrl("")} className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition">Remove</button>
                      </div>

                      {/* Editing Tools Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:bg-slate-800 transition">
                          <Scissors size={18} className="text-slate-600 dark:text-slate-300" />
                          <span className="text-xs font-medium">Trim</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:bg-slate-800 transition">
                          <ImageIcon size={18} className="text-slate-600 dark:text-slate-300" />
                          <span className="text-xs font-medium">Cover</span>
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl transition ${isMuted ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-slate-100 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:bg-slate-800"}`}>
                          {isMuted ? <VolumeX size={18} /> : <Music size={18} />}
                          <span className="text-xs font-medium">{isMuted ? "Muted" : "Audio"}</span>
                        </button>
                        <div className="relative group">
                          <button className="w-full flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:bg-slate-800 transition">
                            <Sliders size={18} className="text-slate-600 dark:text-slate-300" />
                            <span className="text-xs font-medium">Filter</span>
                          </button>
                          <div className="absolute top-full left-0 mt-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-xl hidden group-hover:flex gap-2 z-50 shadow-xl border border-slate-200 dark:border-slate-800">
                            <button onClick={() => setFilter("none")} className={`px-3 py-1.5 text-xs rounded-lg ${filter === "none" ? "bg-white text-black" : "hover:bg-slate-200 dark:bg-slate-800"}`}>None</button>
                            <button onClick={() => setFilter("warm")} className={`px-3 py-1.5 text-xs rounded-lg ${filter === "warm" ? "bg-white text-black" : "hover:bg-slate-200 dark:bg-slate-800"}`}>Warm</button>
                            <button onClick={() => setFilter("cool")} className={`px-3 py-1.5 text-xs rounded-lg ${filter === "cool" ? "bg-white text-black" : "hover:bg-slate-200 dark:bg-slate-800"}`}>Cool</button>
                          </div>
                        </div>
                      </div>

                      {/* On-video text overlay */}
                      <div>
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><Type size={14}/> Text Overlay (Optional)</label>
                        <input value={captionOverlay} onChange={e => setCaptionOverlay(e.target.value)} placeholder="Add text on top of video..." className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/30 transition" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex justify-between items-end">
                    Step 2: Add a short description
                  </label>
                  <textarea 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Describe what you are doing in this video..." 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition text-lg resize-none shadow-inner"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Text / Question Editor */}
            {(postType === "text" || postType === "question") && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {postType === "question" && (
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Question Title</label>
                    <input 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="What do you need help with?" 
                      className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-800 pb-3 text-3xl font-bold outline-none focus:border-amber-400 transition placeholder-white/20"
                    />
                  </div>
                )}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                    {postType === "question" ? "Details & Context" : "What's on your mind?"}
                  </label>
                  <textarea 
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    placeholder={postType === "question" ? "Provide more details so experts can give better answers..." : "Share an update, tip, or thought with the community..."}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl px-6 py-6 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition text-xl resize-none min-h-[200px]"
                  />
                </div>
              </div>
            )}

            {/* Job Editor */}
            {postType === "job" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3">
                  <Briefcase className="text-emerald-400 shrink-0" />
                  <div className="text-sm text-emerald-100">
                    <span className="font-bold block text-emerald-400 mb-1">Business Feature</span>
                    Job posts reach professionals in your selected category instantly. Make sure to specify requirements clearly.
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Job Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Master Plumber Needed" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition text-lg" />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Description</label>
                  <textarea value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="Describe the role, responsibilities, and what you're looking for..." rows={6} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900 transition text-lg resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Job Type</label>
                    <select value={jobType} onChange={e => setJobType(e.target.value as Job["jobType"])} className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-emerald-400 transition appearance-none">
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="freelance">Freelance</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Salary / Rate (Optional)</label>
                    <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="$30-$40/hr" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-emerald-400 transition" />
                  </div>
                </div>
              </div>
            )}

            {/* Smart Targeting & Metadata */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Hash className="text-slate-400 dark:text-slate-500" /> Targeting & Reach
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Category <span className="text-red-500 dark:text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button 
                      key={c.key} 
                      onClick={() => setCategory(c.key)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${category === c.key ? "bg-indigo-600 text-white shadow-md scale-105" : "bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {postType === "video" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Content Intent</label>
                  <div className="flex gap-3">
                    <button onClick={() => setType("skill_demo")} className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${type === "skill_demo" ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]" : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-slate-700 dark:text-slate-200"}`}>
                      <Briefcase size={18} /> Skill Demo
                    </button>
                    <button onClick={() => setType("solution")} className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${type === "solution" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-slate-700 dark:text-slate-200"}`}>
                      <Sparkles size={18} /> Tip / Solution
                    </button>
                    <button onClick={() => setType("question")} className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${type === "question" ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-slate-700 dark:text-slate-200"}`}>
                      <HelpCircle size={18} /> Ask Community
                    </button>
                  </div>
                </div>
              )}

              {postType === "video" && type === "skill_demo" && (
                <div className="group animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Step 3: Add Skill Tags</label>
                  <input value={skillTags} onChange={e => setSkillTags(e.target.value)} placeholder="e.g. Pipe Repair, Troubleshooting, Design" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 transition text-base" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">These tags help the AI match you with opportunities.</p>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Location (Optional)</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-white transition" />
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York, NY" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-5 py-3.5 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition text-base" />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Adding a location helps distribute your content to local users.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="absolute bottom-0 left-0 right-0 md:left-[50%] lg:left-[45%] xl:left-[40%] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 z-30 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${scoreColor}`}>
            <Gauge size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quality Score ({qualityScore}/100)</div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[200px] leading-tight">{getQualityFeedback()}</div>
          </div>
        </div>

        <button 
          onClick={publish}
          disabled={isPublishDisabled}
          className="flex-1 sm:flex-none w-full sm:w-64 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-full shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-indigo-600"
        >
          Publish {postType === "job" ? "Job" : "Post"}
        </button>
      </div>

    </div>
  );
}
