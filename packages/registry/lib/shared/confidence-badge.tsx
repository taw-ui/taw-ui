"use client"

import { cn } from "../utils"

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color =
    pct >= 80
      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      : pct >= 60
        ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
        : "bg-red-500/20 text-red-700 dark:text-red-400"

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
