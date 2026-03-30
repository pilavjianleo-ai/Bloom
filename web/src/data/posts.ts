import type { Post, Business, Category } from "@/types";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "plumbing", label: "Plumbing" },
  { key: "electrical", label: "Electrical" },
  { key: "beauty", label: "Beauty" },
  { key: "fitness", label: "Fitness" },
  { key: "cleaning", label: "Cleaning" },
  { key: "handyman", label: "Handyman" },
  { key: "auto", label: "Auto" },
  { key: "other", label: "Other" },
];

export const BUSINESSES: Business[] = [
  {
    id: "plumb-pro",
    name: "PlumbPro Services",
    logo:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop",
    description:
      "Local certified plumbers fixing leaks, clogs, and installs with 24/7 support.",
    categories: ["plumbing"],
    verified: true,
    premium: true,
    rating: 4.9,
    reviews: [
      {
        id: "r1",
        userId: "u-jordan",
        rating: 5,
        text: "Fast response and fixed the leak in no time.",
      },
    ],
    jobsCompleted: 1280,
    location: "Stockholm",
  },
  {
    id: "spark-electric",
    name: "Spark Electric Co",
    logo:
      "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?q=80&w=200&auto=format&fit=crop",
    description:
      "Licensed electricians for home and small business — safe, reliable, guaranteed.",
    categories: ["electrical"],
    verified: true,
    rating: 4.7,
    jobsCompleted: 740,
    location: "Gothenburg",
  },
  {
    id: "fade-studio",
    name: "Fade Studio Barbers",
    logo:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=200&auto=format&fit=crop",
    description:
      "Modern cuts and beard trims. Walk-ins welcome. Look sharp, feel sharp.",
    categories: ["beauty"],
    rating: 4.8,
    jobsCompleted: 2200,
    location: "Malmö",
  },
];

export const POSTS: Post[] = [
  {
    id: "p1",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    businessName: "PlumbPro Services",
    profileImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop",
    caption: "How to fix a leaky faucet in under 5 minutes 🔧💧 #plumbing",
    category: "plumbing",
    likes: 1240,
    views: 45000,
    businessId: "b-plumbpro",
    userId: "b-plumbpro",
    type: "skill_demo",
    skillTags: ["Pipe Repair", "Maintenance"],
    isVerifiedSkill: true,
  },
  {
    id: "p2",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    businessName: "Ana the Electrician",
    profileImage:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=200&auto=format&fit=crop",
    caption: "Common wiring mistakes to avoid during a renovation ⚡",
    category: "electrical",
    likes: 892,
    views: 22000,
    businessId: "e-ana",
    userId: "e-ana",
    type: "skill_demo",
    skillTags: ["Wiring", "Safety"],
    isVerifiedSkill: true,
  },
  {
    id: "p3",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    businessName: "Ron the Barber",
    profileImage:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=200&auto=format&fit=crop",
    caption: "Clean fade process. Precision is everything ✂️💈",
    category: "beauty",
    likes: 3400,
    views: 120000,
    businessId: "e-ron",
    userId: "e-ron",
    type: "skill_demo",
    skillTags: ["Fades", "Styling"],
  },
];

export function categoriesFromPosts(posts: Post[]): Category[] {
  return Array.from(new Set(posts.map((p) => p.category)));
}
