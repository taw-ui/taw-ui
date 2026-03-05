import { z } from "zod"

const OptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  /** Relative weight/score (0–1) — used to display recommendation strength */
  score: z.number().min(0).max(1).optional(),
  /** Visual badge on the option */
  badge: z.string().optional(),
  /** Whether this option is recommended by the AI */
  recommended: z.boolean().optional(),
  /** Metadata for receipt display after selection */
  meta: z.record(z.string(), z.unknown()).optional(),
})

export const OptionListSchema = z.object({
  id: z.string(),

  /** Question or prompt being answered by this option list */
  question: z.string(),

  /** Subtitle or additional context */
  description: z.string().optional(),

  options: z.array(OptionSchema).min(1).max(10),

  /** Whether multiple options can be selected */
  multiple: z.boolean().optional().default(false),

  /** Whether a selection is required to continue */
  required: z.boolean().optional().default(true),

  /** AI reasoning for the presented options */
  reasoning: z.string().optional(),

  /** Confirmation button label */
  confirmLabel: z.string().optional().default("Confirm"),
})

export type OptionListData = z.infer<typeof OptionListSchema>
export type OptionData = z.infer<typeof OptionSchema>

export function safeParseOptionList(data: unknown): OptionListData | null {
  const result = OptionListSchema.safeParse(data)
  return result.success ? result.data : null
}
