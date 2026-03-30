import { NextResponse } from "next/server";
import { USERS } from "@/data/users";

export async function GET() {
  return NextResponse.json(USERS);
}

