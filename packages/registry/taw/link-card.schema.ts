import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./lib/types"

export const linkCardSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  favicon: z.string().optional(),
  domain: z.string().optional(),
  /** Why the AI is sharing this link */
  reason: z.string().optional(),
  /** Published or last-updated date (ISO 8601 or human-readable) */
  publishedAt: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type LinkCardData = z.infer<typeof linkCardSchema>
