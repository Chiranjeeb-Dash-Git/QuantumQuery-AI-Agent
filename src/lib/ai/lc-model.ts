import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type Provider = "OpenAI" | "Groq" | "Gemini";

export function chatModel(requestedProvider: Provider): any {
    // Check for forced provider from env, otherwise use the requested one
    const envProvider = (process.env.FORCE_PROVIDER || "").toLowerCase();
    let provider: Provider = requestedProvider;
    
    if (envProvider === "openai") provider = "OpenAI";
    else if (envProvider === "groq") provider = "Groq";
    else if (envProvider === "gemini") provider = "Gemini";

    const baseConfig = { temperature: 0, maxRetries: 1 };

    switch (provider) {
        case "OpenAI":
            if (!process.env.OPENAI_API_KEY?.trim()) throw new Error("OpenAI api key is not present!");
            return new ChatOpenAI({
                model: "gpt-4o",
                temperature: 0.1,
                apiKey: process.env.OPENAI_API_KEY?.trim(),
            });
        case "Groq":
            if (!process.env.GROQ_API_KEY?.trim()) throw new Error("Groq api key is not present!");
            return new ChatGroq({
                ...baseConfig,
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                maxTokens: 8192,
                apiKey: process.env.GROQ_API_KEY?.trim(),
            });
        case "Gemini":
            if (!process.env.GEMINI_API_KEY?.trim()) throw new Error("Gemini api key is not present!");
            return new ChatGoogleGenerativeAI({
                model: "gemini-1.5-pro",
                temperature: 0.1,
                apiKey: process.env.GEMINI_API_KEY?.trim(),
            });
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
