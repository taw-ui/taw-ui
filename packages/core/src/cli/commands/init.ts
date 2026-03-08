import path from "path"
import fs from "fs-extra"
import * as p from "@clack/prompts"
import { fetchRegistry, fetchFile, detectPackageManager } from "../utils"

interface InitOptions {
  dir: string
  yes?: boolean
}

// ─── CSS import injection ───────────────────────────────────────────────────

const TAW_STYLES_IMPORT = '@import "taw-ui/styles.css";'

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

  // Already imported — skip (check both old and new paths)
  if (content.includes("taw-ui/styles.css")) {
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

  p.intro("taw-ui init")

  // Check if already initialized
  if (await fs.pathExists(libDir)) {
    if (!options.yes) {
      const overwrite = await p.confirm({
        message: `${path.relative(cwd, libDir)} already exists. Overwrite?`,
        initialValue: false,
      })
      if (p.isCancel(overwrite) || !overwrite) {
        p.cancel("Aborted.")
        return
      }
    }
  }

  // ─── Inject CSS import ──────────────────────────────────────────────────

  const globalsPath = findGlobalsCss(cwd)

  if (globalsPath) {
    const result = injectStylesImport(globalsPath)
    if (result === "injected") {
      p.log.success(`Added ${TAW_STYLES_IMPORT} to ${path.relative(cwd, globalsPath)}`)
    } else if (result === "already-present") {
      p.log.info(`Theme import already present in ${path.relative(cwd, globalsPath)}`)
    }
  } else {
    p.log.warn("Could not find a global CSS file. Add this to your CSS manually:")
    p.log.message(`  ${TAW_STYLES_IMPORT}`)
  }

  // ─── Copy lib files ─────────────────────────────────────────────────────

  const registry = await fetchRegistry()

  for (const filePath of registry.lib.files) {
    const content = await fetchFile(filePath)
    const dest = path.join(targetDir, filePath)
    await fs.ensureDir(path.dirname(dest))
    await fs.writeFile(dest, content, "utf-8")
    p.log.success(`Created ${path.relative(cwd, dest)}`)
  }

  // ─── Install dependencies ──────────────────────────────────────────────

  const pm = detectPackageManager(cwd)
  const deps = registry.lib.dependencies

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

  p.outro("taw-ui initialized! Now add components:")
  console.log()
  console.log("  npx taw-ui add kpi-card")
  console.log("  npx taw-ui add option-list data-table")
  console.log("  npx taw-ui add --all")
  console.log()
}
