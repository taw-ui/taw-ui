"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback } from "react"
import {
  OptionList as OptionListContract,
  type OptionListData,
  type OptionData,
  type TawToolPart,
  type TawReceipt,
  type TawInteractiveProps,
  createReceipt,
} from "@taw-ui/core"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants, transitions } from "./motion"
import { TawError, TawSkeleton } from "./shared"

// ─── Option item ──────────────────────────────────────────────────────────────

function OptionItem({
  option,
  selected,
  onToggle,
  disabled,
}: {
  option: OptionData
  selected: boolean
  onToggle: () => void
  disabled: boolean
}) {
  return (
    <motion.button
      variants={enterVariants}
      onClick={onToggle}
      disabled={disabled}
      type="button"
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-[--taw-radius] border p-3 text-left",
        "transition-colors",
        selected
          ? "border-[--taw-accent] bg-[--taw-accent]/5"
          : "border-[--taw-border] bg-[--taw-surface] hover:border-[--taw-accent]/40",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {/* Selection indicator */}
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
          selected
            ? "border-[--taw-accent] bg-[--taw-accent] text-white"
            : "border-[--taw-border]",
        )}
      >
        {selected && "✓"}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[--taw-text-primary]">
            {option.label}
          </span>
          {option.badge && (
            <span className="rounded-full bg-[--taw-accent]/10 px-2 py-0.5 text-[10px] font-medium text-[--taw-accent]">
              {option.badge}
            </span>
          )}
          {option.recommended && !option.badge && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Recommended
            </span>
          )}
        </div>
        {option.description && (
          <p className="mt-0.5 text-xs text-[--taw-text-muted]">
            {option.description}
          </p>
        )}
      </div>

      {/* Score bar */}
      {option.score !== undefined && (
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          <span className="font-mono text-[10px] text-[--taw-text-muted]">
            {Math.round(option.score * 100)}
          </span>
          <div className="h-1 w-10 overflow-hidden rounded-full bg-[--taw-border]">
            <motion.div
              className="h-full rounded-full bg-[--taw-accent]"
              initial={{ width: 0 }}
              animate={{ width: `${option.score * 100}%` }}
              transition={transitions.smooth}
            />
          </div>
        </div>
      )}
    </motion.button>
  )
}

// ─── Receipt view ─────────────────────────────────────────────────────────────

function OptionListReceipt({
  data,
  receipt,
  animate,
}: {
  data: OptionListData
  receipt: TawReceipt
  animate: boolean
}) {
  const selectedOptions = data.options.filter(
    (o) => receipt.selectedIds?.includes(o.id),
  )
  const isCancelled = receipt.outcome === "cancelled"

  return (
    <motion.div
      {...getEnterProps(animate)}
      className={cn(
        "flex items-center gap-3 rounded-[--taw-radius] border p-3",
        "bg-[--taw-surface] border-[--taw-border]",
        isCancelled && "opacity-60",
      )}
      data-taw-component="option-list"
      data-taw-id={data.id}
      data-taw-receipt
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]",
          isCancelled
            ? "bg-[--taw-border] text-[--taw-text-muted]"
            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        )}
      >
        {isCancelled ? "✗" : "✓"}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-sm text-[--taw-text-primary]">
          {receipt.summary}
        </span>
        {selectedOptions.length > 0 && (
          <span className="ml-2 text-xs text-[--taw-text-muted]">
            {selectedOptions.map((o) => o.label).join(", ")}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OptionListSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["14px", "200px"],
        ["48px", "100%"],
        ["48px", "100%"],
        ["48px", "100%"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── OptionList ───────────────────────────────────────────────────────────────

export interface OptionListProps extends TawInteractiveProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function OptionList({
  part,
  animate = true,
  className,
  onAction,
  receipt,
  pending = false,
}: OptionListProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <OptionListSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = OptionListContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as OptionListData

  if (receipt) {
    return <OptionListReceipt data={data} receipt={receipt} animate={animate} />
  }

  return (
    <OptionListInteractive
      data={data}
      animate={animate}
      className={className}
      onAction={onAction}
      pending={pending}
    />
  )
}

// ─── Interactive view ─────────────────────────────────────────────────────────

function OptionListInteractive({
  data,
  animate,
  className,
  onAction,
  pending,
}: {
  data: OptionListData
  animate: boolean
  className?: string | undefined
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  pending: boolean
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => {
      const rec = data.options.find((o) => o.recommended)
      return rec ? new Set([rec.id]) : new Set()
    },
  )

  const handleToggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (data.multiple) {
          if (next.has(id)) next.delete(id)
          else next.add(id)
        } else {
          next.clear()
          next.add(id)
        }
        return next
      })
    },
    [data.multiple],
  )

  const handleConfirm = useCallback(() => {
    const ids = [...selected]
    const labels = data.options
      .filter((o) => selected.has(o.id))
      .map((o) => o.label)

    onAction?.("confirm", {
      selectedIds: ids,
      receipt: createReceipt("confirm", "success", labels.join(", "), {
        selectedIds: ids,
      }),
    })
  }, [selected, data.options, onAction])

  const handleCancel = useCallback(() => {
    onAction?.("cancel", {
      receipt: createReceipt("cancel", "cancelled", "Skipped"),
    })
  }, [onAction])

  const canConfirm = !data.required || selected.size > 0

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "flex flex-col gap-3 rounded-[--taw-radius] border p-4",
        "bg-[--taw-surface] border-[--taw-border]",
        className,
      )}
      data-taw-component="option-list"
      data-taw-id={data.id}
    >
      <motion.div variants={enterVariants}>
        <h3 className="text-sm font-semibold text-[--taw-text-primary]">
          {data.question}
        </h3>
        {data.description && (
          <p className="mt-0.5 text-xs text-[--taw-text-muted]">
            {data.description}
          </p>
        )}
      </motion.div>

      {data.reasoning && (
        <motion.div
          variants={enterVariants}
          className="rounded-[--taw-radius] bg-[--taw-surface-sunken] px-3 py-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-[--taw-text-muted]">
            AI Reasoning
          </span>
          <p className="mt-0.5 text-xs text-[--taw-text-muted]">
            {data.reasoning}
          </p>
        </motion.div>
      )}

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {data.options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              selected={selected.has(option.id)}
              onToggle={() => handleToggle(option.id)}
              disabled={pending}
            />
          ))}
        </AnimatePresence>
      </div>

      {onAction && (
        <motion.div variants={enterVariants} className="flex justify-end gap-2 pt-1">
          {!data.required && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className={cn(
                "rounded-[--taw-radius] px-3 py-1.5 text-xs font-medium",
                "text-[--taw-text-muted] hover:text-[--taw-text-primary] transition-colors",
                pending && "pointer-events-none opacity-50",
              )}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || pending}
            className={cn(
              "rounded-[--taw-radius] px-4 py-1.5 text-xs font-medium transition-colors",
              "bg-[--taw-accent] text-white hover:opacity-90",
              (!canConfirm || pending) && "pointer-events-none opacity-50",
            )}
          >
            {pending ? "…" : data.confirmLabel}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
