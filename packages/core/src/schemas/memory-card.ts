import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

export const MemoryCategorySchema = z.enum([
  "preference",
  "fact",
  "context",
  "assumption",
])

export const MemoryItemSchema = z.object({
  /** Stable identifier for this memory */
  id: z.string(),
  /** What the AI remembers */
  content: z.string(),
  /** How the AI categorizes this memory */
  category: MemoryCategorySchema,
  /** Where/when the AI learned this */
  learnedFrom: z.string().optional(),
  /** How confident the AI is this is still accurate */
  confidence: ConfidenceSchema,
})

export const MemoryCardSchema = z.object({
  /** Stable identifier */
  id: z.string(),
  /** Title for this memory collection */
  title: z.string(),
  /** Description or context */
  description: z.string().optional(),
  /** Individual memories */
  memories: z.array(MemoryItemSchema).min(1),
  /** Overall confidence */
  confidence: ConfidenceSchema,
  /** Human-readable uncertainty note */
  caveat: CaveatSchema,
  /** Data provenance */
  source: SourceSchema,
})

export const MemoryCard = defineTawContract("MemoryCard", MemoryCardSchema)

export type MemoryCategory = z.infer<typeof MemoryCategorySchema>
export type MemoryItemData = z.infer<typeof MemoryItemSchema>
export type MemoryCardData = typeof MemoryCard.type
