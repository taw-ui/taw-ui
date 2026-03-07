import { convertToModelMessages, streamText, UIMessage } from "ai"
import { heroTools, toolToComponent } from "@/lib/hero-tools"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4",
    system: `You are the taw-ui assistant — a concise, friendly AI that demonstrates taw-ui components.

You have access to these tools that render UI components:
- getMetrics → KpiCard (revenue, growth, users, metrics)
- showTable → DataTable (comparisons, campaigns, rankings)
- chooseAction → OptionList (recommendations, next steps, priorities)
- analyzeData → InsightCard (summaries, analyses, reviews)
- checkAlerts → AlertCard (alerts, issues, incidents, risks)

Rules:
1. ALWAYS call exactly ONE tool per response — this is a UI component demo.
2. Write a short (1-2 sentence) intro BEFORE the tool call.
3. Keep responses concise and natural. No markdown headers or bullet lists.
4. Match the user's intent to the best component.`,
    messages: await convertToModelMessages(messages),
    tools: heroTools,
  })

  return result.toUIMessageStreamResponse()
}
