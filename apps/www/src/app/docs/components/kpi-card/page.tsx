"use client"

import { KpiCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { kpiCardFixtures, kpiCardOptions } from "@/fixtures/kpi-card"
import { CopyPage } from "@/components/copy-page"

export default function KpiCardDocs() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Display
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          KpiCard
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Display 1–4 metrics in a responsive grid with sparklines,
          delta indicators, and locale-aware formatting.
        </p>
      </div>

      {/* Live preview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Preview
        </h2>
        <ComponentPreview
          fixtures={kpiCardFixtures}
          options={kpiCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "What's our Q4 performance looking like?" },
            {
              role: "assistant",
              content: "Here's the overview:",
              tool: component,
            },
          ]}
          code={`import { KpiCard } from "@/components/taw/kpi-card"

<KpiCard part={part} />

// Schema: 1–4 stats with sparklines
{
  id: "q4-performance",
  title: "Q4 Performance",
  stats: [
    {
      key: "revenue",
      label: "Revenue",
      value: 847300,
      format: { kind: "currency", currency: "USD" },
      sparkline: { data: [72000, 81000, 94000, 102000] },
      diff: { value: 12.4 },
    },
    // ... up to 4 stats
  ],
}`}
        >
          {(part) => <KpiCard part={part} />}
        </ComponentPreview>
      </section>

      {/* Layouts */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Layouts
        </h2>
        <div className="space-y-6">
          {(["single", "two-stats", "three-stats", "ready"] as const).map((key) => {
            const fixture = kpiCardFixtures[key]
            if (!fixture) return null
            const count = (fixture.output as { stats?: unknown[] })?.stats?.length ?? 0
            return (
              <div key={key}>
                <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">
                  {count} stat{count !== 1 ? "s" : ""} — {key}
                </span>
                <KpiCard part={fixture} animate={false} />
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "zap", title: "Spring-animated numbers", desc: "Values count up using spring physics, not linear interpolation" },
            { icon: "grid", title: "Background sparklines", desc: "Full-bleed SVG area charts behind each stat cell — plus inline sparklines in hero mode" },
            { icon: "arrow-right", title: "Delta indicators", desc: "Green/red with configurable upIsPositive for metrics like churn" },
            { icon: "schema", title: "Format options", desc: "Currency, percent, number, text — locale-aware formatting" },
            { icon: "diamond", title: "2×2 grid layout", desc: "1 stat = hero mode, 2–4 = consistent 2-column grid with 1px dividers" },
            { icon: "alert", title: "Helpful errors", desc: "Parse failures render with field-level suggestions, never silent null" },
          ]}
        />
      </section>

      {/* Schema */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <SchemaTable
          title="KpiCardSchema"
          fields={[
            { field: "id", type: "string", req: true, desc: "Stable identifier" },
            { field: "title", type: "string", desc: "Card header title" },
            { field: "description", type: "string", desc: "Card header subtitle" },
            { field: "stats", type: "StatItem[]", req: true, desc: "1–4 metric items (see below)" },
            { field: "confidence", type: "number (0-1)", desc: "AI confidence score" },
            { field: "source", type: "Source", desc: "Data provenance display" },
            { field: "caveat", type: "string", desc: "Uncertainty note from the AI" },
          ]}
        />
        <div className="mt-6">
          <SchemaTable
            title="StatItem"
            fields={[
              { field: "key", type: "string", req: true, desc: "Unique identifier for this stat" },
              { field: "label", type: "string", req: true, desc: "Label displayed above the value" },
              { field: "value", type: "number | string", req: true, desc: "The metric value — numbers animate on entrance" },
              { field: "format", type: "StatFormat", desc: "Formatting: { kind: \"currency\", currency: \"USD\" } or \"number\", \"percent\", \"text\"" },
              { field: "diff", type: "StatDiff", desc: "Delta indicator: { value: 12.4, upIsPositive: true }" },
              { field: "sparkline", type: "StatSparkline", desc: "Mini trend chart: { data: number[], color?: string }" },
            ]}
          />
        </div>
      </section>

      {/* Related */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Related
        </h2>
        <RelatedComponents
          items={[
            { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable rich tables" },
            { href: "/docs/components/insight-card", label: "InsightCard", desc: "Structured AI analysis" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
