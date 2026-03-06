"use client"

import { KpiCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { kpiCardFixtures, kpiCardOptions } from "@/fixtures/kpi-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function KpiCardDocs() {
  return (
    <div className="space-y-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Display
          </span>
          <ComponentNav />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          KpiCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Display 1–4 metrics in a responsive grid with background sparklines,
          animated values, delta indicators, and locale-aware formatting.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
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
          code={(part) => generateComponentCode("KpiCard", "@taw-ui/react", part)}
        >
          {(part) => <KpiCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add kpi-card`}</CodeBlock>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          This copies the component source and schema into your project.
          You own the code — customize anything.
        </p>
      </section>

      {/* ── Usage ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server — define tool">{`import { tool } from "ai"
import { KpiCardSchema } from "@/components/taw/kpi-card"

export const getMetrics = tool({
  description: "Get business metrics",
  parameters: z.object({ metric: z.string() }),
  outputSchema: KpiCardSchema,
  execute: async ({ metric }) => {
    const data = await fetchMetric(metric)
    return {
      id: metric,
      stats: [{
        key: metric,
        label: data.name,
        value: data.value,
        format: { kind: "currency", currency: "USD" },
        diff: { value: data.change },
        sparkline: { data: data.history },
      }],
      source: { label: "Stripe", freshness: "just now" },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { KpiCard } from "@/components/taw/kpi-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  // Handles loading, error, and success states
  return <KpiCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Examples ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Examples
        </h2>
        <p className="mb-5 text-[13px] text-(--taw-text-muted)">
          The layout adapts automatically based on the number of stats.
          1 stat renders as a hero, 2–4 as a 2-column grid.
        </p>
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

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state — handles loading, error, and success" },
            { field: "animate", type: "boolean", desc: "Enable spring animations and sparkline draw-in (default: true)" },
            { field: "locale", type: "string", desc: "BCP 47 locale for number/currency formatting (e.g. \"en-US\")" },
            { field: "className", type: "string", desc: "Additional CSS classes on the wrapper" },
          ]}
        />
      </section>

      {/* ── Schema ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <p className="mb-4 text-[13px] text-(--taw-text-muted)">
          The tool output shape validated by the component. Invalid data renders a
          helpful error with field-level suggestions.
        </p>
        <div className="space-y-4">
          <SchemaTable
            title="KpiCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier" },
              { field: "title", type: "string", desc: "Card header title" },
              { field: "description", type: "string", desc: "Card header subtitle" },
              { field: "stats", type: "StatItem[]", req: true, desc: "1–4 metric items (see below)" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence badge" },
              { field: "caveat", type: "string", desc: "Uncertainty note from the AI" },
              { field: "source", type: "Source", desc: "Data provenance (label + freshness)" },
            ]}
          />
          <SchemaTable
            title="StatItem"
            fields={[
              { field: "key", type: "string", req: true, desc: "Unique identifier for this stat" },
              { field: "label", type: "string", req: true, desc: "Label displayed above the value" },
              { field: "value", type: "number | string", req: true, desc: "The metric value — numbers animate on entrance" },
              { field: "format", type: "StatFormat", desc: "Formatting: currency, number, percent, or text" },
              { field: "diff", type: "StatDiff", desc: "Delta indicator with value, decimals, upIsPositive" },
              { field: "sparkline", type: "StatSparkline", desc: "Background trend chart: { data: number[], color?: string }" },
            ]}
          />
          <SchemaTable
            title="StatFormat"
            fields={[
              { field: "kind", type: '"currency" | "number" | "percent" | "text"', req: true, desc: "Format type" },
              { field: "currency", type: "string", desc: "ISO currency code (required for currency kind)" },
              { field: "decimals", type: "number", desc: "Decimal places" },
              { field: "compact", type: "boolean", desc: "Compact notation for large numbers (number kind)" },
              { field: "basis", type: '"unit" | "fraction"', desc: "Whether value is already a percentage or 0–1 (percent kind)" },
            ]}
          />
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "zap", title: "Spring-animated numbers", desc: "Values count up using spring physics, not linear interpolation" },
            { icon: "grid", title: "Background sparklines", desc: "Full-bleed SVG area charts with draw-in animation and hover reveal" },
            { icon: "arrow-right", title: "Delta indicators", desc: "Color-coded badges with configurable upIsPositive for metrics like churn" },
            { icon: "schema", title: "Format options", desc: "Currency, percent, number, text — locale-aware with compact notation" },
            { icon: "diamond", title: "Adaptive layout", desc: "1 stat = hero mode, 2–4 = 2-column grid with subtle dividers" },
            { icon: "alert", title: "Helpful errors", desc: "Parse failures render field-level details with suggestions, never silent null" },
          ]}
        />
      </section>

      {/* ── Related ─────────────────────────────────────────────────────── */}
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
