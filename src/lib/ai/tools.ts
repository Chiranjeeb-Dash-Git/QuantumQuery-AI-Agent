import { tool } from "@langchain/core/tools";
import { tavily } from "@tavily/core";
import { z } from "zod";

/**
 * A custom tool that uses the Tavily API to perform web searches.
 */
export const tavilySearchTool = tool(
  async ({ query }) => {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const searchContext = await tvly.search(query, {
      searchDepth: "basic",
      maxResults: 5,
    });
    return JSON.stringify(searchContext);
  },
  {
    name: "tavily_search_results_json",
    description: "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query.",
    schema: z.object({
      query: z.string().describe("The search query to look up."),
    }),
  }
);
