"use client"

import { cn } from "../utils"

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color =
    pct >= 80
      ? "bg-(--taw-success)/20 text-(--taw-success)"
      : pct >= 60
        ? "bg-(--taw-warning)/20 text-(--taw-warning)"
        : "bg-(--taw-error)/20 text-(--taw-error)"

  return (
    <span
      className={cn(
        "absolute right-3 top-3 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium",
        color,
      )}
      title={`AI confidence: ${pct}%`}
    >
      {pct}%
    </span>
  )
}
