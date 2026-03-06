"use client"

import { DataTable } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { dataTableFixtures, dataTableOptions } from "@/fixtures/data-table"
import { CopyPage } from "@/components/copy-page"

export default function DataTableDocs() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Data
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          DataTable
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Sortable table with rich column formatting — currency, percent, delta,
          status badges, dates, links, and booleans. Client-side sorting with
          staggered row animations.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Preview
        </h2>
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
          code={`import { DataTable } from "@/components/taw/data-table"

<DataTable part={part} />`}
        >
          {(part) => <DataTable part={part} />}
        </ComponentPreview>
      </section>

      {/* Features */}
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
          ]}
        />
      </section>

      {/* Column Types */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Column Types
        </h2>
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

      {/* Related */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Related
        </h2>
        <RelatedComponents
          items={[
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
