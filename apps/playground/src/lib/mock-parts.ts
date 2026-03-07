import type { TawToolPart, TawPartState } from "taw-ui"

export function mockPart<T>(
  toolName: string,
  output: T,
  state: TawPartState = "output-available",
): TawToolPart<unknown, T> {
  return {
    id: crypto.randomUUID(),
    toolName,
    input: {},
    output: state === "output-available" ? output : undefined,
    error: state === "output-error" ? "Upstream API returned 503" : undefined,
    state,
  }
}

export const mocks = {
  kpiCard: {
    loading: mockPart("getMetrics", null, "input-available"),
    streaming: mockPart("getMetrics", null, "streaming"),
    error: mockPart("getMetrics", null, "output-error"),
    single: mockPart("getMetrics", {
      id: "revenue",
      stats: [{ key: "revenue", label: "Monthly Revenue", value: 142580,
        format: { kind: "currency", currency: "USD" },
        diff: { value: 12.4 },
        sparkline: { data: [95000, 108000, 122000, 135000, 142580] }
      }],
      confidence: 0.92,
      source: { label: "Stripe", freshness: "2 min ago" }
    }),
    multi: mockPart("getMetrics", {
      id: "overview",
      title: "Business Overview",
      stats: [
        { key: "revenue", label: "Revenue", value: 142580, format: { kind: "currency", currency: "USD" }, diff: { value: 12.4 } },
        { key: "users", label: "Active Users", value: 8420, diff: { value: -2.1 } },
        { key: "churn", label: "Churn Rate", value: 2.3, format: { kind: "percent" }, diff: { value: 0.4 } },
      ]
    }),
    lowConfidence: mockPart("getMetrics", {
      id: "est",
      stats: [{ key: "forecast", label: "Q4 Forecast", value: 89000, format: { kind: "currency", currency: "USD" } }],
      confidence: 0.41
    }),
    invalidData: mockPart("getMetrics", { title: "Revenue", amount: 142580 }),
  },

  dataTable: {
    loading: mockPart("getTable", null, "input-available"),
    error: mockPart("getTable", null, "output-error"),
    basic: mockPart("getTable", {
      id: "sales",
      title: "Sales Pipeline",
      columns: [
        { key: "name", label: "Company", type: "text", sortable: true },
        { key: "revenue", label: "Revenue", type: "currency", sortable: true, align: "right", format: { currency: "USD" } },
        { key: "growth", label: "Growth", type: "percent", align: "right", sortable: true },
        { key: "status", label: "Status", type: "badge" },
      ],
      rows: [
        { name: "Acme Corp", revenue: 245000, growth: 12.3, status: "Active" },
        { name: "Globex", revenue: 189000, growth: -3.2, status: "At Risk" },
        { name: "Initech", revenue: 320000, growth: 8.1, status: "Active" },
        { name: "Hooli", revenue: 95000, growth: 24.5, status: "New" },
      ],
      total: 12,
      source: { label: "CRM", freshness: "5 min ago" }
    }),
  },

  optionList: {
    loading: mockPart("getOptions", null, "input-available"),
    error: mockPart("getOptions", null, "output-error"),
    single: mockPart("getOptions", {
      id: "plan",
      question: "Which pricing plan fits your needs?",
      description: "Choose the plan that best matches your usage.",
      options: [
        { id: "free", label: "Free", description: "Up to 100 requests/month", badge: "Free" },
        { id: "pro", label: "Pro", description: "10,000 requests/month + priority support", recommended: true },
        { id: "enterprise", label: "Enterprise", description: "Unlimited + SLA + dedicated account manager" },
      ],
      reasoning: "Based on your current usage of ~5,000 requests/month, Pro would be the best fit.",
      confirmLabel: "Select Plan",
    }),
    multi: mockPart("getOptions", {
      id: "features",
      question: "Which features do you want to enable?",
      selectionMode: "multi",
      maxSelections: 3,
      options: [
        { id: "analytics", label: "Analytics Dashboard" },
        { id: "api", label: "API Access", recommended: true },
        { id: "sso", label: "SSO Integration" },
        { id: "audit", label: "Audit Logs" },
      ],
      confirmLabel: "Enable Features",
    }),
  },

  linkCard: {
    loading: mockPart("getLink", null, "input-available"),
    error: mockPart("getLink", null, "output-error"),
    basic: mockPart("getLink", {
      id: "vercel-ai",
      url: "https://sdk.vercel.ai/docs",
      title: "Vercel AI SDK Documentation",
      description: "The Vercel AI SDK is a TypeScript toolkit designed to help you build AI-powered applications with React, Next.js, and more.",
      domain: "sdk.vercel.ai",
      reason: "This is the primary SDK you'll use for integrating taw-ui components with your chat interface.",
      confidence: 0.95,
    }),
    withImage: mockPart("getLink", {
      id: "blog-post",
      url: "https://vercel.com/blog/ai-sdk-5",
      title: "Introducing AI SDK 5.0",
      description: "AI SDK 5.0 brings structured tool call parts, streaming improvements, and better type safety.",
      image: "https://vercel.com/_next/image?url=https://assets.vercel.com/image/upload/v1/front/blog/ai-sdk-5.png&w=1200&q=75",
      domain: "vercel.com",
      publishedAt: "Mar 2025",
    }),
  },

  insightCard: {
    loading: mockPart("getInsight", null, "input-available"),
    error: mockPart("getInsight", null, "output-error"),
    positive: mockPart("getInsight", {
      id: "growth",
      title: "Revenue Growth Analysis",
      subtitle: "Q1 2025 vs Q4 2024",
      sentiment: "positive",
      metrics: [
        { label: "Revenue", value: "$142K", status: "good" },
        { label: "Growth", value: "+12.4%", status: "good" },
        { label: "New Customers", value: 48, status: "good" },
        { label: "Churn", value: "2.1%", status: "warning" },
      ],
      recommendation: "Continue investing in the current acquisition channels. Consider addressing churn in the SMB segment.",
      confidence: 0.88,
      source: { label: "Analytics", freshness: "1 hour ago" },
    }),
    negative: mockPart("getInsight", {
      id: "alert",
      title: "Infrastructure Cost Alert",
      sentiment: "negative",
      metrics: [
        { label: "Monthly Cost", value: "$12,400", status: "critical" },
        { label: "vs Budget", value: "+34%", status: "critical" },
      ],
      recommendation: "Review and optimize cloud resource allocation. Consider reserved instances for predictable workloads.",
      caveat: "Cost data may not include recent spot instance savings.",
      confidence: 0.72,
    }),
  },

  alertCard: {
    loading: mockPart("getAlert", null, "input-available"),
    error: mockPart("getAlert", null, "output-error"),
    warning: mockPart("getAlert", {
      id: "rate-limit",
      severity: "warning",
      title: "API Rate Limit Approaching",
      description: "You've used 85% of your monthly API quota.",
      metrics: [
        { label: "Used", value: "8,500" },
        { label: "Limit", value: "10,000" },
        { label: "Days Left", value: 12 },
      ],
      actions: [
        { id: "upgrade", label: "Upgrade Plan", primary: true },
        { id: "dismiss", label: "Dismiss" },
      ],
      source: { label: "API Gateway" },
    }),
    critical: mockPart("getAlert", {
      id: "outage",
      severity: "critical",
      title: "Database Connection Failed",
      description: "Primary database is unreachable. Failover in progress.",
      actions: [
        { id: "retry", label: "Retry Connection", primary: true },
        { id: "status", label: "View Status" },
      ],
    }),
    info: mockPart("getAlert", {
      id: "update",
      severity: "info",
      title: "New Version Available",
      description: "taw-ui v0.1.0 is available with improved dark mode support.",
      actions: [
        { id: "update", label: "Update Now", primary: true },
        { id: "later", label: "Later" },
      ],
    }),
  },

  memoryCard: {
    loading: mockPart("getMemories", null, "input-available"),
    error: mockPart("getMemories", null, "output-error"),
    basic: mockPart("getMemories", {
      id: "user-prefs",
      title: "What I Remember About You",
      description: "Review and correct my understanding. I'll only keep what you confirm.",
      memories: [
        { id: "m1", content: "You prefer TypeScript with strict mode enabled", category: "preference", confidence: 0.95, learnedFrom: "Multiple conversations" },
        { id: "m2", content: "Your main project uses Next.js 15 with App Router", category: "fact", confidence: 0.88, learnedFrom: "Project setup discussion" },
        { id: "m3", content: "You work at a restaurant tech company called Unem", category: "fact", confidence: 0.92 },
        { id: "m4", content: "You dislike over-engineered abstractions", category: "preference", confidence: 0.85 },
        { id: "m5", content: "You might be using Tailwind CSS v4", category: "assumption", confidence: 0.6 },
      ],
      caveat: "These memories are based on our conversations. Some may be outdated.",
    }),
  },
}
