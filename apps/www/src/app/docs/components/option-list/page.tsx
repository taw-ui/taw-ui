"use client"

import { useState, useCallback } from "react"
import { OptionList } from "@taw-ui/react"
import type { TawReceipt } from "@taw-ui/core"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { optionListFixtures } from "@/fixtures/option-list"
import { CopyPage } from "@/components/copy-page"

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
      <OptionList
        part={optionListFixtures["ready"]!}
        onAction={handleAction}
        receipt={receipt}
      />
      {receipt && (
        <button
          onClick={() => setReceipt(undefined)}
          className="self-start rounded-lg border border-[--taw-border] bg-[--taw-surface] px-3 py-1.5 font-mono text-[11px] text-[--taw-text-muted] transition-all hover:border-[--taw-accent]/30 hover:text-[--taw-text-primary]"
        >
          Reset receipt
        </button>
      )}
    </div>
  )
}

export default function OptionListDocs() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
            Interactive
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[--taw-text-primary]">
          OptionList
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[--taw-text-secondary]">
          Interactive choice list where the AI proposes options and the user
          decides. Supports single/multi-select, scoring, AI reasoning,
          and the receipt pattern for post-decision display.
        </p>
      </div>

      {/* States preview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          States
        </h2>
        <ComponentPreview fixtures={optionListFixtures}>
          {(part) => <OptionList part={part} />}
        </ComponentPreview>
      </section>

      {/* Interactive demo */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Interactive Demo
        </h2>
        <p className="mb-4 text-[13px] text-[--taw-text-muted]">
          Select an option and click Deploy to see the receipt pattern in action.
        </p>
        <div className="overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface-sunken] p-6 shadow-[--taw-shadow-sm]">
          <InteractiveDemo />
        </div>
      </section>

      {/* Usage */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Usage
        </h2>
        <CodeBlock label="usage.tsx">{`import { OptionList } from "@taw-ui/react"
import type { TawReceipt } from "@taw-ui/core"

// Display only (no interaction)
<OptionList part={part} />

// Interactive with receipt
const [receipt, setReceipt] = useState<TawReceipt>()

<OptionList
  part={part}
  onAction={(actionId, payload) => {
    // payload.receipt contains the TawReceipt
    setReceipt(payload.receipt)
  }}
  receipt={receipt}
/>`}</CodeBlock>
      </section>

      {/* Receipt pattern */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Receipt Pattern
        </h2>
        <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
          After the user makes a decision, the full option list collapses into a
          compact receipt showing what was chosen. This is critical for chat UIs
          where vertical space matters — you don{"'"}t want a 10-option list taking
          up the screen after the user has already decided.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-[--taw-text-muted]">
          Pass a <InlineCode>receipt</InlineCode> prop
          to render the receipt state. The component handles the transition.
          Use <InlineCode>createReceipt()</InlineCode> from
          {" "}<InlineCode>@taw-ui/core</InlineCode> to
          construct receipts.
        </p>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Single or multi-select", desc: "Controlled by the schema's multiple field" },
            { title: "Score visualization", desc: "Options can show a 0–1 score as an animated bar" },
            { title: "AI reasoning", desc: "Optional reasoning panel explains why these options were presented" },
            { title: "Receipt pattern", desc: "Collapses to compact read-only state after decision" },
            { title: "Duplicate ID validation", desc: "Caught at parse time via .superRefine()" },
            { title: "Pre-selects recommended", desc: "Recommended option is selected by default" },
          ].map(({ title, desc }) => (
            <div key={title} className="rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] px-4 py-3 shadow-[--taw-shadow-sm]">
              <span className="block text-[13px] font-medium text-[--taw-text-primary]">{title}</span>
              <p className="mt-0.5 text-[12px] text-[--taw-text-muted]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
