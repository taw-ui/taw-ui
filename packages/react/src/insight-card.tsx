"use client"

import { motion } from "framer-motion"
import {
  InsightCard as InsightCardContract,
  type InsightCardData,
  type InsightMetricData,
  type TawToolPart,
} from "taw-ui"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { SourceLabel, TawError, TawSkeleton, Typewriter } from "./shared"

// ─── Status colors ───────────────────────────────────────────────────────────

const statusColors = {
  good: "text-(--taw-success)",
  warning: "text-(--taw-warning)",
  critical: "text-(--taw-error)",
} as const

const sentimentConfig = {
  positive: {
    bg: "bg-(--taw-success)/10",
    text: "text-(--taw-success)",
    border: "border-(--taw-success)/20",
    icon: "\u2713",
  },
  caution: {
    bg: "bg-(--taw-warning)/10",
    text: "text-(--taw-warning)",
    border: "border-(--taw-warning)/20",
    icon: "\u2192",
  },
  negative: {
    bg: "bg-(--taw-error)/10",
    text: "text-(--taw-error)",
    border: "border-(--taw-error)/20",
    icon: "\u2717",
  },
} as const

// ─── Metric ──────────────────────────────────────────────────────────────────

function InsightMetric({ metric }: { metric: InsightMetricData }) {
  const valueColor = metric.status
    ? statusColors[metric.status]
    : "text-(--taw-text-primary)"

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
        {metric.label}
      </span>
      <span className={cn("font-mono text-sm font-semibold tabular-nums", valueColor)}>
        {typeof metric.value === "number"
          ? metric.value.toLocaleString()
          : metric.value}
        {metric.unit && (
          <span className="ml-0.5 text-[10px] font-normal text-(--taw-text-muted)">
            {metric.unit}
          </span>
        )}
      </span>
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function InsightCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["14px", "180px"],
        ["10px", "120px"],
        ["32px", "100%"],
        ["10px", "200px"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── InsightCard ─────────────────────────────────────────────────────────────

export interface InsightCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function InsightCard({
  part,
  animate = true,
  className,
}: InsightCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <InsightCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = InsightCardContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as InsightCardData
  const sentiment = sentimentConfig[data.sentiment ?? "caution"]

  // Grid columns based on metric count
  const metricCols =
    data.metrics.length <= 2
      ? "grid-cols-2"
      : data.metrics.length <= 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-4"

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "flex flex-col gap-3 rounded-(--taw-radius) border p-4",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
      data-taw-component="insight-card"
      data-taw-id={data.id}
    >
      {/* Header */}
      <motion.div variants={enterVariants}>
        <h3 className="text-sm font-semibold text-(--taw-text-primary)">
          {data.title}
        </h3>
        {data.subtitle && (
          <p className="mt-0.5 text-xs text-(--taw-text-muted)">
            {data.subtitle}
          </p>
        )}
      </motion.div>

      {/* Metrics grid */}
      <motion.div
        variants={enterVariants}
        className={cn(
          "grid gap-3 rounded-(--taw-radius) bg-(--taw-surface-sunken) p-3",
          metricCols,
        )}
      >
        {data.metrics.map((metric) => (
          <InsightMetric key={metric.label} metric={metric} />
        ))}
      </motion.div>

      {/* Recommendation badge */}
      {data.recommendation && (
        <motion.div
          variants={enterVariants}
          className={cn(
            "flex items-start gap-2 rounded-(--taw-radius) border px-3 py-2",
            sentiment.bg,
            sentiment.border,
          )}
        >
          <span className={cn("mt-px text-xs font-medium", sentiment.text)}>
            {sentiment.icon}
          </span>
          <span className={cn("text-xs font-medium leading-relaxed", sentiment.text)}>
            {data.recommendation}
          </span>
        </motion.div>
      )}

      {/* Source */}
      {data.source && (
        <motion.div variants={enterVariants}>
          <SourceLabel source={data.source} />
        </motion.div>
      )}

      {/* Reasoning */}
      {data.reasoning && (
        <motion.div
          variants={enterVariants}
          className="flex gap-2 rounded-(--taw-radius) bg-(--taw-accent-subtle) px-3 py-2"
        >
          <span className="mt-px text-[10px] text-(--taw-accent)">{"\u2192"}</span>
          <Typewriter
            text={data.reasoning}
            animate={animate}
            className="text-[11px] leading-relaxed text-(--taw-accent)"
          />
        </motion.div>
      )}

      {/* Caveat */}
      {data.caveat && (
        <motion.div
          variants={enterVariants}
          className="flex gap-2 rounded-(--taw-radius) bg-(--taw-accent-subtle) px-3 py-2"
        >
          <span className="mt-px text-[10px] text-(--taw-accent)">{"\u2192"}</span>
          <Typewriter
            text={data.caveat}
            animate={animate}
            className="text-[11px] leading-relaxed text-(--taw-accent)"
          />
        </motion.div>
      )}
    </motion.div>
  )
}
