import { z, type ZodTypeAny } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"
import { strictify } from "../utils/strict"

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

// ─── Strict-mode helper for DataTable ───────────────────────────────────────
// DataTable.strict throws because `rows` uses z.record() (dynamic keys).
// Use this factory to generate a strict schema with known column definitions.

export interface StrictColumnDef {
  key: string
  type?: "string" | "number" | "boolean"
}

/**
 * Generate a strict-mode-compatible Zod schema for DataTable
 * with concrete column definitions.
 *
 * DataTable normally uses `z.record()` for rows (dynamic keys per column),
 * which is incompatible with strict-mode structured outputs. This factory
 * builds a schema with a fixed row shape based on your column definitions.
 *
 * @example
 * ```ts
 * const schema = strictDataTableSchema({
 *   columns: [
 *     { key: "name", type: "string" },
 *     { key: "revenue", type: "number" },
 *     { key: "active", type: "boolean" },
 *   ],
 * })
 *
 * const { object } = await generateObject({
 *   model: openai("gpt-4o"),
 *   schema,
 *   prompt: "Show top customers",
 * })
 * const result = DataTable.parse(object)
 * ```
 */
export function strictDataTableSchema(opts: {
  columns: StrictColumnDef[]
}): ZodTypeAny {
  const rowShape: z.ZodRawShape = {}
  for (const col of opts.columns) {
    const base: ZodTypeAny =
      col.type === "number" ? z.number() :
      col.type === "boolean" ? z.boolean() :
      z.string()
    rowShape[col.key] = base.nullable()
  }

  // Build a concrete DataTable schema with typed rows,
  // then strictify everything else (columns, source, etc.)
  const concrete = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    columns: z.array(ColumnSchema),
    rows: z.array(z.object(rowShape).strict()),
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

  return strictify(concrete)
}
