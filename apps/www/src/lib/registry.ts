export interface ComponentMeta {
  id: string
  label: string
  description: string
  category: "display" | "interactive" | "data"
  status: "ready" | "coming-soon"
}

export const components: ComponentMeta[] = [
  {
    id: "kpi-card",
    label: "KpiCard",
    description: "Single metric display with animated value, delta, confidence, and source.",
    category: "display",
    status: "ready",
  },
  {
    id: "data-table",
    label: "DataTable",
    description: "Sortable table with rich column formatting — currency, percent, delta, badges.",
    category: "data",
    status: "ready",
  },
  {
    id: "option-list",
    label: "OptionList",
    description: "Interactive choice list with scoring, reasoning, and receipt pattern.",
    category: "interactive",
    status: "ready",
  },
  {
    id: "link-card",
    label: "LinkCard",
    description: "Rich link preview with OG metadata, favicon, AI reasoning, and confidence.",
    category: "display",
    status: "ready",
  },
  {
    id: "memory-card",
    label: "MemoryCard",
    description: "Transparent AI memory viewer with per-item confidence, categories, and review verdicts.",
    category: "interactive",
    status: "ready",
  },
  {
    id: "insight-card",
    label: "InsightCard",
    description: "Structured AI analysis with metrics, sentiment-coded recommendation, and reasoning.",
    category: "display",
    status: "ready",
  },
  {
    id: "alert-card",
    label: "AlertCard",
    description: "Proactive AI notification with severity levels, inline metrics, and action buttons.",
    category: "interactive",
    status: "ready",
  },
  {
    id: "chart",
    label: "Chart",
    description: "Line, bar, area, scatter, pie, and donut charts via Recharts.",
    category: "data",
    status: "coming-soon",
  },
]

export const categories = {
  display: { label: "Display", order: 1 },
  interactive: { label: "Interactive", order: 2 },
  data: { label: "Data", order: 3 },
} as const
