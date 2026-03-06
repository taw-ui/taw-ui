import { z } from "zod"
import { CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

const AlertMetricSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
})

const AlertActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  primary: z.boolean().optional(),
})

export const AlertCardSchema = z.object({
  id: z.string(),
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string(),
  description: z.string().optional(),
  metrics: z.array(AlertMetricSchema).max(6).optional(),
  actions: z.array(AlertActionSchema).max(4).optional(),
  reasoning: z.string().optional(),
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type AlertCardData = z.infer<typeof AlertCardSchema>
export type AlertMetricData = z.infer<typeof AlertMetricSchema>
export type AlertActionData = z.infer<typeof AlertActionSchema>

export function parseAlertCard(data: unknown): ParseResult<AlertCardData> {
  return tawParse(AlertCardSchema, data, "AlertCard")
}
