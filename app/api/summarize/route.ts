import { NextRequest, NextResponse } from "next/server";
import { generateWeeklySummary } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { commits } = body;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      return NextResponse.json(
        { error: "Invalid commits data" },
        { status: 400 }
      );
    }

    const summary = await generateWeeklySummary(commits);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
