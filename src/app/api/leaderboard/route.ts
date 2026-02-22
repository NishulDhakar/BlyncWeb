import { NextResponse } from "next/server";
import { getLeaderboard } from "@/actions/leaderboard";

export async function GET(request: Request) {
  try {
     const data = await getLeaderboard('overall');
     return NextResponse.json(data);
  } catch (error) {
     return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
