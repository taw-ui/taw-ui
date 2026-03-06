import { z } from "zod"
import { CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

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

export type OptionListData = z.infer<typeof OptionListSchema>
export type OptionData = z.infer<typeof OptionSchema>

export function parseOptionList(data: unknown): ParseResult<OptionListData> {
  return tawParse(OptionListSchema, data, "OptionList")
}
