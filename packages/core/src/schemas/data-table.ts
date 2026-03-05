import { z } from "zod"

const ColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["text", "number", "currency", "percent", "date", "badge", "link"]).optional().default("text"),
  align: z.enum(["left", "center", "right"]).optional().default("left"),
  sortable: z.boolean().optional().default(false),
  width: z.string().optional(),
  /** Format hint for numbers/currency */
  format: z.object({
    locale: z.string().optional(),
    currency: z.string().optional(),
    decimals: z.number().optional(),
  }).optional(),
})

export const DataTableSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(ColumnSchema).min(1),
  rows: z.array(z.record(z.string(), z.unknown())),
  /** Total rows if paginated */
  total: z.number().optional(),
  /** Default sort */
  defaultSort: z.object({
    key: z.string(),
    direction: z.enum(["asc", "desc"]),
  }).optional(),
  /** AI confidence in this data */
  confidence: z.number().min(0).max(1).optional(),
  source: z.object({
    label: z.string(),
    freshness: z.string().optional(),
  }).optional(),
})

export type DataTableData = z.infer<typeof DataTableSchema>
export type ColumnData = z.infer<typeof ColumnSchema>

export function safeParseDataTable(data: unknown): DataTableData | null {
  const result = DataTableSchema.safeParse(data)
  return result.success ? result.data : null
}
