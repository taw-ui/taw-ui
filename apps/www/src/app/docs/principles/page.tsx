"use client"

import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { PixelIcon, type PixelIconName } from "@/components/pixel-icon"

// ─── Layout components ──────────────────────────────────────────────────────────

function Principle({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="relative">
      {/* Connector line between principles (desktop only) */}
      <div className="absolute -top-16 left-[15px] hidden h-16 w-px bg-gradient-to-b from-transparent to-(--taw-border) sm:block" />
      <div className="absolute left-[15px] top-10 hidden h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-(--taw-border) to-transparent sm:block" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent) font-pixel text-[12px] font-bold text-white shadow-[0_1px_3px_oklch(0_0_0/0.2),inset_0_1px_0_oklch(1_0_0/0.15)]">
          {number}
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4 sm:pl-11">
        {children}
      </div>
    </section>
  )
}

function Dont({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3.5 py-2.5">
      <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-(--taw-error) text-[9px] font-bold text-white">
        ✗
      </span>
      <span className="text-[12.5px] leading-relaxed text-(--taw-text-secondary)">
        {children}
      </span>
    </div>
  )
}

function Do({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3.5 py-2.5">
      <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-(--taw-success) text-[9px] font-bold text-white">
        ✓
      </span>
      <span className="text-[12.5px] leading-relaxed text-(--taw-text-secondary)">
        {children}
      </span>
    </div>
  )
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] leading-[1.7] text-(--taw-text-secondary)">
      {children}
    </p>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-5 overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-accent-subtle) px-5 py-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <p className="relative text-[14px] font-medium leading-relaxed text-(--taw-text-primary)">
        {children}
      </p>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function PrinciplesPage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Philosophy
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Principles
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-(--taw-text-secondary)">
          taw-ui is built for the next generation of Human-AI Interaction.
          These are the rules we follow — and the rules we think every AI
          tool UI library should follow.
        </p>

        <Callout>
          The AI returns JSON. The component renders it. The developer writes
          zero glue code. That{"'"}s the entire contract.
        </Callout>
      </div>

      {/* ─── Principle 01 ─── */}
      <Principle number="01" title="The Schema Is the API">
        <Rule>
          One Zod schema is the single source of truth. It validates on the
          server, validates on the client, infers TypeScript types, and drives
          rendering. There are no separate action definitions, surface
          configurations, or render instructions.
        </Rule>

        <Rule>
          The AI doesn{"'"}t need to know about React. It doesn{"'"}t need to know
          about components. It returns data that matches a schema — the same
          schema it already uses as its tool{"'"}s <InlineCode>outputSchema</InlineCode>.
          The rendering is the framework{"'"}s job, not the model{"'"}s job.
        </Rule>

        <CodeBlock label="The entire integration">{`// Server: define tool output shape
const getMetrics = tool({
  outputSchema: KpiCardSchema,
  execute: async () => ({
    id: "revenue",
    label: "Revenue",
    value: 142580,
    confidence: 0.92,
  }),
})

// Client: render it
<KpiCard part={part} />`}</CodeBlock>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Separate schema for validation and separate config for rendering
          </Dont>
          <Do>
            One schema drives everything — validation, types, and UI
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 02 ─── */}
      <Principle number="02" title="Zero Glue Code">
        <Rule>
          Components handle their entire lifecycle from a single prop.
          Loading? Skeleton with shimmer. Streaming? Progressive render.
          Success? Animated entrance. Parse error? Helpful inline error
          with field-level suggestions. The developer never writes
          conditional rendering for tool states.
        </Rule>

        <CodeBlock label="This is all you write">{`// Handles loading, streaming, error, AND success
<KpiCard part={part} />

// Not this:
if (part.state === "loading") return <Skeleton />
if (part.state === "error") return <Error msg={part.error} />
const data = validate(part.output)
if (!data) return <ParseError />
return <KpiCard data={data} />`}</CodeBlock>

        <Rule>
          Common affordances are built in, not opt-in. A DataTable sorts
          columns, formats currencies, and shows row counts by default. A
          KpiCard animates numbers and shows confidence badges by default.
          You don{"'"}t configure these — you disable them if you don{"'"}t want them.
        </Rule>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Wire up loading states, error boundaries, and validation manually
          </Dont>
          <Do>
            Pass the part. The component handles the rest.
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 03 ─── */}
      <Principle number="03" title="AI-Native Fields">
        <Rule>
          Every schema supports two fields that don{"'"}t exist in traditional UI
          libraries: <InlineCode>confidence</InlineCode> (0–1) and{" "}
          <InlineCode>source</InlineCode> (provenance). These are first-class
          because AI outputs are probabilistic — users deserve to know how
          certain the data is and where it came from.
        </Rule>

        <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border)">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-(--taw-border) bg-(--taw-surface)">
                <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">Confidence</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">Badge</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">Signal</th>
              </tr>
            </thead>
            <tbody className="bg-(--taw-surface-raised)">
              <tr className="border-b border-(--taw-border)">
                <td className="px-4 py-2 font-mono text-(--taw-text-primary)">≥ 0.8</td>
                <td className="px-4 py-2"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-(--taw-success)" />Green</span></td>
                <td className="px-4 py-2 text-(--taw-text-muted)">High certainty — safe to act on</td>
              </tr>
              <tr className="border-b border-(--taw-border)">
                <td className="px-4 py-2 font-mono text-(--taw-text-primary)">0.5 – 0.8</td>
                <td className="px-4 py-2"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-(--taw-warning)" />Amber</span></td>
                <td className="px-4 py-2 text-(--taw-text-muted)">Moderate — verify before acting</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-(--taw-text-primary)">{"<"} 0.5</td>
                <td className="px-4 py-2"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-(--taw-error)" />Red</span></td>
                <td className="px-4 py-2 text-(--taw-text-muted)">Low certainty — treat as estimate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Rule>
          These fields are optional in every schema. If the AI doesn{"'"}t
          provide them, the component renders cleanly without them. But
          when they{"'"}re present, the user sees exactly how much to trust
          the output. No other library does this.
        </Rule>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Show AI data without indicating certainty or source
          </Dont>
          <Do>
            Surface confidence and provenance so users can calibrate trust
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 04 ─── */}
      <Principle number="04" title="Decisions Produce Receipts">
        <Rule>
          When a component asks the user to decide (approve, select, confirm),
          the interactive controls must transform into a permanent record
          after the decision. This is the receipt pattern. It prevents stale
          buttons in chat history, saves vertical space, and gives the AI
          a clear signal of what was chosen.
        </Rule>

        {/* Visual flow */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {["Present", "Select", "Confirm", "Receipt"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--taw-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              <span className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium ${i === 3 ? "bg-(--taw-accent) text-white" : "border border-(--taw-border) bg-(--taw-surface) text-(--taw-text-secondary)"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <CodeBlock label="Full decision lifecycle">{`const [receipt, setReceipt] = useState<TawReceipt>()

<OptionList
  part={part}
  onAction={(actionId, payload) => {
    // payload.receipt is ready to use
    setReceipt(payload.receipt)
  }}
  receipt={receipt}
/>

// Before decision: full interactive list
// After decision: compact "✓ Rolling Deploy" receipt`}</CodeBlock>

        <Rule>
          Receipt labels use past tense: <strong>Approved</strong>,{" "}
          <strong>Selected</strong>, <strong>Confirmed</strong>,{" "}
          <strong>Skipped</strong>. The action description stays
          imperative. Pattern:{" "}
          <InlineCode>[Past-tense verb] [What was acted on]</InlineCode>
        </Rule>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Leave interactive buttons active after the user has decided
          </Dont>
          <Do>
            Collapse to a receipt — compact, permanent, referenceable
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 05 ─── */}
      <Principle number="05" title="Everything Is Addressable">
        <Rule>
          Every component, every option, every row has a stable{" "}
          <InlineCode>id</InlineCode>. These must be backend identifiers
          (database IDs, slugs, URLs) — never array indexes or random UUIDs
          generated at render time.
        </Rule>

        <Rule>
          Addressability is what makes the AI useful after the first response.
          When the user says {"\""} tell me more about the Acme Corp row{"\""}, the AI can
          reference <InlineCode>row.name === {'"'}Acme Corp{'"'}</InlineCode> because
          the data has stable keys. When the user picks an option, the receipt
          contains <InlineCode>selectedIds: [{'"'}rolling{'"'}]</InlineCode> — not
          {" "}<InlineCode>selectedIndex: 0</InlineCode>.
        </Rule>

        <div className="flex flex-col gap-1.5 rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
            Rendered DOM
          </span>
          <code className="text-[12px] leading-relaxed">
            <span style={{ color: "var(--taw-syn-tag)" }}>{"<div"}</span>
            {" "}
            <span style={{ color: "var(--taw-syn-attr)" }}>data-taw-component</span>
            <span style={{ color: "var(--taw-syn-operator)" }}>=</span>
            <span style={{ color: "var(--taw-syn-string)" }}>{'"kpi-card"'}</span>
            {" "}
            <span style={{ color: "var(--taw-syn-attr)" }}>data-taw-id</span>
            <span style={{ color: "var(--taw-syn-operator)" }}>=</span>
            <span style={{ color: "var(--taw-syn-string)" }}>{'"revenue-q4"'}</span>
            <span style={{ color: "var(--taw-syn-tag)" }}>{">"}</span>
          </code>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Use array indexes or render-time UUIDs as identifiers
          </Dont>
          <Do>
            Use stable backend IDs that persist across re-renders and sessions
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 06 ─── */}
      <Principle number="06" title="Chat-Native by Default">
        <Rule>
          AI tool UIs live inside chat. Chat is a vertical feed, 400–600px
          wide, where attention is scarce. Every component must communicate
          its purpose within the first 300px of vertical space. If a
          component needs tabs, navigation, or horizontal scrolling to be
          understood — it{"'"}s too complex.
        </Rule>

        <div className="grid grid-cols-3 gap-2">
          {[
            { metric: "400–600px", label: "Max width" },
            { metric: "300px", label: "First impression" },
            { metric: "44px", label: "Min tap target" },
          ].map(({ metric, label }) => (
            <div key={label} className="rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-3 py-2.5 text-center">
              <span className="block font-mono text-[14px] font-semibold text-(--taw-accent)">{metric}</span>
              <span className="mt-0.5 block text-[10px] text-(--taw-text-muted)">{label}</span>
            </div>
          ))}
        </div>

        <Rule>
          No input fields. The chat composer is the input. The only
          interactive elements are selection (pick from options the AI
          provides) and confirmation (approve/reject what the AI proposes).
          Limit visible choices to 5–7. If the AI needs to show more, it
          should say so — not render a paginated table.
        </Rule>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Build components that need tabs, forms, or horizontal scroll
          </Dont>
          <Do>
            Single-column, scannable in 300px, actionable with one tap
          </Do>
        </div>
      </Principle>

      {/* ─── Principle 07 ─── */}
      <Principle number="07" title="Fail Helpfully, Never Silently">
        <Rule>
          When the AI returns data that doesn{"'"}t match the schema, the
          component must never render <InlineCode>null</InlineCode>,
          crash, or show a blank space. It renders a helpful inline error
          that shows exactly which fields failed validation and suggests
          corrections.
        </Rule>

        <Rule>
          Parse errors show the expected type, the received value, and a
          {"\""} Did you mean? {"\""} suggestion when possible. This is critical for
          development — the AI model iterates faster when it can see what
          went wrong. And in production, a visible error is always better
          than a silent one.
        </Rule>

        <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--taw-error)/15 text-[10px] text-(--taw-error)">!</span>
            <span className="text-[12px] font-medium text-(--taw-error)">Schema validation failed</span>
          </div>
          <div className="space-y-1 pl-7 font-mono text-[11px]">
            <p className="text-(--taw-text-muted)">
              <span className="text-(--taw-error)">missing</span>{" "}
              <span className="text-(--taw-text-primary)">label</span>{" "}
              <span className="text-(--taw-text-muted)">(string) — received field {'"'}title{'"'}</span>
            </p>
            <p className="text-(--taw-text-muted)">
              <span className="text-(--taw-error)">missing</span>{" "}
              <span className="text-(--taw-text-primary)">value</span>{" "}
              <span className="text-(--taw-text-muted)">(number | string) — received field {'"'}amount{'"'}</span>
            </p>
            <p className="mt-1.5 text-(--taw-warning)">
              Did you mean: label → title, value → amount?
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Dont>
            Return null, throw, or console.error when data is invalid
          </Dont>
          <Do>
            Render inline errors with field-level details and suggestions
          </Do>
        </div>
      </Principle>

      {/* ─── The HAI Contract ─── */}
      <section>
        <h2 className="mb-5 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          The HAI Contract
        </h2>
        <p className="mb-6 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Human-AI Interaction has three participants. Each has a clear
          responsibility. When one oversteps, the experience breaks.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {([
            {
              role: "AI",
              icon: "diamond" as PixelIconName,
              does: "Returns structured data matching a schema. Introduces the component with context. References it later by ID.",
              doesnt: "Describe what the component already shows. Make rendering decisions. Generate HTML or styles.",
            },
            {
              role: "Component",
              icon: "circle-dot" as PixelIconName,
              does: "Validates data. Renders all states. Provides built-in affordances. Produces receipts from decisions.",
              doesnt: "Fetch data. Make AI calls. Render outside its container. Assume context about the conversation.",
            },
            {
              role: "Developer",
              icon: "triangle" as PixelIconName,
              does: "Registers tools with schemas. Maps tool names to components. Passes the part prop.",
              doesnt: "Write conditional rendering. Build loading states. Validate data manually. Style individual tool results.",
            },
          ]).map(({ role, icon, does, doesnt }) => (
            <div
              key={role}
              className="group rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-5 shadow-(--taw-shadow-sm) transition-all hover:shadow-(--taw-shadow-md)"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--taw-accent-subtle) text-(--taw-accent)">
                  <PixelIcon name={icon} size={16} />
                </span>
                <span className="font-pixel text-[13px] text-(--taw-text-primary)">
                  {role}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-(--taw-success)">
                    <span className="h-1 w-1 rounded-full bg-(--taw-success)" />
                    Responsible for
                  </span>
                  <p className="text-[12px] leading-relaxed text-(--taw-text-muted)">
                    {does}
                  </p>
                </div>
                <div className="border-t border-(--taw-border-subtle) pt-3">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-(--taw-error)">
                    <span className="h-1 w-1 rounded-full bg-(--taw-error)" />
                    Never does
                  </span>
                  <p className="text-[12px] leading-relaxed text-(--taw-text-muted)">
                    {doesnt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TL;DR ─── */}
      <section className="relative overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-accent-subtle) px-6 py-6">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <h2 className="relative mb-4 font-pixel text-[12px] uppercase tracking-wider text-(--taw-accent)">
          TL;DR
        </h2>
        <div className="relative grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            ["01", "One schema = validation + types + UI"],
            ["02", "One prop = loading + error + success"],
            ["03", "Confidence and source are first-class"],
            ["04", "Decisions collapse into receipts"],
            ["05", "Everything has a stable ID"],
            ["06", "Chat-native, single-column, no forms"],
            ["07", "Errors are visible, never silent"],
          ].map(([num, text]) => (
            <div key={num} className="flex items-baseline gap-2.5">
              <span className="font-pixel text-[10px] text-(--taw-accent)">{num}</span>
              <span className="text-[13px] leading-relaxed text-(--taw-text-primary)">{text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
