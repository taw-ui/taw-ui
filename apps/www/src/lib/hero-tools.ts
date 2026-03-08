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
      source: { label: "Revenue Analytics", freshness: "today" },
    }),
  }),

  checkAlerts: tool({
    description:
      "Show alerts, warnings, or urgent issues. Use when the user asks about alerts, incidents, or system problems.",
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
      source: { label: "Infrastructure Monitor", freshness: "live" },
    }),
  }),

  showLink: tool({
    description:
      "Show a link preview card with OG metadata. Use when the user asks to preview a URL, share a link, or show a resource.",
    inputSchema: z.object({
      url: z.string().describe("The URL to preview"),
    }),
    execute: async () => ({
      id: "hero-link",
      url: "https://taw-ui.dev/docs/overview",
      title: "taw-ui — The interface layer for the HAI era",
      description: "Schema-first components that turn structured AI outputs into beautiful, actionable interfaces. Build the UI your AI should have returned.",
      image: "https://taw-ui.dev/og.png",
      favicon: "https://taw-ui.dev/favicon.ico",
      domain: "taw-ui.dev",
      source: { label: "Web", freshness: "cached" },
    }),
  }),

  recallMemory: tool({
    description:
      "Show stored memories or context about the user. Use when the user asks what you remember, know about them, or their preferences.",
    inputSchema: z.object({
      topic: z.string().describe("What to recall"),
    }),
    execute: async () => ({
      id: "hero-memory",
      title: "What I know about you",
      description: "Memories stored from our previous conversations.",
      memories: [
        {
          id: "m1",
          content: "Prefers dark mode across all tools and interfaces",
          category: "preference",
          learnedFrom: "Settings discussion on Jan 12",
          confidence: 0.98,
        },
        {
          id: "m2",
          content: "Works on a SaaS product in the developer tools space",
          category: "context",
          learnedFrom: "Product review session",
          confidence: 0.92,
        },
        {
          id: "m3",
          content: "Team uses Linear for issue tracking and GitHub for code",
          category: "fact",
          learnedFrom: "Workflow discussion",
          confidence: 0.95,
        },
        {
          id: "m4",
          content: "Likely interested in AI-powered features based on recent queries",
          category: "assumption",
          learnedFrom: "Inferred from conversation patterns",
          confidence: 0.72,
        },
      ],
      source: { label: "Memory Store", freshness: "up to date" },
    }),
  }),

  showIssue: tool({
    description:
      "Show an issue or ticket from a tracker like GitHub or Linear. Use when the user asks about bugs, tickets, issues, PRs, or tasks.",
    inputSchema: z.object({
      issue: z.string().describe("The issue to display"),
    }),
    execute: async () => ({
      id: "hero-issue",
      provider: "github",
      title: "Auth tokens expire silently when clock skew exceeds 30s",
      number: 1847,
      status: { label: "Open", color: "#22c55e" },
      priority: "high",
      assignee: { name: "Sarah Chen" },
      labels: [
        { name: "bug", color: "#dc2626" },
        { name: "auth", color: "#7c3aed" },
      ],
      project: "taw-ui",
      createdAt: "2026-03-05T10:30:00Z",
      updatedAt: "2026-03-07T16:45:00Z",
      description: "Users with system clocks ahead by >30s get logged out without warning. Need to add clock drift tolerance to token validation.",
      source: { label: "GitHub", freshness: "2 hours ago" },
    }),
  }),

  showEvent: tool({
    description:
      "Show a calendar event or meeting. Use when the user asks about their schedule, meetings, calendar, or upcoming events.",
    inputSchema: z.object({
      query: z.string().describe("What event to show"),
    }),
    execute: async () => ({
      id: "hero-event",
      provider: "google",
      title: "Q1 Planning — Product & Engineering",
      startAt: "2026-03-10T14:00:00Z",
      endAt: "2026-03-10T15:30:00Z",
      description: "Review Q4 outcomes, align on Q1 OKRs, and finalize the roadmap for the next sprint cycle.",
      location: "Conference Room A / Zoom",
      meetingUrl: "https://zoom.us/j/123456789",
      status: "confirmed",
      organizer: { name: "Alex Rivera", email: "alex@company.com" },
      attendees: [
        { name: "Alex Rivera", responseStatus: "accepted" },
        { name: "Sarah Chen", responseStatus: "accepted" },
        { name: "Jordan Kim", responseStatus: "tentative" },
        { name: "Maya Patel", responseStatus: "needsAction" },
      ],
      calendarName: "Work",
      source: { label: "Google Calendar", freshness: "synced" },
    }),
  }),

  showPost: tool({
    description:
      "Show a social media post from X, Instagram, or LinkedIn. Use when the user asks about posts, tweets, social media, or mentions.",
    inputSchema: z.object({
      query: z.string().describe("What post to show"),
    }),
    execute: async () => ({
      id: "hero-post",
      provider: "x",
      author: {
        name: "taw-ui",
        handle: "@taw_ui",
        isVerified: true,
      },
      body: "Just shipped v2.0 — 11 schema-first components, dark mode theming, and a CLI that feels like magic. ✦\n\nBuild the UI your AI should have returned.\n\nnpx taw-ui init",
      postedAt: "2026-03-07T18:30:00Z",
      metrics: {
        likes: 1247,
        reposts: 389,
        comments: 94,
        views: 48200,
      },
      tags: ["taw-ui", "AI", "devtools", "opensource"],
      source: { label: "X API", freshness: "3 hours ago" },
    }),
  }),
}

export const toolToComponent: Record<string, string> = {
  getMetrics: "KpiCard",
  showTable: "DataTable",
  chooseAction: "OptionList",
  analyzeData: "InsightCard",
  checkAlerts: "AlertCard",
  showLink: "LinkCard",
  recallMemory: "MemoryCard",
  showIssue: "IssueCard",
  showEvent: "EventCard",
  showPost: "PostCard",
}
