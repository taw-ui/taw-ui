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
import { CopyPage } from "@/components/copy-page"

export default function InsightCardDocs() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Display
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          InsightCard
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Structured AI analysis with key metrics, a sentiment-coded recommendation,
          and reasoning. The component every analysis tool needs — turns raw data
          into an actionable insight.
        </p>
      </div>

      {/* States */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Preview
        </h2>
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
          code={`import { InsightCard } from "@/components/taw/insight-card"

<InsightCard part={part} />`}
        >
          {(part) => <InsightCard part={part} />}
        </ComponentPreview>
      </section>

      {/* Define the Tool */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Define the Tool
        </h2>
        <CodeBlock label="Vercel AI SDK">{`import { tool } from "ai"
import { InsightCardSchema } from "@/components/taw/insight-card"

export const analyzeOrder = tool({
  description: "Analyze an order item with sales history and stock context",
  parameters: z.object({ orderNumber: z.number() }),
  outputSchema: InsightCardSchema,
  execute: async ({ orderNumber }) => {
    const order = await getOrder(orderNumber)
    const sales = await getSalesHistory(order.productId, order.storeId)
    const velocity = sales.avgMonthly
    const coverage = order.currentStock / velocity

    return {
      id: \`analysis-\${orderNumber}\`,
      title: order.productName,
      subtitle: \`\${order.storeName} · Pedido #\${orderNumber}\`,
      metrics: [
        { label: "Estoque Atual", value: order.currentStock, unit: "un", status: coverage < 1 ? "critical" : coverage < 2 ? "warning" : undefined },
        { label: "Venda Mensal", value: velocity, unit: "un/mês" },
        { label: "Cobertura", value: +coverage.toFixed(1), unit: "meses", status: coverage < 1 ? "critical" : undefined },
        { label: "Tendência", value: sales.trend },
      ],
      recommendation: coverage < 1 ? "Aprovar — estoque crítico" : "Reduzir quantidade",
      sentiment: coverage < 1 ? "positive" : "caution",
      reasoning: \`Estoque cobre \${coverage.toFixed(1)} meses de vendas.\`,
      confidence: 0.87,
      source: { label: "Siagri + Sales", freshness: "live" },
    }
  },
})`}</CodeBlock>
      </section>

      {/* Sentiments */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Sentiment
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          The <InlineCode>sentiment</InlineCode> field controls the recommendation{"'"}s
          visual treatment — color, icon, and border. It tells the user at a glance
          whether the AI{"'"}s judgment is favorable, cautious, or negative.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["positive", "negative"] as const).map((key) => (
            <div key={key} className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-4">
              <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">{key}</span>
              <InsightCard part={insightCardFixtures[key]!} animate={false} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "grid", title: "Metrics grid", desc: "Up to 8 key metrics in a responsive grid with status coloring" },
            { icon: "shield", title: "Sentiment-coded recommendation", desc: "Positive (green), caution (amber), negative (red) with icon" },
            { icon: "chat", title: "AI reasoning", desc: "Typewriter-animated explanation of the analysis" },
            { icon: "diamond", title: "Status indicators", desc: "Per-metric status coloring — good, warning, critical" },
            { icon: "alert", title: "Confidence + caveat", desc: "AI certainty level and human-readable uncertainty note" },
            { icon: "schema", title: "Source attribution", desc: "Shows where the analysis data came from" },
          ]}
        />
      </section>

      {/* Schema */}
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
              { field: "unit", type: "string", desc: "Unit suffix (e.g. \"un\", \"meses\")" },
              { field: "status", type: '"good" | "warning" | "critical"', desc: "Color-codes the value" },
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
            { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI notifications" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Single metric display" },
            { href: "/docs/components/option-list", label: "OptionList", desc: "Decision support with receipts" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable data tables" },
          ]}
        />
      </section>
    </div>
  )
}
