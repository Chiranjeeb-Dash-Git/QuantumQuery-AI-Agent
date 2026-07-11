import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  console.log("Starting test-gemini...");
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Calling generateContent...");
    
    // Add a simple timeout promise race
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout!")), 10000));
    const result = await Promise.race([
      model.generateContent("Hello, world!"),
      timeout
    ]);
    
    console.log("Response:", result.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
