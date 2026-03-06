"use client"

import { KpiCard, OptionList } from "@taw-ui/react"
import type { TawToolPart } from "@taw-ui/react"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"

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

// Using shared CodeBlock and InlineCode from @/components/code-block

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
          The mental model behind taw-ui: tool call lifecycle, AI-native fields,
          and the patterns that make interactive components work in chat UIs.
        </p>
      </div>

      {/* Tool Call Lifecycle */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Tool Call Lifecycle
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Every AI tool call goes through a lifecycle. SDKs represent this as a
          {" "}<InlineCode>part</InlineCode> object with a <InlineCode>state</InlineCode> field.
          taw-ui components handle all four states from a single prop — no
          conditional rendering needed.
        </p>

        <div className="grid gap-4">
          <StateCard
            label="Loading"
            state="input-available"
            description="Tool was called but hasn't returned yet. Component shows a skeleton."
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
            description="Tool returned successfully. Component validates and renders the full result."
          >
            <KpiCard part={outputPart} animate={false} />
          </StateCard>

          <StateCard
            label="Error"
            state="output-error"
            description="Tool failed or returned invalid data. Component shows a helpful error panel."
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Part Object
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          <InlineCode>TawToolPart</InlineCode> is the universal shape for tool call data.
          It matches the structure used by Vercel AI SDK, Anthropic SDK, and
          OpenAI SDK — so you can pass SDK parts directly without transformation.
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
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
              or decide when to set a caveat. Never rendered as a number in the UI.
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
              something to say — silence is confidence.
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Source Provenance
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Where did this data come from? The optional <InlineCode>source</InlineCode> field
          lets your tools declare their data origin. Components render this as a
          subtle footer with the source name, freshness timestamp, and optional link.
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The Receipt Pattern
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          In chat UIs, interactive components (choice lists, forms, confirmations)
          have a problem: after the user decides, the full component wastes vertical
          space. The receipt pattern solves this — after a decision, the component
          collapses into a compact, read-only summary of what was chosen.
        </p>
        <div className="space-y-3">
          <span className="block font-mono text-[10px] font-medium text-(--taw-text-muted)">
            How it works
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent)/10 font-mono text-[10px] font-bold text-(--taw-accent)">1</span>
              <span className="text-xs text-(--taw-text-muted)">
                AI presents options via <InlineCode>OptionList</InlineCode>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent)/10 font-mono text-[10px] font-bold text-(--taw-accent)">2</span>
              <span className="text-xs text-(--taw-text-muted)">
                User selects and confirms — <InlineCode>onAction</InlineCode> fires with the decision
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent)/10 font-mono text-[10px] font-bold text-(--taw-accent)">3</span>
              <span className="text-xs text-(--taw-text-muted)">
                You create a <InlineCode>TawReceipt</InlineCode> and pass it back as a prop
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent)/10 font-mono text-[10px] font-bold text-(--taw-accent)">4</span>
              <span className="text-xs text-(--taw-text-muted)">
                Component collapses to a compact receipt — scroll back and it{"'"}s just one line
              </span>
            </div>
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
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
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Routing Tool Calls
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          When your app has multiple tools, route each tool call to the
          right component using the <InlineCode>toolName</InlineCode> from the part object.
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

      {/* Design Tokens */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Design Tokens
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui uses CSS custom properties for theming — no Tailwind theme extension,
          no build-time config. The default theme ships with Dracula-inspired dark mode
          and Alucard-inspired light mode. Override any token to match your design system.
          All colors use oklch for perceptual uniformity.
        </p>
        <div className="overflow-x-auto rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-sm)">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Token</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Purpose</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-(--taw-text-muted)">Preview</th>
              </tr>
            </thead>
            <tbody className="bg-(--taw-surface-raised)">
              {[
                ["--taw-surface", "Default component background"],
                ["--taw-surface-raised", "Elevated elements (cards, modals)"],
                ["--taw-surface-sunken", "Recessed areas (page bg, code blocks)"],
                ["--taw-border", "All borders and dividers"],
                ["--taw-text-primary", "Headings and important text"],
                ["--taw-text-muted", "Secondary text and labels"],
                ["--taw-accent", "Interactive elements, links, badges"],
                ["--taw-success", "Positive states, confirmations"],
                ["--taw-warning", "Caution states, amber alerts"],
                ["--taw-error", "Error states, destructive actions"],
                ["--taw-cyan", "Info highlights, special badges"],
                ["--taw-pink", "Emphasis, decorative accents"],
                ["--taw-yellow", "Highlights, attention markers"],
              ].map(([token, purpose]) => (
                <tr key={token} className="border-b border-(--taw-border) last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-(--taw-accent)">{token}</td>
                  <td className="px-4 py-2.5 text-[12px] text-(--taw-text-muted)">{purpose}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-block h-4 w-4 rounded" style={{ background: `var(${token})` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What's next */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          What{"'"}s Next
        </h2>
        <ul className="space-y-2 text-xs text-(--taw-text-muted)">
          <li>
            <a href="/docs/components/kpi-card" className="font-medium text-(--taw-accent) hover:underline">KpiCard</a>
            {" "} — Start with the simplest component
          </li>
          <li>
            <a href="/docs/components/data-table" className="font-medium text-(--taw-accent) hover:underline">DataTable</a>
            {" "} — Rich tabular data with 9 column types
          </li>
          <li>
            <a href="/docs/components/option-list" className="font-medium text-(--taw-accent) hover:underline">OptionList</a>
            {" "} — See the receipt pattern in action
          </li>
        </ul>
      </section>
    </div>
  )
}
