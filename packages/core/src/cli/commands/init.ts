import path from "path"
import fs from "fs-extra"
import prompts from "prompts"
import { fetchRegistry, fetchFile, log, detectPackageManager } from "../utils"

interface InitOptions {
  dir: string
  yes?: boolean
}

export async function init(options: InitOptions) {
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, options.dir)
  const libDir = path.join(targetDir, "lib")

  console.log()
  log.info(`Initializing taw-ui in ${path.relative(cwd, targetDir)}`)
  console.log()

  // Check if already initialized
  if (await fs.pathExists(libDir)) {
    if (!options.yes) {
      const { overwrite } = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `${path.relative(cwd, libDir)} already exists. Overwrite?`,
        initial: false,
      })
      if (!overwrite) {
        log.dim("Aborted.")
        return
      }
    }
  }

  const registry = await fetchRegistry()

  // Copy visual lib files (motion, utils, shared sub-components)
  for (const filePath of registry.lib.files) {
    const content = await fetchFile(filePath)
    const dest = path.join(targetDir, filePath)
    await fs.ensureDir(path.dirname(dest))
    await fs.writeFile(dest, content, "utf-8")
    log.success(`Created ${path.relative(cwd, dest)}`)
  }

  // Install taw-ui npm package + visual deps
  const pm = detectPackageManager(cwd)
  const deps = registry.lib.dependencies
  console.log()
  log.info("Installing dependencies...")
  log.dim(`  ${pm.install} ${deps.join(" ")}`)

  const { execSync } = await import("child_process")
  try {
    execSync(`${pm.install} ${deps.join(" ")}`, {
      cwd,
      stdio: "inherit",
    })
  } catch {
    console.log()
    log.warn("Auto-install failed. Install manually:")
    log.dim(`  ${pm.install} ${deps.join(" ")}`)
  }

  console.log()
  log.success("taw-ui initialized! Now add components:")
  log.dim("  npx taw-ui add kpi-card")
  log.dim("  npx taw-ui add option-list data-table")
  log.dim("  npx taw-ui add --all")
  console.log()
}
