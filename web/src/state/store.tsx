"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { POSTS } from "@/data/posts";
import { TEXT_POSTS } from "@/data/text";
import { USERS } from "@/data/users";
import { JOBS } from "@/data/jobs";
import type { Comment, Post, TextPost, User, Job, Application, CV, Category, Group, GroupPost } from "@/types";

type Msg = { me?: boolean; text: string; createdAt: number };
type Conversation = { id: string; name: string; messages: Msg[] };
type Notification = { id: string; text: string; href?: string; read?: boolean; createdAt: number; type?: "view" | "like" | "comment" | "follow" | "message" | "job" | "opportunity" };

type StoreState = {
  currentUserId: string;
  onboarded: boolean;
  users: User[];
  posts: Post[];
  textPosts: TextPost[];
  jobs: Job[];
  applications: Application[];
  comments: Record<string, Comment[]>;
  conversations: Record<string, Conversation>;
  notifications: Notification[];
  follows: Record<string, boolean>;
  likes: Record<string, boolean>;
  saved: Record<string, boolean>;
  theme: "dark" | "light";
  engagement: Record<string, { watchTime: number; exposures: number; profileClicks: number; contactClicks: number }>;
  cvs: Record<string, CV>;
  coverLetters: Record<string, string[]>;
  groups: Group[];
  groupPosts: GroupPost[];
};

type Store = StoreState & {
  createVideo(p: Post): void;
  createText(p: TextPost): void;
  createGroupPost(p: GroupPost): void;
  createGroup(g: Group): void;
  joinGroup(groupId: string): void;
  leaveGroup(groupId: string): void;
  deleteItem(id: string): void;
  editItem(id: string, patch: Partial<Post & TextPost>): void;
  like(id: string): void;
  save(id: string): void;
  follow(targetId: string): void;
  addComment(postId: string, text: string): void;
  addReply(postId: string, commentId: string, text: string): void;
  likeComment(postId: string, commentId: string): void;
  markHelpful(postId: string, commentId: string): void;
  sendMessage(convId: string, name: string, text: string): void;
  addNotification(text: string): void;
  setTheme(t: "dark" | "light"): void;
  updateUser(patch: Partial<User>): void;
  postJob(job: Job): void;
  applyJob(jobId: string, details: { coverLetter: string; videoUrl?: string; answers?: string[] }): void;
  setCurrentUser(userId: string): void;
  bumpExposure(id: string, seconds: number): void;
  trackProfileClick(id: string): void;
  trackContactClick(id: string): void;
  saveCV(cv: CV): void;
  saveCoverLetterTemplate(t: string): void;
  setApplicationStatus(appId: string, status: "accepted" | "rejected"): void;
  markNotificationsRead(): void;
  setOnboarded(val: boolean): void;
};

const Ctx = createContext<Store | null>(null);

function load(): StoreState {
  if (typeof window === "undefined") {
    return {
      currentUserId: USERS[0].id,
      onboarded: false,
      users: USERS,
      posts: POSTS,
      textPosts: TEXT_POSTS,
      jobs: JOBS,
      applications: [],
      comments: {},
      conversations: {},
      notifications: [],
      follows: {},
      likes: {},
      saved: {},
      theme: "dark",
      engagement: {},
      cvs: {},
      coverLetters: {},
      groups: [
        { id: "g-1", name: "Plumbing Pros", description: "Share tips and get advice on complex plumbing jobs.", category: "plumbing", members: [USERS[0].id] },
        { id: "g-2", name: "Home Maintenance", description: "General DIY and home care.", category: "general", members: [] }
      ],
      groupPosts: [],
    };
  }
  try {
    const raw = localStorage.getItem("fixly-store");
    if (!raw) throw new Error("no");
    const parsed = JSON.parse(raw);
    return {
      currentUserId: parsed.currentUserId || USERS[0].id,
      onboarded: parsed.onboarded || false,
      users: parsed.users || USERS,
      posts: parsed.posts || POSTS,
      textPosts: parsed.textPosts || TEXT_POSTS,
      jobs: parsed.jobs || JOBS,
      applications: parsed.applications || [],
      comments: parsed.comments || {},
      conversations: parsed.conversations || {},
      notifications: parsed.notifications || [],
      follows: parsed.follows || {},
      likes: parsed.likes || {},
      saved: parsed.saved || {},
      theme: parsed.theme || "dark",
      engagement: parsed.engagement || {},
      cvs: parsed.cvs || {},
      coverLetters: parsed.coverLetters || {},
      groups: parsed.groups || [
        { id: "g-1", name: "Plumbing Pros", description: "Share tips and get advice on complex plumbing jobs.", category: "plumbing", members: [USERS[0].id] },
        { id: "g-2", name: "Home Maintenance", description: "General DIY and home care.", category: "general", members: [] }
      ],
      groupPosts: parsed.groupPosts || [],
    };
  } catch {
    return {
      currentUserId: USERS[0].id,
      onboarded: false,
      users: USERS,
      posts: POSTS,
      textPosts: TEXT_POSTS,
      jobs: JOBS,
      applications: [],
      comments: {},
      conversations: {},
      notifications: [],
      follows: {},
      likes: {},
      saved: {},
      theme: "dark",
      engagement: {},
      cvs: {},
      coverLetters: {},
      groups: [
        { id: "g-1", name: "Plumbing Pros", description: "Share tips and get advice on complex plumbing jobs.", category: "plumbing", members: [USERS[0].id] },
        { id: "g-2", name: "Home Maintenance", description: "General DIY and home care.", category: "general", members: [] }
      ],
      groupPosts: [],
    };
  }
}

function persist(state: StoreState) {
  try {
    localStorage.setItem("fixly-store", JSON.stringify(state));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(load);

  useEffect(() => {
    persist(state);
  }, [state]);

  const api = useMemo<Store>(() => {
    return {
      ...state,
      createVideo(p) {
        setState((s) => ({
          ...s,
          posts: [p, ...s.posts],
          engagement: { ...s.engagement, [p.id]: { watchTime: 0, exposures: 1, profileClicks: 0, contactClicks: 0 } },
        }));
      },
      createText(p) {
        setState((s) => ({
          ...s,
          textPosts: [p, ...s.textPosts],
          engagement: { ...s.engagement, [p.id]: { watchTime: 0, exposures: 1, profileClicks: 0, contactClicks: 0 } },
        }));
      },
      createGroupPost(p) {
        setState((s) => ({
          ...s,
          groupPosts: [p, ...s.groupPosts],
        }));
      },
      createGroup(g) {
        setState((s) => ({
          ...s,
          groups: [g, ...s.groups],
        }));
      },
      joinGroup(groupId) {
        setState((s) => ({
          ...s,
          groups: s.groups.map(g => g.id === groupId ? { ...g, members: [...new Set([...g.members, s.currentUserId])] } : g)
        }));
      },
      leaveGroup(groupId) {
        setState((s) => ({
          ...s,
          groups: s.groups.map(g => g.id === groupId ? { ...g, members: g.members.filter(m => m !== s.currentUserId) } : g)
        }));
      },
      deleteItem(id) {
        setState((s) => ({
          ...s,
          posts: s.posts.filter((p) => p.id !== id),
          textPosts: s.textPosts.filter((p) => p.id !== id),
        }));
      },
      editItem(id, patch) {
        setState((s) => ({
          ...s,
          posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          textPosts: s.textPosts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },
      like(id) {
        setState((s) => {
          const liked = !s.likes[id];
          const posts = s.posts.map((p) =>
            p.id === id ? { ...p, likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1) } : p
          );
          const texts = s.textPosts.map((p) =>
            p.id === id ? { ...p, likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1) } : p
          );
          const likes = { ...s.likes, [id]: liked };
          const notifications = liked
            ? [
                { id: `n-${Date.now()}`, text: "Someone liked your post", href: `/post/${id}`, createdAt: Date.now() },
                ...s.notifications,
              ]
            : s.notifications;
          return { ...s, posts, textPosts: texts, likes, notifications };
        });
      },
      save(id) {
        setState((s) => {
          const saved = !s.saved[id];
          const savedMap = { ...s.saved, [id]: saved };
          return { ...s, saved: savedMap };
        });
      },
      follow(targetId) {
        setState((s) => {
          const val = !s.follows[targetId];
          const follows = { ...s.follows, [targetId]: val };
          const notifications = val
            ? [
                { id: `n-${Date.now()}`, text: "New follower", href: `/profile/${targetId}`, createdAt: Date.now() },
                ...s.notifications,
              ]
            : s.notifications;
          const users = s.users.map((u) => {
            if (u.id === s.currentUserId) return { ...u, following: Math.max(0, u.following + (val ? 1 : -1)) };
            if (u.id === targetId) return { ...u, followers: Math.max(0, u.followers + (val ? 1 : -1)) };
            return u;
          });
          return { ...s, follows, notifications, users };
        });
      },
      addComment(postId, text) {
        setState((s) => {
          const arr = s.comments[postId] || [];
          const c: Comment = {
            id: `c-${Date.now()}`,
            userId: s.currentUserId,
            text,
            createdAt: Date.now(),
            replies: [],
            likes: 0,
            isHelpful: false,
          };
          const notifications = [{ id: `n-${Date.now()}`, text: "Someone commented on your post", href: `/post/${postId}`, read: false, createdAt: Date.now() }, ...s.notifications];
          return { ...s, comments: { ...s.comments, [postId]: [...arr, c] }, notifications };
        });
      },
      addReply(postId, commentId, text) {
        setState((s) => {
          const arr = s.comments[postId] || [];
          const r: Comment = {
            id: `r-${Date.now()}`,
            userId: s.currentUserId,
            text,
            createdAt: Date.now(),
            likes: 0,
            isHelpful: false,
          };
          const updatedArr = arr.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), r] } : c);
          const notifications = [{ id: `n-${Date.now()}`, text: "Someone replied to your comment", href: `/post/${postId}`, read: false, createdAt: Date.now() }, ...s.notifications];
          return { ...s, comments: { ...s.comments, [postId]: updatedArr }, notifications };
        });
      },
      likeComment(postId, commentId) {
        setState((s) => {
          const arr = s.comments[postId] || [];
          const updatedArr = arr.map(c => {
            if (c.id === commentId) return { ...c, likes: (c.likes || 0) + 1 };
            if (c.replies) {
              return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, likes: (r.likes || 0) + 1 } : r) };
            }
            return c;
          });
          return { ...s, comments: { ...s.comments, [postId]: updatedArr } };
        });
      },
      markHelpful(postId, commentId) {
        setState((s) => {
          const arr = s.comments[postId] || [];
          let targetUserId = "";
          const updatedArr = arr.map(c => {
            if (c.id === commentId) {
              targetUserId = c.userId;
              return { ...c, isHelpful: true };
            }
            if (c.replies) {
              const updatedReplies = c.replies.map(r => {
                if (r.id === commentId) {
                  targetUserId = r.userId;
                  return { ...r, isHelpful: true };
                }
                return r;
              });
              return { ...c, replies: updatedReplies };
            }
            return c;
          });
          
          let updatedUsers = s.users;
          if (targetUserId) {
            updatedUsers = s.users.map(u => u.id === targetUserId ? { 
              ...u, 
              helpfulScore: (u.helpfulScore || 0) + 10,
              peopleHelped: (u.peopleHelped || 0) + 1
            } : u);
          }
          
          return { ...s, comments: { ...s.comments, [postId]: updatedArr }, users: updatedUsers };
        });
      },
      sendMessage(convId, name, text) {
        const msg: Msg = { me: true, text, createdAt: Date.now() };
        setState((s) => {
          const conv = s.conversations[convId] || { id: convId, name, messages: [] };
          const updated: Conversation = { ...conv, messages: [...conv.messages, msg] };
          const conversations = { ...s.conversations, [convId]: updated };
          const notifications: Notification[] = [
            { id: `n-${Date.now()}`, text: "New message sent", href: "/inbox", createdAt: Date.now() },
            ...s.notifications,
          ];
          return { ...s, conversations, notifications };
        });
      },
      addNotification(text) {
        setState((s) => ({
          ...s,
          notifications: [{ id: `n-${Date.now()}`, text, href: "/notifications", createdAt: Date.now() }, ...s.notifications],
        }));
      },
      setTheme(t) {
        setState((s) => ({ ...s, theme: t }));
      },
      updateUser(patch) {
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
        }));
      },
      postJob(job) {
        setState((s) => {
          const jobs = [job, ...s.jobs];
          const poster = s.users.find((u) => u.id === job.postedBy);
          const text: TextPost = {
            id: `jobpost-${job.id}`,
            userId: job.postedBy,
            text: `${job.title} — ${job.description.slice(0, 120)}${job.description.length > 120 ? "..." : ""}`,
            caption: "New Job",
            category: (job.category as Category) || "other",
            likes: 0,
            views: 0,
            businessName: poster?.name || "Business",
            profileImage: poster?.avatar || "/vercel.svg",
          };
          return { ...s, jobs, textPosts: [text, ...s.textPosts] };
        });
      },
      applyJob(jobId, details) {
        setState((s) => {
          const a: Application = {
            id: `a-${Date.now()}`,
            jobId,
            userId: s.currentUserId,
            coverLetter: details.coverLetter,
            videoUrl: details.videoUrl,
            answers: details.answers || [],
            status: "pending",
            createdAt: Date.now(),
          };
          const applications = [a, ...(s.applications || [])];
          const job = s.jobs.find((j) => j.id === jobId);
          const conversations = { ...s.conversations };
          if (job) {
            const convId = `job-${job.id}`;
            const conv = conversations[convId] || { id: convId, name: `Application: ${job.title}`, messages: [] };
            conv.messages = [...conv.messages, { me: true, text: "Application submitted", createdAt: Date.now() }];
            conversations[convId] = conv;
          }
          const notifications: Notification[] = [
            { id: `n-${Date.now()}`, text: "Application sent", href: "/inbox", createdAt: Date.now() },
            ...s.notifications,
          ];
          return { ...s, applications, conversations, notifications };
        });
      },
      setCurrentUser(userId) {
        setState((s) => ({ ...s, currentUserId: userId }));
      },
      bumpExposure(id, seconds) {
        setState((s) => {
          const old = s.engagement[id] || { watchTime: 0, exposures: 0, profileClicks: 0, contactClicks: 0 };
          return {
            ...s,
            engagement: { ...s.engagement, [id]: { ...old, watchTime: old.watchTime + Math.max(0, seconds), exposures: old.exposures + 1 } },
          };
        });
      },
      trackProfileClick(id) {
        setState((s) => {
          const old = s.engagement[id] || { watchTime: 0, exposures: 0, profileClicks: 0, contactClicks: 0 };
          return {
            ...s,
            engagement: { ...s.engagement, [id]: { ...old, profileClicks: old.profileClicks + 1 } },
          };
        });
      },
      trackContactClick(id) {
        setState((s) => {
          const old = s.engagement[id] || { watchTime: 0, exposures: 0, profileClicks: 0, contactClicks: 0 };
          return {
            ...s,
            engagement: { ...s.engagement, [id]: { ...old, contactClicks: old.contactClicks + 1 } },
          };
        });
      },
      saveCV(cv) {
        setState((s) => ({ ...s, cvs: { ...s.cvs, [s.currentUserId]: cv } }));
      },
      saveCoverLetterTemplate(t) {
        setState((s) => {
          const arr = s.coverLetters[s.currentUserId] || [];
          return { ...s, coverLetters: { ...s.coverLetters, [s.currentUserId]: [t, ...arr].slice(0, 10) } };
        });
      },
      setApplicationStatus(appId, status) {
        setState((s) => {
          const applications = s.applications.map((a) => (a.id === appId ? { ...a, status } : a));
          const app = applications.find((a) => a.id === appId);
          const notifications: Notification[] =
            app
              ? [{ id: `n-${Date.now()}`, text: `Application ${status}`, href: "/inbox", createdAt: Date.now() }, ...s.notifications]
              : s.notifications;
          return { ...s, applications, notifications };
        });
      },
      markNotificationsRead() {
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      setOnboarded(val) {
        setState((s) => ({ ...s, onboarded: val }));
      },
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("missing store");
  return ctx;
}
