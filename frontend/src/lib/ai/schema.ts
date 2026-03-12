import z from "zod";

export const askrequestSchema = z.object({
  summary: z.string().min(1, "Summary is required").max(1000, "Summary must be at most 1000 characters"),
  short: z.string().min(1, "Short summary is required").max(500, "Short summary must be at most 500 characters"),
  paragraph: z.string().min(1, "Paragraph is required").max(5000, "Paragraph must be at most 5000 characters"),
  confidence: z.number().min(0).max(1),
  confidenceDescription: z.string().min(1, "Confidence description is required").max(1000, "Confidence description must be at most 1000 characters"),
  sources: z.array(z.string()).optional().describe("List of URLs or source names used to gather information, especially for web searches."),
});

export type AskResult = z.infer<typeof askrequestSchema>;
