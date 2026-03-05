import { z } from "zod"

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

export const ChartSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),

  type: z.enum(["line", "bar", "area", "scatter", "pie", "donut"]),

  series: z.array(SeriesSchema).min(1),

  xAxis: z.object({
    label: z.string().optional(),
    type: z.enum(["category", "number", "time"]).optional().default("category"),
  }).optional(),

  yAxis: z.object({
    label: z.string().optional(),
    unit: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),

  /** Show reference line */
  referenceLine: z.object({
    value: z.number(),
    label: z.string().optional(),
  }).optional(),

  confidence: z.number().min(0).max(1).optional(),

  source: z.object({
    label: z.string(),
    freshness: z.string().optional(),
  }).optional(),
})

export type ChartData = z.infer<typeof ChartSchema>

export function safeParseChart(data: unknown): ChartData | null {
  const result = ChartSchema.safeParse(data)
  return result.success ? result.data : null
}
