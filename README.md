# taw-ui

**UI components for AI tool calls.**

Schema-first. SDK-agnostic. Motion-native.

---

## What is this?

When an AI calls a tool, you get raw JSON back. `taw-ui` turns that JSON into production-grade UI — with loading states during streaming, smooth animations on arrival, and helpful errors when data doesn't match.

```tsx
// Before taw-ui
const data = part.output as any
return <div>{data.value}</div>  // no types, no loading, no errors

// With taw-ui
return <KpiCard part={part} />  // schema-validated, animated, streamed
```

## Philosophy

**Schema-first.** Every component ships with a Zod schema. You use the same schema to define your tool's `outputSchema`, validate the client-side output, and get TypeScript types — one source of truth.

**Part-aware.** Components accept the full tool call `part`, not just the output. They know when data is streaming, complete, or errored — and render the right state automatically.

**SDK-agnostic.** The core is zero-dependency. Adapters for Vercel AI SDK, Anthropic, and OpenAI normalize their different formats into a single `TawToolPart` interface.

**Motion-native.** Built on Framer Motion with spring physics. Skeletons breathe. Values count up. Pass `animate={false}` to opt out entirely.

---

## Installation

### Via shadcn (recommended)

```bash
npx shadcn@latest add https://taw-ui.dev/r/kpi-card
```

This copies the component and its schema directly into your project. You own the code.

### Via npm

```bash
pnpm add @taw-ui/react @taw-ui/core framer-motion
```

---

## Quick start

### 1. Add CSS variables

```css
/* app/globals.css */
@import "@taw-ui/core/taw.css";
```

### 2. Define your tool with the schema

```ts
import { tool } from "ai"
import { KpiCardSchema } from "@taw-ui/core"

const tools = {
  getRevenue: tool({
    description: "Get current revenue metrics",
    parameters: z.object({ period: z.string() }),
    outputSchema: KpiCardSchema,
    execute: async ({ period }) => ({
      id: "revenue",
      label: "Monthly Revenue",
      value: 48200,
      unit: "R$",
      delta: 3200,
      trend: "up",
      confidence: 0.94,
      source: { label: "Stripe", freshness: "2 min ago" },
    }),
  }),
}
```

### 3. Render

```tsx
import { KpiCard } from "@taw-ui/react"

{message.parts.map((part) =>
  part.type === "tool-getRevenue" ? (
    <KpiCard key={part.toolCallId} part={part} />
  ) : null
)}
```

---

## Components

| Component | Description | Has Receipt |
|---|---|---|
| `KpiCard` | Single metric with delta, trend, and confidence | — |
| `DataTable` | Typed tabular data with sorting | — |
| `Chart` | Line, bar, area, pie — wraps Recharts | — |
| `OptionList` | User choice that feeds back into conversation | ✓ |

---

## Part states

Every taw-ui component handles all four states automatically:

```
input-available  →  skeleton (tool called, executing)
streaming        →  skeleton (data arriving)
output-available →  full component (animated entrance)
output-error     →  error display (with message)
```

---

## SDK adapters

Adapters normalize each SDK's format into `TawToolPart`:

```tsx
import { toTawPart } from "@taw-ui/vercel-ai"
<KpiCard part={toTawPart(part)} />
```

---

## License

MIT © [taw-ui](https://github.com/taw-ui)
