import { chatModel, Provider } from "./lc-model";
import { ReviewResult, codeReviewSchema } from "./schema";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function reviewCodeStructure(code: string, provider: Provider = "Gemini", promptContext?: string): Promise<ReviewResult> {
const systemPrompt = `You are a Principal Software Engineer and Security Architect.
Your job is to provide an ADVANCED, elite-level code review of the provided source code.

You must follow these strict steps:
1. chainOfThought: Write out a highly detailed, step-by-step architectural and security analysis. **CRITICAL TONE REQUIREMENT: Adopt an extremely encouraging, highly professional, and creative tone.** You must structure this section exactly like this:
   - "### What you did perfectly:" (Highlight the good parts, best practices, and clever logic used by the developer)
   - "### Minor Improvements to make it 100% bulletproof:" (Discuss the architectural flaws, OWASP vulnerabilities, Big-O bottlenecks, or logic errors in a constructive way)
2. staticAnalysis: Simulate a strict compiler/linter. Flag syntax errors, unused imports, or bad types.
3. aiReview: Provide actionable, senior-level insights. Focus on advanced bugs, security, and performance.
4. metrics: Provide highly accurate code complexity metrics.
5. fullRefactoredCode: If the user specifically asks to "rewrite", "fix everything", or if there are catastrophic errors, provide the completely rewritten, optimized, and error-free source code.

CRITICAL INSTRUCTION FOR JSON: You MUST properly escape all double quotes (\") and newlines (\\n) inside strings, otherwise the JSON parser will crash.

CRITICAL RULES FOR REFACTORING (ABSOLUTE LAWS):
- DO NOT delete valid framework boilerplate. For example, if you see Next.js 'metadata', 'getServerSideProps', or layout exports, LEAVE THEM ALONE.
- DO NOT remove imports, state variables, or UI components unless they are mathematically proven to be dead code or cause a fatal bug.
- If the user provides code that is already correct and asks you to rewrite it, RETURN THE EXACT SAME CODE UNTOUCHED.
- Never degrade the existing functionality. Your job is to strictly improve or fix bugs.

If the user has provided a specific prompt/context, address their exact requirements deeply in your analysis and refactoring.
Always format your response using the provided structured schema.`;
    
    // 60-second timeout to handle rate limits gracefully
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 120 seconds. This is usually caused by API rate limits (e.g. Too Many Requests) or very large files. Please try a different provider or wait a minute.")), 120000);
    });

    const executionPromise = async () => {
        console.log(`[DEBUG] Starting reviewCodeStructure with provider: ${provider}`);
        const model = chatModel(provider);
        const structuredModel = model.withStructuredOutput(codeReviewSchema);

        const messages: any[] = [
            new SystemMessage(systemPrompt),
        ];

        if (promptContext) {
            messages.push(new HumanMessage(`Additional User Context/Prompt: ${promptContext}`));
        }

        messages.push(new HumanMessage(`Source Code to analyze:\n\n\`\`\`\n${code}\n\`\`\``));

        console.log(`[DEBUG] Calling structuredModel.invoke for code review...`);
        const structuredResponse = await structuredModel.invoke(messages);
        console.log(`[DEBUG] Code review structuredResponse received.`);
        
        return structuredResponse as ReviewResult;
    };

    return Promise.race([executionPromise(), timeoutPromise]);
}
