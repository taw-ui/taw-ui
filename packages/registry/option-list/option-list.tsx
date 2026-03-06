"use client"

import { motion } from "framer-motion"
import { useState, useCallback, useMemo, useRef } from "react"
import type { KeyboardEvent } from "react"
import type { TawToolPart, TawReceipt, TawInteractiveProps } from "taw-ui"
import { createReceipt } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, Typewriter } from "../lib/shared"
import { parseOptionList, type OptionListData, type OptionData } from "./schema"

// ─── Selection indicator (radio vs checkbox) ────────────────────────────────

function SelectionIndicator({
  mode,
  selected,
}: {
  mode: "single" | "multi"
  selected: boolean
}) {
  if (mode === "single") {
    return (
      <span
        className={cn(
          "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected
            ? "border-(--taw-text-primary) bg-(--taw-text-primary)"
            : "border-(--taw-border)",
        )}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-(--taw-surface)" />}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-all",
        selected
          ? "border-(--taw-text-primary) bg-(--taw-text-primary)"
          : "border-(--taw-border)",
      )}
    >
      {selected && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--taw-surface)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  )
}

// ─── Option item ──────────────────────────────────────────────────────────────

function OptionItem({
  option,
  selected,
  disabled,
  selectionMode,
  onToggle,
  tabIndex,
  onFocus,
  buttonRef,
  isLast,
}: {
  option: OptionData
  selected: boolean
  disabled: boolean
  selectionMode: "single" | "multi"
  onToggle: () => void
  tabIndex?: number
  onFocus?: () => void
  buttonRef?: (el: HTMLButtonElement | null) => void
  isLast?: boolean
}) {
  return (
    <motion.button
      ref={buttonRef}
      variants={enterVariants}
      onClick={onToggle}
      onFocus={onFocus}
      disabled={disabled}
      tabIndex={tabIndex}
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        "group relative flex w-full items-start gap-3.5 px-4 py-3.5 text-left",
        "transition-colors hover:bg-(--taw-text-primary)/3",
        !isLast && "border-b border-(--taw-border)",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <SelectionIndicator mode={selectionMode} selected={selected} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-(--taw-text-primary)">
            {option.label}
          </span>
          {option.badge && (
            <span className="rounded-full bg-(--taw-accent)/10 px-2 py-0.5 text-[10px] font-medium text-(--taw-accent)">
              {option.badge}
            </span>
          )}
          {option.recommended && !option.badge && (
            <span className="rounded-full bg-(--taw-success)/10 px-2 py-0.5 text-[10px] font-medium text-(--taw-success)">
              Recommended
            </span>
          )}
        </div>
        {option.description && (
          <p className="mt-1 text-xs text-(--taw-text-muted)">
            {option.description}
          </p>
        )}
      </div>
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
        "flex flex-col rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) overflow-hidden",
        isCancelled && "opacity-60",
      )}
      data-taw-component="option-list"
      data-taw-id={data.id}
      data-taw-receipt
    >
      {selectedOptions.length > 0 ? (
        <div className="flex flex-col divide-y divide-(--taw-border)">
          {selectedOptions.map((option) => (
            <div key={option.id} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-(--taw-success)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div className="min-w-0">
                <span className="text-sm font-medium text-(--taw-text-primary)">
                  {option.label}
                </span>
                {option.description && (
                  <p className="mt-0.5 text-xs text-(--taw-text-muted)">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--taw-border) text-(--taw-text-muted) text-[11px]">
            ✗
          </span>
          <span className="text-sm text-(--taw-text-muted)">
            {receipt.summary}
          </span>
        </div>
      )}
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

  const result = parseOptionList(output)
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
  const mode = data.selectionMode ?? "single"
  const maxSelections = mode === "single" ? 1 : data.maxSelections
  const minSelections = data.minSelections ?? 1

  const [selected, setSelected] = useState<Set<string>>(() => {
    const rec = data.options.find((o) => o.recommended)
    return rec ? new Set([rec.id]) : new Set()
  })

  const [activeIndex, setActiveIndex] = useState(() => {
    const recIdx = data.options.findIndex((o) => o.recommended)
    return recIdx >= 0 ? recIdx : 0
  })

  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  // Compute disabled state per option
  const optionStates = useMemo(() => {
    return data.options.map((option) => {
      const isSelected = selected.has(option.id)
      const isMaxed =
        mode === "multi" &&
        maxSelections !== undefined &&
        selected.size >= maxSelections &&
        !isSelected
      return {
        option,
        isSelected,
        isDisabled: option.disabled || isMaxed || pending,
      }
    })
  }, [data.options, selected, mode, maxSelections, pending])

  const handleToggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (mode === "single") {
          next.clear()
          next.add(id)
        } else {
          if (next.has(id)) {
            next.delete(id)
          } else {
            if (maxSelections && next.size >= maxSelections) return prev
            next.add(id)
          }
        }
        return next
      })
    },
    [mode, maxSelections],
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

  // Keyboard navigation
  const focusOption = useCallback((index: number) => {
    optionRefs.current[index]?.focus()
    setActiveIndex(index)
  }, [])

  const findNextEnabled = useCallback(
    (from: number, dir: 1 | -1) => {
      const len = optionStates.length
      for (let step = 1; step <= len; step++) {
        const idx = (from + dir * step + len) % len
        if (!optionStates[idx]!.isDisabled) return idx
      }
      return from
    },
    [optionStates],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const { key } = e
      if (key === "ArrowDown") {
        e.preventDefault()
        focusOption(findNextEnabled(activeIndex, 1))
      } else if (key === "ArrowUp") {
        e.preventDefault()
        focusOption(findNextEnabled(activeIndex, -1))
      } else if (key === "Home") {
        e.preventDefault()
        const first = optionStates.findIndex((s) => !s.isDisabled)
        if (first >= 0) focusOption(first)
      } else if (key === "End") {
        e.preventDefault()
        for (let i = optionStates.length - 1; i >= 0; i--) {
          if (!optionStates[i]!.isDisabled) { focusOption(i); break }
        }
      } else if (key === "Enter" || key === " ") {
        e.preventDefault()
        const current = optionStates[activeIndex]
        if (current && !current.isDisabled) {
          handleToggle(current.option.id)
        }
      }
    },
    [activeIndex, optionStates, focusOption, findNextEnabled, handleToggle],
  )

  const canConfirm = selected.size >= minSelections && selected.size > 0
  const confirmLabel = mode === "multi" && selected.size > 0
    ? `${data.confirmLabel} (${selected.size})`
    : data.confirmLabel

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "flex flex-col gap-4",
        className,
      )}
      data-taw-component="option-list"
      data-taw-id={data.id}
    >
      {(data.question || data.description) && (
        <motion.div variants={enterVariants}>
          {data.question && (
            <h3 className="text-sm font-semibold text-(--taw-text-primary)">
              {data.question}
            </h3>
          )}
          {data.description && (
            <p className="mt-1 text-xs text-(--taw-text-muted)">
              {data.description}
            </p>
          )}
        </motion.div>
      )}

      <div
        className="flex flex-col overflow-hidden rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface)"
        role="listbox"
        aria-multiselectable={mode === "multi"}
        aria-label={data.question}
        onKeyDown={handleKeyDown}
      >
        {optionStates.map(({ option, isSelected, isDisabled }, index) => (
          <OptionItem
            key={option.id}
            option={option}
            selected={isSelected}
            disabled={isDisabled}
            selectionMode={mode}
            onToggle={() => handleToggle(option.id)}
            tabIndex={index === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(index)}
            buttonRef={(el) => { optionRefs.current[index] = el }}
            isLast={index === optionStates.length - 1}
          />
        ))}
      </div>

      {/* Source */}
      {data.source && (
        <motion.div variants={enterVariants}>
          <SourceLabel source={data.source} />
        </motion.div>
      )}

      {/* AI reasoning */}
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
      {onAction && (
        <motion.div variants={enterVariants} className="flex justify-end gap-3">
          {!data.required && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className={cn(
                "px-3 py-1.5 text-xs font-medium",
                "text-(--taw-text-muted) hover:text-(--taw-text-primary) transition-colors",
                pending && "pointer-events-none opacity-50",
              )}
            >
              {data.cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || pending}
            className={cn(
              "rounded-(--taw-radius) px-4 py-1.5 text-xs font-medium transition-all",
              canConfirm
                ? "bg-(--taw-text-primary) text-(--taw-surface) hover:opacity-90"
                : "bg-(--taw-border) text-(--taw-text-muted) cursor-default",
              pending && "pointer-events-none opacity-50",
            )}
          >
            {pending ? "…" : confirmLabel}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
