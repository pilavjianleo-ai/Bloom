"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/state/store";
import { X, Sparkles, TrendingUp, Compass, ChevronRight, User } from "lucide-react";
import { CATEGORIES } from "@/data/posts";

export default function OnboardingOverlay() {
  const store = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<"welcome" | "interests" | "role" | "done">("welcome");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<"user" | "expert" | "business">("user");

  useEffect(() => {
    // Show overlay after a short delay if not onboarded
    if (!store.onboarded) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Let them scroll for 3 seconds before interrupting
      return () => clearTimeout(timer);
    }
  }, [store.onboarded]);

  if (!isVisible) return null;

  const handleComplete = () => {
    store.updateUser({ role: selectedRole });
    store.setOnboarded(true);
    setIsVisible(false);
    
    // Simulate instant reward
    setTimeout(() => {
      store.addNotification("Your profile is optimized! Here are some top posts for you.");
    }, 1000);
  };

  const toggleCategory = (key: string) => {
    setSelectedCats(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Decorative background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50" />
        
        <button 
          onClick={() => {
            store.setOnboarded(true);
            setIsVisible(false);
          }} 
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white z-10 bg-slate-950/20 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8 relative z-10 min-h-[400px] flex flex-col">
          
          {step === "welcome" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in slide-in-from-right-8 duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black mb-3">Welcome to Fixly</h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                The fastest way to discover tips, find professionals, and grow your business.
              </p>
              <button 
                onClick={() => setStep("interests")}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
              >
                Personalize Feed <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === "interests" && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
              <p className="text-white/50 mb-6">Choose a few topics to tune your algorithm.</p>
              
              <div className="flex-1 overflow-y-auto no-scrollbar -mx-2 px-2">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c.key !== "other" && (c.key as any) !== "all").map(c => (
                    <button
                      key={c.key}
                      onClick={() => toggleCategory(c.key)}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        selectedCats.includes(c.key)
                          ? "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] scale-105"
                          : "bg-slate-900/80 text-white/70 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => setStep("role")}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] transition-transform"
                >
                  {selectedCats.length > 0 ? "Continue" : "Skip for now"}
                </button>
              </div>
            </div>
          )}

          {step === "role" && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-bold mb-2">How will you use Fixly?</h2>
              <p className="text-white/50 mb-6">This helps us show you the right tools.</p>
              
              <div className="space-y-3 flex-1">
                <button 
                  onClick={() => setSelectedRole("user")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedRole === "user" ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Compass className={selectedRole === "user" ? "text-indigo-400" : "text-white/40"} size={20} />
                    <div className="font-bold">Just browsing</div>
                  </div>
                  <div className="text-sm text-white/50 ml-8">I want to discover content and learn new things.</div>
                </button>

                <button 
                  onClick={() => setSelectedRole("expert")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedRole === "expert" ? "bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <TrendingUp className={selectedRole === "expert" ? "text-amber-400" : "text-white/40"} size={20} />
                    <div className="font-bold">Creator / Expert</div>
                  </div>
                  <div className="text-sm text-white/50 ml-8">I want to share my knowledge and build an audience.</div>
                </button>

                <button 
                  onClick={() => setSelectedRole("business")}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedRole === "business" ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <User className={selectedRole === "business" ? "text-emerald-400" : "text-white/40"} size={20} />
                    <div className="font-bold">Business</div>
                  </div>
                  <div className="text-sm text-white/50 ml-8">I want to find clients, hire talent, and promote services.</div>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button 
                  onClick={handleComplete}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] transition-transform"
                >
                  Let&apos;s go!
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}