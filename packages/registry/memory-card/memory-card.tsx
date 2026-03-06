"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback, useMemo } from "react"
import type { TawToolPart, TawReceipt, TawInteractiveProps } from "taw-ui"
import { createReceipt } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, Typewriter } from "../lib/shared"
import { parseMemoryCard, type MemoryCardData, type MemoryItemData, type MemoryCategory } from "./schema"

const iconProps = { width: 10, height: 10, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
const CheckIcon = () => <svg {...iconProps}><polyline points="20 6 9 17 4 12" /></svg>
const XIcon = () => <svg {...iconProps}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const PenIcon = () => <svg {...iconProps}><path d="M17 3l4 4L7 21H3v-4L17 3z" /></svg>

const categoryLabels: Record<MemoryCategory, string> = {
  preference: "Preference",
  fact: "Fact",
  context: "Context",
  assumption: "Assumption",
}

type MemoryVerdict = "confirmed" | "dismissed" | "corrected"

function MemoryItem({
  memory,
  verdict,
  onVerdict,
  onUndo,
  disabled,
}: {
  memory: MemoryItemData
  verdict: MemoryVerdict | undefined
  onVerdict: (v: MemoryVerdict) => void
  onUndo: () => void
  disabled: boolean
}) {
  const isAssumption = memory.category === "assumption"
  const hasVerdict = verdict !== undefined

  return (
    <motion.div
      variants={enterVariants}
      layout
      className={cn(
        "group relative rounded-(--taw-radius) border p-3 transition-all duration-200",
        verdict === "dismissed" && "opacity-50",
        isAssumption && !hasVerdict && "border-dashed",
        disabled && "pointer-events-none",
      )}
      style={{
        borderColor: verdict === "confirmed"
          ? "oklch(from var(--taw-success) l c h / 0.3)"
          : verdict === "dismissed"
            ? "oklch(from var(--taw-error) l c h / 0.3)"
            : verdict === "corrected"
              ? "oklch(from var(--taw-warning) l c h / 0.3)"
              : isAssumption
                ? "var(--taw-warning)"
                : "var(--taw-border)",
        backgroundColor: verdict === "confirmed"
          ? "oklch(from var(--taw-success) l c h / 0.07)"
          : verdict === "dismissed"
            ? "oklch(from var(--taw-error) l c h / 0.07)"
            : verdict === "corrected"
              ? "oklch(from var(--taw-warning) l c h / 0.07)"
              : "var(--taw-surface)",
      }}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="rounded-md bg-(--taw-surface-sunken) px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-(--taw-text-muted)">
          {categoryLabels[memory.category]}
        </span>
      </div>

      <p className={cn(
        "text-[13px] leading-relaxed",
        verdict === "dismissed"
          ? "text-(--taw-text-muted) line-through"
          : "text-(--taw-text-primary)",
      )}>
        {memory.content}
      </p>

      {memory.learnedFrom && (
        <span className="mt-1 block text-[10px] text-(--taw-text-muted)">
          Learned from: {memory.learnedFrom}
        </span>
      )}

      <div className="mt-2 flex gap-1.5">
        {(["confirmed", "dismissed", "corrected"] as const).map((v) => {
          const isSelected = verdict === v
          const isHidden = hasVerdict && !isSelected
          const config = {
            confirmed: { Icon: CheckIcon, label: "Correct", selectedLabel: "Confirmed", color: "text-(--taw-success)", hover: "hover:border-(--taw-success) hover:text-(--taw-success)" },
            dismissed: { Icon: XIcon, label: "Wrong", selectedLabel: "Dismissed", color: "text-(--taw-error)", hover: "hover:border-(--taw-error) hover:text-(--taw-error)" },
            corrected: { Icon: PenIcon, label: "Fix this", selectedLabel: "Needs fix", color: "text-(--taw-warning)", hover: "hover:border-(--taw-warning) hover:text-(--taw-warning)" },
          }[v]

          return (
            <motion.button
              key={v}
              type="button"
              onClick={() => isSelected ? onUndo() : onVerdict(v)}
              layout
              animate={{
                opacity: isHidden ? 0 : 1,
                scale: isHidden ? 0.8 : 1,
                width: isHidden ? 0 : "auto",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={cn(
                "flex items-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                isSelected
                  ? cn("border-transparent", config.color)
                  : cn("border-(--taw-border) text-(--taw-text-muted)", config.hover),
                isHidden && "pointer-events-none p-0 border-0",
              )}
            >
              <config.Icon /> {isSelected ? config.selectedLabel : config.label}
            </motion.button>
          )
        })}
        <AnimatePresence>
          {hasVerdict && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-auto self-center text-[9px] text-(--taw-text-muted)"
            >
              click to undo
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function MemoryCardReceipt({
  data,
  receipt,
  animate,
}: {
  data: MemoryCardData
  receipt: TawReceipt
  animate: boolean
}) {
  const isCancelled = receipt.outcome === "cancelled"

  return (
    <motion.div
      {...getEnterProps(animate)}
      className={cn(
        "flex items-center gap-3 rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) p-3",
        isCancelled && "opacity-60",
      )}
      data-taw-component="memory-card"
      data-taw-id={data.id}
      data-taw-receipt
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]",
          isCancelled
            ? "bg-(--taw-border) text-(--taw-text-muted)"
            : "bg-(--taw-accent-subtle) text-(--taw-success)",
        )}
      >
        {isCancelled ? <XIcon /> : <CheckIcon />}
      </span>
      <span className="text-[13px] text-(--taw-text-primary)">
        {receipt.summary}
      </span>
    </motion.div>
  )
}

function MemoryCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["14px", "180px"],
        ["10px", "240px"],
        ["60px", "100%"],
        ["60px", "100%"],
        ["60px", "100%"],
      ]}
      animate={animate}
    />
  )
}

export interface MemoryCardProps extends TawInteractiveProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function MemoryCard({
  part,
  animate = true,
  className,
  onAction,
  receipt,
  pending = false,
}: MemoryCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <MemoryCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = parseMemoryCard(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as MemoryCardData

  if (receipt) {
    return <MemoryCardReceipt data={data} receipt={receipt} animate={animate} />
  }

  return (
    <MemoryCardInteractive
      data={data}
      animate={animate}
      className={className}
      onAction={onAction}
      pending={pending}
    />
  )
}

function MemoryCardInteractive({
  data,
  animate,
  className,
  onAction,
  pending,
}: {
  data: MemoryCardData
  animate: boolean
  className?: string | undefined
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  pending: boolean
}) {
  const [verdicts, setVerdicts] = useState<Record<string, MemoryVerdict>>({})

  const handleVerdict = useCallback((memoryId: string, verdict: MemoryVerdict) => {
    setVerdicts((prev) => ({ ...prev, [memoryId]: verdict }))
  }, [])

  const handleUndo = useCallback((memoryId: string) => {
    setVerdicts((prev) => {
      const next = { ...prev }
      delete next[memoryId]
      return next
    })
  }, [])

  const reviewedCount = Object.keys(verdicts).length
  const totalCount = data.memories.length
  const allReviewed = reviewedCount === totalCount

  const handleSubmit = useCallback(() => {
    const confirmed = Object.entries(verdicts)
      .filter(([, v]) => v === "confirmed")
      .map(([id]) => id)
    const dismissed = Object.entries(verdicts)
      .filter(([, v]) => v === "dismissed")
      .map(([id]) => id)
    const corrected = Object.entries(verdicts)
      .filter(([, v]) => v === "corrected")
      .map(([id]) => id)

    const parts: string[] = []
    if (confirmed.length) parts.push(`Confirmed ${confirmed.length}`)
    if (dismissed.length) parts.push(`Dismissed ${dismissed.length}`)
    if (corrected.length) parts.push(`Corrected ${corrected.length}`)

    onAction?.("review", {
      verdicts,
      confirmed,
      dismissed,
      corrected,
      receipt: createReceipt(
        "review",
        "success",
        parts.join(" \u00B7 ") || "Reviewed memories",
        { meta: { verdicts, confirmed, dismissed, corrected } },
      ),
    })
  }, [verdicts, onAction])

  const handleDismissAll = useCallback(() => {
    onAction?.("dismiss-all", {
      receipt: createReceipt("dismiss-all", "cancelled", "Dismissed memory review"),
    })
  }, [onAction])

  const sortedMemories = useMemo(() => {
    return [...data.memories].sort((a, b) => {
      const order: Record<MemoryCategory, number> = {
        assumption: 0,
        context: 1,
        preference: 2,
        fact: 3,
      }
      return order[a.category] - order[b.category]
    })
  }, [data.memories])

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "flex flex-col overflow-hidden rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) font-sans",
        className,
      )}
      data-taw-component="memory-card"
      data-taw-id={data.id}
    >
      <div className="border-b border-(--taw-border) bg-(--taw-surface-sunken) px-4 py-3">
        <motion.h3
          variants={enterVariants}
          className="text-[14px] font-semibold text-(--taw-text-primary)"
        >
          {data.title}
        </motion.h3>
        {data.description && (
          <motion.p
            variants={enterVariants}
            className="mt-0.5 text-[11px] text-(--taw-text-muted)"
          >
            {data.description}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        {sortedMemories.map((memory) => (
          <MemoryItem
            key={memory.id}
            memory={memory}
            verdict={verdicts[memory.id]}
            onVerdict={(v) => handleVerdict(memory.id, v)}
            onUndo={() => handleUndo(memory.id)}
            disabled={pending}
          />
        ))}
      </div>

      {data.source && (
        <div className="px-4 pb-2">
          <SourceLabel source={data.source} />
        </div>
      )}

      {data.caveat && (
        <div className="mx-4 mb-2 flex gap-1.5 rounded-[6px] bg-(--taw-accent-subtle) px-2.5 py-1.5">
          <span className="mt-px text-[10px] text-(--taw-accent)">{"\u2192"}</span>
          <Typewriter
            text={data.caveat}
            animate={animate}
            className="text-[11px] leading-relaxed text-(--taw-accent)"
          />
        </div>
      )}

      {onAction && (
        <motion.div
          variants={enterVariants}
          className="flex items-center justify-between border-t border-(--taw-border) px-4 py-3"
        >
          <button
            type="button"
            onClick={handleDismissAll}
            disabled={pending}
            className="text-[11px] text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={reviewedCount === 0 || pending}
            className={cn(
              "rounded-(--taw-radius) px-4 py-1.5 text-[12px] font-medium transition-all",
              "bg-(--taw-accent) text-white hover:opacity-90",
              (reviewedCount === 0 || pending) && "pointer-events-none opacity-40",
            )}
          >
            {pending
              ? "\u2026"
              : allReviewed
                ? "Submit Review"
                : reviewedCount > 0
                  ? `Submit (${reviewedCount}/${totalCount})`
                  : "Submit"}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
