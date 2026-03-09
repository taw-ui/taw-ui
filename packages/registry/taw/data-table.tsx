"use client"

import { motion } from "motion/react"
import { Check, X, ArrowUpDown } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
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
  dataTableSchema,
  type DataTableData,
  type ColumnData,
} from "./data-table.schema"

// ─── Sort state ──────────────────────────────────────────────────────────────

type SortDirection = "asc" | "desc" | null

interface SortState {
  key: string
  direction: SortDirection
}

function nextDirection(current: SortDirection): SortDirection {
  if (current === null) return "asc"
  if (current === "asc") return "desc"
  return null
}

// ─── Cell formatting ─────────────────────────────────────────────────────────

function formatCellValue(
  value: unknown,
  column: ColumnData,
): { text: string; node?: React.ReactNode } {
  if (value == null) return { text: "\u2014" }

  switch (column.type) {
    case "text":
      return { text: String(value) }

    case "number": {
      const num = Number(value)
      if (Number.isNaN(num)) return { text: String(value) }
      const decimals = column.format?.decimals
      const locale = column.format?.locale
      return {
        text:
          decimals !== undefined
            ? num.toFixed(decimals)
            : num.toLocaleString(locale),
      }
    }

    case "currency": {
      const num = Number(value)
      if (Number.isNaN(num)) return { text: String(value) }
      const currency = column.format?.currency ?? "USD"
      const locale = column.format?.locale
      const decimals = column.format?.decimals ?? 0
      return {
        text: num.toLocaleString(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
      }
    }

    case "percent": {
      const num = Number(value)
      if (Number.isNaN(num)) return { text: String(value) }
      const decimals = column.format?.decimals ?? 1
      const isPositive = num > 0
      const isNegative = num < 0
      const sign = isPositive ? "+" : ""
      const colorClass = isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : isNegative
          ? "text-red-600 dark:text-red-400"
          : "text-muted-foreground"
      return {
        text: `${sign}${num.toFixed(decimals)}%`,
        node: (
          <span className={cn("font-mono tabular-nums", colorClass)}>
            {sign}
            {num.toFixed(decimals)}%
          </span>
        ),
      }
    }

    case "delta": {
      const num = Number(value)
      if (Number.isNaN(num)) return { text: String(value) }
      const decimals = column.format?.decimals ?? 1
      const isPositive = num > 0
      const isNegative = num < 0
      const isZero = num === 0
      const sign = isPositive ? "+" : ""
      const colorClass = isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : isNegative
          ? "text-red-600 dark:text-red-400"
          : "text-muted-foreground"
      return {
        text: `${sign}${num.toFixed(decimals)}`,
        node: (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono tabular-nums",
              colorClass,
            )}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="currentColor"
              className={cn(
                "shrink-0",
                isNegative && "rotate-180",
                isZero && "rotate-90",
              )}
            >
              <path d="M4 1.5L7 5.5H1L4 1.5Z" />
            </svg>
            {sign}
            {num.toFixed(decimals)}
          </span>
        ),
      }
    }

    case "date": {
      const str = String(value)
      const date = new Date(str)
      if (Number.isNaN(date.getTime())) return { text: str }
      return {
        text: date.toLocaleDateString(column.format?.locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }
    }

    case "badge":
      return {
        text: String(value),
        node: (
          <Badge variant="secondary" className="text-[11px]">
            {String(value)}
          </Badge>
        ),
      }

    case "link": {
      const str = String(value)
      const isUrl = str.startsWith("http://") || str.startsWith("https://")
      return {
        text: str,
        node: isUrl ? (
          <a
            href={str}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            {str}
          </a>
        ) : (
          <span className="text-primary">{str}</span>
        ),
      }
    }

    case "boolean": {
      const bool = Boolean(value)
      return {
        text: bool ? "Yes" : "No",
        node: bool ? (
          <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
        ) : (
          <X size={14} className="text-red-600 dark:text-red-400" />
        ),
      }
    }

    default:
      return { text: String(value) }
  }
}

// ─── Sort icon ───────────────────────────────────────────────────────────────

function SortIcon({
  active,
}: {
  direction: SortDirection
  active: boolean
}) {
  return (
    <ArrowUpDown
      size={12}
      className={cn(
        "ml-1 inline-block shrink-0 transition-opacity",
        active ? "opacity-100" : "opacity-0 group-hover/sortable:opacity-40",
      )}
    />
  )
}

// ─── Alignment helper ────────────────────────────────────────────────────────

function alignClass(align: "left" | "center" | "right"): string {
  switch (align) {
    case "center":
      return "text-center"
    case "right":
      return "text-right"
    default:
      return "text-left"
  }
}

// ─── DataTable ───────────────────────────────────────────────────────────────

export interface DataTableProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function DataTable({
  part,
  animate = true,
  className,
}: DataTableProps) {
  // Guard: output-available with no output -> treat as loading
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["12px", "120px"],
          ["10px", "100%"],
          ["10px", "100%"],
          ["10px", "100%"],
          ["10px", "100%"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="DataTable"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(dataTableSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="DataTable"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  return <DataTableInner data={result.data} animate={animate} className={className} />
}

// ─── Inner (stateful) ────────────────────────────────────────────────────────

function DataTableInner({
  data,
  animate,
  className,
}: {
  data: DataTableData
  animate: boolean
  className?: string | undefined
}) {
  const [sort, setSort] = useState<SortState>(() => ({
    key: data.defaultSort?.key ?? "",
    direction: data.defaultSort?.direction ?? null,
  }))

  const handleSort = useCallback(
    (key: string) => {
      setSort((prev) => ({
        key,
        direction: prev.key === key ? nextDirection(prev.direction) : "asc",
      }))
    },
    [],
  )

  const sortedRows = useMemo(() => {
    if (!sort.key || !sort.direction) return data.rows

    const col = data.columns.find((c) => c.key === sort.key)
    if (!col) return data.rows

    return [...data.rows].sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      let cmp: number
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal
      } else if (col.type === "date") {
        cmp = new Date(String(aVal)).getTime() - new Date(String(bVal)).getTime()
      } else {
        cmp = String(aVal).localeCompare(String(bVal))
      }

      return sort.direction === "desc" ? -cmp : cmp
    })
  }, [data.rows, data.columns, sort])

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("relative gap-0 overflow-hidden py-0", className)}
        data-taw="data-table"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Header */}
        {(data.title || data.description) && (
          <motion.div
            variants={enterVariants}
            className="border-b px-4 py-3"
          >
            {data.title && (
              <h3 className="text-[13px] font-semibold text-foreground">
                {data.title}
              </h3>
            )}
            {data.description && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {data.description}
              </p>
            )}
          </motion.div>
        )}

        {/* Table */}
        <motion.div variants={enterVariants}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {data.columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                      alignClass(col.align),
                      col.sortable && "group/sortable cursor-pointer select-none",
                    )}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={
                      col.sortable
                        ? () => handleSort(col.key)
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          direction={sort.key === col.key ? sort.direction : null}
                          active={sort.key === col.key && sort.direction !== null}
                        />
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  variants={enterVariants}
                  className="border-b transition-colors hover:bg-muted/50 last:border-0"
                >
                  {data.columns.map((col) => {
                    const { text, node } = formatCellValue(row[col.key], col)
                    return (
                      <TableCell
                        key={col.key}
                        className={cn(
                          "text-[13px]",
                          alignClass(col.align),
                          col.type === "number" ||
                            col.type === "currency" ||
                            col.type === "percent" ||
                            col.type === "delta"
                            ? "font-mono tabular-nums"
                            : "",
                        )}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {node ?? text}
                      </TableCell>
                    )
                  })}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        {/* Footer */}
        {(data.total !== undefined || data.source || data.caveat) && (
          <div className="border-t">
            {data.caveat && (
              <motion.div
                variants={enterVariants}
                className="mx-4 mb-1 mt-3 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
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

            <motion.div
              variants={enterVariants}
              className="flex items-center justify-between px-4 py-2"
            >
              {data.total !== undefined && (
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {data.total.toLocaleString()}{" "}
                  {data.total === 1 ? "row" : "rows"}
                </span>
              )}
              {data.source && <SourceLabel source={data.source} />}
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
