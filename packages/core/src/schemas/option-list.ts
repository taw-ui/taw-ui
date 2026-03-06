import { z } from "zod"
import { defineTawContract } from "../contract"
import { CaveatSchema, SourceSchema } from "./shared"

const OptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  badge: z.string().optional(),
  recommended: z.boolean().optional(),
  disabled: z.boolean().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
})

export const OptionListSchema = z
  .object({
    id: z.string(),
    question: z.string(),
    description: z.string().optional(),
    options: z.array(OptionSchema).min(1).max(10),
    selectionMode: z.enum(["single", "multi"]).optional().default("single"),
    minSelections: z.number().min(0).optional().default(1),
    maxSelections: z.number().min(1).optional(),
    required: z.boolean().optional().default(true),
    reasoning: z.string().optional(),
    confirmLabel: z.string().optional().default("Confirm"),
    cancelLabel: z.string().optional().default("Skip"),
    caveat: CaveatSchema,
    source: SourceSchema.optional(),
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

    // Validate min <= max
    if (
      data.minSelections !== undefined &&
      data.maxSelections !== undefined &&
      data.minSelections > data.maxSelections
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minSelections"],
        message: "`minSelections` cannot be greater than `maxSelections`.",
      })
    }
  })

export const OptionList = defineTawContract("OptionList", OptionListSchema)

export type OptionListData = typeof OptionList.type
export type OptionData = z.infer<typeof OptionSchema>

/** @deprecated Use OptionList.safeParse() instead */
export function safeParseOptionList(data: unknown): OptionListData | null {
  return OptionList.safeParse(data)
}
