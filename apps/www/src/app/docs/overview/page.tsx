"use client"

import { KpiCard } from "@taw-ui/react"
import { kpiCardFixtures } from "@/fixtures/kpi-card"
import { CodeBlock } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon } from "@/components/pixel-icon"
import { ComparisonSlider } from "@/components/comparison-slider"

const rawJson = `{
  "stats": [{
    "key": "revenue",
    "label": "Revenue",
    "value": 142580,
    "format": { "kind": "currency", "currency": "USD" },
    "diff": { "value": 12.4 },
    "sparkline": { "data": [95000, 108000, 122000, 135000, 142580] }
  }],
  "source": {
    "label": "Stripe Dashboard",
    "freshness": "2 hours ago"
  }
}`

// ─── Chat simulation ─────────────────────────────────────────────────────────

function ChatWindow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-md)">
      <div className="flex items-center gap-2 border-b border-(--taw-border) bg-(--taw-surface) px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-(--taw-error) opacity-70" />
          <span className="h-[9px] w-[9px] rounded-full bg-(--taw-warning) opacity-70" />
          <span className="h-[9px] w-[9px] rounded-full bg-(--taw-success) opacity-70" />
        </div>
        <span className="ml-1 font-mono text-[11px] text-(--taw-text-muted)">{label}</span>
      </div>
      <div className="flex flex-col gap-3 bg-(--taw-surface-sunken) p-4">
        {children}
      </div>
    </div>
  )
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-(--taw-accent) px-3.5 py-2 text-[12.5px] leading-relaxed text-white">
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
    <div className="px-3.5 py-2 text-[12.5px] leading-relaxed text-(--taw-text-primary)">
      {children}
    </div>
  )
}

function ArchCard({
  icon,
  label,
  description,
  highlight,
  tag,
}: {
  icon: React.ReactNode
  label: string
  description: string
  highlight?: boolean
  tag?: string
}) {
  return (
    <div
      className={
        highlight
          ? "flex items-center gap-4 rounded-(--taw-radius-lg) border-2 border-(--taw-accent) bg-(--taw-accent-subtle) px-5 py-4 shadow-[0_0_0_4px_oklch(0.55_0.18_260/0.06)]"
          : "flex items-center gap-4 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-5 py-4 shadow-(--taw-shadow-sm)"
      }
    >
      <div
        className={
          highlight
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent) text-white"
            : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--taw-surface-sunken) text-(--taw-text-muted)"
        }
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={highlight
            ? "font-mono text-[13px] font-semibold text-(--taw-accent)"
            : "font-mono text-[13px] font-semibold text-(--taw-text-primary)"
          }>
            {label}
          </span>
          {tag && (
            <span className="rounded-md bg-(--taw-accent-subtle) px-1.5 py-0.5 font-pixel text-[8px] uppercase tracking-wider text-(--taw-accent)">
              {tag}
            </span>
          )}
        </div>
        <span className="mt-0.5 block text-[12px] text-(--taw-text-muted)">
          {description}
        </span>
      </div>
    </div>
  )
}

function ArchConnector() {
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-(--taw-border)">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </div>
  )
}

export default function OverviewPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Docs
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Overview
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-(--taw-text-secondary)">
          Text, markdown, raw JSON — these are the default outputs of an AI.
          They{"'"}re also the wrong outputs for most real interactions.
        </p>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-(--taw-text-secondary)">
          taw-ui is the interface layer for the HAI era: AI-native React
          components that turn structured tool outputs into production-quality
          UI — with loading states, spring-physics motion, schema validation,
          and built-in affordances for uncertainty.
        </p>

        <div className="mt-5 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-accent)/20 bg-(--taw-accent-subtle) px-5 py-4">
          <p className="text-[14px] font-medium leading-relaxed text-(--taw-text-primary)">
            The future of AI products is not more text. It{"'"}s better interfaces.
            The right component makes AI feel smarter — not because the model
            changed, but because the interface did.
          </p>
        </div>
      </div>

      {/* Before / After — Comparison slider */}
      <section>
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Gap
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Most AI products treat text as the universal interface. When a user
          asks for metrics, choices, or a confirmation — text is the wrong
          answer. taw-ui fills the gap between what the LLM returns and what
          users should see.
        </p>
        <ComparisonSlider
          beforeLabel={
            <>
              <PixelIcon name="robot-sad" size={14} />
              Without taw-ui
            </>
          }
          afterLabel={
            <>
              <PixelIcon name="robot-happy" size={14} />
              With taw-ui
            </>
          }
          before={
            <ChatWindow label="your-app.com">
              <UserMessage>What{"'"}s our current revenue?</UserMessage>
              <AiMessage>
                <AiTextBubble>Here{"'"}s the current revenue data:</AiTextBubble>
                <pre className="mt-2 overflow-x-auto rounded-xl border border-(--taw-border) bg-(--taw-surface) p-3 font-mono text-[10.5px] leading-relaxed text-(--taw-text-muted)">{rawJson}</pre>
              </AiMessage>
            </ChatWindow>
          }
          after={
            <ChatWindow label="your-app.com">
              <UserMessage>What{"'"}s our current revenue?</UserMessage>
              <AiMessage>
                <AiTextBubble>Here{"'"}s the current revenue data:</AiTextBubble>
                <div className="pointer-events-none mt-2">
                  <KpiCard part={kpiCardFixtures["single"]!} animate={false} />
                </div>
              </AiMessage>
            </ChatWindow>
          }
        />
        <p className="mt-4 text-[13px] text-(--taw-text-muted)">
          Same data, same tool call. One line of code:{" "}
          <code className="rounded-md border border-(--taw-border) bg-(--taw-surface) px-1.5 py-0.5 font-mono text-[12px] text-(--taw-accent)">
            {"<KpiCard part={part} />"}
          </code>
        </p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          How It Works
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Three steps. No glue code.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Define the output schema",
              desc: "Your tool returns JSON matching a taw-ui schema. That same schema validates on the server, validates at render time, and infers TypeScript types. One schema, no duplication.",
            },
            {
              n: "02",
              title: "Pass the part to the component",
              desc: "The AI SDK delivers a part object to your app. Pass it directly. Loading, streaming, success, and error states are handled automatically — no conditionals, no wiring.",
            },
            {
              n: "03",
              title: "Your interface, your rules",
              desc: "Components live in your codebase. Customize layout, override any --taw-* token, extend behavior. Shared contracts from the taw-ui npm package stay versioned across your team.",
            },
          ].map(({ n, title, desc }) => (
            <div
              key={n}
              className="group rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-5 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent)/20 hover:shadow-(--taw-shadow-md)"
            >
              <span className="mb-2 block font-pixel text-[18px] text-(--taw-accent)">
                {n}
              </span>
              <span className="block text-[14px] font-semibold text-(--taw-text-primary)">
                {title}
              </span>
              <p className="mt-1.5 text-[12px] leading-relaxed text-(--taw-text-muted)">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Minimal Example
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server.ts — define tool">{`import { KpiCardSchema } from "@/components/taw/kpi-card"

const getMetrics = tool({
  description: "Get business metrics",
  parameters: z.object({
    metric: z.string(),
  }),
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
      source: {
        label: data.source,
        freshness: "just now",
      },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="chat.tsx — render component">{`import { KpiCard } from "@/components/taw/kpi-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  switch (part.toolName) {
    case "getMetrics":
      return <KpiCard part={part} />
    default:
      return null
  }
}`}</CodeBlock>
        </div>
      </section>

      {/* Architecture */}
      <section>
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Architecture
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui sits between your AI SDK and your users. LLM providers and
          runtimes change fast — taw-ui is designed to stay stable across them.
          You own the components. We maintain the contracts.
        </p>
        <div className="flex flex-col">
          <ArchCard
            icon={<PixelIcon name="chat" size={16} />}
            label="LLM Provider"
            description="OpenAI, Anthropic, Google — calls tools, returns structured JSON"
          />
          <ArchConnector />
          <ArchCard
            icon={<PixelIcon name="zap" size={16} />}
            label="Any AI SDK"
            description="Vercel AI SDK, Anthropic SDK, OpenAI SDK — delivers tool call parts to your app"
          />
          <ArchConnector />
          <div className="rounded-(--taw-radius-lg) border-2 border-(--taw-accent)/30 bg-(--taw-accent-subtle)/30 p-3">
            <span className="mb-2 block font-pixel text-[9px] uppercase tracking-wider text-(--taw-accent)">
              Your App
            </span>
            <div className="flex flex-col gap-2">
              <ArchCard
                icon={<PixelIcon name="diamond" size={16} />}
                label="Your Components"
                description="Copied into your project via CLI — full ownership, customize layout, styles, and behavior"
                highlight
                tag="cli"
              />
              <ArchCard
                icon={<PixelIcon name="shield" size={16} />}
                label="taw-ui"
                description="Schemas, types, validation, actions — versioned npm package that guarantees contracts survive your customizations"
                tag="npm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          What Makes taw-ui Different
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              icon: "◎",
              title: "AI-native fields",
              desc: "Every schema includes confidence (0–1) and source provenance as first-class fields. No other UI library surfaces AI uncertainty in the interface.",
            },
            {
              icon: "↻",
              title: "Part-aware lifecycle",
              desc: "One part prop. Four states handled automatically: loading skeleton, progressive streaming, animated success, helpful error. No conditional rendering.",
            },
            {
              icon: "⚡",
              title: "Spring-physics motion",
              desc: "Numbers count up with spring dynamics. Skeletons shimmer with physics. Entrances are eased, not popped. Motion that feels earned.",
            },
            {
              icon: "✦",
              title: "Helpful errors, never null",
              desc: "Parse failures render inline with field-level details and \"Did you mean?\" suggestions. Every error is an opportunity to fix a prompt — not a silent mystery.",
            },
            {
              icon: "◆",
              title: "Runtime-agnostic",
              desc: "Works with Vercel AI SDK, Anthropic SDK, OpenAI SDK, or raw JSON. The TawToolPart shape matches what every major SDK already returns. No vendor lock-in.",
            },
            {
              icon: "△",
              title: "Schema as source of truth",
              desc: "One Zod schema defines the tool output shape, validates server-side, validates client-side, and infers TypeScript types. No synchronization required.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent)/20 hover:shadow-(--taw-shadow-md)">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent-subtle) text-[16px] text-(--taw-accent)">
                  {icon}
                </span>
                <span className="text-[13px] font-semibold text-(--taw-text-primary)">
                  {title}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-(--taw-text-muted)">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Live error demo */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Error Handling in Action
        </h2>
        <p className="mb-4 text-[13px] text-(--taw-text-muted)">
          When the LLM returns{" "}
          <code className="rounded-md border border-(--taw-border) bg-(--taw-surface) px-1.5 py-0.5 font-mono text-[12px] text-(--taw-accent)">
            {`{ title: "Revenue", amount: 142580 }`}
          </code>{" "}
          instead of the expected schema, taw-ui doesn{"'"}t silently fail.
          It renders a helpful inline error with field-level details and
          correction suggestions. Every error is a prompt iteration opportunity.
        </p>
        <KpiCard part={kpiCardFixtures["parse-error"]!} animate={false} />
      </section>

      {/* Closing CTA */}
      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href="/docs/quick-start"
          className="group flex flex-col gap-1.5 rounded-(--taw-radius-lg) border-2 border-(--taw-accent)/30 bg-(--taw-accent-subtle) px-5 py-4 transition-all hover:border-(--taw-accent)/60 hover:shadow-(--taw-shadow-md)"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-(--taw-accent)">
            <PixelIcon name="zap" size={12} />
            Quick Start
          </span>
          <span className="text-[12px] leading-relaxed text-(--taw-text-secondary)">
            One command. Your code. Full ownership. First component in under
            10 minutes.
          </span>
        </a>
        <a
          href="/docs/principles"
          className="group flex flex-col gap-1.5 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-5 py-4 transition-all hover:border-(--taw-accent)/30 hover:shadow-(--taw-shadow-md)"
        >
          <span className="flex items-center gap-2 text-[13px] font-semibold text-(--taw-text-primary)">
            <PixelIcon name="diamond" size={12} />
            Principles
          </span>
          <span className="text-[12px] leading-relaxed text-(--taw-text-muted)">
            The design thinking behind taw-ui — how we believe AI interfaces
            should be built.
          </span>
        </a>
      </section>
    </div>
  )
}
