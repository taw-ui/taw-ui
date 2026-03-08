import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./lib/types"

const InsightMetricSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  status: z.enum(["good", "warning", "critical"]).optional(),
})

export const insightCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  metrics: z.array(InsightMetricSchema).min(1).max(8),
  recommendation: z.string().optional(),
  sentiment: z
    .enum(["positive", "caution", "negative"])
    .optional()
    .default("caution"),
  reasoning: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type InsightCardData = z.infer<typeof insightCardSchema>
export type InsightMetricData = z.infer<typeof InsightMetricSchema>
