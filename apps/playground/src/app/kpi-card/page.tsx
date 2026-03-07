"use client"

import Link from "next/link"
import { KpiCard } from "@taw-ui/react"
import { mocks } from "@/lib/mock-parts"

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </h3>
      <div>{children}</div>
    </div>
  )
}

export default function KpiCardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">KpiCard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Displays key performance indicators with sparklines, diffs, and confidence badges.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section label="Loading">
          <KpiCard part={mocks.kpiCard.loading} />
        </Section>

        <Section label="Streaming">
          <KpiCard part={mocks.kpiCard.streaming} />
        </Section>

        <Section label="Error">
          <KpiCard part={mocks.kpiCard.error} />
        </Section>

        <Section label="Invalid Data">
          <KpiCard part={mocks.kpiCard.invalidData} />
        </Section>

        <Section label="Single Stat (Hero)">
          <KpiCard part={mocks.kpiCard.single} />
        </Section>

        <Section label="Multi Stat (Grid)">
          <KpiCard part={mocks.kpiCard.multi} />
        </Section>

        <Section label="Low Confidence">
          <KpiCard part={mocks.kpiCard.lowConfidence} />
        </Section>
      </div>
    </div>
  )
}
