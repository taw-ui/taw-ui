"use client"

import { KpiCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import { kpiCardFixtures } from "@/fixtures/kpi-card"
import { CopyPage } from "@/components/copy-page"

export default function KpiCardDocs() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
            Display
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[--taw-text-primary]">
          KpiCard
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[--taw-text-secondary]">
          Single metric display with animated value counting, trend delta,
          AI confidence badge, and data source attribution.
        </p>
      </div>

      {/* Live preview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Preview
        </h2>
        <ComponentPreview fixtures={kpiCardFixtures}>
          {(part) => <KpiCard part={part} />}
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Usage
        </h2>
        <CodeBlock label="usage.tsx">{`import { KpiCard } from "@taw-ui/react"

// Zero config — just pass the tool part
<KpiCard part={part} />

// With variant
<KpiCard part={part} variant="compact" />
<KpiCard part={part} variant="wide" />`}</CodeBlock>
      </section>

      {/* Variants */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Variants
        </h2>
        <div className="flex flex-wrap gap-5">
          {["default", "compact", "wide"].map((variant) => (
            <div key={variant} className="space-y-2">
              <span className="block font-mono text-[11px] text-[--taw-text-muted]">{variant}</span>
              <KpiCard
                part={kpiCardFixtures["ready"]!}
                {...(variant !== "default" ? { variant: variant as "compact" | "wide" } : {})}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Schema */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Schema
        </h2>
        <div className="overflow-x-auto rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-sm]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[--taw-border] bg-[--taw-surface]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Field</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Type</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Required</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Description</th>
              </tr>
            </thead>
            <tbody className="bg-[--taw-surface-raised]">
              {[
                ["id", "string", "yes", "Stable backend identifier"],
                ["label", "string", "yes", "Metric name displayed above the value"],
                ["value", "number | string", "yes", "The metric value — numbers animate on entrance"],
                ["unit", "string", "no", "Unit prefix (e.g. \"$\", \"%\", \"ms\")"],
                ["delta", "number", "no", "Change from previous period"],
                ["trend", "\"up\" | \"down\" | \"neutral\"", "no", "Direction arrow"],
                ["trendPositive", "boolean", "no", "Whether \"up\" is good (default: true)"],
                ["confidence", "number (0–1)", "no", "AI confidence — renders badge with color coding"],
                ["source", "{ label, freshness?, url? }", "no", "Data provenance display"],
                ["description", "string", "no", "Footnote below the value"],
              ].map(([field, type, req, desc]) => (
                <tr key={field} className="border-b border-[--taw-border] last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[--taw-accent]">{field}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[--taw-text-primary]">{type}</td>
                  <td className="px-4 py-2.5">
                    {req === "yes" ? (
                      <span className="inline-block rounded bg-[--taw-accent-subtle] px-1.5 py-0.5 text-[10px] font-medium text-[--taw-accent]">required</span>
                    ) : (
                      <span className="text-[12px] text-[--taw-text-muted]">optional</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-[--taw-text-muted]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Spring-animated numbers", desc: "Values count up using spring physics, not linear interpolation" },
            { title: "Confidence badge", desc: "Color-coded (green/amber/red) based on AI certainty" },
            { title: "Source attribution", desc: "Shows where data came from with optional link and freshness" },
            { title: "Shimmer skeleton", desc: "Physics-based shimmer during loading, not CSS keyframes" },
            { title: "Helpful errors", desc: "Parse failures render with field-level suggestions, never silent null" },
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
