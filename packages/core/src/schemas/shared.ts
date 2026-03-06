import { z } from "zod"

/**
 * AI confidence in a value (0–1).
 * DX signal — developers use this to decide thresholds, filtering, logging.
 * Not rendered as a number in the UI. See `caveat` for human-facing uncertainty.
 */
export const ConfidenceSchema = z.number().min(0).max(1).optional()

/**
 * Human-readable uncertainty note from the AI.
 * Only set when the AI wants to communicate doubt — silence is confidence.
 * Examples: "Based on limited data", "This may have changed", "I'm inferring this"
 */
export const CaveatSchema = z.string().optional()

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
