"use client"

import { AlertTriangle, AlertCircle, Info, CircleCheck, CircleX, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "./lib/utils"
import type { ToolPart } from "./lib/types"
import { safeParse } from "./lib/types"
import {
  getEnterProps,
  staggerParent,
  enterVariants,
  pressProps,
} from "./lib/motion"
import {
  TawSkeleton,
  TawError,
  SourceLabel,
  Typewriter,
} from "./lib/taw"
import {
  alertCardSchema,
  type AlertCardData,
  type AlertActionData,
} from "./alert-card.schema"

// ─── Receipt type (inline, mirrors TawReceipt from taw-ui) ─────────────────

interface AlertReceipt {
  actionId: string
  outcome: "success" | "partial" | "cancelled" | "failed"
  summary: string
  timestamp: number
}

// ─── Severity helpers ────────────────────────────────────────────────────────

function severityConfig(severity: AlertCardData["severity"]) {
  switch (severity) {
    case "critical":
      return {
        border: "border-l-red-500",
        badge: "bg-red-500/10 text-red-600 dark:text-red-400",
        icon: <AlertTriangle size={16} className="shrink-0" />,
        label: "Crítico",
      }
    case "warning":
      return {
        border: "border-l-amber-500",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        icon: <AlertCircle size={16} className="shrink-0" />,
        label: "Atenção",
      }
    case "info":
    default:
      return {
        border: "border-l-blue-500",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        icon: <Info size={16} className="shrink-0" />,
        label: "Info",
      }
  }
}

// ─── Receipt overlay ─────────────────────────────────────────────────────────

function ReceiptOverlay({ receipt }: { receipt: AlertReceipt }) {
  const isSuccess =
    receipt.outcome === "success" || receipt.outcome === "partial"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5",
        isSuccess
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : receipt.outcome === "cancelled"
            ? "bg-muted text-muted-foreground"
            : "bg-red-500/10 text-destructive",
      )}
    >
      {isSuccess ? (
        <CircleCheck size={14} className="shrink-0" />
      ) : (
        <CircleX size={14} className="shrink-0" />
      )}
      <span className="text-[12px] font-medium">{receipt.summary}</span>
    </motion.div>
  )
}

// ─── Action button ───────────────────────────────────────────────────────────

function ActionButton({
  action,
  pending,
  onAction,
}: {
  action: AlertActionData
  pending: boolean
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
}) {
  const isPrimary = action.primary ?? false

  return (
    <motion.button
      {...pressProps}
      disabled={pending}
      onClick={() => onAction?.(action.id, { alertActionId: action.id })}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        isPrimary
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      )}
    >
      {pending && (
        <Loader2 size={14} className="animate-spin" />
      )}
      {action.label}
    </motion.button>
  )
}

// ─── AlertCard ───────────────────────────────────────────────────────────────

export interface AlertCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  receipt?: AlertReceipt | undefined
  pending?: boolean | undefined
}

export function AlertCard({
  part,
  animate = true,
  className,
  onAction,
  receipt,
  pending = false,
}: AlertCardProps) {
  // Guard: loading states
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["14px", "160px"],
          ["10px", "220px"],
          ["32px", "100%"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="AlertCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(alertCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="AlertCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data
  const config = severityConfig(data.severity)
  const hasReceipt = receipt != null

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn(
          "relative gap-0 overflow-hidden border-l-4 py-0",
          config.border,
          className,
        )}
        data-taw="alert-card"
      >
        {/* Header */}
        <motion.div
          variants={enterVariants}
          className="flex items-start gap-3 px-4 py-3"
        >
          <span className={cn("mt-0.5", config.badge.split(" ").filter(c => c.startsWith("text-")).join(" "))}>
            {config.icon}
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-foreground">
                {data.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "border-current/20 px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider",
                  config.badge,
                )}
              >
                {config.label}
              </Badge>
            </div>
            {data.description && (
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>
        </motion.div>

        {/* Metrics */}
        {data.metrics && data.metrics.length > 0 && (
          <motion.div
            variants={enterVariants}
            className="border-t"
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3">
              {data.metrics.map((metric, i) => (
                <div key={`${metric.label}-${i}`} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    {metric.label}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    {metric.value}
                    {metric.unit && (
                      <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reasoning */}
        {data.reasoning && (
          <motion.div
            variants={enterVariants}
            className="border-t px-4 py-3"
          >
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {data.reasoning}
            </p>
          </motion.div>
        )}

        {/* Caveat */}
        {data.caveat && (
          <motion.div
            variants={enterVariants}
            className="mx-4 mb-3 mt-1 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
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

        {/* Actions / Receipt */}
        {(data.actions && data.actions.length > 0) && (
          <motion.div
            variants={enterVariants}
            className="border-t px-4 py-3"
          >
            <AnimatePresence mode="wait">
              {hasReceipt ? (
                <ReceiptOverlay key="receipt" receipt={receipt!} />
              ) : (
                <motion.div
                  key="actions"
                  className="flex flex-wrap gap-2"
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {data.actions.map((action) => (
                    <ActionButton
                      key={action.id}
                      action={action}
                      pending={pending}
                      onAction={onAction}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Source */}
        {data.source && (
          <motion.div
            variants={enterVariants}
            className="border-t px-4 py-2"
          >
            <SourceLabel source={data.source} />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
