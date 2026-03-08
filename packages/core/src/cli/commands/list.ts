import * as p from "@clack/prompts"
import pc from "picocolors"
import { fetchRegistry } from "../utils"

export async function list() {
  const registry = await fetchRegistry()
  const components = Object.entries(registry.components)

  p.intro(`${components.length} components available`)

  for (const [slug, component] of components) {
    const category = component.category === "interactive" ? pc.yellow("interactive") : pc.blue("display")
    p.log.message(`${pc.bold(slug.padEnd(16))} ${pc.dim(component.description)}  ${category}`)
  }

  p.outro("npx taw-ui add <component>")
}
