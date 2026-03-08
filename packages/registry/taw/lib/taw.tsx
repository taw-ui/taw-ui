"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "./utils"
import { getEnterProps, enterVariants, staggerParent } from "./motion"
import type { ParseIssue, SourceData } from "./types"

// ─── Skeleton ───────────────────────────────────────────────────────────────

interface TawSkeletonProps {
  lines?: Array<[height: string, width: string]>
  className?: string | undefined
}

export function TawSkeleton({
  lines = [
    ["12px", "80px"],
    ["28px", "140px"],
    ["10px", "60px"],
  ],
  className,
}: TawSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4",
        className,
      )}
    >
      {lines.map(([height, width], i) => (
        <div
          key={i}
          className="animate-pulse rounded-md bg-primary/10"
          style={{ height, width }}
        />
      ))}
    </div>
  )
}

// ─── Error ──────────────────────────────────────────────────────────────────

interface TawErrorProps {
  title: string
  message?: string | undefined
  issues?: ParseIssue[] | undefined
  animate?: boolean | undefined
  className?: string | undefined
}

export function TawError({
  title,
  message,
  issues,
  animate = true,
  className,
}: TawErrorProps) {
  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "overflow-hidden rounded-xl border bg-card font-sans",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b bg-muted/50 px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-destructive-foreground">
          !
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-destructive">
          {issues ? "Schema Validation Failed" : "Tool Error"}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <motion.p
          variants={enterVariants}
          className="font-mono text-xs leading-relaxed text-muted-foreground"
        >
          {title}: {message ?? "Unknown error"}
        </motion.p>

        {issues && issues.length > 0 && (
          <motion.div
            variants={enterVariants}
            className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3"
          >
            {issues.map((issue, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2 font-mono text-[11px]">
                  <span className="text-destructive">missing</span>
                  <span className="font-medium text-foreground">
                    {issue.path}
                  </span>
                  {issue.expected && (
                    <span className="text-muted-foreground">
                      expected {issue.expected}
                    </span>
                  )}
                </div>
                {issue.received && (
                  <span className="pl-[52px] font-mono text-[10px] text-muted-foreground">
                    received: {issue.received}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {!issues && (
          <motion.p
            variants={enterVariants}
            className="text-[11px] text-muted-foreground"
          >
            The tool returned an error instead of data. This usually means the
            upstream API failed — retry or check the tool{"'"}s logs.
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Source Label ────────────────────────────────────────────────────────────

type Source = NonNullable<SourceData>

export function SourceLabel({ source }: { source: Source }) {
  return (
    <span className="text-[10px] text-muted-foreground">
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted hover:decoration-solid"
        >
          {source.label}
        </a>
      ) : (
        source.label
      )}
      {source.freshness && (
        <span className="ml-1 opacity-60">&middot; {source.freshness}</span>
      )}
    </span>
  )
}

// ─── Confidence Badge ───────────────────────────────────────────────────────

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color =
    pct >= 80
      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
      : pct >= 60
        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
        : "bg-red-500/20 text-red-600 dark:text-red-400"

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

// ─── Typewriter ─────────────────────────────────────────────────────────────

export function Typewriter({
  text,
  speed = 40,
  animate = true,
  className,
}: {
  text: string
  speed?: number
  animate?: boolean
  className?: string
}) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(!animate)

  useEffect(() => {
    if (!animate || done) return

    const interval = 1000 / speed
    let i = 0
    const timer = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) {
        setDone(true)
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animate, done, text, speed])

  if (done) return <span className={className}>{text}</span>

  return <span className={className}>{text.slice(0, count)}</span>
}
