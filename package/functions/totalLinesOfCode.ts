import fs from "fs"
import { TraverseExtensions, walk } from "../utils/fileWalker"
/**
 * Counts the total lines of code in a file
 * @param filePath - Path to the file to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count (default: true)
 * @param excludeComments - Whether to exclude comment-only lines from count (default: true)
 * @returns Number of lines of code
 */
export function getTotalLinesOfCode(
  filePath: string,
  excludeEmptyLines: boolean = true,
  excludeComments: boolean = true
): number {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const lines = content.split("\n")

    let totalLines = 0

    for (const line of lines) {
      const trimmedLine = line.trim()

      // Skip empty lines if requested
      if (excludeEmptyLines && trimmedLine === "") {
        continue
      }

      // Skip comment-only lines if requested
      if (excludeComments && isCommentOnlyLine(trimmedLine)) {
        continue
      }

      totalLines++
    }

    return totalLines
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`)
  }
}

/**
 * Checks if a line contains only comments
 * @param line - The trimmed line to check
 * @returns true if the line is a comment-only line
 */
function isCommentOnlyLine(line: string): boolean {
  // Single line comments
  if (line.startsWith("//") || line.startsWith("#") || line.startsWith("*")) {
    return true
  }

  // Multi-line comment start/end
  if (line.startsWith("/*") || line.startsWith("*/") || line === "*") {
    return true
  }

  // JSDoc comments
  if (line.startsWith("/**") || line.startsWith("* ")) {
    return true
  }

  return false
}

/**
 * Gets total lines of code for multiple files
 * @param filePaths - Array of file paths to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count
 * @param excludeComments - Whether to exclude comment-only lines from count
 * @returns Object with individual file counts and total
 */
export function getTotalLinesOfCodeInDirectory(
  dir: string,
  options: {
    traverseExtensions?: TraverseExtensions
    excludeEmptyLines: boolean
    excludeComments: boolean
  }
): { files: Record<string, number>; total: number } {
  const files: Record<string, number> = {}
  let total = 0
  const { excludeEmptyLines, excludeComments, traverseExtensions } = options
  const filePaths = walk(dir, traverseExtensions)

  for (const filePath of filePaths) {
    const lines = getTotalLinesOfCode(
      filePath,
      excludeEmptyLines,
      excludeComments
    )
    files[filePath] = lines
    total += lines
  }

  return { files, total }
}
