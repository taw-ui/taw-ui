import { z } from "zod"
import { ConfidenceSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

const DataPointSchema = z.object({
  x: z.union([z.string(), z.number()]),
  y: z.number(),
  label: z.string().optional(),
})

const SeriesSchema = z.object({
  id: z.string(),
  label: z.string(),
  data: z.array(DataPointSchema),
  color: z.string().optional(),
})

export const ChartSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(["line", "bar", "area", "scatter", "pie", "donut"]),
    series: z.array(SeriesSchema).min(1),
    xAxis: z
      .object({
        label: z.string().optional(),
        type: z
          .enum(["category", "number", "time"])
          .optional()
          .default("category"),
      })
      .optional(),
    yAxis: z
      .object({
        label: z.string().optional(),
        unit: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional(),
    referenceLine: z
      .object({
        value: z.number(),
        label: z.string().optional(),
      })
      .optional(),
    confidence: ConfidenceSchema,
    source: SourceSchema,
  })
  .superRefine((data, ctx) => {
    // Validate no duplicate series IDs
    const ids = data.series.map((s) => s.id)
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["series"],
          message: `Duplicate series id: "${id}"`,
        })
      }
      seen.add(id)
    }
  })

export const Chart = defineTawContract("Chart", ChartSchema)

export type ChartData = typeof Chart.type

/** @deprecated Use Chart.safeParse() instead */
export function safeParseChart(data: unknown): ChartData | null {
  return Chart.safeParse(data)
}
