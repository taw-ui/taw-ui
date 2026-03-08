import type { ZodType, ZodTypeDef } from "zod"

// ─── Tool Part ──────────────────────────────────────────────────────────────
// Structurally compatible with AI SDK's ToolUIPart. Pass parts directly from
// useChat() — no adapter needed.

export type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"

export interface ToolPart {
  state: ToolState | (string & {})
  toolCallId: string
  toolName: string
  input?: unknown
  output?: unknown
  errorText?: string
}

// ─── Parse ──────────────────────────────────────────────────────────────────

export interface ParseIssue {
  path: string
  message: string
  expected?: string | undefined
  received?: string | undefined
}

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; issues: ParseIssue[] }

export function safeParse<O, D extends ZodTypeDef = ZodTypeDef, I = unknown>(
  schema: ZodType<O, D, I>,
  data: unknown,
): ParseResult<O> {
  const result = schema.safeParse(data)
  if (result.success) return { ok: true, data: result.data }

  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join(".") || "root",
      message: issue.message,
      expected: "expected" in issue ? String(issue.expected) : undefined,
      received: "received" in issue ? String(issue.received) : undefined,
    })),
  }
}

// ─── Shared schema fragments ────────────────────────────────────────────────
// Inlined here so component schemas are fully self-contained (no npm imports).

import { z } from "zod"

export const ConfidenceSchema = z.number().min(0).max(1).optional()
export const CaveatSchema = z.string().optional()
export const SourceSchema = z
  .object({
    label: z.string(),
    url: z.string().optional(),
    freshness: z.string().optional(),
  })
  .optional()

export type SourceData = z.infer<typeof SourceSchema>
