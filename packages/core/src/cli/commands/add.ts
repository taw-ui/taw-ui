import path from "path"
import fs from "fs-extra"
import prompts from "prompts"
import pc from "picocolors"
import { fetchRegistry, fetchFile, log, detectPackageManager } from "../utils"

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
    log.error("taw-ui not initialized. Run `npx taw-ui init` first.")
    process.exit(1)
  }

  const registry = await fetchRegistry()
  const available = Object.keys(registry.components)

  // Resolve which components to add
  let toAdd: string[]

  if (options.all) {
    toAdd = available
  } else if (components.length === 0) {
    const { selected } = await prompts({
      type: "multiselect",
      name: "selected",
      message: "Which components do you want to add?",
      choices: available.map((key) => ({
        title: `${registry.components[key]!.name} ${pc.dim(`— ${registry.components[key]!.description}`)}`,
        value: key,
      })),
      min: 1,
    })
    if (!selected || selected.length === 0) {
      log.dim("No components selected.")
      return
    }
    toAdd = selected
  } else {
    const invalid = components.filter((c) => !available.includes(c))
    if (invalid.length > 0) {
      log.error(`Unknown component(s): ${invalid.join(", ")}`)
      log.dim(`Available: ${available.join(", ")}`)
      process.exit(1)
    }
    toAdd = components
  }

  console.log()

  const extraDeps = new Set<string>()

  for (const name of toAdd) {
    const component = registry.components[name]!
    const componentDir = path.join(targetDir, name)

    // Check if already exists
    if (await fs.pathExists(componentDir)) {
      if (!options.yes) {
        const { overwrite } = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `${name} already exists. Overwrite?`,
          initial: false,
        })
        if (!overwrite) {
          log.dim(`  Skipped ${name}`)
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

    log.success(`Added ${component.name} → ${path.relative(cwd, componentDir)}/`)
  }

  // Install extra deps if any
  if (extraDeps.size > 0) {
    const pm = detectPackageManager(cwd)
    const deps = [...extraDeps]
    console.log()
    log.info("Installing component dependencies...")
    log.dim(`  ${pm.install} ${deps.join(" ")}`)

    const { execSync } = await import("child_process")
    try {
      execSync(`${pm.install} ${deps.join(" ")}`, {
        cwd,
        stdio: "inherit",
      })
    } catch {
      log.warn("Auto-install failed. Install manually:")
      log.dim(`  ${pm.install} ${deps.join(" ")}`)
    }
  }

  console.log()
  log.success("Done! Import from your project:")
  for (const name of toAdd) {
    const component = registry.components[name]!
    log.dim(`  import { ${component.name} } from "@/components/taw/${name}"`)
  }
  console.log()
}
