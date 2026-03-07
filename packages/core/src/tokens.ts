/**
 * taw-ui canonical token contract
 *
 * This is the single source of truth for all supported `--taw-*` CSS variables.
 * Every theme file (styles.css, globals.css) must define all of these tokens.
 *
 * Components reference tokens via Tailwind's `(--taw-{name})` syntax.
 * Users override tokens by redefining `--taw-{name}` in their CSS.
 */

// ─── Token categories ───────────────────────────────────────────────────────

export const TAW_TOKEN_CATEGORIES = {
  surfaces: {
    label: "Surfaces",
    tokens: ["surface", "surface-raised", "surface-sunken"],
  },
  borders: {
    label: "Borders",
    tokens: ["border", "border-subtle", "border-strong"],
  },
  text: {
    label: "Text",
    tokens: ["text-primary", "text-secondary", "text-muted", "text-disabled"],
  },
  accent: {
    label: "Accent",
    tokens: ["accent", "accent-subtle", "accent-hover"],
  },
  semantic: {
    label: "Semantic",
    tokens: ["success", "warning", "error"],
  },
  radius: {
    label: "Radius",
    tokens: ["radius", "radius-sm", "radius-lg"],
  },
  shadows: {
    label: "Shadows",
    tokens: ["shadow-sm", "shadow-md", "shadow-ring"],
  },
} as const

// ─── Flat token list ────────────────────────────────────────────────────────

/** All canonical taw-ui token names (without `--taw-` prefix). */
export const TAW_TOKENS = Object.values(TAW_TOKEN_CATEGORIES).flatMap(
  (cat) => cat.tokens,
)

/** A canonical taw-ui token name (e.g. `"surface"`, `"text-primary"`). */
export type TawToken = (typeof TAW_TOKENS)[number]

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a token name to its CSS variable name: `"surface"` → `"--taw-surface"` */
export function tawVar(token: TawToken): `--taw-${TawToken}` {
  return `--taw-${token}`
}

/** Convert a token name to a CSS `var()` reference: `"surface"` → `"var(--taw-surface)"` */
export function tawVarRef(token: TawToken): string {
  return `var(--taw-${token})`
}
