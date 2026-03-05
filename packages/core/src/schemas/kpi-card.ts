import { z } from "zod"

export const KpiCardSchema = z.object({
  /** Stable backend ID — used for keying and addressability */
  id: z.string(),

  /** Human-readable metric name */
  label: z.string(),

  /** The metric value — number or pre-formatted string */
  value: z.union([z.number(), z.string()]),

  /** Unit suffix displayed after value (e.g. "%", "ms", "R$") */
  unit: z.string().optional(),

  /** Absolute change from previous period */
  delta: z.number().optional(),

  /** Direction of change */
  trend: z.enum(["up", "down", "neutral"]).optional(),

  /** Whether "up" is good (default true — e.g. revenue up = good, churn up = bad) */
  trendPositive: z.boolean().optional().default(true),

  /**
   * AI confidence in this value (0–1).
   * Unique to taw-ui — surfaces uncertainty in data-driven UIs.
   */
  confidence: z.number().min(0).max(1).optional(),

  /** Data provenance — where this value came from */
  source: z
    .object({
      label: z.string(),
      /** ISO 8601 or relative string like "2 hours ago" */
      freshness: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),

  /** Optional description or footnote */
  description: z.string().optional(),
})

export type KpiCardData = z.infer<typeof KpiCardSchema>

export function safeParseKpiCard(data: unknown): KpiCardData | null {
  const result = KpiCardSchema.safeParse(data)
  return result.success ? result.data : null
}
