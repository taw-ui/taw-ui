import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

const StatFormatSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text") }),
  z.object({
    kind: z.literal("number"),
    decimals: z.number().optional(),
    compact: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal("currency"),
    currency: z.string(),
    decimals: z.number().optional(),
  }),
  z.object({
    kind: z.literal("percent"),
    decimals: z.number().optional(),
    basis: z.enum(["fraction", "unit"]).optional().default("unit"),
  }),
])

const StatDiffSchema = z.object({
  value: z.number(),
  decimals: z.number().optional().default(1),
  upIsPositive: z.boolean().optional().default(true),
  label: z.string().optional(),
})

const StatSparklineSchema = z.object({
  data: z.array(z.number()).min(2),
  color: z.string().optional(),
})

const StatItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.union([z.number(), z.string()]),
  format: StatFormatSchema.optional(),
  diff: StatDiffSchema.optional(),
  sparkline: StatSparklineSchema.optional(),
})

export const KpiCardSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  stats: z.array(StatItemSchema).min(1).max(4),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export const KpiCard = defineTawContract("KpiCard", KpiCardSchema)

export type KpiCardData = typeof KpiCard.type
export type StatItem = z.infer<typeof StatItemSchema>
export type StatFormat = z.infer<typeof StatFormatSchema>
export type StatDiff = z.infer<typeof StatDiffSchema>
export type StatSparkline = z.infer<typeof StatSparklineSchema>
