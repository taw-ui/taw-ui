import type { TawToolPart } from "@taw-ui/react"

export function prettyPrint(obj: unknown, depth = 0): string {
  const indent = "  ".repeat(depth)
  const inner = "  ".repeat(depth + 1)

  if (obj === null || obj === undefined) return String(obj)
  if (typeof obj === "string") return `"${obj}"`
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj)

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]"
    // Compact number arrays (sparkline data)
    if (obj.every((v) => typeof v === "number")) {
      const joined = obj.join(", ")
      if (joined.length < 60) return `[${joined}]`
      return `[\n${inner}${obj.join(`,\n${inner}`)}\n${indent}]`
    }
    const items = obj.map((v) => `${inner}${prettyPrint(v, depth + 1)},`)
    return `[\n${items.join("\n")}\n${indent}]`
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    const fields = entries.map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`
      return `${inner}${key}: ${prettyPrint(v, depth + 1)},`
    })
    return `{\n${fields.join("\n")}\n${indent}}`
  }

  return String(obj)
}

export function generateComponentCode(
  componentName: string,
  importPath: string,
  part: TawToolPart,
  extraProps?: string,
): string {
  const lines = [`import { ${componentName} } from "${importPath}"`, ""]

  if (part.state === "input-available" || part.state === "streaming") {
    lines.push(`// Loading state — no output yet`)
    lines.push(`<${componentName} part={part} />${extraProps ? ` // + ${extraProps}` : ""}`)
    return lines.join("\n")
  }

  if (part.state === "output-error") {
    lines.push(`// Error state`)
    lines.push(`<${componentName} part={part} /> // error: "${part.error}"`)
    return lines.join("\n")
  }

  lines.push(`<${componentName} part={part}${extraProps ? ` ${extraProps}` : ""} />`)
  lines.push("")
  lines.push("// Tool output shape:")

  const output = part.output as Record<string, unknown> | undefined
  if (output) {
    lines.push(prettyPrint(output, 0))
  }

  return lines.join("\n")
}
