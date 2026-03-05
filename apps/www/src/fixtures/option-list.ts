import type { TawToolPart } from "@taw-ui/core"

export const optionListFixtures: Record<string, TawToolPart> = {
  ready: {
    id: "ol-2",
    toolName: "chooseAction",
    input: { context: "deployment" },
    state: "output-available",
    output: {
      id: "deploy-strategy",
      question: "How should we deploy the database migration?",
      description: "The migration includes 3 schema changes and 1 data backfill.",
      options: [
        {
          id: "rolling",
          label: "Rolling Deploy",
          description: "Zero-downtime deployment with gradual rollout. Takes ~15 minutes.",
          score: 0.9,
          badge: "Recommended",
          recommended: true,
        },
        {
          id: "blue-green",
          label: "Blue-Green Deploy",
          description: "Full environment swap. Instant rollback capability but requires 2x resources.",
          score: 0.7,
        },
        {
          id: "maintenance",
          label: "Maintenance Window",
          description: "Schedule 30-min downtime. Simplest approach but impacts users.",
          score: 0.3,
          badge: "Downtime",
        },
      ],
      reasoning: "Rolling deploy is recommended because the schema changes are backward-compatible and the backfill can run incrementally.",
      confirmLabel: "Deploy",
    },
  },
  loading: {
    id: "ol-1",
    toolName: "chooseAction",
    input: { context: "deployment" },
    state: "input-available",
  },
  error: {
    id: "ol-3",
    toolName: "chooseAction",
    input: { context: "deployment" },
    state: "output-error",
    error: "Failed to generate deployment options",
  },
}
