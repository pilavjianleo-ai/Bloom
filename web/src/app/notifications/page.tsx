"use client";
import { useStore } from "@/state/store";
import Link from "next/link";
import { useEffect } from "react";

export default function Notifications() {
  const store = useStore();

  useEffect(() => {
    store.markNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div className="mt-4 space-y-3">
          {store.notifications.length === 0 && (
            <div className="text-sm text-white/60">No notifications yet.</div>
          )}
          {store.notifications.map((i) =>
            i.href ? (
              <Link key={i.id} href={i.href} className="block rounded-xl bg-slate-900 p-3 text-sm hover:bg-slate-800">
                {i.text}
              </Link>
            ) : (
              <div key={i.id} className="rounded-xl bg-slate-900 p-3 text-sm">{i.text}</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
