import { NextResponse } from "next/server";
import { BUSINESSES, POSTS } from "@/data/posts";
import { USERS } from "@/data/users";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const business = BUSINESSES.find((b) => b.id === id) || null;
  const user = USERS.find((u) => u.id === id) || null;
  const items = POSTS.filter((p) => p.businessId === id);
  return NextResponse.json({ business, user, items });
}

