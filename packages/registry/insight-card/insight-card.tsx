"use client"

import { motion } from "framer-motion"
import type { TawToolPart } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants, transitions } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, ConfidenceBadge, Typewriter } from "../lib/shared"
import { parseInsightCard, type InsightCardData, type InsightMetricData } from "./schema"

// ─── Status colors ───────────────────────────────────────────────────────────

const statusColors = {
  good: "text-(--taw-success)",
  warning: "text-(--taw-warning)",
  critical: "text-(--taw-error)",
} as const

const statusDotColors = {
  good: "bg-(--taw-success)",
  warning: "bg-(--taw-warning)",
  critical: "bg-(--taw-error)",
} as const

const sentimentConfig = {
  positive: {
    bg: "bg-(--taw-success)/8",
    text: "text-(--taw-success)",
    border: "border-(--taw-success)/20",
    strip: "bg-(--taw-success)",
  },
  caution: {
    bg: "bg-(--taw-warning)/8",
    text: "text-(--taw-warning)",
    border: "border-(--taw-warning)/20",
    strip: "bg-(--taw-warning)",
  },
  negative: {
    bg: "bg-(--taw-error)/8",
    text: "text-(--taw-error)",
    border: "border-(--taw-error)/20",
    strip: "bg-(--taw-error)",
  },
} as const

// ─── Sentiment icons (SVG) ──────────────────────────────────────────────────

function SentimentIcon({ sentiment, className }: { sentiment: keyof typeof sentimentConfig; className?: string | undefined }) {
  const size = 14
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className }

  if (sentiment === "positive") {
    return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>
  }
  if (sentiment === "negative") {
    return <svg {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  }
  // caution
  return <svg {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
}

// ─── Metric ──────────────────────────────────────────────────────────────────

function InsightMetric({ metric, animate }: { metric: InsightMetricData; animate: boolean }) {
  const valueColor = metric.status
    ? statusColors[metric.status]
    : "text-(--taw-text-primary)"

  return (
    <motion.div
      className="group relative flex flex-col gap-1 rounded-lg p-2.5 transition-colors hover:bg-(--taw-surface)"
      {...(animate ? { whileHover: { y: -1 } } : {})}
      transition={transitions.snappy}
    >
      <div className="flex items-center gap-1.5">
        {metric.status && (
          <span className={cn("h-1.5 w-1.5 rounded-full", statusDotColors[metric.status])} />
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
          {metric.label}
        </span>
      </div>
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
    </motion.div>
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

  const result = parseInsightCard(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as InsightCardData
  const sentiment = sentimentConfig[data.sentiment ?? "caution"]
  const sentimentKey = data.sentiment ?? "caution"

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
        "relative overflow-hidden rounded-(--taw-radius-lg) border shadow-(--taw-shadow-sm)",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
      data-taw-component="insight-card"
      data-taw-id={data.id}
    >
      {/* Sentiment accent strip */}
      <div className={cn("absolute left-0 top-0 h-full w-1", sentiment.strip)} />

      {/* Confidence badge */}
      {data.confidence != null && <ConfidenceBadge confidence={data.confidence} />}

      <div className="flex flex-col gap-4 py-4 pr-4 pl-5">
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

        {/* Recommendation — hero element */}
        {data.recommendation && (
          <motion.div
            variants={enterVariants}
            className={cn(
              "flex items-start gap-2.5 rounded-(--taw-radius) border px-3 py-2.5",
              sentiment.bg,
              sentiment.border,
            )}
          >
            <span className={cn("mt-0.5 shrink-0", sentiment.text)}>
              <SentimentIcon sentiment={sentimentKey} />
            </span>
            <span className={cn("text-[13px] font-medium leading-relaxed", sentiment.text)}>
              {data.recommendation}
            </span>
          </motion.div>
        )}

        {/* Metrics grid */}
        <motion.div
          variants={enterVariants}
          className={cn(
            "grid rounded-(--taw-radius) bg-(--taw-surface-sunken)",
            metricCols,
          )}
        >
          {data.metrics.map((metric) => (
            <InsightMetric key={metric.label} metric={metric} animate={animate} />
          ))}
        </motion.div>

        {/* Reasoning */}
        {data.reasoning && (
          <motion.div
            variants={enterVariants}
            className="flex gap-2 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface-sunken) px-3 py-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-(--taw-text-muted)">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <Typewriter
              text={data.reasoning}
              animate={animate}
              className="text-[11px] leading-relaxed text-(--taw-text-secondary)"
            />
          </motion.div>
        )}

        {/* Caveat */}
        {data.caveat && (
          <motion.div
            variants={enterVariants}
            className="flex gap-2 rounded-(--taw-radius) bg-(--taw-warning)/6 px-3 py-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-(--taw-warning)">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <Typewriter
              text={data.caveat}
              animate={animate}
              className="text-[11px] leading-relaxed text-(--taw-warning)"
            />
          </motion.div>
        )}

        {/* Source */}
        {data.source && (
          <motion.div variants={enterVariants}>
            <SourceLabel source={data.source} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
