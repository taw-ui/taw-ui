"use client"

import Link from "next/link"

const components = [
  {
    name: "KpiCard",
    slug: "kpi-card",
    description: "Displays key performance indicators with sparklines, diffs, and confidence badges.",
  },
  {
    name: "DataTable",
    slug: "data-table",
    description: "Sortable data table with typed columns, currency/percent formatting, and badges.",
  },
  {
    name: "OptionList",
    slug: "option-list",
    description: "Interactive single or multi-select option list with confirmation and receipt state.",
  },
  {
    name: "LinkCard",
    slug: "link-card",
    description: "Rich link preview card with title, description, domain, and optional image.",
  },
  {
    name: "InsightCard",
    slug: "insight-card",
    description: "Insight summary with sentiment, metrics, recommendations, and confidence.",
  },
  {
    name: "AlertCard",
    slug: "alert-card",
    description: "Severity-based alert with metrics, actions, and receipt state.",
  },
  {
    name: "MemoryCard",
    slug: "memory-card",
    description: "Memory review card with confirm/dismiss/correct actions per memory item.",
  },
]

export default function PlaygroundIndex() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Components</h1>
      <p className="mb-8 text-sm text-zinc-400">
        Click a component to see all states and variants.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {components.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="group rounded-lg border border-zinc-800 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-900/50"
          >
            <h2 className="mb-1 text-sm font-semibold group-hover:text-white">
              {c.name}
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              {c.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
