import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

/**
 * Normalized issue status — provider-agnostic.
 * `color` is optional and accepts any CSS color string
 * (hex, hsl, rgb, named). Adapters map provider-specific
 * colors here; the component falls back to sensible defaults.
 */
const IssueStatusSchema = z.object({
  label: z.string(),
  color: z.string().optional(),
})

/**
 * Assignee — minimal identity for display.
 * No email or auth-related fields; taw-ui doesn't handle identity.
 */
const IssueAssigneeSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().url().optional(),
})

/**
 * Label / tag — provider-agnostic.
 */
const IssueLabelSchema = z.object({
  name: z.string(),
  color: z.string().optional(),
})

/**
 * Canonical issue surface schema.
 *
 * Represents a work item / ticket / issue from any provider
 * (GitHub, Linear, Jira, etc.) in a normalized shape.
 *
 * Design principles:
 * - Provider-aware, not provider-dependent
 * - All display-only — no mutation, no auth
 * - Optional fields degrade gracefully in the UI
 */
export const IssueCardSchema = z.object({
  /** Stable identifier (e.g. "github:octocat/repo#42") */
  id: z.string(),

  /** Source provider */
  provider: z.enum(["github", "linear", "jira", "other"]),

  /** Issue title */
  title: z.string(),

  /** Issue number (e.g. #123) */
  number: z.number().int().positive().optional(),

  /** Normalized status */
  status: IssueStatusSchema,

  /** Priority level */
  priority: z.enum(["urgent", "high", "medium", "low", "none"]).optional(),

  /** Assignee */
  assignee: IssueAssigneeSchema.optional(),

  /** Labels / tags */
  labels: z.array(IssueLabelSchema).optional(),

  /** Project or repository name */
  project: z.string().optional(),

  /** URL back to the issue in the provider */
  url: z.string().url().optional(),

  /** When the issue was created (ISO 8601 or relative) */
  createdAt: z.string().optional(),

  /** When the issue was last updated (ISO 8601 or relative) */
  updatedAt: z.string().optional(),

  /** Body / description (truncated for display) */
  description: z.string().optional(),

  /** AI confidence in this data (0–1) */
  confidence: ConfidenceSchema,

  /** Human-readable uncertainty note */
  caveat: CaveatSchema,

  /** Data provenance */
  source: SourceSchema,
})

export const IssueCard = defineTawContract("IssueCard", IssueCardSchema)

export type IssueCardData = typeof IssueCard.type
export type IssueStatusData = z.infer<typeof IssueStatusSchema>
export type IssueAssigneeData = z.infer<typeof IssueAssigneeSchema>
export type IssueLabelData = z.infer<typeof IssueLabelSchema>
