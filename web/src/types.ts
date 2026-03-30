export type Category =
  | "plumbing"
  | "electrical"
  | "beauty"
  | "fitness"
  | "cleaning"
  | "handyman"
  | "auto"
  | "other";

export type Role = "user" | "expert" | "business";

export type ContentType = "question" | "solution" | "tip";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  bio?: string;
  website?: string;
  links?: string[];
  verified?: boolean;
  premium?: boolean;
  followers: number;
  following: number;
  location?: string;
  peopleHelped?: number;
  answersGiven?: number;
  helpfulScore?: number;
  // Skill System
  skills?: string[];
  verifiedSkills?: string[];
  skillLevel?: "beginner" | "intermediate" | "expert" | "master";
  activityScore?: number;
  opportunityScore?: number;
  topPercentile?: number; // e.g., 10 for "Top 10% in category"
  cv?: {
    experience?: {
      role: string;
      company: string;
      start: string;
      end?: string;
      description?: string;
    }[];
  };
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  text: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
  replies?: Comment[];
  likes?: number;
  isHelpful?: boolean;
}

export interface Post {
  id: string;
  videoUrl: string;
  businessName: string;
  profileImage: string;
  caption: string;
  category: Category;
  likes: number;
  views: number;
  businessId: string;
  description?: string;
  type?: ContentType | "skill_demo" | "answer" | "service";
  userId?: string;
  sponsored?: boolean;
  saved?: boolean;
  bestAnswer?: boolean;
  threadId?: string;
  // Skill System
  skillTags?: string[];
  isVerifiedSkill?: boolean;
}

export interface Business {
  id: string;
  name: string;
  logo: string;
  description: string;
  categories: Category[];
  verified?: boolean;
  premium?: boolean;
  rating?: number;
  reviews?: Review[];
  jobsCompleted?: number;
  location?: string;
}

export interface TextPost {
  id: string;
  userId: string;
  text: string;
  caption: string;
  category: Category;
  likes: number;
  views: number;
  businessName: string;
  profileImage: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  image?: string;
  members: string[]; // user IDs
  category: Category | "general";
  isPrivate?: boolean;
}

export interface GroupPost extends TextPost {
  groupId: string;
}

export type FeedItem = Post | TextPost | GroupPost;

export interface Job {
  id: string;
  title: string;
  description: string;
  category?: Category;
  location: string;
  postedBy: string; // userId or business id
  createdAt: number;
  jobType?: "full-time" | "part-time" | "freelance" | "contract" | "collab";
  salary?: string;
  requirements?: string[];
  deadline?: number;
  questions?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  videoUrl?: string;
  answers?: string[];
  status?: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface CVExperience {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
}

export interface CVEducation {
  school: string;
  degree: string;
  year?: string;
}

export interface CV {
  name: string;
  summary?: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: string[];
  certifications?: string[];
  links?: string[];
}
