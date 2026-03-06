"use client"

import { DataTable } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { dataTableFixtures, dataTableOptions } from "@/fixtures/data-table"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function DataTableDocs() {
  return (
    <div className="space-y-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Data
          </span>
          <ComponentNav />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          DataTable
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Sortable table with rich column formatting — currency, percent, delta,
          status badges, dates, links, and booleans. Client-side sorting with
          staggered row animations.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={dataTableFixtures}
          options={dataTableOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "Show me our top customers" },
            {
              role: "assistant",
              content: "Here are the top customers by revenue:",
              tool: component,
            },
          ]}
          code={(part) => generateComponentCode("DataTable", "@taw-ui/react", part)}
        >
          {(part) => <DataTable part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add data-table`}</CodeBlock>
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
import { DataTableSchema } from "@/components/taw/data-table"

export const showTable = tool({
  description: "Show data in a sortable table",
  parameters: z.object({ query: z.string() }),
  outputSchema: DataTableSchema,
  execute: async ({ query }) => {
    const result = await queryDatabase(query)
    return {
      id: slugify(query),
      title: result.title,
      columns: result.columns.map(c => ({
        key: c.key,
        label: c.label,
        type: c.type,
        sortable: true,
      })),
      rows: result.rows,
      total: result.total,
      defaultSort: { key: "revenue", direction: "desc" },
      source: { label: "Database", freshness: "just now" },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { DataTable } from "@/components/taw/data-table"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  // Handles loading, error, and success states
  return <DataTable part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Column Types ───────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Column Types
        </h2>
        <p className="mb-4 text-[13px] text-(--taw-text-muted)">
          9 built-in column types handle formatting without custom renderers.
        </p>
        <SchemaTable
          fields={[
            { field: "text", type: "default", desc: "Plain string" },
            { field: "number", type: "format", desc: "Locale-formatted number with optional decimals" },
            { field: "currency", type: "format", desc: "Currency-formatted with symbol (configurable via format.currency)" },
            { field: "percent", type: "format", desc: "Signed percentage with color coding (green/red)" },
            { field: "delta", type: "format", desc: "Arrow + signed number with color coding" },
            { field: "date", type: "format", desc: "Locale-formatted date (short month, day, year)" },
            { field: "badge", type: "visual", desc: "Pill badge with accent color" },
            { field: "link", type: "visual", desc: "Clickable link with dotted underline" },
            { field: "boolean", type: "visual", desc: "Checkmark (true) or cross (false)" },
          ]}
        />
      </section>

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state — handles loading, error, and success" },
            { field: "animate", type: "boolean", desc: "Enable stagger row animations (default: true)" },
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
          Cross-field validation ensures <code className="text-(--taw-accent)">defaultSort.key</code> exists
          in your columns — caught at parse time, not at render.
        </p>
        <div className="space-y-4">
          <SchemaTable
            title="DataTableSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier" },
              { field: "title", type: "string", desc: "Table header title" },
              { field: "description", type: "string", desc: "Subtitle below the title" },
              { field: "columns", type: "Column[]", req: true, desc: "Column definitions (min 1)" },
              { field: "rows", type: "Record[]", req: true, desc: "Row data as key-value objects" },
              { field: "total", type: "number", desc: "Total row count (for pagination context)" },
              { field: "defaultSort", type: "{ key, direction }", desc: "Initial sort column and direction" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence badge" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance (label + freshness)" },
            ]}
          />
          <SchemaTable
            title="Column"
            fields={[
              { field: "key", type: "string", req: true, desc: "Maps to row data keys" },
              { field: "label", type: "string", req: true, desc: "Column header text" },
              { field: "type", type: "ColumnType", desc: 'One of 9 types (default: "text")' },
              { field: "align", type: '"left" | "center" | "right"', desc: 'Text alignment (default: "left")' },
              { field: "sortable", type: "boolean", desc: "Enable sort on this column (default: false)" },
              { field: "width", type: "string", desc: "CSS width (e.g. \"120px\", \"20%\")" },
              { field: "format", type: "{ currency?, decimals? }", desc: "Extra formatting options for currency/number types" },
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
            { icon: "triangle", title: "Client-side sorting", desc: "Click column headers to toggle asc/desc/none" },
            { icon: "grid", title: "9 column format types", desc: "Rich formatting without custom renderers" },
            { icon: "schema", title: "Cross-field validation", desc: "defaultSort.key must exist in columns, caught at parse time" },
            { icon: "receipt", title: "Row count + source", desc: "Footer shows row count and data provenance" },
            { icon: "diamond", title: "Staggered entrance", desc: "Rows animate in sequence on first render" },
            { icon: "alert", title: "Helpful errors", desc: "Invalid columns show field-level details with suggestions" },
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
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/insight-card", label: "InsightCard", desc: "Structured AI analysis" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
