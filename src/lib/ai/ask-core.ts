import { chatModel, Provider } from "./lc-model";
import { AskResult, askrequestSchema } from "./schema";
import { tavilySearchTool } from "./tools";
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";

/**
 * Executes a structured query using LCEL-inspired flow and search tools.
 * It distinguishes between queries that need a web search and those that can be answered directly.
 */
export async function askstructure(query: string, provider: Provider = "Gemini"): Promise<AskResult> {
    const systemPrompt = `You are a helpful assistant that can answer questions in a structured format.
    You have access to a web search tool. Use it ONLY if the user's question requires real-time information, 
    current events, weather, or data beyond your knowledge cutoff.
    If the question is general knowledge, mathematical, or logic-based, answer directly.
    
    After gathering any necessary information (with or without tools), provide a comprehensive answer 
    following the requested structure, including a list of URLs or sources if you used the search tool.`;
    
    // Add a strict timeout to prevent infinite hanging when API providers hit rate limits and auto-retry
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 60 seconds. This is usually caused by API rate limits (e.g. Too Many Requests). Please try a different provider or wait a minute.")), 60000);
    });

    const executionPromise = async () => {
        console.log(`[DEBUG] Starting askstructure with provider: ${provider}`);
        const model = chatModel(provider);

        // Bind tools to the model
        const modelWithTools = model.bindTools([tavilySearchTool]);

        // LCEL-like flow: initial call
        console.log(`[DEBUG] Calling modelWithTools.invoke...`);
        const initialResponse = await modelWithTools.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(query)
        ]);
        console.log(`[DEBUG] initialResponse received.`);

        let finalContent = initialResponse.content;
        let sources: string[] = [];

        // Check if tools were called
        if (initialResponse.tool_calls && initialResponse.tool_calls.length > 0) {
            console.log(`[DEBUG] Tools were called:`, initialResponse.tool_calls.map((t: any) => t.name));
            const toolMessages = [];
            for (const toolCall of initialResponse.tool_calls) {
                if (toolCall.name === "tavily_search_results_json") {
                    console.log(`[DEBUG] Calling tavilySearchTool...`);
                    const toolResponse = await tavilySearchTool.invoke(toolCall.args);
                    console.log(`[DEBUG] tavilySearchTool returned.`);
                    const result = typeof toolResponse === "string" ? toolResponse : JSON.stringify(toolResponse);
                    
                    // Try to extract URLs from Tavily results for sources
                    try {
                      const parsed = JSON.parse(result);
                      if (Array.isArray(parsed)) {
                        sources = [...new Set(parsed.map((r: any) => r.url).filter(Boolean))];
                      }
                    } catch (e) {
                      console.error("Failed to parse tool result for sources", e);
                    }

                    toolMessages.push(new ToolMessage({
                        content: result,
                        tool_call_id: toolCall.id!
                    }));
                }
            }

            // Final call to synthesize with tool results
            console.log(`[DEBUG] Calling final model.invoke...`);
            const finalResponse = await model.invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(query),
                initialResponse,
                ...toolMessages
            ]);
            console.log(`[DEBUG] finalResponse received.`);
            finalContent = finalResponse.content;
        }

        // Use structured output to format the final synthesized content
        console.log(`[DEBUG] Calling structuredModel.invoke...`);
        const structuredModel = model.withStructuredOutput(askrequestSchema);
        const structuredResponse = await structuredModel.invoke([
            new SystemMessage(`Format the provided information into the required JSON structure. 
            If sources were provided, include them in the 'sources' array. 
            Current sources: ${sources.join(", ")}`),
            new HumanMessage(String(finalContent))
        ]);
        console.log(`[DEBUG] structuredResponse received.`);
        
        // Ensure sources are included if they were extracted but the model missed them in the final formatting
        if (sources.length > 0 && (!structuredResponse.sources || structuredResponse.sources.length === 0)) {
            structuredResponse.sources = sources;
        }
        
        return structuredResponse as AskResult;
    };

    return Promise.race([executionPromise(), timeoutPromise]);
}
