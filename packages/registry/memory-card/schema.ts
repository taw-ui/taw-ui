import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

export const MemoryCategorySchema = z.enum([
  "preference",
  "fact",
  "context",
  "assumption",
])

export const MemoryItemSchema = z.object({
  id: z.string(),
  content: z.string(),
  category: MemoryCategorySchema,
  learnedFrom: z.string().optional(),
  confidence: ConfidenceSchema,
})

export const MemoryCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  memories: z.array(MemoryItemSchema).min(1),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type MemoryCategory = z.infer<typeof MemoryCategorySchema>
export type MemoryItemData = z.infer<typeof MemoryItemSchema>
export type MemoryCardData = z.infer<typeof MemoryCardSchema>

export function parseMemoryCard(data: unknown): ParseResult<MemoryCardData> {
  return tawParse(MemoryCardSchema, data, "MemoryCard")
}
