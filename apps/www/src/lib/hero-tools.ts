import { tool } from "ai"
import { z } from "zod"

export const heroTools = {
  getMetrics: tool({
    description:
      "Show KPI metrics like revenue, active users, NPS. Use when the user asks for metrics, KPIs, numbers, revenue, growth, or performance data.",
    inputSchema: z.object({
      metric: z.string().describe("The metric to display"),
    }),
    execute: async () => ({
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
    }),
  }),

  showTable: tool({
    description:
      "Show a data table for comparisons, campaigns, rankings. Use when the user asks to compare, rank, list, or show tabular data.",
    inputSchema: z.object({
      query: z.string().describe("What to show in the table"),
    }),
    execute: async () => ({
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
    }),
  }),

  chooseAction: tool({
    description:
      "Present options or next steps for the user to choose from. Use when the user asks for recommendations, suggestions, actions, priorities, or next steps.",
    inputSchema: z.object({
      context: z.string().describe("Context for what decisions to present"),
    }),
    execute: async () => ({
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
    }),
  }),

  analyzeData: tool({
    description:
      "Show an insight or analysis card with metrics and recommendation. Use when the user asks to summarize, analyze, explain, or review data.",
    inputSchema: z.object({
      query: z.string().describe("What to analyze"),
    }),
    execute: async () => ({
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
    }),
  }),

  checkAlerts: tool({
    description:
      "Show alerts, warnings, or urgent issues. Use when the user asks about issues, risks, alerts, incidents, or problems.",
    inputSchema: z.object({
      scope: z.string().optional().describe("Scope of alerts to check"),
    }),
    execute: async () => ({
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
    }),
  }),
}

export const toolToComponent: Record<string, string> = {
  getMetrics: "KpiCard",
  showTable: "DataTable",
  chooseAction: "OptionList",
  analyzeData: "InsightCard",
  checkAlerts: "AlertCard",
}
