import { NextResponse } from "next/server";

const trending = ["leak", "breaker", "fade", "cleaning", "smart home"];

export async function GET() {
  return NextResponse.json(trending);
}

