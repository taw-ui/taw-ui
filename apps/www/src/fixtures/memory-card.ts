import type { TawToolPart } from "@taw-ui/react"

const baseInput = { query: "what do you know about me" }

const fullOutput = {
  id: "user-memory",
  title: "What I Remember",
  description: "From our last 5 conversations",
  memories: [
    {
      id: "pref-dark-mode",
      content: "You prefer dark mode in all tools and editors",
      category: "preference" as const,
      learnedFrom: "conversation on Mar 2",
      confidence: 0.95,
    },
    {
      id: "fact-stack",
      content: "Your stack is Next.js 15 + Tailwind CSS + pnpm monorepo",
      category: "fact" as const,
      learnedFrom: "package.json analysis",
      confidence: 0.99,
    },
    {
      id: "context-project",
      content: "You're building taw-ui, an open-source component library for AI tool outputs",
      category: "context" as const,
      learnedFrom: "ongoing project context",
      confidence: 0.98,
    },
    {
      id: "assumption-timezone",
      content: "You're based in Brazil, likely Sao Paulo timezone",
      category: "assumption" as const,
      learnedFrom: "inferred from activity patterns",
      confidence: 0.68,
    },
    {
      id: "pref-pixel-art",
      content: "You like pixel art aesthetics and hand-drawn SVG icons",
      category: "preference" as const,
      learnedFrom: "design decisions in taw-ui",
      confidence: 0.88,
    },
    {
      id: "assumption-senior",
      content: "You're a senior engineer who values DX and clean architecture",
      category: "assumption" as const,
      learnedFrom: "code review patterns",
      confidence: 0.75,
    },
  ],
  caveat: "Some memories are inferred and may be incorrect — review and correct them",
  source: { label: "Memory Store", freshness: "updated 2h ago" },
}

export const memoryCardFixtures: Record<string, TawToolPart> = {
  ready: {
    id: "demo-memory",
    toolName: "getMemories",
    input: baseInput,
    state: "output-available",
    output: fullOutput,
  },
  loading: {
    id: "demo-memory-loading",
    toolName: "getMemories",
    input: baseInput,
    state: "input-available",
  },
  error: {
    id: "demo-memory-error",
    toolName: "getMemories",
    input: baseInput,
    state: "output-error",
    error: "Memory store unavailable — could not retrieve stored context",
  },
}

export const memoryCardOptions = [
  { key: "description", label: "description", defaultOn: true },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: true },
]
