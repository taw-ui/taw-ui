"use client"

import { TrendingUp, TrendingDown, AlertTriangle, CircleHelp } from "lucide-react"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { cn } from "./lib/utils"
import type { ToolPart } from "./lib/types"
import { safeParse } from "./lib/types"
import {
  getEnterProps,
  staggerParent,
  enterVariants,
} from "./lib/motion"
import {
  TawSkeleton,
  TawError,
  SourceLabel,
  ConfidenceBadge,
  Typewriter,
} from "./lib/taw"
import {
  insightCardSchema,
  type InsightMetricData,
} from "./insight-card.schema"

// ─── Sentiment ───────────────────────────────────────────────────────────────

const SENTIMENT = {
  positive: {
    label: "Recommended",
    icon: TrendingUp,
    text: "text-emerald-600 dark:text-emerald-400",
    textBold: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-500/8 dark:bg-emerald-500/10",
    border: "border-emerald-500/30 dark:border-emerald-400/20",
    dot: "bg-emerald-500",
  },
  negative: {
    label: "Attention Needed",
    icon: TrendingDown,
    text: "text-red-600 dark:text-red-400",
    textBold: "text-red-700 dark:text-red-300",
    bg: "bg-red-500/8 dark:bg-red-500/10",
    border: "border-red-500/30 dark:border-red-400/20",
    dot: "bg-red-500",
  },
  caution: {
    label: "Under Review",
    icon: AlertTriangle,
    text: "text-amber-600 dark:text-amber-400",
    textBold: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-500/8 dark:bg-amber-500/10",
    border: "border-amber-500/30 dark:border-amber-400/20",
    dot: "bg-amber-500",
  },
} as const

// ─── Metric status ───────────────────────────────────────────────────────────

function metricValueColor(status?: InsightMetricData["status"]) {
  switch (status) {
    case "good":
      return "text-emerald-600 dark:text-emerald-400"
    case "warning":
      return "text-amber-600 dark:text-amber-400"
    case "critical":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-foreground"
  }
}

function metricDotColor(status?: InsightMetricData["status"]) {
  switch (status) {
    case "good":
      return "bg-emerald-500"
    case "warning":
      return "bg-amber-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-muted-foreground/25"
  }
}

// ─── InsightCard ─────────────────────────────────────────────────────────────

export interface InsightCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function InsightCard({
  part,
  animate = true,
  className,
}: InsightCardProps) {
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["10px", "80px"],
          ["16px", "220px"],
          ["48px", "100%"],
          ["12px", "100%"],
          ["12px", "100%"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="InsightCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(insightCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="InsightCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data
  const s = SENTIMENT[data.sentiment]
  const Icon = s.icon

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("relative gap-0 overflow-hidden py-0", className)}
        data-taw="insight-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* ── Verdict: sentiment + title ─────────────────────────────── */}
        <motion.div variants={enterVariants} className="px-5 pb-1 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Icon size={14} className={s.text} strokeWidth={2.5} />
            <span className={cn("text-[11px] font-semibold uppercase tracking-widest", s.text)}>
              {s.label}
            </span>
          </div>
          <h3 className="text-[15px] font-semibold leading-snug text-foreground">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="mt-1 text-[12px] text-muted-foreground">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* ── Recommendation ─────────────────────────────────────────── */}
        {data.recommendation && (
          <motion.div variants={enterVariants} className="px-5 py-4">
            <div className={cn("rounded-xl border px-4 py-3.5", s.border, s.bg)}>
              <Typewriter
                text={data.recommendation}
                animate={animate}
                className={cn("text-[13px] font-medium leading-relaxed", s.textBold)}
              />
            </div>
          </motion.div>
        )}

        {/* ── Metrics list ───────────────────────────────────────────── */}
        {data.metrics.length > 0 && (
          <motion.div variants={enterVariants} className="px-5 pb-4">
            <div className="flex flex-col">
              {data.metrics.map((metric, i) => (
                <div
                  key={`${metric.label}-${i}`}
                  className={cn(
                    "flex items-center justify-between py-2",
                    i < data.metrics.length - 1 && "border-b border-dashed border-border/60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", metricDotColor(metric.status))} />
                    <span className="text-[12px] text-muted-foreground">
                      {metric.label}
                    </span>
                  </div>
                  <span className={cn("font-mono text-[13px] font-semibold tabular-nums", metricValueColor(metric.status))}>
                    {metric.value}
                    {metric.unit && (
                      <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Reasoning ──────────────────────────────────────────────── */}
        {data.reasoning && (
          <motion.div variants={enterVariants} className="border-t px-5 py-4">
            <div className="flex gap-2.5">
              <CircleHelp size={14} className="mt-[3px] shrink-0 text-muted-foreground/40" />
              <p className="text-[12px] leading-relaxed text-muted-foreground/80">
                {data.reasoning}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Caveat ─────────────────────────────────────────────────── */}
        {data.caveat && (
          <motion.div
            variants={enterVariants}
            className="mx-5 mb-4 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
          >
            <span className="mt-0.5 shrink-0 text-[10px] text-primary">
              {"\u2192"}
            </span>
            <Typewriter
              text={data.caveat}
              animate={animate}
              className="text-[11px] leading-relaxed text-primary"
            />
          </motion.div>
        )}

        {/* ── Source ──────────────────────────────────────────────────── */}
        {data.source && (
          <motion.div variants={enterVariants} className="border-t px-5 py-2.5">
            <SourceLabel source={data.source} />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
