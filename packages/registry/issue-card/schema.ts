import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

const IssueStatusSchema = z.object({
  label: z.string(),
  color: z.string().optional(),
})

const IssueAssigneeSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().url().optional(),
})

const IssueLabelSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
})

export const IssueCardSchema = z.object({
  id: z.string(),
  provider: z.enum(["github", "linear", "jira", "other"]),
  title: z.string(),
  number: z.number().int().positive().optional(),
  status: IssueStatusSchema,
  priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),
  assignee: IssueAssigneeSchema.optional(),
  labels: z.array(IssueLabelSchema).optional(),
  project: z.string().optional(),
  url: z.string().url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  description: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type IssueCardData = z.infer<typeof IssueCardSchema>
export type IssueStatusData = z.infer<typeof IssueStatusSchema>
export type IssueAssigneeData = z.infer<typeof IssueAssigneeSchema>
export type IssueLabelData = z.infer<typeof IssueLabelSchema>

export function parseIssueCard(data: unknown): ParseResult<IssueCardData> {
  return tawParse(IssueCardSchema, data, "IssueCard")
}
