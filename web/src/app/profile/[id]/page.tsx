"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BUSINESSES } from "@/data/posts";
import { USERS } from "@/data/users";
import { useParams } from "next/navigation";
import { useStore } from "@/state/store";
import { useMemo, useState } from "react";
import { MessageSquare, MapPin, Briefcase, Calendar, Star, CheckCircle, Video, FileText, Bookmark, Share2, Award, TrendingUp } from "lucide-react";

export default function Profile() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const store = useStore();
  const router = useRouter();
  const biz = BUSINESSES.find((b) => b.id === id);
  const user = USERS.find((u) => u.id === id);
  const [tab, setTab] = useState<"videos" | "posts" | "replies" | "saved" | "reviews">("videos");
  const videos = useMemo(
    () => store.posts.filter((p) => (p.businessId === id || p.userId === id) && p.type !== "answer"),
    [store.posts, id]
  );
  const replies = useMemo(
    () => store.posts.filter((p) => (p.businessId === id || p.userId === id) && p.type === "answer"),
    [store.posts, id]
  );
  const texts = useMemo(() => store.textPosts.filter((t) => t.userId === id), [store.textPosts, id]);
  
  const savedItems = useMemo(() => {
    const savedIds = Object.keys(store.saved).filter(k => store.saved[k]);
    return [...store.posts, ...store.textPosts].filter(p => savedIds.includes(p.id));
  }, [store.saved, store.posts, store.textPosts]);

  const isFollowing = store.follows[id];
  const profileName = biz?.name ?? user?.name ?? videos[0]?.businessName ?? "Profile";
  const profileImage = biz?.logo ?? user?.avatar ?? videos[0]?.profileImage ?? "/vercel.svg";
  
  function handleContact() {
    store.sendMessage(id, profileName, "Hi, I'd like to connect!");
    router.push("/inbox");
  }

  function handleShare() {
    store.addNotification("Profile link copied to clipboard!");
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20">
      {/* Cover Photo */}
      <div className="h-40 md:h-56 w-full relative">
        <div className="absolute inset-0 bg-indigo-100 dark:bg-gradient-to-tr dark:from-indigo-900 dark:via-zinc-900 dark:to-black" />
        <div className="absolute inset-0 bg-slate-950/5 dark:bg-slate-950/40" />
      </div>

      <div className="mx-auto max-w-4xl px-4 md:px-8 -mt-20 relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-[2rem] overflow-hidden border-[6px] border-gray-50 dark:border-black bg-white dark:bg-slate-900 shrink-0 shadow-xl">
            <Image
              src={profileImage}
              alt={profileName}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight flex items-center gap-2 text-slate-900 dark:text-white">
                {profileName}
                {(biz?.verified || user?.verified) && (
                  <CheckCircle className="text-blue-500 dark:text-blue-400" size={24} fill="currentColor" stroke="white" />
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">
                <span className="capitalize text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">{user?.role || "user"}</span>
                {(user?.location || biz?.location) && (
                  <span className="flex items-center gap-1"><MapPin size={14} /> {user?.location || biz?.location}</span>
                )}
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined 2024</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              {(biz || user?.role === "expert" || user?.role === "business") && id !== store.currentUserId && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-4 py-2 flex items-center gap-2 mb-3 md:mb-0 md:mr-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">Available for work</span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <button onClick={handleShare} className="p-3 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition shadow-sm">
                  <Share2 size={20} className="text-slate-700 dark:text-white" />
                </button>
                {id === store.currentUserId ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold transition shadow-md whitespace-nowrap"
                    >
                      My Hub
                    </Link>
                    <Link
                      href="/settings"
                      className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 dark:bg-white dark:hover:bg-zinc-200 dark:text-black dark:border-transparent font-bold transition shadow-md whitespace-nowrap"
                    >
                      Edit Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => store.follow(id)}
                      className={`px-6 py-3 rounded-full font-bold transition shadow-md whitespace-nowrap ${isFollowing ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-800" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button 
                      onClick={handleContact}
                      className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md flex items-center gap-2 whitespace-nowrap"
                    >
                      <MessageSquare size={18} />
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Info & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">About</h2>
              <p className="text-slate-500 dark:text-slate-200 leading-relaxed">
                {biz?.description ?? user?.bio ?? "Welcome to my profile. I share tips, videos, and professional services. Let's connect!"}
              </p>
            </div>

            {/* Skill Highlights (New) */}
            {(user?.skills && user.skills.length > 0) && (
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Award className="text-indigo-500 dark:text-indigo-400" size={20} /> Verified Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map(s => {
                    const isVerified = user.verifiedSkills?.includes(s);
                    return (
                      <span key={s} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 ${isVerified ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30' : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>
                        {isVerified && <CheckCircle size={14} />} {s}
                      </span>
                    )
                  })}
                </div>
                {user.skillLevel && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Skill Level</span>
                    <span className="capitalize font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-xs">{user.skillLevel}</span>
                  </div>
                )}
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center shadow-sm">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{user?.followers || 1200}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Followers</div>
              </div>
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center shadow-sm">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{videos.length + texts.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Posts</div>
              </div>
              {biz?.rating && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-center col-span-2 flex items-center justify-center gap-3 shadow-sm">
                  <Star className="text-amber-500 dark:text-amber-400" size={24} fill="currentColor" />
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{biz.rating.toFixed(1)} <span className="text-sm font-medium text-slate-400 dark:text-slate-400">/ 5.0</span></div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {biz?.premium && <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-bold text-sm">PRO Member</span>}
              {typeof biz?.jobsCompleted === "number" && <span className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 font-bold text-sm">{biz.jobsCompleted} Jobs Done</span>}
              {user?.topPercentile && (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold text-sm flex items-center gap-1.5">
                  <TrendingUp size={16} /> Top {user.topPercentile}% in category
                </span>
              )}
              {user?.peopleHelped && user.peopleHelped > 0 ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-sm">
                  Helped {user.peopleHelped} people
                </span>
              ) : null}
            </div>

            {/* Experience & CV Data (New) */}
            {user?.cv && (
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-emerald-500 dark:text-emerald-400" /> Experience
                </h2>
                <div className="space-y-4">
                  {user.cv.experience?.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 pb-4 last:pb-0">
                      <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 border-2 border-white dark:border-black" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{exp.role}</h3>
                      <div className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-1">{exp.company} • {exp.start} - {exp.end || "Present"}</div>
                      {exp.description && <p className="text-slate-500 dark:text-slate-300 text-xs leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {(biz || user?.role === "expert" || user?.role === "business") && id !== store.currentUserId && (
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Available for new opportunities</div>
                </div>
                <button 
                  onClick={handleContact}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md"
                >
                  <MessageSquare size={20} />
                  Message
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href={`/jobs?q=${encodeURIComponent(profileName)}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent font-bold transition text-sm shadow-sm"
                  >
                    <Briefcase size={16} /> Hire
                  </Link>
                  <button 
                    onClick={() => store.addNotification("Saved to Network")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition text-sm shadow-sm"
                  >
                    <Bookmark size={16} /> Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="lg:col-span-2">
            
            {/* Custom Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
              {[
                { id: "videos", label: "Skill Demos", count: videos.length, icon: Video },
                { id: "posts", label: "Posts", count: texts.length, icon: FileText },
                { id: "replies", label: "Answers", count: replies.length, icon: MessageSquare },
                { id: "reviews", label: "Reviews", count: biz?.reviews?.length || 0, icon: Star },
                ...(id === store.currentUserId ? [{ id: "saved", label: "Saved", count: savedItems.length, icon: Bookmark }] : [])
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id as "videos" | "posts" | "replies" | "saved" | "reviews")} 
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold transition-all ${tab === t.id ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-400" : "bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-transparent"}`}
                >
                  <t.icon size={18} className={tab === t.id ? "text-white dark:text-black" : "text-slate-400 dark:text-slate-500"} />
                  {t.label} <span className={`px-2 py-0.5 rounded-lg text-xs ${tab === t.id ? "bg-white/20 dark:bg-slate-950/10" : "bg-slate-100 dark:bg-slate-950/30 text-slate-500 dark:text-white"}`}>{t.count}</span>
                </button>
              ))}
            </div>

            {/* Content Grids */}
            {tab === "videos" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {videos.map((p) => (
                  <Link href={`/post/${p.id}`} key={p.id} className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[3/4] border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-sm">
                    <video
                      src={p.videoUrl}
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 h-full w-full object-cover"
                      onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-80 group-hover:opacity-100 transition" />
                    {p.isVerifiedSkill && (
                      <div className="absolute top-3 right-3 bg-indigo-500 text-white p-1.5 rounded-full shadow-lg z-10">
                        <CheckCircle size={14} />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {p.caption}
                      </div>
                      {p.skillTags && p.skillTags.length > 0 && (
                        <div className="text-[10px] text-indigo-300 font-bold">
                          {p.skillTags[0]}
                        </div>
                      )}
                      {p.views !== undefined && (
                        <div className="text-white/80 text-xs flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          {p.views.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                {videos.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                    <Video className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No skill demos yet</h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-6">This profile hasn&apos;t uploaded any skill demonstration videos.</p>
                    {id === store.currentUserId && (
                      <Link href="/upload" className="px-6 py-3 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold transition shadow-md inline-block">
                        Upload your first skill demo
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {tab === "posts" && (
              <div className="space-y-4">
                {texts.map((t) => (
                  <Link href={`/post/${t.id}`} key={t.id} className="block rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition shadow-sm">
                    <div className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{t.caption}</div>
                    <div className="text-slate-500 dark:text-slate-300 leading-relaxed">{t.text}</div>
                  </Link>
                ))}
                {texts.length === 0 && (
                  <div className="py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                    <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No posts yet</h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-6">This profile hasn&apos;t shared any written posts.</p>
                    {id === store.currentUserId && (
                      <Link href="/upload" className="px-6 py-3 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold transition shadow-md inline-block">
                        Write your first post
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {tab === "replies" && (
              <div className="grid grid-cols-2 gap-4">
                {replies.map((p) => (
                  <Link href={`/post/${p.id}`} key={p.id} className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[3/4] border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-sm">
                    <div className="absolute top-3 left-3 z-20 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Answer</div>
                    <video src={p.videoUrl} muted playsInline loop className="absolute inset-0 h-full w-full object-cover" onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-80 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white line-clamp-2">{p.caption}</div>
                  </Link>
                ))}
                {replies.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                    <MessageSquare className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No answers yet</h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-6">This profile hasn&apos;t answered any questions.</p>
                    {id === store.currentUserId && (
                      <Link href="/groups" className="px-6 py-3 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold transition shadow-md inline-block">
                        Help someone in the community
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {tab === "saved" && id === store.currentUserId && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {savedItems.map((item) => (
                  <Link href={`/post/${item.id}`} key={item.id} className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[3/4] border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 transition-all shadow-sm">
                    {"videoUrl" in item ? (
                      <video src={item.videoUrl} muted playsInline loop className="absolute inset-0 h-full w-full object-cover" onLoadedMetadata={(e) => (e.target as HTMLVideoElement).play().catch(() => {})} />
                    ) : (
                      <div className="absolute inset-0 p-6 flex flex-col justify-center bg-slate-100 dark:bg-slate-800">
                        <div className="font-bold text-lg mb-2 line-clamp-2 text-slate-900 dark:text-white">{item.caption}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3">{item.text}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-80 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white line-clamp-2 pointer-events-none">
                      {item.caption}
                    </div>
                  </Link>
                ))}
                {savedItems.length === 0 && <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-500 font-medium bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">No saved items</div>}
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-4">
                {biz?.reviews && biz.reviews.length > 0 ? (
                  biz.reviews.map((r) => (
                    <div key={r.id} className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.floor(r.rating) ? "text-amber-500 dark:text-amber-400" : "text-slate-300 dark:text-slate-600"} fill="currentColor" />
                        ))}
                        <span className="font-bold ml-2 text-slate-900 dark:text-white">{r.rating}.0</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-200 leading-relaxed">&quot;{r.text}&quot;</div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                    <Star className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-400 mb-2">No reviews yet</h3>
                    <p className="text-slate-500 dark:text-slate-500">This profile hasn&apos;t received any reviews yet.</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
