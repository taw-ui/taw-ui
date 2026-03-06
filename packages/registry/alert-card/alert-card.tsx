"use client"

import { motion } from "framer-motion"
import { useCallback } from "react"
import type { TawToolPart, TawReceipt, TawInteractiveProps } from "taw-ui"
import { createReceipt } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, Typewriter } from "../lib/shared"
import { parseAlertCard, type AlertCardData } from "./schema"

// ─── Severity config ─────────────────────────────────────────────────────────

const severityConfig = {
  info: {
    border: "border-l-(--taw-accent)",
    icon: "\u2139",
    iconColor: "text-(--taw-accent)",
    badge: "bg-(--taw-accent)/10 text-(--taw-accent)",
  },
  warning: {
    border: "border-l-(--taw-warning)",
    icon: "\u26A0",
    iconColor: "text-(--taw-warning)",
    badge: "bg-(--taw-warning)/10 text-(--taw-warning)",
  },
  critical: {
    border: "border-l-(--taw-error)",
    icon: "\u2718",
    iconColor: "text-(--taw-error)",
    badge: "bg-(--taw-error)/10 text-(--taw-error)",
  },
} as const

// ─── Receipt ─────────────────────────────────────────────────────────────────

function AlertCardReceipt({
  data,
  receipt,
  animate,
}: {
  data: AlertCardData
  receipt: TawReceipt
  animate: boolean
}) {
  const severity = severityConfig[data.severity]
  const isCancelled = receipt.outcome === "cancelled"

  return (
    <motion.div
      {...getEnterProps(animate)}
      className={cn(
        "flex items-center gap-3 rounded-(--taw-radius) border border-l-[3px] px-4 py-3",
        "bg-(--taw-surface) border-(--taw-border)",
        severity.border,
        isCancelled && "opacity-60",
      )}
      data-taw-component="alert-card"
      data-taw-id={data.id}
      data-taw-receipt
    >
      <span className={cn("text-sm", severity.iconColor)}>
        {data.severity === "critical" ? "\u2718" : "\u2713"}
      </span>
      <span className="text-sm text-(--taw-text-muted)">
        {receipt.summary}
      </span>
    </motion.div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function AlertCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["14px", "200px"],
        ["10px", "280px"],
        ["24px", "100%"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── AlertCard ───────────────────────────────────────────────────────────────

export interface AlertCardProps extends TawInteractiveProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function AlertCard({
  part,
  animate = true,
  className,
  onAction,
  receipt,
  pending = false,
}: AlertCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <AlertCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = parseAlertCard(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as AlertCardData

  if (receipt) {
    return <AlertCardReceipt data={data} receipt={receipt} animate={animate} />
  }

  return (
    <AlertCardInteractive
      data={data}
      animate={animate}
      className={className}
      onAction={onAction}
      pending={pending}
    />
  )
}

// ─── Interactive ─────────────────────────────────────────────────────────────

function AlertCardInteractive({
  data,
  animate,
  className,
  onAction,
  pending,
}: {
  data: AlertCardData
  animate: boolean
  className?: string | undefined
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  pending: boolean
}) {
  const severity = severityConfig[data.severity]

  const handleAction = useCallback(
    (actionId: string, label: string) => {
      const isPrimary = data.actions?.find((a) => a.id === actionId)?.primary
      onAction?.(actionId, {
        receipt: createReceipt(
          actionId,
          isPrimary ? "success" : "cancelled",
          label,
        ),
      })
    },
    [data.actions, onAction],
  )

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "flex flex-col gap-3 rounded-(--taw-radius) border border-l-[3px] p-4",
        "bg-(--taw-surface) border-(--taw-border)",
        severity.border,
        className,
      )}
      data-taw-component="alert-card"
      data-taw-id={data.id}
    >
      {/* Header */}
      <motion.div variants={enterVariants} className="flex items-start gap-3">
        <span className={cn("mt-0.5 text-base", severity.iconColor)}>
          {severity.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-(--taw-text-primary)">
              {data.title}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                severity.badge,
              )}
            >
              {data.severity}
            </span>
          </div>
          {data.description && (
            <p className="mt-0.5 text-xs text-(--taw-text-muted)">
              {data.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Inline metrics */}
      {data.metrics && data.metrics.length > 0 && (
        <motion.div
          variants={enterVariants}
          className="flex flex-wrap gap-4 rounded-(--taw-radius) bg-(--taw-surface-sunken) px-3 py-2"
        >
          {data.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
                {metric.label}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-(--taw-text-primary)">
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
          ))}
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

      {/* Actions */}
      {onAction && data.actions && data.actions.length > 0 && (
        <motion.div variants={enterVariants} className="flex justify-end gap-2 pt-1">
          {data.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action.id, action.label)}
              disabled={pending}
              className={cn(
                "rounded-(--taw-radius) px-3 py-1.5 text-xs font-medium transition-colors",
                action.primary
                  ? "bg-(--taw-accent) text-white hover:opacity-90"
                  : "text-(--taw-text-muted) hover:text-(--taw-text-primary)",
                pending && "pointer-events-none opacity-50",
              )}
            >
              {pending ? "\u2026" : action.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
