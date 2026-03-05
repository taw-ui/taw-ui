import { z } from "zod"
import { ConfidenceSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

export const LinkCardSchema = z.object({
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
  source: SourceSchema,
})

export const LinkCard = defineTawContract("LinkCard", LinkCardSchema)

export type LinkCardData = typeof LinkCard.type
