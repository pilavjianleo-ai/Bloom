import { USERS } from "@/data/users";
import type { TextPost, Category } from "@/types";

const sampleTexts = [
  "Pro tip: Vinegar + baking soda can clear mild drain clogs.",
  "Question: Why does my breaker trip when I run the microwave and toaster?",
  "Idea: A routine maintenance checklist for renters.",
  "Tip: Schedule barber appointments 3–4 weeks out to keep a fresh look.",
  "Question: Best cordless drill for small home projects?",
];

const categories: Category[] = ["cleaning", "electrical", "handyman", "beauty", "other"];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

export const TEXT_POSTS: TextPost[] = Array.from({ length: 8 }).map((_, i) => {
  const u = USERS[(i + 1) % USERS.length];
  return {
    id: `text-${i + 1}`,
    userId: u.id,
    text: pick(sampleTexts, i),
    caption: "Quick post",
    category: pick(categories, i),
    likes: 50 + i * 3,
    views: 800 + i * 17,
    businessName: u.name,
    profileImage: u.avatar,
  };
});

