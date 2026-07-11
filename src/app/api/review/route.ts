import { NextRequest, NextResponse } from "next/server";
import { reviewCodeStructure } from "@/lib/ai/review-core";

export async function POST(req: NextRequest) {
  try {
    const { code, provider, promptContext } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid code provided" },
        { status: 400 }
      );
    }

    const result = await reviewCodeStructure(code, provider, promptContext);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Code Review Error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        message: "Failed to perform code review. Please try again."
      },
      { status: 500 }
    );
  }
}
