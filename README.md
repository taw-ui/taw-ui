# taw-ui

**UI components for AI tool calls.**

Schema-validated. SDK-agnostic. Motion-native. You own the code.

---

## What is this?

When an AI calls a tool, you get raw JSON back. taw-ui turns that JSON into production-grade UI — with loading states during streaming, spring-animated entrances, and helpful errors when data doesn't match the schema.

```tsx
// Before: raw JSON, no types, no loading, no errors
const data = part.output as any
return <div>{data.value}</div>

// After: schema-validated, animated, all states handled
return <KpiCard part={part} />
```

## Install

```bash
npm i taw-ui
npx taw-ui add kpi-card
```

`taw-ui` installs the runtime (schemas, types, validation). The CLI copies components into your project — you own them, customize anything.

## Quick start

### 1. Define your tool with the schema

```ts
import { tool } from "ai"
import { KpiCardSchema } from "@/components/taw/kpi-card"

const getMetrics = tool({
  description: "Get business metrics",
  parameters: z.object({ metric: z.string() }),
  outputSchema: KpiCardSchema,
  execute: async ({ metric }) => ({
    id: metric,
    stats: [{
      key: metric,
      label: "Revenue",
      value: 142580,
      format: { kind: "currency", currency: "USD" },
      diff: { value: 12.4 },
    }],
    confidence: 0.92,
    source: { label: "Stripe", freshness: "2 min ago" },
  }),
})
```

### 2. Render

```tsx
import { KpiCard } from "@/components/taw/kpi-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  switch (part.toolName) {
    case "getMetrics":
      return <KpiCard part={part} />
    default:
      return null
  }
}
```

That's it. The component handles loading, streaming, error, and success states automatically.

## How it works

```
┌─ Your project ─────────────────────────────┐
│                                             │
│  @/components/taw/kpi-card.tsx    ← YOURS   │
│  @/components/taw/data-table.tsx  ← YOURS   │
│  @/components/taw/option-list.tsx ← YOURS   │
│                                             │
│  imports from:                              │
│  ┌─ taw-ui (npm) ──────────────────────┐   │
│  │  schemas, types, parse, actions     │   │
│  │  versioned, tested, guaranteed      │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

Components are copied into your project (like shadcn). Types, schemas, and validation come from the `taw-ui` npm package so contracts stay versioned.

## Components

| Component | Type | Description |
|---|---|---|
| `KpiCard` | Display | Metrics with sparklines, animated counting, delta indicators |
| `DataTable` | Display | Sortable table with 9 column types — currency, percent, delta, badges |
| `OptionList` | Interactive | Single/multi-select with keyboard nav and receipt pattern |
| `LinkCard` | Display | Rich link preview with OG metadata and favicon |
| `InsightCard` | Display | Structured AI analysis with sentiment-coded recommendation |
| `AlertCard` | Interactive | Severity-based alerts with inline metrics and actions |
| `MemoryCard` | Interactive | AI memory viewer with per-item review verdicts |

## What makes taw-ui different

- **AI-native fields** — every schema supports `confidence` (0-1) and `source` provenance
- **Part-aware lifecycle** — one prop handles loading, streaming, error, and success
- **Spring physics motion** — numbers count up with springs, entrances are smooth
- **Helpful errors** — parse failures show field-level details and "Did you mean?" suggestions
- **SDK-agnostic** — works with Vercel AI SDK, Anthropic, OpenAI, or raw JSON
- **Receipt pattern** — interactive components collapse to compact summaries after decisions

## CLI

```bash
npx taw-ui init              # Set up shared utilities
npx taw-ui add kpi-card      # Add a component
npx taw-ui add --all         # Add all components
```

Auto-detects your package manager (npm, pnpm, yarn, bun).

## License

MIT
