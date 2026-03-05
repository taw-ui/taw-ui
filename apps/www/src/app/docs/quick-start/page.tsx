"use client"

import { KpiCard } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/core"
import { CodeBlock, InlineCode } from "@/components/code-block"

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
    <div className="relative flex gap-5">
      {/* Connector line */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--taw-accent] font-pixel text-[12px] font-bold text-white shadow-[0_1px_3px_oklch(0_0_0/0.2),inset_0_1px_0_oklch(1_0_0/0.15)]">
          {number}
        </div>
        <div className="mt-2 w-px flex-1 bg-[--taw-border]" />
      </div>

      <div className="flex-1 space-y-3 pb-10">
        <h3 className="text-[15px] font-semibold text-[--taw-text-primary]">
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

export default function QuickStartPage() {
  return (
    <div className="space-y-12">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
            Guide
          </span>
          <span className="font-mono text-[11px] text-[--taw-text-muted]">~5 min</span>
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
          <CodeBlock label="globals.css">{`:root {
  --taw-surface: oklch(0.98 0 0);
  --taw-surface-raised: oklch(1 0 0);
  --taw-surface-sunken: oklch(0.94 0 0);
  --taw-border: oklch(0.88 0 0);
  --taw-text-primary: oklch(0.15 0 0);
  --taw-text-muted: oklch(0.55 0 0);
  --taw-accent: oklch(0.55 0.18 250);
  --taw-radius: 6px;
}

.dark {
  --taw-surface: oklch(0.14 0 0);
  --taw-surface-raised: oklch(0.17 0 0);
  --taw-surface-sunken: oklch(0.11 0 0);
  --taw-border: oklch(0.26 0 0);
  --taw-text-primary: oklch(0.93 0 0);
  --taw-text-muted: oklch(0.55 0 0);
  --taw-accent: oklch(0.65 0.18 250);
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
      <section className="rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] p-6 shadow-[--taw-shadow-sm]">
        <h2 className="mb-4 font-pixel text-[11px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
          What{"'"}s Next
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, confidence, receipts" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "9 column format types" },
            { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices" },
          ].map(({ href, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-[--taw-surface-sunken]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--taw-accent-subtle] font-pixel text-[10px] text-[--taw-accent] transition-colors group-hover:bg-[--taw-accent] group-hover:text-white">
                →
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
