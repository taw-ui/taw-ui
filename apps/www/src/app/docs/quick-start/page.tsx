"use client"

import { KpiCard } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/core"
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
    label: "Active Users",
    value: 8421,
    delta: 340,
    trend: "up",
    confidence: 0.87,
    source: { label: "Analytics API", freshness: "just now" },
  },
}

function Step({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="relative pb-8">
      {/* Connector line (desktop only) */}
      <div className="absolute left-[15px] top-10 hidden h-[calc(100%-2.5rem)] w-px bg-[--taw-border] sm:block" />

      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--taw-accent] font-pixel text-[12px] font-bold text-white shadow-[0_1px_3px_oklch(0_0_0/0.2),inset_0_1px_0_oklch(1_0_0/0.15)]">
          {number}
        </div>
        <h3 className="text-[15px] font-semibold text-[--taw-text-primary]">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-3 sm:pl-11">
        {children}
      </div>
    </div>
  )
}

export default function QuickStartPage() {
  return (
    <div className="space-y-12">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
              Guide
            </span>
            <span className="font-mono text-[11px] text-[--taw-text-muted]">~5 min</span>
          </div>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[--taw-text-primary]">
          Quick Start
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[--taw-text-secondary]">
          Get a taw-ui component rendering in your app in under 5 minutes.
          Works with any AI SDK or standalone.
        </p>
      </div>

      {/* Steps */}
      <section>
        <Step number={1} title="Install packages">
          <CodeBlock label="terminal">{`pnpm add @taw-ui/core @taw-ui/react framer-motion`}</CodeBlock>
          <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
            <InlineCode>@taw-ui/core</InlineCode> is Zod-only (schemas + types).{" "}
            <InlineCode>@taw-ui/react</InlineCode> has the components.{" "}
            <InlineCode>framer-motion</InlineCode> is a peer dependency for animations.
          </p>
        </Step>

        <Step number={2} title="Add CSS variables">
          <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
            Add these to your global CSS. taw-ui uses CSS custom properties
            with oklch for perceptual uniformity — no Tailwind theme extension needed.
          </p>
          <CodeBlock label="globals.css">{`/* Light — Alucard (warm cream + purple) */
:root {
  --taw-surface: oklch(0.965 0.008 85);
  --taw-surface-raised: oklch(0.985 0.006 85);
  --taw-surface-sunken: oklch(0.945 0.010 85);
  --taw-border: oklch(0.88 0.015 85);
  --taw-text-primary: oklch(0.22 0.04 290);
  --taw-text-muted: oklch(0.52 0.04 290);
  --taw-accent: oklch(0.55 0.20 295);
  --taw-radius: 8px;
}

/* Dark — Dracula (deep blue-purple + vivid) */
.dark {
  --taw-surface: oklch(0.22 0.025 280);
  --taw-surface-raised: oklch(0.27 0.025 280);
  --taw-surface-sunken: oklch(0.18 0.025 280);
  --taw-border: oklch(0.32 0.03 280);
  --taw-text-primary: oklch(0.95 0.01 90);
  --taw-text-muted: oklch(0.55 0.04 270);
  --taw-accent: oklch(0.72 0.16 295);
}`}</CodeBlock>
        </Step>

        <Step number={3} title="Render your first component">
          <CodeBlock label="tool-result.tsx">{`import { KpiCard } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/core"

function ToolResult({ part }: { part: TawToolPart }) {
  return <KpiCard part={part} />
}`}</CodeBlock>
          <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
            That{"'"}s it. The component handles loading (skeleton), error (red
            panel with suggestions), and success (animated entrance) automatically.
          </p>
          <div className="mt-3 overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface-sunken] p-5 shadow-[--taw-shadow-sm]">
            <KpiCard part={demoPart} />
          </div>
        </Step>

        <Step number={4} title="Define your tool (server-side)">
          <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
            Use the same Zod schema on both server and client. Here are examples
            for the three major SDKs:
          </p>

          <div className="space-y-3">
            <CodeBlock label="Vercel AI SDK">{`import { tool } from "ai"
import { KpiCardSchema } from "@taw-ui/core"

export const getMetrics = tool({
  description: "Get a business metric",
  parameters: z.object({ metric: z.string() }),
  outputSchema: KpiCardSchema,
  execute: async ({ metric }) => ({
    id: metric,
    label: "Active Users",
    value: 8421,
    confidence: 0.87,
    source: { label: "Analytics" },
  }),
})`}</CodeBlock>

            <CodeBlock label="Anthropic SDK">{`import Anthropic from "@anthropic-ai/sdk"
import { KpiCardSchema } from "@taw-ui/core"
import { zodToJsonSchema } from "zod-to-json-schema"

const tools = [{
  name: "getMetrics",
  description: "Get a business metric",
  input_schema: zodToJsonSchema(
    z.object({ metric: z.string() })
  ),
}]

// After tool execution, validate with:
const data = KpiCard.parse(toolOutput)
// Returns { data, error, success }`}</CodeBlock>

            <CodeBlock label="OpenAI SDK">{`import { zodFunction } from "openai/helpers/zod"
import { KpiCardSchema } from "@taw-ui/core"

const tools = [
  zodFunction({
    name: "getMetrics",
    parameters: z.object({ metric: z.string() }),
  }),
]

// After tool execution, validate with:
const data = KpiCard.parse(toolOutput)`}</CodeBlock>
          </div>
        </Step>

        <Step number={5} title="Use the registry for multiple tools">
          <CodeBlock label="registry.ts">{`import {
  KpiCard, DataTable, OptionList,
  createTawRegistry, TawRenderer,
} from "@taw-ui/react"

const registry = createTawRegistry({
  getMetrics: KpiCard,
  showTable: DataTable,
  chooseAction: OptionList,
})

// Routes part.toolName → correct component
function ToolOutput({ part }) {
  return <TawRenderer registry={registry} part={part} />
}`}</CodeBlock>
          <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
            The registry maps tool names to components. <InlineCode>TawRenderer</InlineCode> reads{" "}
            <InlineCode>part.toolName</InlineCode> and renders the right component. In development,
            it warns when no component is registered for a tool name.
          </p>
        </Step>
      </section>

      {/* What's next */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          What{"'"}s Next
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { href: "/docs/principles", label: "Principles", desc: "The HAI contract & design rules" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, confidence, receipts" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "9 column format types" },
            { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices" },
            { href: "/docs/components/link-card", label: "LinkCard", desc: "Rich link previews" },
          ].map(({ href, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] px-4 py-3.5 shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent] hover:shadow-[--taw-shadow-md]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--taw-accent-subtle] text-[--taw-accent] transition-colors group-hover:bg-[--taw-accent] group-hover:text-white">
                <PixelIcon name="arrow-right" size={12} />
              </div>
              <div>
                <span className="block text-[13px] font-medium text-[--taw-text-primary]">{label}</span>
                <span className="text-[11px] text-[--taw-text-muted]">{desc}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
