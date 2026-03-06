"use client"

import { KpiCard } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/react"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon } from "@/components/pixel-icon"

const demoPart: TawToolPart = {
  id: "demo",
  toolName: "getMetrics",
  input: { metric: "users" },
  state: "output-available",
  output: {
    id: "active-users",
    stats: [
      {
        key: "users",
        label: "Active Users",
        value: 8421,
        format: { kind: "number", compact: true },
        diff: { value: 4.2 },
        sparkline: {
          data: [7200, 7400, 7600, 7800, 8000, 8100, 8200, 8300, 8421],
          color: "var(--taw-accent)",
        },
      },
    ],
    source: { label: "Analytics API", freshness: "just now" },
  },
}

export default function QuickStartPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Guide
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Quick Start
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-(--taw-text-secondary)">
          One command. Your code. Full ownership.
        </p>
      </div>

      <section className="space-y-4">
        <CodeBlock label="terminal">{`npm i taw-ui
npx taw-ui add kpi-card`}</CodeBlock>

        <CodeBlock label="server.ts — define tool">{`import { KpiCardSchema } from "@/components/taw/kpi-card"

const getMetrics = tool({
  description: "Get business metrics",
  parameters: z.object({ metric: z.string() }),
  outputSchema: KpiCardSchema,
  execute: async ({ metric }) => ({
    id: metric,
    stats: [{
      key: "users",
      label: "Active Users",
      value: 8421,
      format: { kind: "number", compact: true },
      diff: { value: 4.2 },
    }],
    source: { label: "Analytics API", freshness: "just now" },
  }),
})`}</CodeBlock>

        <CodeBlock label="chat.tsx — render component">{`import { KpiCard } from "@/components/taw/kpi-card"

<KpiCard part={part} />`}</CodeBlock>
      </section>

      <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-5 shadow-(--taw-shadow-sm)">
        <KpiCard part={demoPart} />
      </div>

      <p className="text-[13px] leading-relaxed text-(--taw-text-muted)">
        Every component handles loading, error, and success states automatically.
        Components are copied into <InlineCode>@/components/taw/</InlineCode> — you own the
        UI and can customize anything. Shared types and validation come from
        the <InlineCode>taw-ui</InlineCode> npm package so contracts stay versioned.
        Override any <InlineCode>--taw-*</InlineCode> CSS variable to match your theme.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, caveat, receipts" },
          { href: "/docs/principles", label: "Principles", desc: "Design philosophy & HAI contract" },
          { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
          { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable rich tables" },
          { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices" },
          { href: "/docs/components/insight-card", label: "InsightCard", desc: "Structured AI analysis" },
          { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI alerts" },
          { href: "/docs/components/link-card", label: "LinkCard", desc: "Rich link previews" },
        ].map(({ href, label, desc }) => (
          <a
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3.5 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent) hover:shadow-(--taw-shadow-md)"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent-subtle) text-(--taw-accent) transition-colors group-hover:bg-(--taw-accent) group-hover:text-white">
              <PixelIcon name="arrow-right" size={12} />
            </div>
            <div>
              <span className="block text-[13px] font-medium text-(--taw-text-primary)">{label}</span>
              <span className="text-[11px] text-(--taw-text-muted)">{desc}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
