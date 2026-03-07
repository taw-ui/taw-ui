import path from "path"
import fs from "fs-extra"
import prompts from "prompts"
import { fetchRegistry, fetchFile, log, detectPackageManager } from "../utils"

interface InitOptions {
  dir: string
  yes?: boolean
}

// ─── CSS import injection ───────────────────────────────────────────────────

const TAW_STYLES_IMPORT = '@import "@taw-ui/react/styles.css";'

const GLOBALS_CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/globals.css",
  "styles/globals.css",
  "src/index.css",
  "src/styles/globals.css",
]

function findGlobalsCss(cwd: string): string | null {
  for (const candidate of GLOBALS_CANDIDATES) {
    const full = path.join(cwd, candidate)
    if (fs.existsSync(full)) return full
  }
  return null
}

function injectStylesImport(filePath: string): "injected" | "already-present" | "skipped" {
  const content = fs.readFileSync(filePath, "utf-8")

  // Already imported — skip
  if (content.includes("@taw-ui/react/styles.css")) {
    return "already-present"
  }

  // Find the best insertion point: after the last @import or @tailwind directive
  const lines = content.split("\n")
  let insertAfter = -1
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i]!.trim()
    if (trimmed.startsWith("@import") || trimmed.startsWith("@tailwind")) {
      insertAfter = i
    }
  }

  const before = lines.slice(0, insertAfter + 1).join("\n")
  const after = lines.slice(insertAfter + 1).join("\n")
  const result = `${before}\n${TAW_STYLES_IMPORT}\n${after}`
  fs.writeFileSync(filePath, result, "utf-8")
  return "injected"
}

// ─── Init command ───────────────────────────────────────────────────────────

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

  // ─── Inject CSS import ──────────────────────────────────────────────────

  const globalsPath = findGlobalsCss(cwd)

  if (globalsPath) {
    const result = injectStylesImport(globalsPath)
    if (result === "injected") {
      log.success(`Added ${TAW_STYLES_IMPORT} to ${path.relative(cwd, globalsPath)}`)
    } else if (result === "already-present") {
      log.dim(`Theme import already present in ${path.relative(cwd, globalsPath)}`)
    }
  } else {
    console.log()
    log.warn("Could not find a global CSS file. Add this to your CSS manually:")
    log.dim(`  ${TAW_STYLES_IMPORT}`)
    console.log()
  }

  // ─── Copy lib files ─────────────────────────────────────────────────────

  const registry = await fetchRegistry()

  for (const filePath of registry.lib.files) {
    const content = await fetchFile(filePath)
    const dest = path.join(targetDir, filePath)
    await fs.ensureDir(path.dirname(dest))
    await fs.writeFile(dest, content, "utf-8")
    log.success(`Created ${path.relative(cwd, dest)}`)
  }

  // ─── Install dependencies ──────────────────────────────────────────────

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
