"use client"

import { InsightCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { insightCardFixtures, insightCardOptions } from "@/fixtures/insight-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function InsightCardDocs() {
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
          InsightCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Structured AI analysis with key metrics, a sentiment-coded recommendation,
          and reasoning. The component every analysis tool needs — turns raw data
          into an actionable insight.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={insightCardFixtures}
          options={insightCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "Analyze our Q4 churn data" },
            {
              role: "assistant",
              content: "Here\u2019s what I found:",
              tool: component,
            },
          ]}
          code={(part) => generateComponentCode("InsightCard", "@taw-ui/react", part)}
        >
          {(part) => <InsightCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add insight-card`}</CodeBlock>
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
import { InsightCardSchema } from "@/components/taw/insight-card"

export const analyzeOrder = tool({
  description: "Analyze an order item",
  parameters: z.object({ orderNumber: z.number() }),
  outputSchema: InsightCardSchema,
  execute: async ({ orderNumber }) => {
    const order = await getOrder(orderNumber)
    const sales = await getSalesHistory(order.productId)
    const coverage = order.stock / sales.avgMonthly

    return {
      id: \`analysis-\${orderNumber}\`,
      title: order.productName,
      subtitle: \`\${order.storeName} · #\${orderNumber}\`,
      metrics: [
        { label: "Stock", value: order.stock, unit: "un" },
        { label: "Monthly Sales", value: sales.avgMonthly },
        { label: "Coverage", value: +coverage.toFixed(1), unit: "months",
          status: coverage < 1 ? "critical" : "good" },
      ],
      recommendation: "Approve — stock is critically low",
      sentiment: "positive",
      confidence: 0.87,
      source: { label: "Siagri", freshness: "live" },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { InsightCard } from "@/components/taw/insight-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  // Handles loading, error, and success states
  return <InsightCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Sentiment ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Sentiment
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          The <InlineCode>sentiment</InlineCode> field controls the recommendation{"'"}s
          visual treatment — color, icon, and accent border. It tells the user at a glance
          whether the AI{"'"}s judgment is favorable, cautious, or negative.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["positive", "negative"] as const).map((key) => (
            <div key={key} className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-4">
              <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">{key}</span>
              <InsightCard part={insightCardFixtures[key]!} animate={false} />
            </div>
          ))}
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
            { field: "animate", type: "boolean", desc: "Enable entrance animations and metric hover (default: true)" },
            { field: "className", type: "string", desc: "Additional CSS classes on the wrapper" },
          ]}
        />
      </section>

      {/* ── Schema ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <div className="space-y-4">
          <SchemaTable
            title="InsightCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier" },
              { field: "title", type: "string", req: true, desc: "Main heading (e.g. product name)" },
              { field: "subtitle", type: "string", desc: "Context line (e.g. store + order number)" },
              { field: "metrics", type: "Metric[]", req: true, desc: "1-8 key metrics to display" },
              { field: "recommendation", type: "string", desc: "Human-readable recommendation" },
              { field: "sentiment", type: '"positive" | "caution" | "negative"', desc: 'Visual treatment for recommendation (default: "caution")' },
              { field: "reasoning", type: "string", desc: "AI explanation of the analysis" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence in this analysis" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance" },
            ]}
          />
          <SchemaTable
            title="Metric"
            fields={[
              { field: "label", type: "string", req: true, desc: "Metric name" },
              { field: "value", type: "string | number", req: true, desc: "Metric value (numbers are auto-formatted)" },
              { field: "unit", type: "string", desc: 'Unit suffix (e.g. "un", "months")' },
              { field: "status", type: '"good" | "warning" | "critical"', desc: "Color-codes the value" },
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
            { icon: "grid", title: "Metrics grid", desc: "Up to 8 key metrics in a responsive grid with status coloring" },
            { icon: "shield", title: "Sentiment-coded recommendation", desc: "Positive (green), caution (amber), negative (red) with SVG icon" },
            { icon: "chat", title: "AI reasoning", desc: "Typewriter-animated explanation of the analysis" },
            { icon: "diamond", title: "Status indicators", desc: "Per-metric status dots — good, warning, critical" },
            { icon: "alert", title: "Confidence + caveat", desc: "AI certainty badge and human-readable uncertainty note" },
            { icon: "zap", title: "Accent strip", desc: "Sentiment-colored left border for instant visual signal" },
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
            { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI notifications" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable data tables" },
          ]}
        />
      </section>
    </div>
  )
}
