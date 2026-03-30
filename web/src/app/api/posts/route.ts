import { NextResponse } from "next/server";
import { POSTS } from "@/data/posts";

export async function GET() {
  return NextResponse.json(POSTS);
}

