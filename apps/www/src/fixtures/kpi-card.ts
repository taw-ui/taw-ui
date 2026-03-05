import type { TawToolPart } from "@taw-ui/core"

export const kpiCardFixtures: Record<string, TawToolPart> = {
  loading: {
    id: "kpi-1",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "input-available",
  },
  ready: {
    id: "kpi-2",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: {
      id: "revenue-q4",
      label: "Revenue",
      value: 142580,
      unit: "$",
      delta: 12.4,
      trend: "up" as const,
      trendPositive: true,
      confidence: 0.92,
      source: {
        label: "Stripe Dashboard",
        freshness: "2 hours ago",
        url: "https://dashboard.stripe.com",
      },
      description: "Monthly recurring revenue for Q4 2025",
    },
  },
  "low-confidence": {
    id: "kpi-3",
    toolName: "getMetrics",
    input: { metric: "churn" },
    state: "output-available",
    output: {
      id: "churn-rate",
      label: "Churn Rate",
      value: 4.7,
      unit: "%",
      delta: 0.8,
      trend: "up" as const,
      trendPositive: false,
      confidence: 0.45,
      source: { label: "Estimated from partial data" },
    },
  },
  error: {
    id: "kpi-4",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-error",
    error: "API rate limit exceeded. Retry after 30s.",
  },
  "parse-error": {
    id: "kpi-5",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: { title: "Revenue", amount: 142580 },
  },
}
