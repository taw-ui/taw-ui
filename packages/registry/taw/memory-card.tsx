"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
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
  transitions,
} from "./lib/motion"
import {
  TawSkeleton,
  TawError,
  SourceLabel,
  ConfidenceBadge,
  Typewriter,
} from "./lib/taw"
import {
  memoryCardSchema,
  type MemoryItemData,
  type MemoryCategory,
} from "./memory-card.schema"

// ─── Types ──────────────────────────────────────────────────────────────────

type Verdict = "confirm" | "dismiss" | "correct"

interface MemoryReceipt {
  confirmed: number
  dismissed: number
  corrected: number
}

interface MemoryActionPayload {
  verdicts: Record<string, Verdict>
  receipt: MemoryReceipt
}

// ─── Category styling ───────────────────────────────────────────────────────

const categoryConfig: Record<
  MemoryCategory,
  { label: string; className: string }
> = {
  preference: {
    label: "Preference",
    className:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  fact: {
    label: "Fact",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  context: {
    label: "Context",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  assumption: {
    label: "Assumption",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
}

// ─── Verdict button config ──────────────────────────────────────────────────

const verdictConfig: Record<
  Verdict,
  { label: string; icon: string; className: string; activeClassName: string }
> = {
  confirm: {
    label: "Confirm",
    icon: "\u2713",
    className:
      "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 dark:hover:text-emerald-400",
    activeClassName:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  },
  dismiss: {
    label: "Dismiss",
    icon: "\u2715",
    className:
      "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
    activeClassName:
      "bg-destructive/10 text-destructive ring-1 ring-destructive/20",
  },
  correct: {
    label: "Correct",
    icon: "\u270E",
    className:
      "text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 dark:hover:text-amber-400",
    activeClassName:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
  },
}

// ─── Confidence bar ─────────────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 60
        ? "bg-amber-500"
        : "bg-red-500"

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {pct}%
      </span>
    </div>
  )
}

// ─── Memory Item ────────────────────────────────────────────────────────────

function MemoryItem({
  memory,
  verdict,
  onVerdict,
  disabled,
}: {
  memory: MemoryItemData
  verdict?: Verdict | undefined
  onVerdict?: ((id: string, verdict: Verdict) => void) | undefined
  disabled?: boolean | undefined
}) {
  const cat = categoryConfig[memory.category]
  const isAssumption = memory.category === "assumption"

  return (
    <motion.div
      variants={enterVariants}
      className={cn(
        "group/item flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        isAssumption && "border-dashed",
        verdict === "dismiss" && "opacity-50",
        verdict === "confirm" && "bg-emerald-500/5",
        verdict === "correct" && "bg-amber-500/5",
      )}
    >
      {/* Top row: category + confidence */}
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className={cn(
            "h-5 rounded px-1.5 text-[10px] font-medium",
            cat.className,
          )}
        >
          {cat.label}
        </Badge>
        {memory.confidence !== undefined && (
          <ConfidenceBar value={memory.confidence} />
        )}
      </div>

      {/* Content */}
      <p className="text-[13px] leading-relaxed text-foreground">
        {memory.content}
      </p>

      {/* Learned from */}
      {memory.learnedFrom && (
        <span className="text-[10px] text-muted-foreground">
          Learned from: {memory.learnedFrom}
        </span>
      )}

      {/* Verdict buttons */}
      {onVerdict && (
        <div className="mt-1 flex gap-1.5">
          {(Object.keys(verdictConfig) as Verdict[]).map((v) => {
            const cfg = verdictConfig[v]
            const isActive = verdict === v

            return (
              <motion.button
                key={v}
                {...pressProps}
                onClick={() => onVerdict(memory.id, v)}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                  "disabled:pointer-events-none disabled:opacity-40",
                  isActive ? cfg.activeClassName : cfg.className,
                )}
                title={cfg.label}
              >
                <span className="text-[10px]">{cfg.icon}</span>
                {cfg.label}
              </motion.button>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── Receipt view ───────────────────────────────────────────────────────────

function ReceiptView({
  receipt,
  animate,
}: {
  receipt: MemoryReceipt
  animate: boolean
}) {
  const items = [
    {
      label: "Confirmed",
      count: receipt.confirmed,
      className: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Dismissed",
      count: receipt.dismissed,
      className: "text-destructive",
    },
    {
      label: "Corrected",
      count: receipt.corrected,
      className: "text-amber-600 dark:text-amber-400",
    },
  ].filter((item) => item.count > 0)

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 6, filter: "blur(4px)" } : false}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={transitions.smooth}
      className="flex items-center gap-3 px-4 py-3"
    >
      <span className="text-[11px] font-medium text-muted-foreground">
        Reviewed:
      </span>
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-[10px] text-muted-foreground opacity-40">
              &middot;
            </span>
          )}
          <span className={cn("text-[12px] font-semibold tabular-nums", item.className)}>
            {item.count}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {item.label}
          </span>
        </span>
      ))}
    </motion.div>
  )
}

// ─── MemoryCard ─────────────────────────────────────────────────────────────

export interface MemoryCardProps {
  part: ToolPart
  onAction?: ((id: string, payload: MemoryActionPayload) => void) | undefined
  receipt?: MemoryReceipt | undefined
  pending?: boolean | undefined
  animate?: boolean | undefined
  className?: string | undefined
}

export function MemoryCard({
  part,
  onAction,
  receipt: externalReceipt,
  pending = false,
  animate = true,
  className,
}: MemoryCardProps) {
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({})
  const [internalReceipt, setInternalReceipt] = useState<MemoryReceipt | null>(
    null,
  )

  const receipt = externalReceipt ?? internalReceipt

  // Guard: loading states
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["14px", "50%"],
          ["10px", "70%"],
          ["48px", "100%"],
          ["48px", "100%"],
          ["48px", "100%"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="MemoryCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(memoryCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="MemoryCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data
  const memoryCount = data.memories.length
  const verdictCount = Object.keys(verdicts).length
  const allReviewed = verdictCount === memoryCount

  const handleVerdict = (memoryId: string, verdict: Verdict) => {
    if (receipt || pending) return
    setVerdicts((prev) => {
      // Toggle off if same verdict
      if (prev[memoryId] === verdict) {
        const next = { ...prev }
        delete next[memoryId]
        return next
      }
      return { ...prev, [memoryId]: verdict }
    })
  }

  const handleSubmit = () => {
    if (!allReviewed || pending) return

    const receiptData: MemoryReceipt = {
      confirmed: Object.values(verdicts).filter((v) => v === "confirm").length,
      dismissed: Object.values(verdicts).filter((v) => v === "dismiss").length,
      corrected: Object.values(verdicts).filter((v) => v === "correct").length,
    }

    if (onAction) {
      onAction(data.id, { verdicts, receipt: receiptData })
    } else {
      setInternalReceipt(receiptData)
    }
  }

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("relative gap-0 overflow-hidden py-0", className)}
        data-taw="memory-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Header */}
        <motion.div
          variants={enterVariants}
          className="border-b px-4 py-3"
        >
          <h3 className="text-[13px] font-semibold text-foreground">
            {data.title}
          </h3>
          {data.description && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {data.description}
            </p>
          )}
        </motion.div>

        {/* Receipt or Memory list */}
        <AnimatePresence mode="wait">
          {receipt ? (
            <ReceiptView
              key="receipt"
              receipt={receipt}
              animate={animate}
            />
          ) : (
            <motion.div
              key="memories"
              className="flex flex-col gap-2 p-3"
            >
              {data.memories.map((memory) => (
                <MemoryItem
                  key={memory.id}
                  memory={memory}
                  verdict={verdicts[memory.id]}
                  onVerdict={onAction ? handleVerdict : undefined}
                  disabled={pending}
                />
              ))}

              {/* Submit button */}
              {onAction && !receipt && (
                <motion.div
                  variants={enterVariants}
                  className="flex items-center justify-between pt-2"
                >
                  <span className="text-[11px] text-muted-foreground">
                    {verdictCount} of {memoryCount} reviewed
                  </span>
                  <motion.button
                    {...pressProps}
                    onClick={handleSubmit}
                    disabled={!allReviewed || pending}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                      "disabled:pointer-events-none disabled:opacity-40",
                      allReviewed
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {pending ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caveat */}
        {data.caveat && !receipt && (
          <motion.div
            variants={enterVariants}
            className="mx-3 mb-3 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
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

        {/* Source footer */}
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
