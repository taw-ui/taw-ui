"use client"

import { useState, useCallback } from "react"
import { OptionList } from "@taw-ui/react"
import type { TawReceipt } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  KeyboardTable,
  RelatedComponents,
} from "@/components/docs-components"
import { optionListFixtures, optionListOptions } from "@/fixtures/option-list"
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
          className="self-start rounded-lg border border-(--taw-border) bg-(--taw-surface) px-3 py-1.5 font-mono text-[11px] text-(--taw-text-muted) transition-all hover:border-(--taw-accent)/30 hover:text-(--taw-text-primary)"
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
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Interactive
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          OptionList
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Let the AI propose choices and the human decide. Single or multi-select
          with keyboard navigation, AI reasoning, selection constraints, and the
          receipt pattern for post-decision display.
        </p>
      </div>

      {/* States preview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          States
        </h2>
        <ComponentPreview
          fixtures={optionListFixtures}
          options={optionListOptions}
          chatMessages={({ part, onAction, receipt, pending }) => [
            { role: "user", content: "Deploy the database migration" },
            {
              role: "assistant",
              content: "I\u2019ve prepared the deployment options:",
              tool: (
                <OptionList
                  part={part}
                  onAction={onAction}
                  receipt={receipt}
                  pending={pending}
                />
              ),
            },
            ...(receipt
              ? [{ role: "assistant" as const, content: "Deploying now \u2014 I\u2019ll notify you when it\u2019s done." }]
              : []),
          ]}
          code={`import { OptionList } from "@/components/taw/option-list"
import type { TawReceipt } from "taw-ui"

const [receipt, setReceipt] = useState<TawReceipt>()

<OptionList
  part={part}
  onAction={(actionId, payload) => {
    setReceipt(payload.receipt)
  }}
  receipt={receipt}
/>`}
        >
          {(part) => <OptionList part={part} />}
        </ComponentPreview>
      </section>

      {/* Interactive demo */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Try It
        </h2>
        <p className="mb-4 text-[13px] text-(--taw-text-muted)">
          Select an option and click Deploy. The list collapses to a receipt.
        </p>
        <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-6 shadow-(--taw-shadow-sm)">
          <InteractiveDemo />
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "circle-dot", title: "Single or multi-select", desc: "Radio buttons for single, checkboxes for multi — controlled by selectionMode" },
            { icon: "shield", title: "Selection constraints", desc: "minSelections and maxSelections enforce valid choices, auto-disabling when max is reached" },
            { icon: "chat", title: "AI reasoning", desc: "Optional reasoning panel explains why these options were presented" },
            { icon: "receipt", title: "Receipt pattern", desc: "Collapses to a compact card showing selected options after decision" },
            { icon: "check", title: "Pre-selects recommended", desc: "Options marked recommended are selected by default" },
            { icon: "schema", title: "Cross-field validation", desc: "Duplicate IDs and invalid min/max caught at parse time via .superRefine()" },
          ]}
        />
      </section>

      {/* Receipt pattern */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Receipt Pattern
        </h2>
        <p className="text-[13px] leading-relaxed text-(--taw-text-muted)">
          After the user decides, the full list collapses to a compact receipt showing
          what was chosen — with descriptions preserved. This is critical for chat UIs where
          vertical space matters. Pass a <InlineCode>receipt</InlineCode> prop to render
          the receipt state. Use <InlineCode>createReceipt()</InlineCode> to construct receipts.
        </p>
      </section>

      {/* Schema */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <div className="space-y-4">
          <SchemaTable
            title="OptionListSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable backend identifier" },
              { field: "question", type: "string", req: true, desc: "The question or prompt shown to the user" },
              { field: "description", type: "string", desc: "Additional context below the question" },
              { field: "options", type: "Option[]", req: true, desc: "1-10 options to choose from" },
              { field: "selectionMode", type: '"single" | "multi"', desc: 'Selection behavior (default: "single")' },
              { field: "minSelections", type: "number", desc: "Minimum selections required (default: 1)" },
              { field: "maxSelections", type: "number", desc: "Maximum selections allowed" },
              { field: "required", type: "boolean", desc: "Whether cancel is hidden (default: true)" },
              { field: "reasoning", type: "string", desc: "AI explanation for these options" },
              { field: "confirmLabel", type: "string", desc: 'Confirm button text (default: "Confirm")' },
              { field: "cancelLabel", type: "string", desc: 'Cancel button text (default: "Skip")' },
              { field: "caveat", type: "string", desc: "AI caveat or disclaimer" },
              { field: "source", type: "Source", desc: "Data provenance (label + freshness)" },
            ]}
          />

          <SchemaTable
            title="Option"
            fields={[
              { field: "id", type: "string", req: true, desc: "Unique identifier within the list" },
              { field: "label", type: "string", req: true, desc: "Display label" },
              { field: "description", type: "string", desc: "Detail text below the label" },
              { field: "badge", type: "string", desc: "Custom badge text (e.g. \"Recommended\")" },
              { field: "recommended", type: "boolean", desc: "Pre-selects and shows green badge if no custom badge" },
              { field: "disabled", type: "boolean", desc: "Prevents selection of this option" },
              { field: "meta", type: "Record<string, unknown>", desc: "Arbitrary metadata passed through to receipts" },
            ]}
          />
        </div>
      </section>

      {/* Props */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state" },
            { field: "onAction", type: "(id, payload) => void", desc: "Callback for confirm/cancel actions" },
            { field: "receipt", type: "TawReceipt", desc: "Renders the receipt state when provided" },
            { field: "pending", type: "boolean", desc: "Disables all interactions while processing" },
            { field: "animate", type: "boolean", desc: "Enable entrance animations (default: true)" },
            { field: "className", type: "string", desc: "Additional CSS classes on the wrapper" },
          ]}
        />
      </section>

      {/* Accessibility */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Accessibility
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          OptionList uses <InlineCode>role=&quot;listbox&quot;</InlineCode> with{" "}
          <InlineCode>role=&quot;option&quot;</InlineCode> on each item,{" "}
          <InlineCode>aria-selected</InlineCode>, and{" "}
          <InlineCode>aria-multiselectable</InlineCode> for multi-select mode.
          Navigation uses roving tabindex so only the focused option is in the tab order.
        </p>
        <KeyboardTable
          shortcuts={[
            { key: "Arrow Down", desc: "Move focus to next enabled option" },
            { key: "Arrow Up", desc: "Move focus to previous enabled option" },
            { key: "Home", desc: "Move focus to first enabled option" },
            { key: "End", desc: "Move focus to last enabled option" },
            { key: "Enter / Space", desc: "Toggle selection on focused option" },
          ]}
        />
      </section>

      {/* Related */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Related
        </h2>
        <RelatedComponents
          items={[
            { href: "/docs/components/memory-card", label: "MemoryCard", desc: "Interactive memory review with receipts" },
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable rich tables" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
