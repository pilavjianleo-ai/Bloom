"use client";
import { useState } from "react";
import { useStore } from "@/state/store";
import { USERS } from "@/data/users";
import { Zap, Shield, Sparkles, Star, ChevronRight, Check, User, X, PlusCircle } from "lucide-react";

export default function Settings() {
  const store = useStore();
  const [userId, setUserId] = useState(store.currentUserId);
  const me = store.users.find(u => u.id === store.currentUserId)!;

  const handleSwitch = (id: string) => {
    setUserId(id);
    store.setCurrentUser(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-0">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-6 md:px-8 md:py-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Account Hub</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Development / User Switcher */}
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-red-500"><Shield size={64} /></div>
          <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Developer Mode</h2>
          <p className="text-red-800/60 dark:text-slate-400 text-sm mb-4">Switch accounts to test different roles (User, Expert, Business).</p>
          <div className="flex flex-wrap gap-2">
            {USERS.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => handleSwitch(u.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${userId === u.id ? "bg-red-500 text-white shadow-md" : "bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-950/80 text-slate-700 dark:text-white"}`}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                {u.name} <span className="text-[10px] uppercase opacity-60">({u.role})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Settings (New) */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <User className="text-indigo-500 dark:text-indigo-400" /> Edit Profile
          </h2>
          
          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Display Name</label>
                <input 
                  id="edit-name"
                  type="text" 
                  defaultValue={me.name}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Role / Title</label>
                <input 
                  id="edit-role"
                  type="text" 
                  defaultValue={me.role || ""}
                  placeholder="e.g. Master Plumber, Senior React Developer"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Bio / Description</label>
                <textarea 
                  id="edit-bio"
                  defaultValue={me.bio || "Professional expert looking for new opportunities."}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 dark:text-white min-h-[100px] resize-none" 
                />
              </div>
            </div>

            {/* Experience (New) */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Experience</label>
                <button 
                  onClick={() => {
                    const newExp = {
                      role: "New Role",
                      company: "Company Name",
                      start: "2024",
                      end: "Present"
                    };
                    store.updateUser({ 
                      cv: { 
                        ...me.cv, 
                        experience: [...(me.cv?.experience || []), newExp] 
                      } 
                    });
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <PlusCircle size={14} /> Add Role
                </button>
              </div>
              <div className="space-y-3">
                {me.cv?.experience?.map((exp, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-start group">
                    <div className="flex-1">
                      <input 
                        type="text"
                        defaultValue={exp.role}
                        className="font-bold text-sm text-slate-900 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-indigo-500 w-full mb-1"
                        onBlur={(e) => {
                          const newExp = [...(me.cv?.experience || [])];
                          newExp[i].role = e.target.value;
                          store.updateUser({ cv: { ...me.cv, experience: newExp } });
                        }}
                      />
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <input 
                          type="text"
                          defaultValue={exp.company}
                          className="bg-transparent outline-none border-b border-transparent focus:border-indigo-500 w-1/3"
                          onBlur={(e) => {
                            const newExp = [...(me.cv?.experience || [])];
                            newExp[i].company = e.target.value;
                            store.updateUser({ cv: { ...me.cv, experience: newExp } });
                          }}
                        />
                        <span>•</span>
                        <input 
                          type="text"
                          defaultValue={exp.start}
                          className="bg-transparent outline-none border-b border-transparent focus:border-indigo-500 w-16"
                          onBlur={(e) => {
                            const newExp = [...(me.cv?.experience || [])];
                            newExp[i].start = e.target.value;
                            store.updateUser({ cv: { ...me.cv, experience: newExp } });
                          }}
                        />
                        <span>-</span>
                        <input 
                          type="text"
                          defaultValue={exp.end || ""}
                          placeholder="Present"
                          className="bg-transparent outline-none border-b border-transparent focus:border-indigo-500 w-16"
                          onBlur={(e) => {
                            const newExp = [...(me.cv?.experience || [])];
                            newExp[i].end = e.target.value;
                            store.updateUser({ cv: { ...me.cv, experience: newExp } });
                          }}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newExp = [...(me.cv?.experience || [])];
                        newExp.splice(i, 1);
                        store.updateUser({ cv: { ...me.cv, experience: newExp } });
                      }}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition ml-2 opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {(!me.cv?.experience || me.cv.experience.length === 0) && (
                  <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No experience added yet
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Your Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {me.skills?.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-bold flex items-center gap-2 border border-indigo-100 dark:border-transparent">
                    {s} 
                    <button 
                      onClick={() => store.updateUser({ skills: me.skills?.filter(skill => skill !== s) })}
                      className="hover:text-indigo-900 dark:hover:text-indigo-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  id="new-skill-input"
                  type="text" 
                  placeholder="Add a skill (e.g. React, Plumbing)..." 
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm text-slate-900 dark:text-white" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('add-skill-btn')?.click();
                    }
                  }}
                />
                <button 
                  id="add-skill-btn"
                  onClick={() => {
                    const input = document.getElementById('new-skill-input') as HTMLInputElement;
                    const val = input.value.trim();
                    if (val && !me.skills?.includes(val)) {
                      store.updateUser({ skills: [...(me.skills || []), val] });
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={() => {
                  store.updateUser({ 
                    name: document.querySelector<HTMLInputElement>('#edit-name')?.value || me.name,
                    role: (document.querySelector<HTMLInputElement>('#edit-role')?.value as any) || me.role,
                    bio: document.querySelector<HTMLTextAreaElement>('#edit-bio')?.value || me.bio
                  });
                  store.addNotification("Profile saved successfully!");
                }}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Monetization / Boost Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Zap className="text-amber-500 dark:text-amber-400" /> Monetization & Growth
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pro Tier */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 flex flex-col relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative z-10 flex-1">
                <div className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
                  Creator Pro
                </div>
                <h3 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">$9.99<span className="text-sm text-slate-500 dark:text-slate-500 font-normal">/month</span></h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Perfect for growing creators looking to monetize their audience.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-indigo-500 dark:text-indigo-400" /> Advanced analytics</li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-indigo-500 dark:text-indigo-400" /> Premium &quot;Pro&quot; badge</li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-indigo-500 dark:text-indigo-400" /> Accept direct bookings</li>
                </ul>
              </div>
              <button 
                onClick={() => store.addNotification("Subscribed to Pro Tier!")}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold transition relative z-10 shadow-md dark:shadow-none"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Business Tier */}
            <div className="rounded-3xl bg-amber-50 dark:bg-gradient-to-br dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/30 p-6 flex flex-col relative overflow-hidden shadow-sm dark:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <Sparkles className="absolute top-4 right-4 text-amber-200 dark:text-amber-400/20" size={64} />
              <div className="relative z-10 flex-1">
                <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
                  Business Leads
                </div>
                <h3 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">$49.00<span className="text-sm text-slate-500 dark:text-slate-500 font-normal">/month</span></h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Generate highly qualified local leads and hire top talent.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-amber-600 dark:text-amber-400" /> Post unlimited opportunities</li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-amber-600 dark:text-amber-400" /> Targeted lead generation</li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-amber-600 dark:text-amber-400" /> Priority in Explore page</li>
                  <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-white"><Check size={16} className="text-amber-600 dark:text-amber-400" /> Client review system</li>
                </ul>
              </div>
              <button 
                onClick={() => store.addNotification("Subscribed to Business Tier!")}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition shadow-lg shadow-amber-500/20 relative z-10"
              >
                Start Generating Leads
              </button>
            </div>
          </div>
        </div>

        {/* Trust & Credibility Settings */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Star className="text-emerald-500 dark:text-emerald-400" /> Trust & Profile
          </h2>
          
          <div className="rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-2 divide-y divide-gray-100 dark:divide-white/5 shadow-sm">
            
            <button 
              onClick={() => {
                store.updateUser({ verified: true });
                store.addNotification("Verification request submitted!");
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="text-left">
                <div className="font-bold mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
                  Request Verification {me.verified && <span className="text-[10px] bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase border border-blue-100 dark:border-transparent">Verified</span>}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Get the blue checkmark to build trust.</div>
              </div>
              <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
            </button>

            <button 
              onClick={() => store.addNotification("Review request sent to recent clients")}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="text-left">
                <div className="font-bold mb-1 text-slate-900 dark:text-white">Request Client Reviews</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Send an automated message to recent clients.</div>
              </div>
              <ChevronRight size={20} className="text-slate-400 dark:text-slate-600" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
