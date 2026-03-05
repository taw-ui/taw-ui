import { z } from "zod"

/**
 * AI confidence in a value (0–1).
 * Unique to taw-ui — surfaces uncertainty in data-driven UIs.
 */
export const ConfidenceSchema = z.number().min(0).max(1).optional()

/**
 * Data provenance — where a value came from.
 * Unique to taw-ui — every component can show its source.
 */
export const SourceSchema = z
  .object({
    /** Human-readable source name */
    label: z.string(),
    /** ISO 8601 or relative string like "2 hours ago" */
    freshness: z.string().optional(),
    /** Link back to the original data source */
    url: z.string().url().optional(),
  })
  .optional()

export type SourceData = z.infer<typeof SourceSchema>
