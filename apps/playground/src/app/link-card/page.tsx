"use client"

import Link from "next/link"
import { LinkCard } from "@taw-ui/react"
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

export default function LinkCardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">LinkCard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Rich link preview card with title, description, domain, and optional image.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section label="Loading">
          <LinkCard part={mocks.linkCard.loading} />
        </Section>

        <Section label="Error">
          <LinkCard part={mocks.linkCard.error} />
        </Section>

        <Section label="Basic Link">
          <LinkCard part={mocks.linkCard.basic} />
        </Section>

        <Section label="With Image">
          <LinkCard part={mocks.linkCard.withImage} />
        </Section>
      </div>
    </div>
  )
}
