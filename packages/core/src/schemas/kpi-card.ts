import { z } from "zod"
import { ConfidenceSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

export const KpiCardSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  delta: z.number().optional(),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  trendPositive: z.boolean().optional().default(true),
  confidence: ConfidenceSchema,
  source: SourceSchema,
  description: z.string().optional(),
})

export const KpiCard = defineTawContract("KpiCard", KpiCardSchema)

export type KpiCardData = typeof KpiCard.type

/** @deprecated Use KpiCard.safeParse() instead */
export function safeParseKpiCard(data: unknown): KpiCardData | null {
  return KpiCard.safeParse(data)
}
