"use client";

import { useState } from "react";
import { USERS } from "@/data/users";
import { useStore } from "@/state/store";
import Image from "next/image";
import { Send, CheckCircle2, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  recipientId?: string;
  recipientName?: string;
}

export default function ContactModal({ open, onClose, recipientId, recipientName }: Props) {
  const store = useStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const targetUser = USERS.find(u => u.id === recipientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !recipientId) return;
    
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      store.sendMessage(recipientId, recipientName || "User", text);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setText("");
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {success ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: "2s" }}>
              <CheckCircle2 size={40} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400">They usually respond within a few hours.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                Work with {recipientName || "them"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              {targetUser && (
                <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-transparent">
                    <Image src={targetUser.avatar} alt={targetUser.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{targetUser.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">{targetUser.role} • {targetUser.location || "Remote"}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">What do you need help with?</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe your project, timeline, or ask a question..."
                    className="w-full h-32 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-sm"
                    autoFocus
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!text.trim() || loading}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold text-lg disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                  This will start a conversation in your Inbox.
                </p>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
