"use client"

import { KpiCard } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/core"
import { kpiCardFixtures } from "@/fixtures/kpi-card"
import { CodeBlock } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon } from "@/components/pixel-icon"

const rawJson = `{
  "label": "Revenue",
  "value": 142580,
  "unit": "$",
  "delta": 12.4,
  "trend": "up",
  "confidence": 0.92,
  "source": {
    "label": "Stripe Dashboard",
    "freshness": "2 hours ago"
  }
}`

// ─── Chat simulation ─────────────────────────────────────────────────────────

function ChatWindow({
  label,
  variant,
  children,
}: {
  label: string
  variant: "bad" | "good"
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-md]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[--taw-border] bg-[--taw-surface] px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-[--taw-error] opacity-70" />
          <span className="h-[9px] w-[9px] rounded-full bg-[--taw-warning] opacity-70" />
          <span className="h-[9px] w-[9px] rounded-full bg-[--taw-success] opacity-70" />
        </div>
        <span className="ml-1 font-mono text-[11px] text-[--taw-text-muted]">{label}</span>
      </div>
      {/* Messages */}
      <div className="flex flex-col gap-3 bg-[--taw-surface-sunken] p-4">
        {children}
      </div>
    </div>
  )
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[--taw-accent] px-3.5 py-2 text-[12.5px] leading-relaxed text-white">
        {children}
      </div>
    </div>
  )
}

function AiMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">{children}</div>
  )
}

function AiTextBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl rounded-tl-md bg-[--taw-surface] px-3.5 py-2 text-[12.5px] leading-relaxed text-[--taw-text-primary] shadow-[--taw-shadow-sm]">
      {children}
    </div>
  )
}

function ArchLayer({
  label,
  description,
  highlight,
}: {
  label: string
  description: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-[--taw-radius-lg] border-2 border-[--taw-accent] bg-[--taw-accent-subtle] px-5 py-3.5 shadow-[0_0_0_4px_oklch(0.55_0.18_260/0.06)]"
          : "rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] px-5 py-3.5 shadow-[--taw-shadow-sm]"
      }
    >
      <span className="block font-mono text-[13px] font-semibold text-[--taw-text-primary]">
        {label}
      </span>
      <span className="mt-0.5 block text-[12px] text-[--taw-text-muted]">
        {description}
      </span>
    </div>
  )
}

export default function OverviewPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
            Docs
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[--taw-text-primary]">
          Overview
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[--taw-text-secondary]">
          When an LLM calls a tool, it returns raw JSON. Today, developers either
          dump it as text or write one-off UI for every tool. taw-ui solves this
          with schema-validated, motion-native React components that handle the
          full tool call lifecycle.
        </p>
      </div>

      {/* Before / After — Chat simulation */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          The Problem
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {/* Without taw-ui */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-[--taw-error]">
              <PixelIcon name="robot-sad" size={14} />
              Without taw-ui
            </span>
            <ChatWindow label="your-app.com" variant="bad">
              <UserMessage>What{"'"}s our current revenue?</UserMessage>
              <AiMessage>
                <AiTextBubble>Here{"'"}s the current revenue data:</AiTextBubble>
                <div className="mt-2 overflow-hidden rounded-xl border border-[--taw-border] bg-[--taw-surface]">
                  <pre className="overflow-x-auto p-3 font-mono text-[10.5px] leading-relaxed text-[--taw-text-muted]">{rawJson}</pre>
                </div>
              </AiMessage>
            </ChatWindow>
          </div>

          {/* With taw-ui */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-[--taw-success]">
              <PixelIcon name="robot-happy" size={14} />
              With taw-ui
            </span>
            <ChatWindow label="your-app.com" variant="good">
              <UserMessage>What{"'"}s our current revenue?</UserMessage>
              <AiMessage>
                <AiTextBubble>Here{"'"}s the current revenue data:</AiTextBubble>
                <div className="pointer-events-none mt-2">
                  <KpiCard part={kpiCardFixtures["ready"]!} animate={false} />
                </div>
              </AiMessage>
            </ChatWindow>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-[--taw-text-muted]">
          Same data, same tool call. One line of code:{" "}
          <code className="rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 py-0.5 font-mono text-[12px] text-[--taw-accent]">
            {"<KpiCard part={part} />"}
          </code>
        </p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          How It Works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Define your tool",
              desc: "Your tool returns JSON matching a taw-ui schema. Same schema works as your tool's outputSchema and for client-side validation.",
            },
            {
              n: "02",
              title: "Render the part",
              desc: "Pass the tool call part to the component. It handles loading, streaming, success, and error states automatically.",
            },
            {
              n: "03",
              title: "Ship with confidence",
              desc: "Invalid data? Helpful error. Missing fields? Skeleton with shimmer. AI uncertain? Confidence badge. It just works.",
            },
          ].map(({ n, title, desc }) => (
            <div
              key={n}
              className="group rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] p-5 shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent]/20 hover:shadow-[--taw-shadow-md]"
            >
              <span className="mb-2 block font-pixel text-[18px] text-[--taw-accent]">
                {n}
              </span>
              <span className="block text-[14px] font-semibold text-[--taw-text-primary]">
                {title}
              </span>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[--taw-text-muted]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Minimal Example
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server.ts — define tool">{`import { KpiCardSchema } from "@taw-ui/core"

const getMetrics = tool({
  description: "Get a business metric",
  parameters: z.object({
    metric: z.string(),
  }),
  outputSchema: KpiCardSchema,
  execute: async ({ metric }) => {
    const data = await fetchMetric(metric)
    return {
      id: metric,
      label: data.name,
      value: data.value,
      unit: "$",
      delta: data.change,
      trend: data.change > 0 ? "up" : "down",
      confidence: data.confidence,
      source: {
        label: data.source,
        freshness: "just now",
      },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="chat.tsx — render component">{`import { KpiCard, DataTable,
  createTawRegistry, TawRenderer
} from "@taw-ui/react"

// Register once
const registry = createTawRegistry({
  getMetrics: KpiCard,
  showTable: DataTable,
})

// In your chat UI
function ToolOutput({ part }) {
  return <TawRenderer
    registry={registry}
    part={part}
  />
}

// Or use directly
<KpiCard part={part} />`}</CodeBlock>
        </div>
      </section>

      {/* Architecture */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Where taw-ui Fits
        </h2>
        <div className="flex flex-col gap-1.5">
          <ArchLayer
            label="Your App"
            description="Next.js, Remix, or any React framework"
          />
          <div className="flex items-center justify-center py-0.5 text-[--taw-border]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </div>
          <ArchLayer
            label="@taw-ui/react"
            description="Components, motion system, shared primitives"
            highlight
          />
          <div className="flex items-center justify-center py-0.5 text-[--taw-border]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </div>
          <ArchLayer
            label="@taw-ui/core"
            description="Schemas (Zod), types, validation, action/receipt system"
            highlight
          />
          <div className="flex items-center justify-center py-0.5 text-[--taw-border]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </div>
          <ArchLayer
            label="SDK Adapter (planned)"
            description="@taw-ui/vercel-ai · @taw-ui/anthropic · @taw-ui/openai"
          />
          <div className="flex items-center justify-center py-0.5 text-[--taw-border]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
          </div>
          <ArchLayer
            label="LLM Provider"
            description="OpenAI, Anthropic, Google, or any provider that supports tool calling"
          />
        </div>
      </section>

      {/* Differentiators */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          What Makes taw-ui Different
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: "◎",
              title: "AI-native fields",
              desc: "Every schema supports confidence (0–1) and source provenance. No other library surfaces AI uncertainty in the UI.",
            },
            {
              icon: "↻",
              title: "Part-aware lifecycle",
              desc: "Components handle 4 states — loading, streaming, output, error — from a single prop. No conditional rendering.",
            },
            {
              icon: "⚡",
              title: "Spring physics motion",
              desc: "Numbers count up with springs. Skeletons shimmer with physics. Entrances are settled, not popped.",
            },
            {
              icon: "✦",
              title: "Helpful errors, never null",
              desc: "Parse failures render with field-level details and \"Did you mean?\" suggestions. Never silent null.",
            },
            {
              icon: "◆",
              title: "SDK-agnostic",
              desc: "Works with Vercel AI SDK, Anthropic SDK, OpenAI SDK, or raw JSON. No vendor lock-in.",
            },
            {
              icon: "△",
              title: "Schema = source of truth",
              desc: "One Zod schema defines tool output, validates on server, validates on client, infers types.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] p-4 shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent]/20 hover:shadow-[--taw-shadow-md]">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[--taw-accent-subtle] text-[16px] text-[--taw-accent]">
                  {icon}
                </span>
                <span className="text-[13px] font-semibold text-[--taw-text-primary]">
                  {title}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-[--taw-text-muted]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live error demo */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Error Handling in Action
        </h2>
        <p className="mb-4 text-[13px] text-[--taw-text-muted]">
          When the LLM returns{" "}
          <code className="rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 py-0.5 font-mono text-[12px] text-[--taw-accent]">
            {`{ title: "Revenue", amount: 142580 }`}
          </code>{" "}
          instead of the expected schema, taw-ui doesn{"'"}t silently fail:
        </p>
        <KpiCard part={kpiCardFixtures["parse-error"]!} animate={false} />
      </section>
    </div>
  )
}
