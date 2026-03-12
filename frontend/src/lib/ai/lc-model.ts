import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type Provider = "OpenAI" | "Groq" | "Gemini";

export function chatModel(requestedProvider: Provider): any {
    // Check for forced provider from env, otherwise use the requested one
    const envProvider = (process.env.FORCE_PROVIDER || process.env.PROVIDER || "").toLowerCase();
    let provider: Provider = requestedProvider;
    
    if (envProvider === "openai") provider = "OpenAI";
    else if (envProvider === "groq") provider = "Groq";
    else if (envProvider === "gemini") provider = "Gemini";

    const baseConfig = { temperature: 0 };

    switch (provider) {
        case "OpenAI":
            if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI api key is not present!");
            return new ChatOpenAI({
                ...baseConfig,
                model: "gpt-4o-mini",
            });
        case "Groq":
            if (!process.env.GROQ_API_KEY) throw new Error("Groq api key is not present!");
            return new ChatGroq({
                ...baseConfig,
                model: "llama-3.3-70b-versatile",
                apiKey: process.env.GROQ_API_KEY,
            });
        case "Gemini":
            if (!process.env.GEMINI_API_KEY) throw new Error("Gemini api key is not present!");
            return new ChatGoogleGenerativeAI({
                ...baseConfig,
                model: "gemini-2.0-flash",
                apiKey: process.env.GEMINI_API_KEY,
            });
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
