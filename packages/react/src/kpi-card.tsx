"use client"

import { motion, useSpring, useTransform, type MotionProps } from "framer-motion"
import { useEffect, useRef } from "react"
import { cva } from "class-variance-authority"
import { KpiCard as KpiCardContract, type KpiCardData, type TawToolPart } from "@taw-ui/core"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { ConfidenceBadge, SourceLabel, TawError, TawSkeleton } from "./shared"

// ─── Variants ──────────────────────────────────────────────────────────────────

const cardVariants = cva(
  [
    "relative flex flex-col gap-1.5 rounded-[--taw-radius] border p-4",
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
  unit?: string | undefined
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
  trend?: "up" | "down" | "neutral" | undefined
  trendPositive?: boolean | undefined
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

// ─── KpiCard ──────────────────────────────────────────────────────────────────

export interface KpiCardProps {
  part: TawToolPart<unknown, unknown>
  variant?: "default" | "compact" | "wide"
  animate?: boolean | undefined
  motionProps?: MotionProps | undefined
  className?: string | undefined
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
    const skeletonLines: Record<string, Array<[string, string]>> = {
      default: [["12px", "64px"], ["28px", "96px"], ["10px", "48px"]],
      compact: [["10px", "48px"], ["22px", "72px"]],
      wide: [["12px", "80px"], ["32px", "120px"], ["10px", "56px"]],
    }
    return (
      <TawSkeleton
        lines={skeletonLines[variant] ?? skeletonLines.default!}
        animate={animate}
        className={cardVariants({ variant })}
      />
    )
  }

  // Error state
  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  // Parse and validate
  const result = KpiCardContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as KpiCardData

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
        <ConfidenceBadge confidence={data.confidence} />
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
          <SourceLabel source={data.source} />
        </motion.div>
      )}
    </motion.div>
  )
}
