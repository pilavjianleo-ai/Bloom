import { NextResponse } from "next/server";

const notifications = [
  { id: "n1", text: "Ana the Electrician followed you" },
  { id: "n2", text: "PlumbPro replied to your question with a video" },
  { id: "n3", text: "Your post reached 1,200 views" },
];

export async function GET() {
  return NextResponse.json(notifications);
}

