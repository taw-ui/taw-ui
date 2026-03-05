"use client"

import { motion, useSpring, useTransform, type MotionProps } from "framer-motion"
import { useEffect, useRef } from "react"
import { cva } from "class-variance-authority"
import {
  safeParseKpiCard,
  type KpiCardData,
  type TawToolPart,
  cn,
  getEnterProps,
  staggerParent,
  enterVariants,
  shimmerAnimation,
} from "@taw-ui/core"

// ─── Variants ──────────────────────────────────────────────────────────────────

const cardVariants = cva(
  [
    "relative flex flex-col gap-1.5 rounded-[6px] border p-4",
    "bg-[--taw-surface] border-[--taw-border]",
    "font-sans",
  ],
  {
    variants: {
      variant: {
        default: "min-w-[160px]",
        compact: "min-w-[120px] p-3 gap-1",
        wide: "min-w-[240px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiLabel({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-widest text-[--taw-text-muted]">
      {label}
    </span>
  )
}

function KpiValue({
  value,
  unit,
  animate,
}: {
  value: number | string
  unit?: string
  animate: boolean
}) {
  const isNumber = typeof value === "number"
  const spring = useSpring(0, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) =>
    Number.isInteger(value as number)
      ? Math.round(v).toLocaleString()
      : v.toFixed(2),
  )

  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isNumber && animate && !hasAnimated.current) {
      hasAnimated.current = true
      spring.set(value as number)
    }
  }, [isNumber, animate, value, spring])

  return (
    <span className="flex items-baseline gap-0.5">
      {unit && (
        <span className="text-base font-medium text-[--taw-text-muted]">
          {unit}
        </span>
      )}
      <span className="font-mono text-2xl font-semibold tabular-nums text-[--taw-text-primary]">
        {isNumber && animate ? <motion.span>{display}</motion.span> : value}
      </span>
    </span>
  )
}

function KpiDelta({
  delta,
  trend,
  trendPositive = true,
}: {
  delta: number
  trend?: "up" | "down" | "neutral"
  trendPositive?: boolean
}) {
  const isGood =
    trend === "neutral" ? null : trend === "up" ? trendPositive : !trendPositive
  const color =
    isGood === null
      ? "text-[--taw-text-muted]"
      : isGood
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400"
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→"
  const sign = delta > 0 ? "+" : ""

  return (
    <span className={cn("font-mono text-xs font-medium tabular-nums", color)}>
      {arrow} {sign}
      {delta}
    </span>
  )
}

function KpiConfidence({ confidence }: { confidence: number }) {
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
        "absolute right-3 top-3 rounded px-1.5 py-0.5 text-[10px] font-medium",
        color,
      )}
      title={`AI confidence: ${pct}%`}
    >
      {pct}%
    </span>
  )
}

function KpiSource({
  source,
}: {
  source: NonNullable<KpiCardData["source"]>
}) {
  return (
    <span className="mt-1 text-[10px] text-[--taw-text-muted]">
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
        <span className="ml-1 opacity-60">· {source.freshness}</span>
      )}
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function KpiCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <div className={cardVariants()}>
      <div
        className={cn(
          "h-3 w-16 rounded bg-[--taw-border]",
          animate && "overflow-hidden",
        )}
      >
        {animate && (
          <motion.div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.88 0 0 / 0.6) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={shimmerAnimation.animate}
            transition={shimmerAnimation.transition}
          />
        )}
      </div>
      <div className="h-7 w-24 rounded bg-[--taw-border]" />
    </div>
  )
}

// ─── Error ────────────────────────────────────────────────────────────────────

function KpiCardError({
  error,
  animate,
}: {
  error?: Error | string
  animate: boolean
}) {
  const msg = error instanceof Error ? error.message : error ?? "Unknown error"
  return (
    <motion.div
      {...(animate ? getEnterProps(true) : {})}
      className={cn(
        cardVariants(),
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-widest text-red-500">
        Error
      </span>
      <span className="font-mono text-xs text-red-700 dark:text-red-400">
        {msg}
      </span>
    </motion.div>
  )
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  part: TawToolPart<unknown, unknown>
  variant?: "default" | "compact" | "wide"
  animate?: boolean
  motionProps?: MotionProps
  className?: string
}

export function KpiCard({
  part,
  variant = "default",
  animate = true,
  motionProps,
  className,
}: KpiCardProps) {
  const { state, output, error } = part

  // Loading states
  if (state === "input-available" || state === "streaming") {
    return <KpiCardSkeleton animate={animate} />
  }

  // Error state
  if (state === "output-error") {
    return <KpiCardError error={error} animate={animate} />
  }

  // Parse and validate
  const data = safeParseKpiCard(output)
  if (!data) {
    return (
      <KpiCardError
        error="Invalid data: output does not match KpiCardSchema"
        animate={animate}
      />
    )
  }

  return (
    <motion.div
      {...getEnterProps(animate)}
      {...motionProps}
      variants={{
        ...staggerParent,
        ...motionProps?.variants,
      }}
      className={cn(cardVariants({ variant }), className)}
      data-taw-component="kpi-card"
      data-taw-id={data.id}
    >
      {data.confidence !== undefined && (
        <KpiConfidence confidence={data.confidence} />
      )}

      <motion.div variants={enterVariants}>
        <KpiLabel label={data.label} />
      </motion.div>

      <motion.div variants={enterVariants}>
        <KpiValue value={data.value} unit={data.unit} animate={animate} />
      </motion.div>

      {data.delta !== undefined && (
        <motion.div variants={enterVariants}>
          <KpiDelta
            delta={data.delta}
            trend={data.trend}
            trendPositive={data.trendPositive ?? true}
          />
        </motion.div>
      )}

      {data.description && (
        <motion.p
          variants={enterVariants}
          className="text-xs text-[--taw-text-muted]"
        >
          {data.description}
        </motion.p>
      )}

      {data.source && (
        <motion.div variants={enterVariants}>
          <KpiSource source={data.source} />
        </motion.div>
      )}
    </motion.div>
  )
}
