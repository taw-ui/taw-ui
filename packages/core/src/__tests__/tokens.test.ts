import { describe, it, expect } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"
import { TAW_TOKENS, TAW_TOKEN_CATEGORIES, tawVar, tawVarRef } from "../tokens"

// Workspace root (packages/core/src/__tests__ → 4 levels up)
const ROOT = resolve(__dirname, "../../../..")

function readCssFile(pathFromRoot: string): string {
  return readFileSync(resolve(ROOT, pathFromRoot), "utf-8")
}

// ─── Token contract integrity ───────────────────────────────────────────────

describe("TAW_TOKENS", () => {
  it("has 22 canonical tokens", () => {
    expect(TAW_TOKENS).toHaveLength(22)
  })

  it("flat list matches category contents", () => {
    const fromCategories = Object.values(TAW_TOKEN_CATEGORIES).flatMap(
      (cat) => cat.tokens,
    )
    expect(TAW_TOKENS).toEqual(fromCategories)
  })

  it("has no duplicates", () => {
    const unique = new Set(TAW_TOKENS)
    expect(unique.size).toBe(TAW_TOKENS.length)
  })
})

// ─── Helpers ────────────────────────────────────────────────────────────────

describe("tawVar", () => {
  it("generates CSS variable names", () => {
    expect(tawVar("surface")).toBe("--taw-surface")
    expect(tawVar("text-primary")).toBe("--taw-text-primary")
    expect(tawVar("shadow-md")).toBe("--taw-shadow-md")
  })
})

describe("tawVarRef", () => {
  it("generates CSS var() references", () => {
    expect(tawVarRef("accent")).toBe("var(--taw-accent)")
  })
})

// ─── CSS file coverage ─────────────────────────────────────────────────────

describe("styles.css token coverage", () => {
  const css = readCssFile("packages/react/styles.css")

  it.each(TAW_TOKENS.map((t) => [t]))("defines --taw-%s", (token) => {
    expect(css).toContain(`--taw-${token}:`)
  })
})

describe("globals.css token coverage", () => {
  const css = readCssFile("apps/www/src/app/globals.css")

  it.each(TAW_TOKENS.map((t) => [t]))("defines --taw-%s", (token) => {
    expect(css).toContain(`--taw-${token}:`)
  })
})
