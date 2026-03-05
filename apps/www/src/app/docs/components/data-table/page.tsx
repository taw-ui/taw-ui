"use client"

import { DataTable } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import { dataTableFixtures } from "@/fixtures/data-table"

export default function DataTableDocs() {
  return (
    <div className="space-y-10">
      <div>
        <span className="mb-2 block font-pixel text-[10px] uppercase tracking-[0.15em] text-[--taw-accent]">
          Data
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[--taw-text-primary]">
          DataTable
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[--taw-text-secondary]">
          Sortable table with rich column formatting — currency, percent, delta,
          status badges, dates, links, and booleans. Client-side sorting with
          staggered row animations.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-pixel text-[11px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
          Preview
        </h2>
        <ComponentPreview fixtures={dataTableFixtures}>
          {(part) => <DataTable part={part} />}
        </ComponentPreview>
      </section>

      <section>
        <h2 className="mb-4 font-pixel text-[11px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
          Usage
        </h2>
        <CodeBlock label="usage.tsx">{`import { DataTable } from "@taw-ui/react"

<DataTable part={part} />`}</CodeBlock>
      </section>

      <section>
        <h2 className="mb-4 font-pixel text-[11px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
          Column Types
        </h2>
        <div className="overflow-x-auto rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-sm]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[--taw-border] bg-[--taw-surface]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Type</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Renders as</th>
              </tr>
            </thead>
            <tbody className="bg-[--taw-surface-raised]">
              {[
                ["text", "Plain string (default)"],
                ["number", "Locale-formatted number with optional decimals"],
                ["currency", "Currency-formatted with symbol (configurable via format.currency)"],
                ["percent", "Signed percentage with color coding (green positive, red negative)"],
                ["delta", "Arrow + signed number with color coding"],
                ["date", "Locale-formatted date (short month, day, year)"],
                ["badge", "Pill badge with accent color"],
                ["link", "Clickable link with dotted underline"],
                ["boolean", "Checkmark (true) or cross (false)"],
              ].map(([type, desc]) => (
                <tr key={type} className="border-b border-[--taw-border] last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[--taw-accent]">{type}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[--taw-text-muted]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-pixel text-[11px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
          Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Client-side sorting", desc: "Click column headers to toggle asc/desc/none" },
            { title: "9 column format types", desc: "Rich formatting without custom renderers" },
            { title: "Cross-field validation", desc: "defaultSort.key must exist in columns, caught at parse time" },
            { title: "Row count + source", desc: "Footer shows row count and data provenance" },
            { title: "Staggered entrance", desc: "Rows animate in sequence on first render" },
          ].map(({ title, desc }) => (
            <div key={title} className="rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] px-4 py-3 shadow-[--taw-shadow-sm]">
              <span className="block text-[13px] font-medium text-[--taw-text-primary]">{title}</span>
              <p className="mt-0.5 text-[12px] text-[--taw-text-muted]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
