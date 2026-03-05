import { z } from "zod"
import { ConfidenceSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

const ColumnFormatSchema = z.object({
  locale: z.string().optional(),
  currency: z.string().optional(),
  decimals: z.number().optional(),
})

const ColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z
    .enum([
      "text",
      "number",
      "currency",
      "percent",
      "date",
      "badge",
      "link",
      "boolean",
      "delta",
    ])
    .optional()
    .default("text"),
  align: z.enum(["left", "center", "right"]).optional().default("left"),
  sortable: z.boolean().optional().default(false),
  width: z.string().optional(),
  format: ColumnFormatSchema.optional(),
})

export const DataTableSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    columns: z.array(ColumnSchema).min(1),
    rows: z.array(z.record(z.string(), z.unknown())),
    total: z.number().optional(),
    defaultSort: z
      .object({
        key: z.string(),
        direction: z.enum(["asc", "desc"]),
      })
      .optional(),
    confidence: ConfidenceSchema,
    source: SourceSchema,
  })
  .superRefine((data, ctx) => {
    const columnKeys = new Set(data.columns.map((c) => c.key))

    // Validate defaultSort.key exists in columns
    if (data.defaultSort && !columnKeys.has(data.defaultSort.key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultSort", "key"],
        message: `Sort key "${data.defaultSort.key}" does not match any column. Available: ${[...columnKeys].join(", ")}`,
      })
    }
  })

export const DataTable = defineTawContract("DataTable", DataTableSchema)

export type DataTableData = typeof DataTable.type
export type ColumnData = z.output<typeof ColumnSchema>

/** @deprecated Use DataTable.safeParse() instead */
export function safeParseDataTable(data: unknown): DataTableData | null {
  return DataTable.safeParse(data)
}
