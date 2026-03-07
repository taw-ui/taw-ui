import { fetchRegistry, log } from "../utils"
import pc from "picocolors"

export async function list() {
  const registry = await fetchRegistry()
  const components = Object.entries(registry.components)

  console.log()
  log.info(`${components.length} components available:`)
  console.log()

  for (const [slug, component] of components) {
    const category = component.category === "interactive" ? pc.yellow("interactive") : pc.blue("display")
    console.log(`  ${pc.bold(slug.padEnd(16))} ${pc.dim(component.description)}  ${category}`)
  }

  console.log()
  log.dim("  npx taw-ui add <component>")
  log.dim("  npx taw-ui add --all")
  console.log()
}
