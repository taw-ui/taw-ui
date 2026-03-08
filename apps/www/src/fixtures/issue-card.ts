import type { ToolPart } from "@/components/taw/lib/types"

export const issueCardOptions = [
  { key: "description", label: "description", defaultOn: true },
  { key: "priority", label: "priority", defaultOn: true },
  { key: "labels", label: "labels", defaultOn: true },
  { key: "assignees", label: "assignees", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

// ─── Example: GitHub issue ───────────────────────────────────────────────────

export const githubIssueFixture: ToolPart = {
  toolCallId: "gh-1",
  toolName: "getIssue",
  input: { owner: "vercel", repo: "next.js", number: 58234 },
  state: "output-available",
  output: {
    id: "github:vercel/next.js#58234",
    provider: "github",
    identifier: "vercel/next.js#58234",
    title: "App Router: Dynamic routes fail to prerender with generateStaticParams",
    status: "open",
    priority: "high",
    assignees: [{ name: "timneutkens", avatar: "https://avatars.githubusercontent.com/u/6324199?v=4" }],
    labels: [
      { name: "bug", color: "#d73a4a" },
      { name: "app-router", color: "#0075ca" },
    ],
    repository: "vercel/next.js",
    url: "https://github.com/vercel/next.js/issues/58234",
    createdAt: "2024-11-15T10:30:00Z",
    updatedAt: "2024-12-02T14:22:00Z",
    description: "When using generateStaticParams with dynamic route segments in the App Router, the build fails with 'Error: Page changed from SSG to SSR'. This happens consistently when the route has nested dynamic segments.",
    source: { label: "GitHub", url: "https://github.com/vercel/next.js/issues/58234" },
  },
}

// ─── Example: Linear issue ───────────────────────────────────────────────────

export const linearIssueFixture: ToolPart = {
  toolCallId: "lin-1",
  toolName: "getIssue",
  input: { identifier: "ENG-423" },
  state: "output-available",
  output: {
    id: "linear:ENG-423",
    provider: "linear",
    identifier: "ENG-423",
    title: "Implement webhook retry logic with exponential backoff",
    status: "in_progress",
    priority: "medium",
    assignees: [{ name: "Sarah Chen" }],
    labels: [
      { name: "backend", color: "#bb87fc" },
      { name: "reliability", color: "#4ea7fc" },
    ],
    project: "Platform",
    url: "https://linear.app/acme/issue/ENG-423",
    createdAt: "2024-12-01T09:15:00Z",
    updatedAt: "2024-12-03T16:45:00Z",
    description: "Webhook deliveries currently fail silently after the first attempt. We need to implement retry logic with exponential backoff (1s, 2s, 4s, 8s, 16s) and dead letter queue for failed deliveries.",
    source: { label: "Linear", url: "https://linear.app/acme/issue/ENG-423" },
  },
}

// ─── Minimal issue (few optional fields) ────────────────────────────────────

export const minimalIssueFixture: ToolPart = {
  toolCallId: "min-1",
  toolName: "getIssue",
  input: { id: "TASK-99" },
  state: "output-available",
  output: {
    id: "jira:TASK-99",
    provider: "jira",
    identifier: "TASK-99",
    title: "Update onboarding flow copy",
    status: "open",
  },
}

// ─── Issue with caveat / confidence ─────────────────────────────────────────

export const issueWithCaveatFixture: ToolPart = {
  toolCallId: "cav-1",
  toolName: "getIssue",
  input: { owner: "facebook", repo: "react", number: 28140 },
  state: "output-available",
  output: {
    id: "github:facebook/react#28140",
    provider: "github",
    identifier: "facebook/react#28140",
    title: "useEffect cleanup runs twice in development mode",
    status: "done",
    priority: "low",
    labels: [
      { name: "Type: Discussion", color: "#fef2c0" },
    ],
    repository: "facebook/react",
    url: "https://github.com/facebook/react/issues/28140",
    createdAt: "2024-01-20T08:00:00Z",
    description: "In React 18 strict mode, useEffect cleanup functions run twice during development. This is intentional behavior but confuses many developers.",
    confidence: 0.72,
    caveat: "This issue may have been addressed in a recent canary release — verify against latest.",
    source: { label: "GitHub", url: "https://github.com/facebook/react/issues/28140" },
  },
}

// ─── All fixtures for ComponentPreview ───────────────────────────────────────

export const issueCardFixtures: Record<string, ToolPart> = {
  ready: githubIssueFixture,
  linear: linearIssueFixture,
  minimal: minimalIssueFixture,
  caveat: issueWithCaveatFixture,
  loading: {
    toolCallId: "ic-load",
    toolName: "getIssue",
    input: { owner: "vercel", repo: "next.js", number: 123 },
    state: "input-available",
  },
  error: {
    toolCallId: "ic-err",
    toolName: "getIssue",
    input: { owner: "vercel", repo: "next.js", number: 999 },
    state: "output-error",
    errorText: "Issue not found or access denied",
  },
}

// ─── Raw provider examples (for adapter documentation) ──────────────────────

/**
 * Example raw GitHub REST API response shape.
 */
export const rawGithubIssueExample = {
  id: 2012345678,
  number: 58234,
  title: "App Router: Dynamic routes fail to prerender with generateStaticParams",
  body: "When using generateStaticParams with dynamic route segments in the App Router, the build fails with 'Error: Page changed from SSG to SSR'. This happens consistently when the route has nested dynamic segments.",
  state: "open",
  state_reason: null,
  html_url: "https://github.com/vercel/next.js/issues/58234",
  created_at: "2024-11-15T10:30:00Z",
  updated_at: "2024-12-02T14:22:00Z",
  user: { login: "developer123", avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4" },
  assignee: { login: "timneutkens", avatar_url: "https://avatars.githubusercontent.com/u/6324199?v=4" },
  labels: [
    { name: "bug", color: "d73a4a" },
    { name: "app-router", color: "0075ca" },
  ],
  repository: { full_name: "vercel/next.js" },
}

/**
 * Example raw Linear GraphQL response shape.
 */
export const rawLinearIssueExample = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  identifier: "ENG-423",
  number: 423,
  title: "Implement webhook retry logic with exponential backoff",
  description: "Webhook deliveries currently fail silently after the first attempt. We need to implement retry logic with exponential backoff (1s, 2s, 4s, 8s, 16s) and dead letter queue for failed deliveries.",
  url: "https://linear.app/acme/issue/ENG-423",
  createdAt: "2024-12-01T09:15:00Z",
  updatedAt: "2024-12-03T16:45:00Z",
  priority: 3,
  priorityLabel: "Medium",
  state: { name: "In Progress", color: "#f2c94c", type: "started" },
  assignee: { name: "sarah.chen", displayName: "Sarah Chen" },
  labels: {
    nodes: [
      { name: "backend", color: "#bb87fc" },
      { name: "reliability", color: "#4ea7fc" },
    ],
  },
  team: { name: "Engineering", key: "ENG" },
  project: { name: "Platform" },
}
