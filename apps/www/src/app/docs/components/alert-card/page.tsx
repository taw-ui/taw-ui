"use client"

import { useState, useCallback } from "react"
import { AlertCard } from "@taw-ui/react"
import type { TawReceipt } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { alertCardFixtures, alertCardOptions } from "@/fixtures/alert-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

function InteractiveDemo() {
  const [receipt, setReceipt] = useState<TawReceipt | undefined>()

  const handleAction = useCallback(
    (_actionId: string, payload: unknown) => {
      const p = payload as { receipt?: TawReceipt }
      if (p.receipt) setReceipt(p.receipt)
    },
    [],
  )

  return (
    <div className="flex flex-col gap-3">
      <AlertCard
        part={alertCardFixtures["warning"]!}
        onAction={handleAction}
        receipt={receipt}
      />
      {receipt && (
        <button
          onClick={() => setReceipt(undefined)}
          className="self-start rounded-lg border border-(--taw-border) bg-(--taw-surface) px-3 py-1.5 font-mono text-[11px] text-(--taw-text-muted) transition-all hover:border-(--taw-accent)/30 hover:text-(--taw-text-primary)"
        >
          Reset receipt
        </button>
      )}
    </div>
  )
}

export default function AlertCardDocs() {
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
          AlertCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Proactive AI notification with severity levels, inline metrics, and
          action buttons. The component for when the AI speaks first — surfacing
          issues before the user asks.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={alertCardFixtures}
          options={alertCardOptions}
          chatMessages={({ part, onAction, receipt, pending }) => [
            {
              role: "assistant",
              content: "Heads up \u2014 I noticed something that needs attention:",
              tool: (
                <AlertCard
                  part={part}
                  onAction={onAction}
                  receipt={receipt}
                  pending={pending}
                />
              ),
            },
          ]}
          code={(part) => generateComponentCode("AlertCard", "@taw-ui/react", part, `onAction={handleAction} receipt={receipt}`)}
        >
          {(part) => <AlertCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add alert-card`}</CodeBlock>
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
import { AlertCardSchema } from "@/components/taw/alert-card"

export const checkAlerts = tool({
  description: "Check for proactive alerts",
  parameters: z.object({}),
  outputSchema: AlertCardSchema,
  execute: async () => {
    const alerts = await monitoringService.check()
    return {
      id: "alert-stockout",
      severity: "critical",
      title: "Stock risk detected",
      description: "3 products are below 1 week of coverage",
      metrics: [
        { label: "Critical", value: 3 },
        { label: "Impact", value: "R$ 28.000" },
      ],
      actions: [
        { id: "create-orders", label: "Create orders", primary: true },
        { id: "dismiss", label: "Dismiss" },
      ],
      source: { label: "Stock Monitor", freshness: "live" },
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { AlertCard } from "@/components/taw/alert-card"
import { createReceipt } from "taw-ui"

function ToolOutput({ part }) {
  const [receipt, setReceipt] = useState()

  const handleAction = (id, payload) => {
    if (payload.receipt) setReceipt(payload.receipt)
    // Execute the chosen action
    await executeAction(id)
  }

  return (
    <AlertCard
      part={part}
      onAction={handleAction}
      receipt={receipt}
    />
  )
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Try It ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Try It
        </h2>
        <p className="mb-4 text-[13px] text-(--taw-text-muted)">
          Click an action button to see the receipt pattern.
        </p>
        <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-6 shadow-(--taw-shadow-sm)">
          <InteractiveDemo />
        </div>
      </section>

      {/* ── Severity Levels ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Severity Levels
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Each severity level has its own color, icon, and left border. The AI
          chooses the severity — the UI adapts automatically.
        </p>
        <div className="flex flex-col gap-4">
          {(["info", "warning", "critical"] as const).map((key) => (
            <AlertCard key={key} part={alertCardFixtures[key]!} animate={false} />
          ))}
        </div>
      </section>

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state" },
            { field: "onAction", type: "(id, payload) => void", desc: "Callback when an action button is clicked" },
            { field: "receipt", type: "TawReceipt", desc: "Renders the receipt state when provided" },
            { field: "pending", type: "boolean", desc: "Disables all actions while processing" },
            { field: "animate", type: "boolean", desc: "Enable entrance animations (default: true)" },
            { field: "className", type: "string", desc: "Additional CSS classes" },
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
            title="AlertCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier" },
              { field: "severity", type: '"info" | "warning" | "critical"', req: true, desc: "Visual severity level" },
              { field: "title", type: "string", req: true, desc: "Alert heading" },
              { field: "description", type: "string", desc: "Detail text below the title" },
              { field: "metrics", type: "Metric[]", desc: "Up to 6 inline key-value metrics" },
              { field: "actions", type: "Action[]", desc: "Up to 4 action buttons" },
              { field: "reasoning", type: "string", desc: "AI explanation" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance" },
            ]}
          />
          <SchemaTable
            title="Action"
            fields={[
              { field: "id", type: "string", req: true, desc: "Action identifier (passed to onAction)" },
              { field: "label", type: "string", req: true, desc: "Button text" },
              { field: "primary", type: "boolean", desc: "Renders as a filled accent button" },
            ]}
          />
          <SchemaTable
            title="Metric"
            fields={[
              { field: "label", type: "string", req: true, desc: "Metric label" },
              { field: "value", type: "string | number", req: true, desc: "Metric value" },
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
            { icon: "alert", title: "Three severity levels", desc: "Info (accent), warning (amber), critical (red) with matching icons" },
            { icon: "grid", title: "Inline metrics", desc: "Up to 6 key numbers displayed in a compact row" },
            { icon: "check", title: "Action buttons", desc: "Up to 4 actions with primary/secondary styling and receipt pattern" },
            { icon: "receipt", title: "Receipt pattern", desc: "Collapses to a compact summary after the user acts" },
            { icon: "chat", title: "AI reasoning", desc: "Optional typewriter-animated explanation" },
            { icon: "schema", title: "Source attribution", desc: "Shows which monitoring system generated the alert" },
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
            { href: "/docs/components/insight-card", label: "InsightCard", desc: "Structured AI analysis" },
            { href: "/docs/components/option-list", label: "OptionList", desc: "Interactive choices with receipts" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
          ]}
        />
      </section>
    </div>
  )
}
