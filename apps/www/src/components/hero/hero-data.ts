import type { TawToolPart } from "@taw-ui/react"

// ─── Demo keys ───────────────────────────────────────────────────────────────

export type DemoKey = "kpi" | "table" | "options" | "insight" | "alert"

// ─── Prompt → component routing ──────────────────────────────────────────────

const patterns: Record<DemoKey, string[]> = {
  kpi: [
    "revenue", "sales", "metrics", "growth", "kpi", "numbers",
    "performance", "month", "quarter", "mrr", "arpu", "users",
    "active", "churn", "retention", "dashboard",
  ],
  table: [
    "compare", "table", "campaign", "campaigns", "list", "rows",
    "customers", "rank", "top", "data", "breakdown", "side by side",
  ],
  options: [
    "choose", "options", "next step", "recommend", "suggest", "action",
    "deploy", "what should", "decision", "pick", "steps", "focus",
    "prioritize",
  ],
  insight: [
    "summarize", "insight", "analysis", "analyze", "explain", "report",
    "trend", "summary", "overview", "review", "assessment", "findings",
  ],
  alert: [
    "urgent", "alert", "issue", "risk", "warning", "critical",
    "problem", "error", "incident", "spike", "outage", "down",
    "latency",
  ],
}

export function routePrompt(prompt: string): DemoKey {
  const lower = prompt.toLowerCase()
  let best: DemoKey = "kpi"
  let bestScore = 0

  for (const [key, keywords] of Object.entries(patterns) as [DemoKey, string[]][]) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw)) score += kw.length
    }
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }

  return best
}

// ─── Prompt chips ────────────────────────────────────────────────────────────

export const promptChips = [
  { label: "Show KPIs", prompt: "Show me this month's revenue and growth" },
  { label: "Compare campaigns", prompt: "Compare the last 3 campaigns side by side" },
  { label: "Suggest next steps", prompt: "Recommend what we should focus on next" },
  { label: "Summarize insights", prompt: "Summarize the analysis and key findings" },
  { label: "Show alerts", prompt: "Show me any urgent issues or alerts" },
] as const

// ─── Component meta + AI response text ───────────────────────────────────────

export const demoMeta: Record<DemoKey, {
  component: string
  icon: string
  aiResponse: string
}> = {
  kpi: {
    component: "KpiCard",
    icon: "◎",
    aiResponse: "Here are your key metrics for Q4. Revenue is trending up with strong user growth.",
  },
  table: {
    component: "DataTable",
    icon: "▤",
    aiResponse: "I pulled a comparison of your recent campaigns. Product Hunt had the highest ROI.",
  },
  options: {
    component: "OptionList",
    icon: "☰",
    aiResponse: "Based on current metrics and capacity, here are your best options. I'd recommend starting with onboarding.",
  },
  insight: {
    component: "InsightCard",
    icon: "◆",
    aiResponse: "Here's a summary of this quarter's performance. Growth is strong but churn needs attention.",
  },
  alert: {
    component: "AlertCard",
    icon: "△",
    aiResponse: "I found an active alert that needs your attention. There's a latency spike on 3 endpoints.",
  },
}

// ─── Curated demo fixtures ───────────────────────────────────────────────────

export const demoFixtures: Record<DemoKey, TawToolPart> = {
  kpi: {
    id: "hero-kpi",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: {
      id: "hero-revenue",
      title: "Q4 Performance",
      description: "October through December 2025",
      stats: [
        {
          key: "revenue",
          label: "Revenue",
          value: 847300,
          format: { kind: "currency", currency: "USD", decimals: 0 },
          sparkline: {
            data: [72000, 68000, 74000, 81000, 78000, 85000, 89000, 91000, 86000, 94000, 97000, 102000],
            color: "var(--taw-accent)",
          },
          diff: { value: 12.4, decimals: 1 },
        },
        {
          key: "active-users",
          label: "Active Users",
          value: 24890,
          format: { kind: "number", compact: true },
          sparkline: {
            data: [18200, 19100, 19800, 20400, 21200, 21900, 22600, 23100, 23800, 24200, 24500, 24890],
            color: "var(--taw-success)",
          },
          diff: { value: 8.2, decimals: 1 },
        },
        {
          key: "nps",
          label: "NPS Score",
          value: 72,
          format: { kind: "number" },
          sparkline: {
            data: [58, 61, 64, 62, 65, 68, 66, 69, 70, 71, 71, 72],
          },
          diff: { value: 5.0, decimals: 0 },
        },
      ],
      source: { label: "Stripe + Analytics", freshness: "2 hours ago" },
    },
  },

  table: {
    id: "hero-table",
    toolName: "showTable",
    input: { query: "campaign comparison" },
    state: "output-available",
    output: {
      id: "hero-campaigns",
      title: "Campaign Performance",
      description: "Last 3 campaigns compared side by side",
      columns: [
        { key: "campaign", label: "Campaign", type: "text" },
        { key: "spend", label: "Spend", type: "currency", align: "right", sortable: true, format: { currency: "USD" } },
        { key: "conversions", label: "Conv.", type: "number", align: "right", sortable: true },
        { key: "roi", label: "ROI", type: "percent", align: "right", sortable: true },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { campaign: "Summer Launch", spend: 12400, conversions: 847, roi: 340, status: "Completed" },
        { campaign: "Product Hunt", spend: 3200, conversions: 1203, roi: 580, status: "Completed" },
        { campaign: "Q4 Retarget", spend: 8900, conversions: 612, roi: 210, status: "Active" },
      ],
      total: 3,
      defaultSort: { key: "roi", direction: "desc" },
      source: { label: "Marketing Analytics", freshness: "1 hour ago" },
    },
  },

  options: {
    id: "hero-options",
    toolName: "chooseAction",
    input: { context: "priorities" },
    state: "output-available",
    output: {
      id: "hero-next-steps",
      question: "What should we focus on next?",
      description: "Based on current metrics and team capacity.",
      selectionMode: "single",
      options: [
        {
          id: "onboarding",
          label: "Improve onboarding flow",
          description: "Activation rate dropped 3% this month. Fixing onboarding could recover ~200 users/week.",
          badge: "High Impact",
          recommended: true,
        },
        {
          id: "api-v2",
          label: "Ship API v2",
          description: "14 enterprise customers waiting on new endpoints. Estimated 2-week sprint.",
        },
        {
          id: "mobile",
          label: "Launch mobile app beta",
          description: "60% of traffic is mobile. A native experience could improve retention by ~15%.",
          badge: "Long-term",
        },
      ],
      reasoning: "Onboarding has the highest ROI — low effort with immediate impact on activation and retention.",
      confirmLabel: "Start",
    },
  },

  insight: {
    id: "hero-insight",
    toolName: "analyzeOrderItem",
    input: { query: "q4 review" },
    state: "output-available",
    output: {
      id: "hero-q4-analysis",
      title: "Q4 Revenue Analysis",
      subtitle: "Quarterly Business Review",
      metrics: [
        { label: "Total Revenue", value: "$847K", status: "good" },
        { label: "Growth Rate", value: "12.4%", status: "good" },
        { label: "Churn", value: "2.1%", status: "warning" },
        { label: "Net Retention", value: "118%", status: "good" },
      ],
      recommendation: "Expansion revenue is driving growth, but rising churn in the SMB segment needs attention before Q1.",
      sentiment: "positive",
      reasoning: "Enterprise accounts grew 23% while SMB contracted 4%. Shifting support resources could stabilize SMB retention.",
      confidence: 0.91,
      source: { label: "Revenue Analytics", freshness: "today" },
    },
  },

  alert: {
    id: "hero-alert",
    toolName: "checkAlerts",
    input: {},
    state: "output-available",
    output: {
      id: "hero-latency-alert",
      severity: "warning",
      title: "API latency spike detected",
      description: "P95 response time exceeded 500ms on 3 endpoints in the last 15 minutes.",
      metrics: [
        { label: "P95 Latency", value: "847ms" },
        { label: "Affected", value: "3 endpoints" },
        { label: "Error rate", value: "2.4%" },
      ],
      actions: [
        { id: "investigate", label: "Investigate", primary: true },
        { id: "acknowledge", label: "Acknowledge" },
      ],
      reasoning: "Spike correlates with recent deploy v2.4.1. Consider rollback if latency doesn't recover in 10 minutes.",
      source: { label: "Infrastructure Monitor", freshness: "live" },
    },
  },
}
