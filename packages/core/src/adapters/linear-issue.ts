import type { IssueCardData } from "../schemas/issue-card"

// ─── Linear GraphQL types (subset) ──────────────────────────────────────────
// These are intentionally loose — we don't import @linear/sdk
// so there's no SDK lock-in. Any object with these fields works.

export interface LinearIssue {
  id: string
  identifier: string // e.g. "ENG-123"
  number: number
  title: string
  description?: string | null
  url: string
  createdAt: string
  updatedAt: string
  priority: number // 0 = none, 1 = urgent, 2 = high, 3 = medium, 4 = low
  priorityLabel?: string
  state?: {
    name: string
    color?: string
    type?: string // "backlog" | "unstarted" | "started" | "completed" | "cancelled"
  } | null
  assignee?: {
    name: string
    displayName?: string
    avatarUrl?: string
  } | null
  labels?: {
    nodes: Array<{
      name: string
      color?: string
    }>
  } | null
  team?: {
    name: string
    key: string
  } | null
  project?: {
    name: string
  } | null
}

/**
 * Transform a Linear GraphQL issue object into canonical IssueCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the issue; taw-ui normalizes and renders it.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const issue = await linearClient.issue("issue-id")
 *
 * // taw-ui normalizes it
 * const data = fromLinearIssue(issue)
 *
 * // taw-ui renders it
 * <IssueCard part={{ id: "1", toolName: "issue", state: "output-available", input: {}, output: data }} />
 * ```
 */
export function fromLinearIssue(issue: LinearIssue): IssueCardData {
  const project = issue.project?.name ?? issue.team?.name

  return {
    id: `linear:${issue.identifier}`,
    provider: "linear",
    title: issue.title,
    number: issue.number,
    status: {
      label: issue.state?.name ?? "Unknown",
      color: issue.state?.color,
    },
    priority: mapLinearPriority(issue.priority),
    assignee: issue.assignee
      ? {
          name: issue.assignee.displayName ?? issue.assignee.name,
          avatarUrl: issue.assignee.avatarUrl,
        }
      : undefined,
    labels: issue.labels?.nodes.map((l) => ({
      name: l.name,
      color: l.color,
    })),
    project,
    url: issue.url,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    description: issue.description ? truncate(issue.description, 200) : undefined,
    source: {
      label: "Linear",
      url: issue.url,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapLinearPriority(priority: number): IssueCardData["priority"] {
  switch (priority) {
    case 1: return "urgent"
    case 2: return "high"
    case 3: return "medium"
    case 4: return "low"
    default: return "none"
  }
}

function truncate(str: string, max: number): string {
  const clean = str.replace(/\r\n/g, "\n").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}
