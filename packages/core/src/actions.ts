import { z } from "zod"

// ─── Actions ──────────────────────────────────────────────────────────────────

/**
 * An action button that can be displayed on interactive components.
 * Maps to a button the user can click to make a decision.
 */
export const TawActionSchema = z.object({
  /** Unique identifier for this action (e.g. "confirm", "cancel", "approve") */
  id: z.string(),
  /** Button label */
  label: z.string(),
  /** Visual variant — inferred from id when omitted */
  variant: z
    .enum(["primary", "secondary", "ghost", "destructive"])
    .optional(),
  /** Whether this action is disabled */
  disabled: z.boolean().optional(),
  /** Label shown during confirm-before-execute (e.g. "Are you sure?") */
  confirmLabel: z.string().optional(),
})

export type TawAction = z.infer<typeof TawActionSchema>

/**
 * Action IDs that default to non-primary styling.
 * When variant is omitted, actions with these IDs get "ghost" variant.
 */
export const NEGATORY_ACTION_IDS = new Set([
  "cancel",
  "dismiss",
  "skip",
  "close",
  "decline",
  "reject",
  "back",
  "no",
])

/**
 * Resolves the visual variant for an action.
 * Explicit variant wins; otherwise inferred from action ID.
 */
export function resolveActionVariant(
  action: TawAction,
): NonNullable<TawAction["variant"]> {
  if (action.variant) return action.variant
  if (NEGATORY_ACTION_IDS.has(action.id)) return "ghost"
  return "primary"
}

// ─── Receipts ─────────────────────────────────────────────────────────────────

/**
 * The outcome of a user decision on an interactive component.
 */
export type TawReceiptOutcome =
  | "success"
  | "partial"
  | "cancelled"
  | "failed"

/**
 * A receipt captures what happened after a user made a decision.
 * Interactive components transition from interactive → receipt state
 * once the user acts.
 */
export const TawReceiptSchema = z.object({
  /** The action ID that was taken (e.g. "confirm", "cancel") */
  actionId: z.string(),
  /** What happened */
  outcome: z.enum(["success", "partial", "cancelled", "failed"]),
  /** Human-readable summary of the decision */
  summary: z.string(),
  /** When the decision was made */
  timestamp: z.number(),
  /** Any selected values (e.g. option IDs) */
  selectedIds: z.array(z.string()).optional(),
  /** Arbitrary metadata from the decision */
  meta: z.record(z.string(), z.unknown()).optional(),
})

export type TawReceipt = z.infer<typeof TawReceiptSchema>

/**
 * Creates a receipt from a user action.
 */
export function createReceipt(
  actionId: string,
  outcome: TawReceiptOutcome,
  summary: string,
  options?: {
    selectedIds?: string[]
    meta?: Record<string, unknown>
  },
): TawReceipt {
  return {
    actionId,
    outcome,
    summary,
    timestamp: Date.now(),
    ...(options?.selectedIds && { selectedIds: options.selectedIds }),
    ...(options?.meta && { meta: options.meta }),
  }
}

// ─── Interactive component props ──────────────────────────────────────────────

/**
 * Base props for interactive taw-ui components (OptionList, ApprovalCard, etc.)
 * Extends TawComponentProps with decision handling.
 */
export interface TawInteractiveProps {
  /** Callback when user takes an action */
  onAction?: ((actionId: string, payload: unknown) => void) | undefined
  /** If set, component renders in receipt (read-only) state */
  receipt?: TawReceipt | undefined
  /** Whether the component is in a submitting/executing state */
  pending?: boolean | undefined
}
