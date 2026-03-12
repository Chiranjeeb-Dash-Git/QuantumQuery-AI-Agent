import { NextResponse } from "next/server";
import { askstructure } from "@/lib/ai/ask-core";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Call the AI logic directly instead of proxying to a separate backend
    const result = await askstructure(query);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in Next.js AI API route:", error);

    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message,
        message: "Check your API keys and provider configuration in .env.local"
      },
      { status: 500 }
    );
  }
}
