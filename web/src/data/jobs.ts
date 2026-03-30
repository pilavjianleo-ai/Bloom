import type { Job } from "@/types";
import { USERS } from "@/data/users";

export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Electrician for kitchen remodel",
    description: "Install outlets and lighting for a small kitchen. Must be certified.",
    category: "electrical",
    location: "Gothenburg",
    postedBy: USERS.find((u) => u.role === "business")?.id || "b-plumbpro",
    createdAt: Date.now() - 86400000 * 3,
    jobType: "contract",
    salary: "SEK 350-500/h",
    requirements: ["Certified electrician", "2+ years experience", "Own tools"],
    deadline: Date.now() + 86400000 * 10,
    questions: ["Describe a similar project you completed", "When are you available?"],
  },
  {
    id: "j2",
    title: "Plumbing maintenance for apartments",
    description: "Routine check and minor fixes for 12 units. Flexible schedule.",
    category: "plumbing",
    location: "Stockholm",
    postedBy: "b-plumbpro",
    createdAt: Date.now() - 86400000 * 5,
    jobType: "part-time",
    requirements: ["Licensed plumber", "Reliable and punctual"],
    deadline: Date.now() + 86400000 * 14,
  },
  {
    id: "j3",
    title: "Barber collab: content shoot",
    description: "Looking for a creator to film transformations and tips.",
    category: "beauty",
    location: "Malmö",
    postedBy: "e-ron",
    createdAt: Date.now() - 86400000,
    jobType: "collab",
    questions: ["Link to your portfolio", "What kind of content would you propose?"],
  },
];
