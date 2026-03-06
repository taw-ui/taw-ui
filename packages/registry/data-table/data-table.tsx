"use client"

import { motion } from "framer-motion"
import { useState, useMemo, useCallback } from "react"
import type { TawToolPart } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, Typewriter } from "../lib/shared"
import { parseDataTable, type DataTableData } from "./schema"

// ─── Cell formatters ──────────────────────────────────────────────────────────

function formatCell(
  value: unknown,
  column: DataTableData["columns"][number],
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-(--taw-text-muted)">&mdash;</span>
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
            isNeg ? "text-(--taw-error)" : "text-(--taw-success)",
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
      const arrow = isNeg ? "\u2193" : num > 0 ? "\u2191" : "\u2192"
      return (
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            isNeg
              ? "text-(--taw-error)"
              : num > 0
                ? "text-(--taw-success)"
                : "text-(--taw-text-muted)",
          )}
        >
          {arrow} {isNeg ? "" : "+"}{num}
        </span>
      )
    }

    case "date": {
      const str = String(value)
      try {
        return (
          <span className="text-(--taw-text-secondary)">
            {new Date(str).toLocaleDateString(column.format?.locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )
      } catch {
        return str
      }
    }

    case "badge":
      return (
        <span className="inline-flex rounded-full bg-(--taw-surface-sunken) px-2.5 py-0.5 text-[11px] font-medium text-(--taw-text-secondary)">
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
          className="text-(--taw-accent) underline decoration-dotted hover:decoration-solid"
        >
          {str}
        </a>
      )
    }

    case "boolean":
      return (
        <span className={value ? "text-(--taw-success)" : "text-(--taw-text-muted)"}>
          {value ? "\u2713" : "\u2014"}
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
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "ml-1 inline-block shrink-0 transition-opacity",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-30",
      )}
    >
      {direction === "asc" ? (
        <polyline points="18 15 12 9 6 15" />
      ) : (
        <polyline points="6 9 12 15 18 9" />
      )}
    </svg>
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

  const result = parseDataTable(output)
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
        "overflow-hidden rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) font-sans",
        className,
      )}
      data-taw-component="data-table"
      data-taw-id={data.id}
    >
      {/* Header */}
      {(data.title || data.description) && (
        <motion.div
          variants={enterVariants}
          className="border-b border-(--taw-border) bg-(--taw-surface-sunken) px-4 py-3"
        >
          {data.title && (
            <h3 className="text-[14px] font-semibold text-(--taw-text-primary)">
              {data.title}
            </h3>
          )}
          {data.description && (
            <p className="mt-0.5 text-[11px] text-(--taw-text-muted)">
              {data.description}
            </p>
          )}
        </motion.div>
      )}

      {/* Table */}
      <motion.div variants={enterVariants} className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-(--taw-border)">
              {data.columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "group whitespace-nowrap px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-(--taw-text-muted)",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && "cursor-pointer select-none transition-colors hover:text-(--taw-text-primary)",
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        direction={sort?.key === col.key ? sort.direction : "asc"}
                        active={sort?.key === col.key}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <motion.tr
                key={i}
                variants={enterVariants}
                className="border-b border-(--taw-border) transition-colors last:border-b-0 hover:bg-(--taw-surface-sunken)"
              >
                {data.columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-4 py-2.5",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      colIdx === 0 && "font-medium text-(--taw-text-primary)",
                      colIdx !== 0 && "text-(--taw-text-secondary)",
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

      {/* Footer */}
      {(data.total || data.source) && (
        <motion.div
          variants={enterVariants}
          className="flex items-center justify-between border-t border-(--taw-border) bg-(--taw-surface-sunken) px-4 py-2.5"
        >
          <span className="text-[11px] text-(--taw-text-muted)">
            {data.total
              ? `${sortedRows.length} of ${data.total} rows`
              : `${sortedRows.length} rows`}
          </span>
          {data.source && <SourceLabel source={data.source} />}
        </motion.div>
      )}

      {/* Caveat */}
      {data.caveat && (
        <motion.div
          variants={enterVariants}
          className="border-t border-(--taw-border) px-4 py-2.5"
        >
          <div className="flex gap-1.5 rounded-[6px] bg-(--taw-accent-subtle) px-2.5 py-1.5">
            <span className="mt-px text-[10px] text-(--taw-accent)">{"\u2192"}</span>
            <Typewriter
              text={data.caveat}
              animate={animate}
              className="text-[11px] leading-relaxed text-(--taw-accent)"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
