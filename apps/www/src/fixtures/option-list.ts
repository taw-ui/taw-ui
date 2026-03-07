import type { TawToolPart } from "@taw-ui/react"

export const optionListOptions = [
  { key: "description", label: "description", defaultOn: true },
  { key: "reasoning", label: "reasoning", defaultOn: true },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

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
      selectionMode: "single",
      options: [
        {
          id: "rolling",
          label: "Rolling Deploy",
          description: "Zero-downtime deployment with gradual rollout. Takes ~15 minutes.",
          badge: "Recommended",
          recommended: true,
        },
        {
          id: "blue-green",
          label: "Blue-Green Deploy",
          description: "Full environment swap. Instant rollback capability but requires 2x resources.",
        },
        {
          id: "maintenance",
          label: "Maintenance Window",
          description: "Schedule 30-min downtime. Simplest approach but impacts users.",
          badge: "Downtime",
        },
      ],
      reasoning: "Rolling deploy is recommended because the schema changes are backward-compatible and the backfill can run incrementally.",
      caveat: "Deployment times are estimates based on similar past migrations",
      source: { label: "Infrastructure API", freshness: "live" },
      confirmLabel: "Deploy",
    },
  },
  "multi-select": {
    id: "ol-4",
    toolName: "chooseAction",
    input: { context: "features" },
    state: "output-available",
    output: {
      id: "feature-flags",
      question: "Which features should we enable for the beta?",
      description: "Select up to 3 features to roll out.",
      selectionMode: "multi",
      maxSelections: 3,
      options: [
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "System-aware theme switching with custom palette support.",
          recommended: true,
        },
        {
          id: "ai-assistant",
          label: "AI Assistant",
          description: "Context-aware chat sidebar powered by GPT-4o.",
          recommended: true,
        },
        {
          id: "collab",
          label: "Real-time Collaboration",
          description: "Multiplayer editing with cursor presence and conflict resolution.",
        },
        {
          id: "export",
          label: "PDF Export",
          description: "High-fidelity document export with custom headers and footers.",
        },
      ],
      reasoning: "Dark Mode and AI Assistant have the highest user demand scores from the beta survey.",
      caveat: "Enabling more than 2 features may increase beta crash rate by ~5%",
      source: { label: "Feature Flag Service", freshness: "synced" },
      confirmLabel: "Enable",
      cancelLabel: "Skip for now",
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
