"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCard } from "@taw-ui/react"
import type { TawReceipt } from "taw-ui"
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

function InteractiveAlertCard({
  label,
  part,
}: {
  label: string
  part: Parameters<typeof AlertCard>[0]["part"]
}) {
  const [receipt, setReceipt] = useState<TawReceipt | undefined>()

  return (
    <Section label={label}>
      <AlertCard
        part={part}
        onAction={(_actionId, payload) => {
          const p = payload as { receipt?: TawReceipt }
          if (p.receipt) setReceipt(p.receipt)
        }}
        receipt={receipt}
      />
      {receipt && (
        <button
          onClick={() => setReceipt(undefined)}
          className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
        >
          Reset receipt
        </button>
      )}
    </Section>
  )
}

export default function AlertCardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">AlertCard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Severity-based alert with metrics, actions, and receipt state.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section label="Loading">
          <AlertCard part={mocks.alertCard.loading} />
        </Section>

        <Section label="Error">
          <AlertCard part={mocks.alertCard.error} />
        </Section>

        <InteractiveAlertCard
          label="Warning"
          part={mocks.alertCard.warning}
        />

        <InteractiveAlertCard
          label="Critical"
          part={mocks.alertCard.critical}
        />

        <InteractiveAlertCard
          label="Info"
          part={mocks.alertCard.info}
        />
      </div>
    </div>
  )
}
