"use client"

import { KpiCard, OptionList } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/react"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon } from "@/components/pixel-icon"

// ─── Fixtures for lifecycle demos ─────────────────────────────────────────────

const loadingPart: TawToolPart = {
  id: "lifecycle-loading",
  toolName: "getMetrics",
  input: { metric: "revenue" },
  state: "input-available",
}

const streamingPart: TawToolPart = {
  id: "lifecycle-streaming",
  toolName: "getMetrics",
  input: { metric: "revenue" },
  state: "streaming",
  output: {
    id: "revenue",
    label: "Revenue",
  },
}

const outputPart: TawToolPart = {
  id: "lifecycle-output",
  toolName: "getMetrics",
  input: { metric: "revenue" },
  state: "output-available",
  output: {
    id: "revenue",
    label: "Revenue",
    value: 142580,
    unit: "$",
    delta: 12.4,
    trend: "up",
    confidence: 0.92,
    source: { label: "Stripe Dashboard", freshness: "2 hours ago" },
  },
}

const errorPart: TawToolPart = {
  id: "lifecycle-error",
  toolName: "getMetrics",
  input: { metric: "revenue" },
  state: "output-error",
  error: new Error("Connection timeout after 30s"),
}

function StateCard({
  label,
  state,
  description,
  children,
}: {
  label: string
  state: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
      <div className="border-b border-(--taw-border) bg-(--taw-surface) px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-(--taw-text-primary)">
            {label}
          </span>
          <span className="rounded-md bg-(--taw-accent-subtle) px-1.5 py-0.5 font-mono text-[10px] font-medium text-(--taw-accent)">
            {state}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-(--taw-text-muted)">
          {description}
        </p>
      </div>
      <div className="bg-(--taw-surface-sunken) p-5">
        {children}
      </div>
    </div>
  )
}

export default function ConceptsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Fundamentals
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Concepts
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-(--taw-text-secondary)">
          taw-ui is built around one core idea: every AI tool call is a{" "}
          <strong className="font-semibold text-(--taw-text-primary)">part</strong>,
          and every part has a{" "}
          <strong className="font-semibold text-(--taw-text-primary)">lifecycle</strong>.
          Once you understand that model, everything else — schemas, confidence
          fields, receipt patterns — follows naturally.
        </p>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-(--taw-text-muted)">
          This page builds that vocabulary. Read it before going deep on
          individual components.
        </p>
      </div>

      {/* ─── The Core Model ─── (new opening section) */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Core Model
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          An AI tool call isn{"'"}t a single event. It{"'"}s a sequence: the tool is
          invoked, data starts arriving (or doesn{"'"}t), the result is complete
          (or fails). taw-ui calls this the{" "}
          <strong className="font-medium text-(--taw-text-primary)">part lifecycle</strong>.
        </p>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui components are designed around this lifecycle. They don{"'"}t ask
          you to manage state. They don{"'"}t ask you to write conditionals. They
          accept a <InlineCode>part</InlineCode> — and render the right interface
          for whatever state that part is in.
        </p>

        {/* Lifecycle flow diagram */}
        <div className="flex flex-wrap items-center gap-2 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-5 py-4">
          {[
            { label: "input-available", desc: "Called, waiting" },
            { label: "streaming", desc: "Partial data arriving" },
            { label: "output-available", desc: "Complete result" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-(--taw-border)">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              <div className="text-center">
                <span className="block rounded-md bg-(--taw-accent-subtle) px-2 py-1 font-mono text-[10px] font-medium text-(--taw-accent)">
                  {step.label}
                </span>
                <span className="mt-1 block text-[10px] text-(--taw-text-muted)">
                  {step.desc}
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-(--taw-border)">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <div className="text-center">
              <span className="block rounded-md bg-(--taw-error)/10 px-2 py-1 font-mono text-[10px] font-medium text-(--taw-error)">
                output-error
              </span>
              <span className="mt-1 block text-[10px] text-(--taw-text-muted)">
                Tool failed
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Every concept on this page connects back to this model. The
          schema validates output. Confidence and source annotate it.
          The receipt pattern closes interactive states. They{"'"}re all
          facets of how taw-ui handles the part lifecycle.
        </p>
      </section>

      {/* Tool Call Lifecycle */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Tool Call Lifecycle
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui components handle all four lifecycle states from a single prop.
          Here{"'"}s what each state looks like in practice:
        </p>

        <div className="grid gap-4">
          <StateCard
            label="Loading"
            state="input-available"
            description="Tool was called but hasn't returned yet. Component shows a shimmer skeleton automatically."
          >
            <KpiCard part={loadingPart} animate={false} />
          </StateCard>

          <StateCard
            label="Streaming"
            state="streaming"
            description="Partial data is arriving. Component renders what it can, skeletons for the rest."
          >
            <KpiCard part={streamingPart} animate={false} />
          </StateCard>

          <StateCard
            label="Output"
            state="output-available"
            description="Tool returned successfully. Component validates against the schema and renders the full result."
          >
            <KpiCard part={outputPart} animate={false} />
          </StateCard>

          <StateCard
            label="Error"
            state="output-error"
            description="Tool failed or returned invalid data. Component shows a helpful error panel — never null."
          >
            <KpiCard part={errorPart} animate={false} />
          </StateCard>
        </div>

        <div className="mt-4">
          <CodeBlock>{`// Your component code stays clean
function ToolResult({ part }: { part: TawToolPart }) {
  // No switch statements, no if/else chains
  // The component handles all 4 states internally
  return <KpiCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* The Part Object */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Part Object
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          <InlineCode>TawToolPart</InlineCode> is the universal shape for tool call data.
          It{"'"}s deliberately shaped to match what Vercel AI SDK, Anthropic SDK, and
          OpenAI SDK already return from their streaming hooks — so you can pass
          SDK parts directly without transformation.
        </p>
        <CodeBlock>{`interface TawToolPart<TInput = unknown, TOutput = unknown> {
  id: string           // Unique call ID
  toolName: string     // Which tool was called
  input: TInput        // Arguments sent to the tool
  output?: TOutput     // Result data (when available)
  error?: Error | string  // Error (when failed)
  state:               // Current lifecycle state
    | "input-available"   // Called, waiting
    | "streaming"         // Partial data arriving
    | "output-available"  // Complete result
    | "output-error"      // Failed
}`}</CodeBlock>
      </section>

      {/* Confidence & Caveat */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Confidence & Caveat
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          AI outputs aren{"'"}t always certain. Every taw-ui schema supports two fields
          for handling uncertainty: <InlineCode>confidence</InlineCode> (0–1) for developers,
          and <InlineCode>caveat</InlineCode> for humans.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)">
            <span className="block text-[13px] font-medium text-(--taw-text-primary)">
              confidence
            </span>
            <span className="mt-0.5 block font-mono text-[11px] text-(--taw-text-muted)">
              number (0–1), optional
            </span>
            <p className="mt-1.5 text-[12px] text-(--taw-text-muted)">
              Machine-readable signal for developers. Use it to filter, threshold,
              or decide when to set a caveat. Drives the confidence badge in the
              UI — never rendered as a raw number.
            </p>
          </div>
          <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)">
            <span className="block text-[13px] font-medium text-(--taw-text-primary)">
              caveat
            </span>
            <span className="mt-0.5 block font-mono text-[11px] text-(--taw-text-muted)">
              string, optional
            </span>
            <p className="mt-1.5 text-[12px] text-(--taw-text-muted)">
              Human-readable uncertainty note from the AI. Only set when there{"'"}s
              something meaningful to say — silence is confidence.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CodeBlock>{`// Server: the AI speaks to humans, not in metrics
return {
  label: "Revenue",
  value: 142580,
  confidence: 0.65,  // DX: developers use this for thresholds
  caveat: "Based on partial data — full sync completes tonight",
}

// High confidence? Don't set caveat. Silence is confidence.`}</CodeBlock>
        </div>
      </section>

      {/* Source Provenance */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Source Provenance
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Where did this data come from? The optional <InlineCode>source</InlineCode> field
          lets your tools declare their data origin. Components render this as a
          subtle footer with the source name, freshness timestamp, and an optional link.
        </p>
        <CodeBlock>{`// Included in every schema
source: {
  label: "Stripe Dashboard",   // Required: what produced this data
  freshness: "2 hours ago",     // Optional: how stale is it
  url: "https://dashboard..."   // Optional: link to source
}`}</CodeBlock>
        <p className="mt-3 text-[13px] text-(--taw-text-muted)">
          This matters because AI tools often aggregate from multiple sources.
          Users should always be able to trace a number back to its origin —
          especially in financial, medical, or compliance contexts.
        </p>
      </section>

      {/* Schema Validation */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema Validation
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          LLMs sometimes return wrong shapes. taw-ui validates tool output at
          render time using the same Zod schema you used on the server. When
          validation fails, the component renders a helpful error — never silently
          returns null.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className="mb-1.5 block font-mono text-[10px] font-medium text-(--taw-text-muted)">
              Strict parse (render time)
            </span>
            <CodeBlock>{`// Used when state = "output-available"
const result = KpiCard.parse(output)

if (!result.ok) {
  // result.error has field-level details
  // + "Did you mean?" suggestions
  return <TawError parseError={result.error} />
}

// result.data is fully typed`}</CodeBlock>
          </div>
          <div>
            <span className="mb-1.5 block font-mono text-[10px] font-medium text-(--taw-text-muted)">
              Lenient parse (streaming)
            </span>
            <CodeBlock>{`// Used when state = "streaming"
const partial = KpiCard.safeParse(output)

// Returns typed data or null
// No errors — partial data is expected
// Component renders what it can`}</CodeBlock>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-(--taw-text-muted)">
          Two parse modes solve the streaming problem: strict mode catches schema
          mismatches after the tool completes; lenient mode gracefully handles
          incomplete data while streaming.
        </p>
      </section>

      {/* Receipt Pattern */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Receipt Pattern
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          In AI interfaces, interactive components (choice lists, confirmations)
          have a problem: after the user decides, the full component wastes vertical
          space — and the buttons are now stale and potentially confusing. The receipt
          pattern solves this: after a decision, the component collapses into a
          compact, read-only summary of what was chosen.
        </p>
        <div className="space-y-3">
          <span className="block font-mono text-[10px] font-medium text-(--taw-text-muted)">
            How it works
          </span>
          <div className="flex flex-col gap-2">
            {[
              { n: "1", text: <>AI presents options via <InlineCode>OptionList</InlineCode></> },
              { n: "2", text: <>User selects and confirms — <InlineCode>onAction</InlineCode> fires with the decision</> },
              { n: "3", text: <>You create a <InlineCode>TawReceipt</InlineCode> and pass it back as a prop</> },
              { n: "4", text: <>Component collapses to a compact receipt — scroll back and it{"'"}s just one line</> },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent)/10 font-mono text-[10px] font-bold text-(--taw-accent)">{n}</span>
                <span className="text-xs text-(--taw-text-muted)">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <CodeBlock>{`import { OptionList } from "@/components/taw/option-list"
import type { TawReceipt } from "taw-ui"

const [receipt, setReceipt] = useState<TawReceipt>()

<OptionList
  part={part}
  onAction={(actionId, payload) => {
    // payload.receipt is auto-generated
    setReceipt(payload.receipt)
  }}
  receipt={receipt}  // When set, collapses to receipt
/>`}</CodeBlock>
        </div>
      </section>

      {/* Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Actions
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Actions are the buttons in interactive components. Each action has an ID,
          label, and optional variant. taw-ui auto-resolves variants from semantic
          IDs — <InlineCode>cancel</InlineCode>, <InlineCode>dismiss</InlineCode>,{" "}
          <InlineCode>skip</InlineCode> automatically render as ghost buttons.
          Primary actions render as filled buttons.
        </p>
        <CodeBlock>{`// Actions defined in tool output schema
actions: [
  { id: "deploy", label: "Deploy to production" },
  { id: "cancel", label: "Cancel" },
  // deploy → primary (default)
  // cancel → ghost (auto-detected from ID)
]

// Override with explicit variant
{ id: "delete", label: "Delete all", variant: "destructive" }`}</CodeBlock>
        <p className="mt-3 text-[13px] text-(--taw-text-muted)">
          The <InlineCode>confirmLabel</InlineCode> field adds a two-step confirmation
          for dangerous actions — first click shows the confirm label, second click
          executes.
        </p>
      </section>

      {/* Routing tool calls */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Routing Tool Calls
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          When your app has multiple tools, route each tool call to the
          right component using the <InlineCode>toolName</InlineCode> from the part object.
          This is the only wiring taw-ui asks you to do.
        </p>
        <CodeBlock>{`import { KpiCard } from "@/components/taw/kpi-card"
import { DataTable } from "@/components/taw/data-table"
import { OptionList } from "@/components/taw/option-list"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  switch (part.toolName) {
    case "getMetrics":
      return <KpiCard part={part} />
    case "showTable":
      return <DataTable part={part} />
    case "chooseAction":
      return <OptionList part={part} />
    default:
      return null
  }
}`}</CodeBlock>
      </section>

      {/* Theming bridge (replaces full Design Tokens section) */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Theming
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui uses CSS custom properties for theming — no Tailwind theme
          extension, no build-time config. Import the default theme, then override
          any <InlineCode>--taw-*</InlineCode> token to match your design system.
        </p>
        <CodeBlock label="globals.css">{`@import "@taw-ui/react/styles.css";`}</CodeBlock>
        <p className="mt-3 mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          The default theme provides sensible defaults and automatically picks up
          shadcn/ui v2 variables (<InlineCode>--primary</InlineCode>,{" "}
          <InlineCode>--background</InlineCode>, <InlineCode>--border</InlineCode>,
          etc.) when available. Override any token directly:
        </p>
        <CodeBlock>{`:root {
  --taw-accent: oklch(0.55 0.2 260);   /* Primary interactive color */
  --taw-surface: oklch(0.98 0 0);       /* Component background */
  --taw-border: oklch(0.9 0 0);         /* Borders and dividers */
  /* ... override any of the 22 tokens */
}`}</CodeBlock>
        <p className="mt-3 text-[13px] text-(--taw-text-muted)">
          Components use semantic tokens like{" "}
          <InlineCode>bg-(--taw-surface)</InlineCode> and{" "}
          <InlineCode>text-(--taw-text-primary)</InlineCode>. Dark mode
          works automatically — the <InlineCode>.dark</InlineCode> class
          on <InlineCode>{"<html>"}</InlineCode> swaps all token values.
          A dedicated Theming page with the full token reference is coming soon.
        </p>

        {/* Theming placeholder */}
        <div className="mt-4 flex items-center gap-3 rounded-(--taw-radius-lg) border border-(--taw-border) border-dashed bg-(--taw-surface) px-4 py-3">
          <PixelIcon name="zap" size={14} />
          <div>
            <span className="block text-[12px] font-medium text-(--taw-text-secondary)">Theming page — coming soon</span>
            <span className="text-[11px] text-(--taw-text-muted)">Full token reference, dark/light examples, and custom theme guide</span>
          </div>
        </div>
      </section>

      {/* What's next — improved */}
      <section className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-5 shadow-(--taw-shadow-sm)">
        <h2 className="mb-1 text-[14px] font-semibold text-(--taw-text-primary)">
          You now have the vocabulary.
        </h2>
        <p className="mb-5 text-[13px] leading-relaxed text-(--taw-text-muted)">
          You understand what a part is, how the lifecycle states work, how
          confidence and provenance surface in the interface, and how decisions
          produce receipts. Pick a component and see these concepts in action.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            {
              href: "/docs/components/kpi-card",
              label: "KpiCard",
              desc: "The simplest component — metrics, sparklines, confidence. Start here.",
            },
            {
              href: "/docs/components/data-table",
              label: "DataTable",
              desc: "Sortable tables with 9 column types. Rich schemas in action.",
            },
            {
              href: "/docs/components/option-list",
              label: "OptionList",
              desc: "Choices with the receipt pattern — the most complete lifecycle demo.",
            },
          ].map(({ href, label, desc }) => (
            <a
              key={href}
              href={href}
              className="group flex flex-col gap-1 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface-sunken) px-3.5 py-3 transition-all hover:border-(--taw-accent)/30 hover:bg-(--taw-surface)"
            >
              <span className="text-[13px] font-medium text-(--taw-accent)">{label} →</span>
              <span className="text-[11px] leading-relaxed text-(--taw-text-muted)">{desc}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
