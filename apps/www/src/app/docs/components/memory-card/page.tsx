"use client"

import { MemoryCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { memoryCardFixtures, memoryCardOptions } from "@/fixtures/memory-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function MemoryCardDocs() {
  return (
    <div className="space-y-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Interactive
          </span>
          <ComponentNav />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          MemoryCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Transparent AI memory viewer. Shows what the AI remembers about the
          user with per-item confidence, categories, and the ability to confirm,
          dismiss, or correct each memory. Trust through radical transparency.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={memoryCardFixtures}
          options={memoryCardOptions}
          chatMessages={({ part, onAction, receipt, pending }) => [
            { role: "user", content: "What do you know about me?" },
            {
              role: "assistant",
              content: "Here\u2019s what I remember from our conversations:",
              tool: (
                <MemoryCard
                  part={part}
                  onAction={onAction}
                  receipt={receipt}
                  pending={pending}
                />
              ),
            },
            ...(receipt
              ? [{ role: "assistant" as const, content: "Got it! I\u2019ve updated my memory based on your review." }]
              : []),
          ]}
          code={(part) => generateComponentCode("MemoryCard", "@taw-ui/react", part, `onAction={handleAction} receipt={receipt}`)}
        >
          {(part) => <MemoryCard part={part} onAction={(id, payload) => console.log(id, payload)} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add memory-card`}</CodeBlock>
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
import { MemoryCardSchema } from "@/components/taw/memory-card"

export const getMemories = tool({
  description: "Show what you remember about the user",
  parameters: z.object({ scope: z.string().optional() }),
  outputSchema: MemoryCardSchema,
  execute: async ({ scope }) => {
    const memories = await memoryStore.getAll(userId, scope)
    return {
      id: "user-memory",
      title: "What I Remember",
      description: \`From our last \${memories.count} conversations\`,
      memories: memories.items.map(m => ({
        id: m.id,
        content: m.content,
        category: m.category,
        learnedFrom: m.source,
        confidence: m.confidence,
      })),
      confidence: memories.overallConfidence,
      source: { label: "Memory Store" },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { MemoryCard } from "@/components/taw/memory-card"
import { createReceipt } from "taw-ui"

function ToolOutput({ part }) {
  const [receipt, setReceipt] = useState()

  const handleAction = (id, payload) => {
    if (payload.receipt) setReceipt(payload.receipt)
    // Send verdicts to your memory store
    await updateMemories(payload.verdicts)
  }

  return (
    <MemoryCard
      part={part}
      onAction={handleAction}
      receipt={receipt}
    />
  )
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Interaction Pattern ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Interaction Pattern
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Each memory can be individually reviewed with three verdicts:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { verdict: "Confirm", desc: "This memory is correct", color: "text-(--taw-success)" },
            { verdict: "Dismiss", desc: "This is wrong, forget it", color: "text-(--taw-error)" },
            { verdict: "Correct", desc: "Close, but needs updating", color: "text-(--taw-warning)" },
          ].map(({ verdict, desc, color }) => (
            <div key={verdict} className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) px-4 py-3 shadow-(--taw-shadow-sm)">
              <span className={`block text-[13px] font-medium ${color}`}>{verdict}</span>
              <p className="mt-0.5 text-[12px] text-(--taw-text-muted)">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          After reviewing, the card collapses to a receipt:{" "}
          <InlineCode>Confirmed 4 · Dismissed 1 · Corrected 1</InlineCode>
        </p>
      </section>

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state" },
            { field: "onAction", type: "(id, payload) => void", desc: "Callback with verdicts when user submits review" },
            { field: "receipt", type: "TawReceipt", desc: "Renders the receipt summary when provided" },
            { field: "pending", type: "boolean", desc: "Disables all interactions while processing" },
            { field: "animate", type: "boolean", desc: "Enable entrance animations (default: true)" },
            { field: "className", type: "string", desc: "Additional CSS classes on the wrapper" },
          ]}
        />
      </section>

      {/* ── Schema ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <div className="space-y-4">
          <SchemaTable
            title="MemoryCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier" },
              { field: "title", type: "string", req: true, desc: "Title for this memory collection" },
              { field: "description", type: "string", desc: "Context about these memories" },
              { field: "memories", type: "MemoryItem[]", req: true, desc: "Array of individual memories (min 1)" },
              { field: "confidence", type: "number (0-1)", desc: "Overall memory confidence" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance (label + freshness)" },
            ]}
          />
          <SchemaTable
            title="MemoryItem"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable ID per memory" },
              { field: "content", type: "string", req: true, desc: "What the AI remembers" },
              { field: "category", type: "enum", req: true, desc: "preference | fact | context | assumption" },
              { field: "learnedFrom", type: "string", desc: "Where/when the AI learned this" },
              { field: "confidence", type: "number (0-1)", desc: "How sure the AI is this is accurate" },
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
            { icon: "schema", title: "Category badges", desc: "Preference, fact, context, assumption — each visually distinct" },
            { icon: "alert", title: "Assumption awareness", desc: "Dashed borders + low confidence = the AI is guessing" },
            { icon: "shield", title: "Per-item confidence", desc: "Each memory shows how certain the AI is" },
            { icon: "check", title: "Three verdicts", desc: "Confirm, dismiss, or correct individual memories" },
            { icon: "receipt", title: "Undo support", desc: "Change your mind on any verdict before submitting" },
            { icon: "circle-dot", title: "Receipt pattern", desc: "Collapses to a summary after review" },
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
            { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices with receipts" },
            { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI notifications" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
