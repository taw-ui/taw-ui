"use client"

import { motion } from "framer-motion"
import { useState, useMemo, useCallback } from "react"
import {
  DataTable as DataTableContract,
  type DataTableData,
  type TawToolPart,
} from "@taw-ui/core"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { ConfidenceBadge, SourceLabel, TawError, TawSkeleton } from "./shared"

// ─── Cell formatters ──────────────────────────────────────────────────────────

function formatCell(
  value: unknown,
  column: DataTableData["columns"][number],
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-[--taw-text-muted]">—</span>
  }

  switch (column.type) {
    case "number": {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value)
      const decimals = column.format?.decimals
      return (
        <span className="font-mono tabular-nums">
          {decimals !== undefined ? num.toFixed(decimals) : num.toLocaleString(column.format?.locale)}
        </span>
      )
    }

    case "currency": {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value)
      return (
        <span className="font-mono tabular-nums">
          {num.toLocaleString(column.format?.locale, {
            style: "currency",
            currency: column.format?.currency ?? "USD",
            minimumFractionDigits: column.format?.decimals ?? 0,
            maximumFractionDigits: column.format?.decimals ?? 0,
          })}
        </span>
      )
    }

    case "percent": {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value)
      const isNeg = num < 0
      return (
        <span
          className={cn(
            "font-mono tabular-nums",
            isNeg
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {isNeg ? "" : "+"}
          {num.toFixed(column.format?.decimals ?? 1)}%
        </span>
      )
    }

    case "delta": {
      const num = Number(value)
      if (Number.isNaN(num)) return String(value)
      const isNeg = num < 0
      const arrow = isNeg ? "↓" : num > 0 ? "↑" : "→"
      return (
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            isNeg
              ? "text-red-600 dark:text-red-400"
              : num > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-[--taw-text-muted]",
          )}
        >
          {arrow} {isNeg ? "" : "+"}{num}
        </span>
      )
    }

    case "date": {
      const str = String(value)
      try {
        return new Date(str).toLocaleDateString(column.format?.locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      } catch {
        return str
      }
    }

    case "badge":
      return (
        <span className="inline-flex rounded-full bg-[--taw-accent]/10 px-2 py-0.5 text-[11px] font-medium text-[--taw-accent]">
          {String(value)}
        </span>
      )

    case "link": {
      const str = String(value)
      return (
        <a
          href={str}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[--taw-accent] underline decoration-dotted hover:decoration-solid"
        >
          {str}
        </a>
      )
    }

    case "boolean":
      return (
        <span className={value ? "text-emerald-600 dark:text-emerald-400" : "text-[--taw-text-muted]"}>
          {value ? "✓" : "✗"}
        </span>
      )

    default:
      return String(value)
  }
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({
  direction,
  active,
}: {
  direction: "asc" | "desc"
  active: boolean
}) {
  return (
    <span
      className={cn(
        "ml-1 inline-block text-[10px]",
        active ? "text-[--taw-text-primary]" : "text-[--taw-text-muted] opacity-0 group-hover:opacity-50",
      )}
    >
      {direction === "asc" ? "↑" : "↓"}
    </span>
  )
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

function DataTableSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["14px", "120px"],
        ["12px", "100%"],
        ["12px", "100%"],
        ["12px", "100%"],
        ["12px", "80%"],
      ]}
      animate={animate}
      className="min-w-[320px]"
    />
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export interface DataTableProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function DataTable({
  part,
  animate = true,
  className,
}: DataTableProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <DataTableSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = DataTableContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as DataTableData

  return <DataTableView data={data} animate={animate} className={className} />
}

// ─── DataTableView (pure render) ──────────────────────────────────────────────

function DataTableView({
  data,
  animate,
  className,
}: {
  data: DataTableData
  animate: boolean
  className?: string | undefined
}) {
  const [sort, setSort] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(data.defaultSort ?? null)

  const handleSort = useCallback(
    (key: string) => {
      setSort((prev) => {
        if (prev?.key === key) {
          return prev.direction === "asc"
            ? { key, direction: "desc" }
            : null
        }
        return { key, direction: "asc" }
      })
    },
    [],
  )

  const sortedRows = useMemo(() => {
    if (!sort) return data.rows
    const col = data.columns.find((c) => c.key === sort.key)
    if (!col) return data.rows

    return [...data.rows].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const numA = Number(aVal)
      const numB = Number(bVal)
      const cmp = !Number.isNaN(numA) && !Number.isNaN(numB)
        ? numA - numB
        : String(aVal).localeCompare(String(bVal))

      return sort.direction === "asc" ? cmp : -cmp
    })
  }, [data.rows, data.columns, sort])

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "relative overflow-hidden rounded-[--taw-radius] border",
        "bg-[--taw-surface] border-[--taw-border]",
        className,
      )}
      data-taw-component="data-table"
      data-taw-id={data.id}
    >
      {data.confidence !== undefined && (
        <ConfidenceBadge confidence={data.confidence} />
      )}

      {(data.title || data.description) && (
        <motion.div variants={enterVariants} className="px-4 pt-4 pb-2">
          {data.title && (
            <h3 className="text-sm font-semibold text-[--taw-text-primary]">
              {data.title}
            </h3>
          )}
          {data.description && (
            <p className="mt-0.5 text-xs text-[--taw-text-muted]">
              {data.description}
            </p>
          )}
        </motion.div>
      )}

      <motion.div variants={enterVariants} className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[--taw-border]">
              {data.columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "group px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-[--taw-text-muted]",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && "cursor-pointer select-none hover:text-[--taw-text-primary]",
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon
                      direction={sort?.key === col.key ? sort.direction : "asc"}
                      active={sort?.key === col.key}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <motion.tr
                key={i}
                variants={enterVariants}
                className={cn(
                  "border-b border-[--taw-border] last:border-b-0",
                  "hover:bg-[--taw-surface-raised] transition-colors",
                )}
              >
                {data.columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-[--taw-text-primary]",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                    )}
                  >
                    {formatCell(row[col.key], col)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {(data.total || data.source) && (
        <motion.div
          variants={enterVariants}
          className="flex items-center justify-between px-4 py-2 text-[10px] text-[--taw-text-muted]"
        >
          {data.total ? (
            <span>
              {sortedRows.length} of {data.total} rows
            </span>
          ) : (
            <span>{sortedRows.length} rows</span>
          )}
          {data.source && <SourceLabel source={data.source} />}
        </motion.div>
      )}
    </motion.div>
  )
}
