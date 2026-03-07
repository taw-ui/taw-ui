"use client"

import Link from "next/link"
import { DataTable } from "@taw-ui/react"
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

export default function DataTablePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-200">
          &larr; Back to All Components
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">DataTable</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Sortable data table with typed columns, currency/percent formatting, and badges.
        </p>
      </div>

      <div className="grid gap-8">
        <Section label="Loading">
          <DataTable part={mocks.dataTable.loading} />
        </Section>

        <Section label="Error">
          <DataTable part={mocks.dataTable.error} />
        </Section>

        <Section label="Basic Table">
          <DataTable part={mocks.dataTable.basic} />
        </Section>
      </div>
    </div>
  )
}
