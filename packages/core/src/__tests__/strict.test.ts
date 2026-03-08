import { describe, it, expect } from "vitest"
import { z } from "zod"

import { strictify, coerceNulls, toStrictJSONSchema, StrictModeError } from "../utils/strict"
import { defineTawContract } from "../contract"

import { KpiCard } from "../schemas/kpi-card"
import { OptionList } from "../schemas/option-list"
import { DataTable, strictDataTableSchema } from "../schemas/data-table"
import { Chart } from "../schemas/chart"
import { InsightCard } from "../schemas/insight-card"
import { AlertCard } from "../schemas/alert-card"
import { LinkCard } from "../schemas/link-card"
import { MemoryCard } from "../schemas/memory-card"

// ─── strictify() ────────────────────────────────────────────────────────────

describe("strictify", () => {
  it("converts .optional() to .nullable()", () => {
    const schema = z.object({ name: z.string().optional() })
    const strict = strictify(schema)
    // Should accept null
    expect(strict.safeParse({ name: null }).success).toBe(true)
    // Should accept the value
    expect(strict.safeParse({ name: "hello" }).success).toBe(true)
    // Should reject missing field (all fields required in strict)
    expect(strict.safeParse({}).success).toBe(false)
  })

  it("strips .default() and converts to .nullable()", () => {
    const schema = z.object({
      mode: z.enum(["a", "b"]).optional().default("a"),
    })
    const strict = strictify(schema)
    // Should accept null (no default applied)
    const result = strict.safeParse({ mode: null })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toEqual({ mode: null })
    // Should accept the value
    expect(strict.safeParse({ mode: "b" }).success).toBe(true)
  })

  it("does not double-wrap nullable", () => {
    const schema = z.object({
      field: z.string().nullable().optional(),
    })
    const strict = strictify(schema)
    expect(strict.safeParse({ field: null }).success).toBe(true)
    expect(strict.safeParse({ field: "hi" }).success).toBe(true)
  })

  it("adds additionalProperties: false (strict objects)", () => {
    const schema = z.object({ a: z.string() })
    const strict = strictify(schema)
    // Should reject extra properties
    expect(strict.safeParse({ a: "ok", b: "extra" }).success).toBe(false)
  })

  it("strictifies nested objects", () => {
    const schema = z.object({
      nested: z.object({
        x: z.string().optional(),
      }).optional(),
    })
    const strict = strictify(schema)
    expect(strict.safeParse({ nested: null }).success).toBe(true)
    expect(strict.safeParse({ nested: { x: null } }).success).toBe(true)
    expect(strict.safeParse({ nested: { x: "hi" } }).success).toBe(true)
  })

  it("strictifies arrays (strips min/max)", () => {
    const schema = z.object({
      items: z.array(z.string()).min(1).max(5),
    })
    const strict = strictify(schema)
    // Empty array should pass (min constraint stripped)
    expect(strict.safeParse({ items: [] }).success).toBe(true)
  })

  it("strictifies z.union()", () => {
    const schema = z.object({
      val: z.union([z.string(), z.number()]),
    })
    const strict = strictify(schema)
    expect(strict.safeParse({ val: "hi" }).success).toBe(true)
    expect(strict.safeParse({ val: 42 }).success).toBe(true)
  })

  it("strictifies z.discriminatedUnion()", () => {
    const schema = z.object({
      format: z.discriminatedUnion("kind", [
        z.object({ kind: z.literal("text") }),
        z.object({ kind: z.literal("number"), decimals: z.number().optional() }),
      ]).optional(),
    })
    const strict = strictify(schema)
    expect(strict.safeParse({ format: null }).success).toBe(true)
    expect(strict.safeParse({ format: { kind: "text" } }).success).toBe(true)
    expect(strict.safeParse({ format: { kind: "number", decimals: null } }).success).toBe(true)
  })

  it("strips .superRefine() effects", () => {
    const schema = z.object({ a: z.string() }).superRefine(() => {})
    const strict = strictify(schema)
    expect(strict.safeParse({ a: "ok" }).success).toBe(true)
  })

  it("strips string checks (.url, .min, .max)", () => {
    const schema = z.object({ url: z.string().url() })
    const strict = strictify(schema)
    // "not-a-url" should pass (url check stripped)
    expect(strict.safeParse({ url: "not-a-url" }).success).toBe(true)
  })

  it("strips number checks (.min, .max)", () => {
    const schema = z.object({ score: z.number().min(0).max(1) })
    const strict = strictify(schema)
    expect(strict.safeParse({ score: 999 }).success).toBe(true)
  })

  it("throws on z.record()", () => {
    const schema = z.object({
      data: z.record(z.string(), z.unknown()),
    })
    expect(() => strictify(schema)).toThrow(StrictModeError)
  })

  it("throws on z.unknown()", () => {
    const schema = z.object({ x: z.unknown() })
    expect(() => strictify(schema)).toThrow(StrictModeError)
  })

  it("omits optional fields that use z.record() instead of throwing", () => {
    const schema = z.object({
      name: z.string(),
      meta: z.record(z.string(), z.unknown()).optional(),
    })
    const strict = strictify(schema)
    // meta should be omitted from the strict schema
    expect(strict.safeParse({ name: "ok" }).success).toBe(true)
    // should reject meta since it's not in the shape
    expect(strict.safeParse({ name: "ok", meta: {} }).success).toBe(false)
  })
})

// ─── Component schema strictification ───────────────────────────────────────

describe("component schema strictification", () => {
  it("KpiCard.strict works", () => {
    expect(() => KpiCard.strict).not.toThrow()
    const result = KpiCard.strict.safeParse({
      id: "test",
      title: null,
      description: null,
      stats: [{
        key: "rev",
        label: "Revenue",
        value: 1000,
        format: null,
        diff: null,
        sparkline: null,
      }],
      confidence: null,
      caveat: null,
      source: null,
    })
    expect(result.success).toBe(true)
  })

  it("OptionList.strict works (meta omitted)", () => {
    expect(() => OptionList.strict).not.toThrow()
    const result = OptionList.strict.safeParse({
      id: "test",
      question: "Pick one",
      description: null,
      options: [{
        id: "a",
        label: "Option A",
        description: null,
        badge: null,
        recommended: null,
        disabled: null,
        // meta is omitted from strict schema
      }],
      selectionMode: null,
      minSelections: null,
      maxSelections: null,
      required: null,
      reasoning: null,
      confirmLabel: null,
      cancelLabel: null,
      caveat: null,
      source: null,
    })
    expect(result.success).toBe(true)
  })

  it("InsightCard.strict works", () => {
    expect(() => InsightCard.strict).not.toThrow()
  })

  it("AlertCard.strict works", () => {
    expect(() => AlertCard.strict).not.toThrow()
  })

  it("LinkCard.strict works", () => {
    expect(() => LinkCard.strict).not.toThrow()
  })

  it("MemoryCard.strict works", () => {
    expect(() => MemoryCard.strict).not.toThrow()
  })

  it("Chart.strict works", () => {
    expect(() => Chart.strict).not.toThrow()
  })

  it("DataTable.strict throws with descriptive error", () => {
    expect(() => DataTable.strict).toThrow(StrictModeError)
    expect(() => DataTable.strict).toThrow(/ZodRecord/)
  })
})

// ─── coerceNulls() ──────────────────────────────────────────────────────────

describe("coerceNulls", () => {
  it("converts null values to absent keys", () => {
    expect(coerceNulls({ a: "hello", b: null })).toEqual({ a: "hello" })
  })

  it("recurses into nested objects", () => {
    expect(coerceNulls({
      top: "ok",
      nested: { x: null, y: "keep" },
    })).toEqual({
      top: "ok",
      nested: { y: "keep" },
    })
  })

  it("recurses into arrays", () => {
    expect(coerceNulls({
      items: [{ a: null, b: "ok" }, { a: "yes", b: null }],
    })).toEqual({
      items: [{ b: "ok" }, { a: "yes" }],
    })
  })

  it("preserves non-null primitives", () => {
    expect(coerceNulls({ a: 0, b: false, c: "" })).toEqual({ a: 0, b: false, c: "" })
  })

  it("handles empty objects", () => {
    expect(coerceNulls({})).toEqual({})
  })

  it("handles already-clean data (no nulls)", () => {
    const data = { id: "x", stats: [{ key: "a", label: "A", value: 1 }] }
    expect(coerceNulls(data)).toEqual(data)
  })

  it("converts top-level null to undefined", () => {
    expect(coerceNulls(null)).toBeUndefined()
  })

  it("passes through primitives", () => {
    expect(coerceNulls("hello")).toBe("hello")
    expect(coerceNulls(42)).toBe(42)
    expect(coerceNulls(true)).toBe(true)
  })
})

// ─── Null-coercing parse (contract.parse / contract.safeParse) ──────────────

describe("null-coercing parse", () => {
  const TestSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    mode: z.enum(["a", "b"]).optional().default("a"),
    score: z.number().min(0).max(1).optional(),
  })
  const TestContract = defineTawContract("Test", TestSchema)

  it("parse() handles strict-mode output (null values)", () => {
    const result = TestContract.parse({
      id: "x",
      title: null,
      mode: null,
      score: null,
    })
    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      id: "x",
      mode: "a", // default applied because null → undefined → default
    })
  })

  it("parse() handles regular output (absent fields)", () => {
    const result = TestContract.parse({ id: "x" })
    expect(result.success).toBe(true)
    expect(result.data).toEqual({ id: "x", mode: "a" })
  })

  it("safeParse() handles strict-mode output", () => {
    const data = TestContract.safeParse({
      id: "x",
      title: null,
      mode: null,
      score: null,
    })
    expect(data).toEqual({ id: "x", mode: "a" })
  })

  it("safeParse() handles regular output (streaming)", () => {
    const data = TestContract.safeParse({ id: "x", title: "hi" })
    expect(data).toEqual({ id: "x", title: "hi", mode: "a" })
  })

  it("parse() rejects truly invalid data", () => {
    const result = TestContract.parse({ title: "no id" })
    expect(result.success).toBe(false)
    expect(result.error).not.toBeNull()
  })
})

// ─── Full round-trip: strict schema → parse ─────────────────────────────────

describe("strict round-trip", () => {
  it("KpiCard: strict output parses correctly", () => {
    const strictOutput = {
      id: "q4",
      title: "Q4 Performance",
      description: null,
      stats: [{
        key: "rev",
        label: "Revenue",
        value: 847300,
        format: { kind: "currency", currency: "USD", decimals: null },
        diff: { value: 12.4, decimals: null, upIsPositive: null, label: null },
        sparkline: null,
      }],
      confidence: 0.95,
      caveat: null,
      source: { label: "Stripe", freshness: "2h ago", url: null },
    }

    const result = KpiCard.parse(strictOutput)
    expect(result.success).toBe(true)
    const data = result.data!
    expect(data.id).toBe("q4")
    expect(data.stats[0]!.format?.kind).toBe("currency")
    // defaults applied
    expect(data.stats[0]!.diff?.decimals).toBe(1) // .default(1)
    expect(data.stats[0]!.diff?.upIsPositive).toBe(true) // .default(true)
  })

  it("InsightCard: strict output parses correctly", () => {
    const strictOutput = {
      id: "i1",
      title: "Analysis",
      subtitle: null,
      metrics: [{ label: "Growth", value: "12%", unit: null, status: null }],
      recommendation: null,
      sentiment: null,
      reasoning: "Strong quarter",
      confidence: null,
      caveat: null,
      source: null,
    }

    const result = InsightCard.parse(strictOutput)
    expect(result.success).toBe(true)
    expect(result.data?.sentiment).toBe("caution") // default
  })

  it("AlertCard: strict output with union values parses correctly", () => {
    const strictOutput = {
      id: "a1",
      severity: "warning",
      title: "Latency spike",
      description: null,
      metrics: [{ label: "P95", value: "847ms", unit: null }],
      actions: [{ id: "investigate", label: "Investigate", primary: null }],
      reasoning: null,
      caveat: null,
      source: null,
    }

    const result = AlertCard.parse(strictOutput)
    expect(result.success).toBe(true)
  })
})

// ─── DataTable.strictWith ───────────────────────────────────────────────────

describe("strictDataTableSchema", () => {
  it("generates a valid strict schema for given columns", () => {
    const schema = strictDataTableSchema({
      columns: [
        { key: "name", type: "string" },
        { key: "revenue", type: "number" },
        { key: "active", type: "boolean" },
      ],
    })

    const data = {
      id: "t1",
      title: null,
      description: null,
      columns: [
        { key: "name", label: "Name", type: null, align: null, sortable: null, width: null, format: null },
        { key: "revenue", label: "Revenue", type: null, align: null, sortable: null, width: null, format: null },
        { key: "active", label: "Active", type: null, align: null, sortable: null, width: null, format: null },
      ],
      rows: [
        { name: "Acme", revenue: 50000, active: true },
        { name: "Beta", revenue: null, active: false },
      ],
      total: null,
      defaultSort: null,
      confidence: null,
      caveat: null,
      source: null,
    }

    expect(schema.safeParse(data).success).toBe(true)
  })

  it("strictWith output can be parsed by DataTable.parse()", () => {
    const strictOutput = {
      id: "t1",
      title: "Customers",
      description: null,
      columns: [
        { key: "name", label: "Name", type: null, align: null, sortable: null, width: null, format: null },
      ],
      rows: [{ name: "Acme" }],
      total: null,
      defaultSort: null,
      confidence: null,
      caveat: null,
      source: null,
    }

    const result = DataTable.parse(strictOutput)
    expect(result.success).toBe(true)
    const data = result.data!
    expect(data.columns[0]!.type).toBe("text") // default
    expect(data.columns[0]!.align).toBe("left") // default
  })
})

// ─── JSON Schema output compliance ──────────────────────────────────────────

describe("toStrictJSONSchema compliance", () => {
  // Validates that a JSON Schema object conforms to strict-mode rules
  function assertStrictCompliant(node: Record<string, unknown>, path = "") {
    if (node.type === "object") {
      expect(node.additionalProperties).toBe(false)

      if (node.properties && typeof node.properties === "object") {
        const props = Object.keys(node.properties as object)
        const required = node.required as string[] | undefined
        expect(required).toBeDefined()
        for (const prop of props) {
          expect(required!).toContain(prop)
          assertStrictCompliant(
            (node.properties as Record<string, Record<string, unknown>>)[prop]!,
            `${path}.${prop}`,
          )
        }
      }
    }

    // No unsupported keywords
    const UNSUPPORTED = [
      "default", "format", "minimum", "maximum",
      "exclusiveMinimum", "exclusiveMaximum",
      "minLength", "maxLength", "minItems", "maxItems",
      "uniqueItems", "pattern", "multipleOf",
      "minProperties", "maxProperties",
    ]
    for (const kw of UNSUPPORTED) {
      expect(node).not.toHaveProperty(kw)
    }

    // Recurse into composite keywords
    if (node.anyOf && Array.isArray(node.anyOf)) {
      for (const [i, variant] of (node.anyOf as Record<string, unknown>[]).entries()) {
        assertStrictCompliant(variant, `${path}.anyOf[${i}]`)
      }
    }
    if (node.items && typeof node.items === "object" && !Array.isArray(node.items)) {
      assertStrictCompliant(node.items as Record<string, unknown>, `${path}.items`)
    }
  }

  const strictSchemas = [
    ["KpiCard", KpiCard],
    ["InsightCard", InsightCard],
    ["AlertCard", AlertCard],
    ["LinkCard", LinkCard],
    ["MemoryCard", MemoryCard],
    ["Chart", Chart],
    ["OptionList", OptionList],
  ] as const

  it.each(strictSchemas)("%s.jsonSchema() is strict-compliant", (_name, contract) => {
    const jsonSchema = contract.jsonSchema()
    assertStrictCompliant(jsonSchema)
  })

  it("DataTable.jsonSchema() throws", () => {
    expect(() => DataTable.jsonSchema()).toThrow(StrictModeError)
  })

  it("strictDataTableSchema produces strict-compliant JSON Schema", () => {
    const schema = strictDataTableSchema({
      columns: [
        { key: "name", type: "string" },
        { key: "revenue", type: "number" },
      ],
    })
    const jsonSchema = toStrictJSONSchema(schema)
    assertStrictCompliant(jsonSchema)
  })

  it("JSON Schema has no $schema key", () => {
    const jsonSchema = KpiCard.jsonSchema()
    expect(jsonSchema).not.toHaveProperty("$schema")
  })
})

// ─── contract.jsonSchema() structure ────────────────────────────────────────

describe("jsonSchema() structure", () => {
  it("returns a valid JSON Schema object", () => {
    const schema = KpiCard.jsonSchema()
    expect(schema.type).toBe("object")
    expect(schema.properties).toBeDefined()
    expect(schema.required).toBeDefined()
    expect(schema.additionalProperties).toBe(false)
  })

  it("nullable fields use type array with null", () => {
    const schema = KpiCard.jsonSchema()
    const props = schema.properties as Record<string, Record<string, unknown>>
    // title is .optional() → becomes nullable in strict → type: ["string", "null"]
    const title = props["title"]
    expect(title).toBeDefined()
    expect(title!.type).toContain("string")
    expect(title!.type).toContain("null")
  })
})
