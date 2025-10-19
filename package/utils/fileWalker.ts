import fs from "fs"
import path from "path"

export type TraverseExtensions = {
  ts: boolean
  tsx: boolean
  js: boolean
  jsx: boolean
  mjs: boolean
}

/**
 * Recursively walks through a directory and returns all files matching the specified extensions
 * @param dir - Directory to start traversal from
 * @param traverseExtensions - Extensions to include in the search
 * @returns Array of file paths
 */
export function walk(
  dir: string,
  traverseExtensions?: TraverseExtensions
): string[] {
  let files: string[] = []

  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full, traverseExtensions))
    } else {
      const shouldInclude = traverseExtensions
        ? Object.entries(traverseExtensions).some(
            ([ext, enabled]) => enabled && full.endsWith(`.${ext}`)
          )
        : full.endsWith(".ts") || full.endsWith(".tsx")

      if (shouldInclude) {
        files.push(full)
      }
    }
  }
  return files
}
