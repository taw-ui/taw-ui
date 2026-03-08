import type { IssueCardData } from "../schemas/issue-card"

// ─── GitHub REST API types (subset) ─────────────────────────────────────────
// These are intentionally loose — we don't import @octokit/types
// so there's no SDK lock-in. Any object with these fields works.

export interface GithubIssue {
  id: number
  number: number
  title: string
  body?: string | null
  state: string // "open" | "closed"
  state_reason?: string | null // "completed" | "not_planned" | "reopened" | null
  html_url: string
  created_at: string
  updated_at: string
  user?: { login: string; avatar_url?: string } | null
  assignee?: { login: string; avatar_url?: string } | null
  labels?: Array<
    | string
    | { name?: string; color?: string }
  >
  repository?: { full_name?: string } | null
  repository_url?: string
  milestone?: { title?: string } | null
}

/**
 * Transform a GitHub REST API issue object into canonical IssueCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the issue; taw-ui normalizes and renders it.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const res = await octokit.issues.get({ owner, repo, issue_number })
 *
 * // taw-ui normalizes it
 * const data = fromGithubIssue(res.data)
 *
 * // taw-ui renders it
 * <IssueCard part={{ id: "1", toolName: "issue", state: "output-available", input: {}, output: data }} />
 * ```
 */
export function fromGithubIssue(issue: GithubIssue): IssueCardData {
  const repo = issue.repository?.full_name ?? extractRepoFromUrl(issue.repository_url)

  return {
    id: `github:${repo ?? "unknown"}#${issue.number}`,
    provider: "github",
    title: issue.title,
    number: issue.number,
    status: mapGithubStatus(issue.state, issue.state_reason),
    assignee: issue.assignee
      ? { name: issue.assignee.login, avatarUrl: issue.assignee.avatar_url }
      : undefined,
    labels: issue.labels
      ?.map((l) => {
        if (typeof l === "string") return { name: l }
        if (l.name) return { name: l.name, color: l.color ? `#${l.color}` : undefined }
        return null
      })
      .filter((l): l is NonNullable<typeof l> => l !== null),
    project: repo,
    url: issue.html_url,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    description: issue.body ? truncate(issue.body, 200) : undefined,
    source: {
      label: "GitHub",
      url: issue.html_url,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapGithubStatus(
  state: string,
  stateReason?: string | null,
): IssueCardData["status"] {
  if (state === "closed") {
    return stateReason === "not_planned"
      ? { label: "Closed", color: "#8b949e" }
      : { label: "Done", color: "#a371f7" }
  }
  return { label: "Open", color: "#3fb950" }
}

function extractRepoFromUrl(url?: string): string | undefined {
  if (!url) return undefined
  // https://api.github.com/repos/octocat/hello-world -> octocat/hello-world
  const match = url.match(/repos\/(.+)$/)
  return match?.[1]
}

function truncate(str: string, max: number): string {
  const clean = str.replace(/\r\n/g, "\n").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}
