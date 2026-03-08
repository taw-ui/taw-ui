import path from "path"
import fs from "fs-extra"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { fetchRegistry, fetchFile, detectPackageManager } from "../utils"

interface AddOptions {
  dir: string
  yes?: boolean
  all?: boolean
}

export async function add(components: string[], options: AddOptions) {
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, options.dir)
  const libDir = path.join(targetDir, "lib")

  // Check if initialized
  if (!(await fs.pathExists(libDir))) {
    p.cancel("taw-ui not initialized. Run `npx taw-ui init` first.")
    process.exit(1)
  }

  const registry = await fetchRegistry()
  const available = Object.keys(registry.components)

  // Resolve which components to add
  let toAdd: string[]

  if (options.all) {
    toAdd = available
  } else if (components.length === 0) {
    const selected = await p.multiselect({
      message: "Which components do you want to add?",
      options: available.map((key) => ({
        label: `${registry.components[key]!.name} ${pc.dim(`— ${registry.components[key]!.description}`)}`,
        value: key,
      })),
      required: true,
    })
    if (p.isCancel(selected)) {
      p.cancel("Aborted.")
      return
    }
    toAdd = selected
  } else {
    const invalid = components.filter((c) => !available.includes(c))
    if (invalid.length > 0) {
      p.cancel(`Unknown component(s): ${invalid.join(", ")}\nAvailable: ${available.join(", ")}`)
      process.exit(1)
    }
    toAdd = components
  }

  p.intro(`Adding ${toAdd.length} component${toAdd.length > 1 ? "s" : ""}`)

  const extraDeps = new Set<string>()

  for (const name of toAdd) {
    const component = registry.components[name]!
    const componentDir = path.join(targetDir, name)

    // Check if already exists
    if (await fs.pathExists(componentDir)) {
      if (!options.yes) {
        const overwrite = await p.confirm({
          message: `${name} already exists. Overwrite?`,
          initialValue: false,
        })
        if (p.isCancel(overwrite) || !overwrite) {
          p.log.info(`Skipped ${name}`)
          continue
        }
      }
    }

    // Copy component files
    for (const filePath of component.files) {
      const content = await fetchFile(filePath)
      const dest = path.join(targetDir, filePath)
      await fs.ensureDir(path.dirname(dest))
      await fs.writeFile(dest, content, "utf-8")
    }

    for (const dep of component.dependencies) {
      extraDeps.add(dep)
    }

    p.log.success(`Added ${component.name} → ${path.relative(cwd, componentDir)}/`)
  }

  // Install extra deps if any
  if (extraDeps.size > 0) {
    const pm = detectPackageManager(cwd)
    const deps = [...extraDeps]

    const s = p.spinner()
    s.start(`Installing dependencies via ${pm.name}`)

    const { execSync } = await import("child_process")
    try {
      execSync(`${pm.install} ${deps.join(" ")}`, {
        cwd,
        stdio: "pipe",
      })
      s.stop("Dependencies installed")
    } catch {
      s.stop("Auto-install failed")
      p.log.warn("Install manually:")
      p.log.message(`  ${pm.install} ${deps.join(" ")}`)
    }
  }

  p.outro("Done! Import from your project:")
  console.log()
  for (const name of toAdd) {
    const component = registry.components[name]!
    console.log(`  import { ${component.name} } from "@/components/taw/${name}"`)
  }
  console.log()
}
