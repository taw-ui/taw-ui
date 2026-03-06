import type { TawToolPart } from "@taw-ui/react"

export const kpiCardFixtures: Record<string, TawToolPart> = {
  ready: {
    id: "kpi-1",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: {
      id: "revenue-q4",
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
          key: "churn",
          label: "Churn Rate",
          value: 2.1,
          format: { kind: "percent", decimals: 1, basis: "unit" },
          sparkline: {
            data: [3.2, 3.0, 2.8, 2.9, 2.7, 2.5, 2.4, 2.3, 2.2, 2.1, 2.1, 2.1],
            color: "var(--taw-warning)",
          },
          diff: { value: -0.8, decimals: 1, upIsPositive: false },
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
      confidence: 0.92,
      source: {
        label: "Stripe + Analytics",
        freshness: "2 hours ago",
      },
    },
  },
  "single": {
    id: "kpi-single",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: {
      id: "revenue-hero",
      stats: [
        {
          key: "revenue",
          label: "Revenue",
          value: 142580,
          format: { kind: "currency", currency: "USD", decimals: 0 },
          sparkline: {
            data: [95000, 98000, 102000, 108000, 115000, 122000, 130000, 135000, 138000, 142580],
            color: "var(--taw-accent)",
          },
          diff: { value: 12.4, decimals: 1 },
        },
      ],
      caveat: "Based on partial data — full sync completes tonight",
      source: {
        label: "Stripe Dashboard",
        freshness: "just now",
        url: "https://dashboard.stripe.com",
      },
    },
  },
  "two-stats": {
    id: "kpi-two",
    toolName: "getMetrics",
    input: { metric: "overview" },
    state: "output-available",
    output: {
      id: "two-kpis",
      stats: [
        {
          key: "mrr",
          label: "MRR",
          value: 48200,
          format: { kind: "currency", currency: "USD", decimals: 0 },
          sparkline: {
            data: [31000, 33500, 36200, 38000, 40100, 42800, 44500, 46000, 47200, 48200],
            color: "var(--taw-accent)",
          },
          diff: { value: 6.3, decimals: 1 },
        },
        {
          key: "customers",
          label: "Customers",
          value: 1284,
          format: { kind: "number" },
          sparkline: {
            data: [890, 940, 980, 1020, 1060, 1110, 1150, 1200, 1245, 1284],
            color: "var(--taw-success)",
          },
          diff: { value: 3.1, decimals: 1 },
        },
      ],
    },
  },
  "three-stats": {
    id: "kpi-three",
    toolName: "getMetrics",
    input: { metric: "overview" },
    state: "output-available",
    output: {
      id: "three-kpis",
      stats: [
        {
          key: "latency",
          label: "P95 Latency",
          value: 142,
          format: { kind: "text" },
          sparkline: {
            data: [180, 175, 168, 155, 150, 148, 145, 143, 142, 142],
            color: "var(--taw-success)",
          },
          diff: { value: -21.1, decimals: 1, upIsPositive: false },
        },
        {
          key: "uptime",
          label: "Uptime",
          value: 99.98,
          format: { kind: "percent", decimals: 2, basis: "unit" },
        },
        {
          key: "errors",
          label: "Error Rate",
          value: 0.02,
          format: { kind: "percent", decimals: 2, basis: "unit" },
          diff: { value: -0.01, decimals: 2, upIsPositive: false },
        },
      ],
      source: { label: "Datadog", freshness: "5 min ago" },
    },
  },
  loading: {
    id: "kpi-loading",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "input-available",
  },
  error: {
    id: "kpi-error",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-error",
    error: "API rate limit exceeded. Retry after 30s.",
  },
  "parse-error": {
    id: "kpi-parse",
    toolName: "getMetrics",
    input: { metric: "revenue" },
    state: "output-available",
    output: { title: "Revenue", amount: 142580 },
  },
}

export const kpiCardOptions = [
  { key: "title", label: "title", defaultOn: true },
  { key: "description", label: "description", defaultOn: true },
  { key: "diff", label: "diff %", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: true },
]
