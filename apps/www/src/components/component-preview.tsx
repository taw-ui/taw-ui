"use client"

import { useState } from "react"
import type { TawToolPart } from "@taw-ui/core"
import { cn } from "@taw-ui/react"

interface ComponentPreviewProps {
  fixtures: Record<string, TawToolPart>
  children: (part: TawToolPart, key: string) => React.ReactNode
}

export function ComponentPreview({ fixtures, children }: ComponentPreviewProps) {
  const entries = Object.entries(fixtures)
  const [active, setActive] = useState(entries[0]?.[0] ?? "")
  const activePart = fixtures[active]

  return (
    <div className="overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-md]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[--taw-border] bg-[--taw-surface] px-4 py-2">
        {/* Traffic lights */}
        <div className="mr-2 flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[oklch(0.70_0.17_25)]" />
          <span className="h-[10px] w-[10px] rounded-full bg-[oklch(0.80_0.15_80)]" />
          <span className="h-[10px] w-[10px] rounded-full bg-[oklch(0.70_0.17_150)]" />
        </div>

        {/* State tabs */}
        <div className="flex gap-px rounded-lg bg-[--taw-surface-sunken] p-0.5">
          {entries.map(([key]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-[11px] transition-all",
                active === key
                  ? "bg-[--taw-surface-raised] font-medium text-[--taw-text-primary] shadow-[--taw-shadow-sm]"
                  : "text-[--taw-text-muted] hover:text-[--taw-text-secondary]",
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="relative bg-[--taw-surface-sunken] p-6">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.5 0 0 / 0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          {activePart && children(activePart, active)}
        </div>
      </div>
    </div>
  )
}
