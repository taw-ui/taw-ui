import { defineConfig } from "tsup"

export default defineConfig([
  // Runtime library (schemas, types, actions, parse)
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
  },
  // CLI binary (no DTS needed, no clean since runtime already cleaned)
  {
    entry: { "cli/index": "src/cli/index.ts" },
    format: ["esm"],
    target: "node18",
    clean: false,
    banner: { js: "#!/usr/bin/env node" },
  },
])
