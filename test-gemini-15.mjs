import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  console.log("Testing gemini-flash-latest...");
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout!")), 10000));
    const result = await Promise.race([
      model.generateContent("Say hello"),
      timeout
    ]);
    
    console.log("Response:", result.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
