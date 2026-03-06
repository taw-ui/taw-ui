import pc from "picocolors"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs-extra"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REGISTRY_BASE_URL =
  "https://raw.githubusercontent.com/thiagomaia/taw-ui/main/packages/registry"

export interface RegistryData {
  lib: {
    description: string
    files: string[]
    dependencies: string[]
  }
  components: Record<
    string,
    {
      name: string
      description: string
      category: string
      files: string[]
      dependencies: string[]
    }
  >
}

export async function fetchRegistry(): Promise<RegistryData> {
  // In development, read from local filesystem
  const localPath = path.resolve(__dirname, "../../../registry/registry.json")
  if (await fs.pathExists(localPath)) {
    return fs.readJSON(localPath)
  }

  // In production, fetch from GitHub
  const res = await fetch(`${REGISTRY_BASE_URL}/registry.json`)
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.statusText}`)
  return res.json() as Promise<RegistryData>
}

export async function fetchFile(filePath: string): Promise<string> {
  // In development, read from local filesystem
  const localPath = path.resolve(__dirname, "../../../registry", filePath)
  if (await fs.pathExists(localPath)) {
    return fs.readFile(localPath, "utf-8")
  }

  // In production, fetch from GitHub
  const res = await fetch(`${REGISTRY_BASE_URL}/${filePath}`)
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}: ${res.statusText}`)
  return res.text()
}

export function detectPackageManager(cwd: string): { name: string; install: string } {
  if (fs.existsSync(path.join(cwd, "bun.lockb")) || fs.existsSync(path.join(cwd, "bun.lock"))) {
    return { name: "bun", install: "bun add" }
  }
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return { name: "pnpm", install: "pnpm add" }
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return { name: "yarn", install: "yarn add" }
  }
  return { name: "npm", install: "npm install" }
}

export const log = {
  info: (msg: string) => console.log(pc.cyan("ℹ"), msg),
  success: (msg: string) => console.log(pc.green("✓"), msg),
  warn: (msg: string) => console.log(pc.yellow("⚠"), msg),
  error: (msg: string) => console.log(pc.red("✗"), msg),
  dim: (msg: string) => console.log(pc.dim(msg)),
}
