import { z } from "zod"
import { defineTawContract } from "../contract"

const OptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  score: z.number().min(0).max(1).optional(),
  badge: z.string().optional(),
  recommended: z.boolean().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export const OptionListSchema = z
  .object({
    id: z.string(),
    question: z.string(),
    description: z.string().optional(),
    options: z.array(OptionSchema).min(1).max(10),
    multiple: z.boolean().optional().default(false),
    required: z.boolean().optional().default(true),
    reasoning: z.string().optional(),
    confirmLabel: z.string().optional().default("Confirm"),
  })
  .superRefine((data, ctx) => {
    // Validate no duplicate option IDs
    const ids = data.options.map((o) => o.id)
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: `Duplicate option id: "${id}"`,
        })
      }
      seen.add(id)
    }
  })

export const OptionList = defineTawContract("OptionList", OptionListSchema)

export type OptionListData = typeof OptionList.type
export type OptionData = z.infer<typeof OptionSchema>

/** @deprecated Use OptionList.safeParse() instead */
export function safeParseOptionList(data: unknown): OptionListData | null {
  return OptionList.safeParse(data)
}
