"use client"

import { useState } from "react"
import Link from "next/link"
import { MemoryCard } from "@taw-ui/react"
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

function InteractiveMemoryCard({
  label,
  part,
}: {
  label: string
  part: Parameters<typeof MemoryCard>[0]["part"]
}) {
  const [receipt, setReceipt] = useState<TawReceipt | undefined>()

  return (
    <Section label={label}>
      <MemoryCard
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

export default function MemoryCardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">MemoryCard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Memory review card with confirm/dismiss/correct actions per memory item.
        </p>
      </div>

      <div className="grid gap-8">
        <Section label="Loading">
          <MemoryCard part={mocks.memoryCard.loading} />
        </Section>

        <Section label="Error">
          <MemoryCard part={mocks.memoryCard.error} />
        </Section>

        <InteractiveMemoryCard
          label="Interactive (Basic)"
          part={mocks.memoryCard.basic}
        />
      </div>
    </div>
  )
}
