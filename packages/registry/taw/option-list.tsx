"use client"

import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import {
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react"
import { Card } from "@/components/ui/card"
import { cn } from "./lib/utils"
import type { ToolPart } from "./lib/types"
import { safeParse } from "./lib/types"
import {
  getEnterProps,
  staggerParent,
  enterVariants,
  transitions,
} from "./lib/motion"
import {
  TawSkeleton,
  TawError,
  SourceLabel,
  Typewriter,
} from "./lib/taw"
import {
  optionListSchema,
  type OptionListData,
  type OptionData,
  type TawReceipt,
} from "./option-list.schema"

// ─── Receipt helpers ─────────────────────────────────────────────────────────

function createReceipt(
  actionId: string,
  outcome: TawReceipt["outcome"],
  summary: string,
  options?: {
    selectedIds?: string[]
    meta?: Record<string, unknown>
  },
): TawReceipt {
  return {
    actionId,
    outcome,
    summary,
    timestamp: Date.now(),
    ...(options?.selectedIds && { selectedIds: options.selectedIds }),
    ...(options?.meta && { meta: options.meta }),
  }
}

// ─── OptionItem ──────────────────────────────────────────────────────────────

function OptionItem({
  option,
  selected,
  focused,
  disabled,
  isMulti,
  onSelect,
  onFocus,
}: {
  option: OptionData
  selected: boolean
  focused: boolean
  disabled: boolean
  isMulti: boolean
  onSelect: () => void
  onFocus: () => void
}) {
  const isDisabled = option.disabled || disabled

  return (
    <motion.div
      variants={enterVariants}
      role="option"
      aria-selected={selected}
      aria-disabled={isDisabled || undefined}
      tabIndex={focused ? 0 : -1}
      data-focused={focused || undefined}
      data-selected={selected || undefined}
      onFocus={onFocus}
      onClick={() => {
        if (!isDisabled) onSelect()
      }}
      onKeyDown={(e) => {
        if (isDisabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left outline-none transition-colors",
        "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
        selected && "bg-primary/5",
        isDisabled && "pointer-events-none opacity-40",
      )}
    >
      {/* Radio / Checkbox indicator */}
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          isMulti ? "rounded" : "rounded-full",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 bg-background",
        )}
      >
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={transitions.snappy}
            className="flex items-center justify-center"
          >
            {isMulti ? (
              <Check size={10} />
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="2.5" fill="currentColor" />
              </svg>
            )}
          </motion.span>
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            {option.label}
          </span>
          {option.badge && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
                option.recommended
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {option.badge}
            </span>
          )}
          {!option.badge && option.recommended && (
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-emerald-600 dark:text-emerald-400">
              Recommended
            </span>
          )}
        </div>
        {option.description && (
          <span className="text-[12px] leading-relaxed text-muted-foreground">
            {option.description}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── ReceiptView ─────────────────────────────────────────────────────────────

function ReceiptView({
  receipt,
  data,
  animate,
}: {
  receipt: TawReceipt
  data: OptionListData
  animate: boolean
}) {
  const selectedOptions = useMemo(() => {
    if (!receipt.selectedIds) return []
    return receipt.selectedIds
      .map((id) => data.options.find((o) => o.id === id))
      .filter(Boolean) as OptionData[]
  }, [receipt.selectedIds, data.options])

  const isCancelled = receipt.outcome === "cancelled"

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("gap-0 overflow-hidden py-0")}
        data-taw="option-list-receipt"
      >
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold leading-none",
              isCancelled
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            )}
          >
            {isCancelled ? "\u2013" : "\u2713"}
          </span>
          <span className="text-[12px] font-medium text-foreground">
            {receipt.summary}
          </span>
        </div>

        {selectedOptions.length > 0 && (
          <motion.div
            variants={enterVariants}
            className="flex flex-wrap gap-1.5 px-4 py-3"
          >
            {selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="rounded-md bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary"
              >
                {opt.label}
              </span>
            ))}
          </motion.div>
        )}

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

// ─── OptionList ──────────────────────────────────────────────────────────────

export interface OptionListProps {
  part: ToolPart
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  receipt?: TawReceipt | undefined
  pending?: boolean | undefined
  animate?: boolean | undefined
  className?: string | undefined
}

export function OptionList({
  part,
  onAction,
  receipt,
  pending = false,
  animate = true,
  className,
}: OptionListProps) {
  // ── Loading state ────────────────────────────────────────────────────────
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["14px", "200px"],
          ["12px", "160px"],
          ["40px", "100%"],
          ["40px", "100%"],
          ["40px", "100%"],
        ]}
        className={className}
      />
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (part.state === "output-error") {
    return (
      <TawError
        title="OptionList"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  // ── Parse ────────────────────────────────────────────────────────────────
  const result = safeParse(optionListSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="OptionList"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data

  // ── Receipt state ────────────────────────────────────────────────────────
  if (receipt) {
    return <ReceiptView receipt={receipt} data={data} animate={animate} />
  }

  return (
    <InteractiveOptionList
      data={data}
      onAction={onAction}
      pending={pending}
      animate={animate}
      className={className}
    />
  )
}

// ─── Interactive List (stateful) ─────────────────────────────────────────────

function InteractiveOptionList({
  data,
  onAction,
  pending,
  animate,
  className,
}: {
  data: OptionListData
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  pending: boolean
  animate: boolean
  className?: string | undefined
}) {
  const isMulti = data.selectionMode === "multi"
  const listRef = useRef<HTMLDivElement>(null)

  // ── Selection state ──────────────────────────────────────────────────────
  const initialSelection = useMemo(() => {
    const recommended = data.options
      .filter((o) => o.recommended && !o.disabled)
      .map((o) => o.id)
    if (isMulti) return new Set(recommended)
    return new Set(recommended.length > 0 ? [recommended[0]!] : [])
  }, [data.options, isMulti])

  const [selected, setSelected] = useState<Set<string>>(initialSelection)
  const [focusIndex, setFocusIndex] = useState(0)

  const enabledOptions = useMemo(
    () => data.options.filter((o) => !o.disabled),
    [data.options],
  )

  const atMax =
    data.maxSelections !== undefined && selected.size >= data.maxSelections
  const meetsMin = selected.size >= (data.minSelections ?? 1)

  // ── Toggle selection ─────────────────────────────────────────────────────
  const toggleOption = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          if (isMulti) {
            if (data.maxSelections !== undefined && next.size >= data.maxSelections) {
              return prev
            }
            next.add(id)
          } else {
            next.clear()
            next.add(id)
          }
        }
        return next
      })
    },
    [isMulti, data.maxSelections],
  )

  // ── Keyboard navigation ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = enabledOptions.length
      if (len === 0) return

      let nextIndex = focusIndex

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          nextIndex = (focusIndex + 1) % len
          break
        case "ArrowUp":
          e.preventDefault()
          nextIndex = (focusIndex - 1 + len) % len
          break
        case "Home":
          e.preventDefault()
          nextIndex = 0
          break
        case "End":
          e.preventDefault()
          nextIndex = len - 1
          break
        default:
          return
      }

      setFocusIndex(nextIndex)

      // Focus the element
      const items = listRef.current?.querySelectorAll("[role='option']:not([aria-disabled='true'])")
      if (items && items[nextIndex]) {
        ;(items[nextIndex] as HTMLElement).focus()
      }
    },
    [focusIndex, enabledOptions.length],
  )

  // ── Confirm / Cancel ─────────────────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    if (!meetsMin || pending) return
    const selectedIds = Array.from(selected)
    const selectedLabels = selectedIds
      .map((id) => data.options.find((o) => o.id === id)?.label)
      .filter(Boolean)

    const summary =
      selectedLabels.length === 1
        ? `Selected: ${selectedLabels[0]}`
        : `Selected ${selectedLabels.length} options: ${selectedLabels.join(", ")}`

    const receipt = createReceipt("confirm", "success", summary, {
      selectedIds,
    })

    onAction?.("confirm", { receipt, selectedIds })
  }, [selected, meetsMin, pending, data.options, onAction])

  const handleCancel = useCallback(() => {
    if (pending) return
    const receipt = createReceipt("cancel", "cancelled", "Skipped")
    onAction?.("cancel", { receipt })
  }, [pending, onAction])

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn(
          "relative gap-0 overflow-hidden py-0",
          pending && "pointer-events-none opacity-60",
          className,
        )}
        data-taw="option-list"
      >
        {/* Header */}
        <motion.div
          variants={enterVariants}
          className="border-b px-4 py-3"
        >
          <h3 className="text-[13px] font-semibold text-foreground">
            {data.question}
          </h3>
          {data.description && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {data.description}
            </p>
          )}
        </motion.div>

        {/* Reasoning */}
        {data.reasoning && (
          <motion.div
            variants={enterVariants}
            className="mx-4 mt-3 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
          >
            <span className="mt-0.5 shrink-0 text-[10px] text-primary">
              {"\u2192"}
            </span>
            <Typewriter
              text={data.reasoning}
              animate={animate}
              className="text-[11px] leading-relaxed text-primary"
            />
          </motion.div>
        )}

        {/* Options list */}
        <div
          ref={listRef}
          role="listbox"
          aria-multiselectable={isMulti || undefined}
          aria-label={data.question}
          onKeyDown={handleKeyDown}
          className="flex flex-col gap-0.5 p-2"
        >
          {data.options.map((option) => {
            const enabledIndex = enabledOptions.findIndex(
              (o) => o.id === option.id,
            )
            const isFocused = enabledIndex === focusIndex
            const isSelected = selected.has(option.id)
            const isDisabledByMax = atMax && !isSelected && isMulti

            return (
              <OptionItem
                key={option.id}
                option={option}
                selected={isSelected}
                focused={isFocused && !option.disabled}
                disabled={isDisabledByMax}
                isMulti={isMulti}
                onSelect={() => toggleOption(option.id)}
                onFocus={() => {
                  if (enabledIndex >= 0) setFocusIndex(enabledIndex)
                }}
              />
            )
          })}
        </div>

        {/* Selection count for multi */}
        {isMulti && (
          <motion.div
            variants={enterVariants}
            className="px-4 pb-1"
          >
            <span className="text-[10px] text-muted-foreground">
              {selected.size}
              {data.maxSelections ? ` / ${data.maxSelections}` : ""} selected
              {data.minSelections && data.minSelections > 0 && !meetsMin && (
                <span className="ml-1 text-destructive">
                  (min {data.minSelections})
                </span>
              )}
            </span>
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

        {/* Actions */}
        <motion.div
          variants={enterVariants}
          className="flex items-center justify-between border-t px-4 py-3"
        >
          <div className="flex items-center gap-2">
            {data.source && <SourceLabel source={data.source} />}
          </div>
          <div className="flex items-center gap-2">
            {!data.required && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={pending}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {data.cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!meetsMin || pending}
              className={cn(
                "rounded-lg px-4 py-1.5 text-[12px] font-medium transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              {pending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin" />
                  Processing...
                </span>
              ) : (
                data.confirmLabel
              )}
            </button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
