"use client"

import Link from "next/link"
import { InsightCard } from "@taw-ui/react"
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

export default function InsightCardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">InsightCard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Insight summary with sentiment, metrics, recommendations, and confidence.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section label="Loading">
          <InsightCard part={mocks.insightCard.loading} />
        </Section>

        <Section label="Error">
          <InsightCard part={mocks.insightCard.error} />
        </Section>

        <Section label="Positive Sentiment">
          <InsightCard part={mocks.insightCard.positive} />
        </Section>

        <Section label="Negative Sentiment">
          <InsightCard part={mocks.insightCard.negative} />
        </Section>
      </div>
    </div>
  )
}
