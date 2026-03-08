import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./lib/types"

const IssueProviderSchema = z.enum([
  "github",
  "gitlab",
  "jira",
  "linear",
  "asana",
  "shortcut",
])

const IssuePrioritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "none",
])

const IssueStatusSchema = z.enum([
  "open",
  "in_progress",
  "in_review",
  "done",
  "closed",
  "cancelled",
])

const IssueLabelSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
})

const IssueAssigneeSchema = z.object({
  name: z.string(),
  avatar: z.string().optional(),
})

export const issueCardSchema = z.object({
  id: z.string(),
  provider: IssueProviderSchema,
  identifier: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: IssueStatusSchema,
  priority: IssuePrioritySchema.optional(),
  labels: z.array(IssueLabelSchema).max(6).optional(),
  assignees: z.array(IssueAssigneeSchema).max(5).optional(),
  author: IssueAssigneeSchema.optional(),
  url: z.string().optional(),
  repository: z.string().optional(),
  project: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  commentCount: z.number().optional(),
  reasoning: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type IssueCardData = z.infer<typeof issueCardSchema>
export type IssueProvider = z.infer<typeof IssueProviderSchema>
export type IssuePriority = z.infer<typeof IssuePrioritySchema>
export type IssueStatus = z.infer<typeof IssueStatusSchema>
export type IssueLabel = z.infer<typeof IssueLabelSchema>
export type IssueAssignee = z.infer<typeof IssueAssigneeSchema>
