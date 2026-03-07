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

function StepLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--taw-accent) font-pixel text-[11px] text-white">
        {n}
      </div>
      <span className="text-[14px] font-semibold text-(--taw-text-primary)">{children}</span>
    </div>
  )
}

function GainRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-[3px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-(--taw-success) text-[9px] font-bold text-white">
        ✓
      </span>
      <span className="text-[13px] leading-relaxed text-(--taw-text-secondary)">
        {children}
      </span>
    </div>
  )
}

export default function QuickStartPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
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
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-(--taw-text-muted)">
          taw-ui has two parts: a runtime package (<InlineCode>taw-ui</InlineCode>)
          that ships schemas, types, and validation — and components that live
          in your project. The CLI copies components into{" "}
          <InlineCode>@/components/taw/</InlineCode> so you own them completely.
          Let{"'"}s install both and render your first AI-native interface.
        </p>
      </div>

      {/* Step 1 — Install */}
      <section className="space-y-3">
        <StepLabel n="1">Install</StepLabel>
        <CodeBlock label="terminal">{`npm i taw-ui
npx taw-ui add kpi-card`}</CodeBlock>
        <p className="text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          The first command installs the runtime (schemas, types, validation).
          The second copies <InlineCode>kpi-card.tsx</InlineCode> into{" "}
          <InlineCode>@/components/taw/</InlineCode>. That file is yours — edit
          layout, styles, behavior, anything. The{" "}
          <InlineCode>KpiCardSchema</InlineCode> it imports from{" "}
          <InlineCode>taw-ui</InlineCode> stays versioned so contracts survive
          your customizations.
        </p>
      </section>

      {/* Step 2 — Define tool */}
      <section className="space-y-3">
        <StepLabel n="2">Define your tool</StepLabel>
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
        <p className="text-[12.5px] leading-relaxed text-(--taw-text-muted)">
          The <InlineCode>outputSchema</InlineCode> does double duty: it tells
          the LLM what shape to return, and it{"'"}s the same schema your component
          validates against at render time. One schema. Both sides. No
          synchronization required.
        </p>
      </section>

      {/* Step 3 — Render */}
      <section className="space-y-3">
        <StepLabel n="3">Render</StepLabel>
        <CodeBlock label="chat.tsx — render component">{`import { KpiCard } from "@/components/taw/kpi-card"

<KpiCard part={part} />`}</CodeBlock>
      </section>

      {/* Live result */}
      <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-5 shadow-(--taw-shadow-sm)">
        <KpiCard part={demoPart} />
      </div>

      {/* What you just gained */}
      <section className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-5 shadow-(--taw-shadow-sm)">
        <h2 className="mb-1 text-[14px] font-semibold text-(--taw-text-primary)">
          What you just gained
        </h2>
        <p className="mb-4 text-[12.5px] text-(--taw-text-muted)">
          That one line does a lot:
        </p>
        <div className="space-y-2.5">
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Loading state</strong>{" "}
            — while the tool is running, <InlineCode>KpiCard</InlineCode> shows a
            shimmer skeleton automatically. No <InlineCode>if (loading)</InlineCode> needed.
          </GainRow>
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Streaming</strong>{" "}
            — as partial data arrives, the component renders progressively.
            Skeletons fill in as fields resolve.
          </GainRow>
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Animated entrance</strong>{" "}
            — numbers count up with spring physics when the result lands.
            Motion that feels earned, not decorative.
          </GainRow>
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Schema validation</strong>{" "}
            — if the AI returns the wrong shape, you get a helpful inline error
            with field-level details and "Did you mean?" suggestions. Never a
            blank space, never a silent failure.
          </GainRow>
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Source provenance</strong>{" "}
            — the <InlineCode>source</InlineCode> field renders as a subtle
            footer automatically. Users know where the data came from.
          </GainRow>
          <GainRow>
            <strong className="font-medium text-(--taw-text-primary)">Full ownership</strong>{" "}
            — the component lives in your project. Open{" "}
            <InlineCode>@/components/taw/kpi-card.tsx</InlineCode> and change
            anything. The schema contract is the only thing that stays versioned.
          </GainRow>
        </div>
      </section>

      {/* Next steps */}
      <section>
        <h2 className="mb-4 text-[14px] font-semibold text-(--taw-text-primary)">
          Where to go next
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/docs/concepts",
              label: "Concepts",
              desc: "The mental model: lifecycle, confidence, receipt pattern, and more",
              primary: true,
            },
            {
              href: "/docs/principles",
              label: "Principles",
              desc: "The design thinking behind taw-ui — how we believe AI interfaces should be built",
              primary: false,
            },
            {
              href: "/docs/components/kpi-card",
              label: "KpiCard",
              desc: "The component you just added — full props, schema, and examples",
              primary: false,
            },
            {
              href: "/docs/components/data-table",
              label: "DataTable",
              desc: "Sortable tables with 9 column types — currency, percent, delta, badges",
              primary: false,
            },
            {
              href: "/docs/components/option-list",
              label: "OptionList",
              desc: "Interactive choices with the receipt pattern — see decisions in action",
              primary: false,
            },
            {
              href: "/docs/components/insight-card",
              label: "InsightCard",
              desc: "Structured AI analysis with sentiment-coded recommendations",
              primary: false,
            },
            {
              href: "/docs/components/alert-card",
              label: "AlertCard",
              desc: "Severity-based proactive alerts with inline metrics",
              primary: false,
            },
            {
              href: "/docs/components/link-card",
              label: "LinkCard",
              desc: "Rich link previews with OG metadata and favicon",
              primary: false,
            },
          ].map(({ href, label, desc, primary }) => (
            <a
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-(--taw-radius-lg) border bg-(--taw-surface) px-4 py-3.5 shadow-(--taw-shadow-sm) transition-all hover:shadow-(--taw-shadow-md) ${
                primary
                  ? "border-(--taw-accent)/40 hover:border-(--taw-accent)"
                  : "border-(--taw-border) hover:border-(--taw-accent)/30"
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-white ${
                primary
                  ? "bg-(--taw-accent) text-white"
                  : "bg-(--taw-accent-subtle) text-(--taw-accent) group-hover:bg-(--taw-accent)"
              }`}>
                <PixelIcon name="arrow-right" size={12} />
              </div>
              <div>
                <span className="block text-[13px] font-medium text-(--taw-text-primary)">{label}</span>
                <span className="text-[11px] text-(--taw-text-muted)">{desc}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
