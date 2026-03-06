import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

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
    caveat: CaveatSchema,
    source: SourceSchema,
  })
  .superRefine((data, ctx) => {
    const columnKeys = new Set(data.columns.map((c) => c.key))

    if (data.defaultSort && !columnKeys.has(data.defaultSort.key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["defaultSort", "key"],
        message: `Sort key "${data.defaultSort.key}" does not match any column. Available: ${[...columnKeys].join(", ")}`,
      })
    }
  })

export type DataTableData = z.infer<typeof DataTableSchema>
export type ColumnData = z.output<typeof ColumnSchema>

export function parseDataTable(data: unknown): ParseResult<DataTableData> {
  return tawParse(DataTableSchema, data, "DataTable")
}
