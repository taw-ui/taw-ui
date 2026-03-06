import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

export const LinkCardSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  favicon: z.string().optional(),
  domain: z.string().optional(),
  reason: z.string().optional(),
  publishedAt: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type LinkCardData = z.infer<typeof LinkCardSchema>

export function parseLinkCard(data: unknown): ParseResult<LinkCardData> {
  return tawParse(LinkCardSchema, data, "LinkCard")
}
