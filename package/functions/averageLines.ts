import ts from "typescript"
import fs from "fs"
import { walk, TraverseExtensions } from "../utils/fileWalker"

type Options = {
  traverseExtensions?: TraverseExtensions
}

/**
 * Analyzes a file and extracts the number of lines for each function
 * @param filePath - Path to the file to analyze
 * @param ignoreComments - Whether to exclude comment lines from the count
 * @returns Array of line counts for each function in the file
 */
export function getFunctionLines(
  filePath: string,
  ignoreComments: boolean = true
): number[] {
  const sourceText = fs.readFileSync(filePath, "utf8")
  const source = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.ESNext,
    true
  )

  const functions: number[] = []

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      const start = source.getLineAndCharacterOfPosition(node.getStart()).line
      const end = source.getLineAndCharacterOfPosition(node.getEnd()).line
      let lineCount = end - start + 1

      if (ignoreComments) {
        lineCount = countNonCommentLines(sourceText, node, source)
      }

      functions.push(lineCount)
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return functions
}

function countNonCommentLines(
  sourceText: string,
  node: ts.Node,
  _source: ts.SourceFile
): number {
  const startPos = node.getStart()
  const endPos = node.getEnd()
  const functionText = sourceText.substring(startPos, endPos)
  const lines = functionText.split("\n")

  let nonCommentLines = 0
  let inBlockComment = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) continue

    // Handle block comments
    if (inBlockComment) {
      if (trimmed.includes("*/")) {
        inBlockComment = false
        // Check if there's code after the closing comment
        const afterComment = trimmed.substring(trimmed.indexOf("*/") + 2).trim()
        if (afterComment && !afterComment.startsWith("//")) {
          nonCommentLines++
        }
      }
      continue
    }

    // Check for block comment start
    if (trimmed.includes("/*")) {
      const beforeComment = trimmed.substring(0, trimmed.indexOf("/*")).trim()
      if (beforeComment) {
        nonCommentLines++
      }
      if (!trimmed.includes("*/")) {
        inBlockComment = true
      }
      continue
    }

    // Skip single-line comments
    if (trimmed.startsWith("//")) continue

    nonCommentLines++
  }

  return nonCommentLines
}

/**
 * Calculates the average lines per function in a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal, by default only .ts and .tsx files are considered
 */
export function averageLinesPerFunction(
  dir: string,
  options?: Options
): number {
  const { traverseExtensions } = options || {
    traverseExtensions: {
      ts: true,
      tsx: true,
      js: true,
      jsx: true,
      mjs: true,
    },
  }

  const allFiles = walk(dir, traverseExtensions)
  const lengths = allFiles.flatMap((file) => getFunctionLines(file))
  const avg = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1)

  console.log(
    `Average lines per function/method: ${avg.toFixed(2)} (${
      lengths.length
    } total)`
  )

  return avg
}

/**
 * Gets detailed function statistics for a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal
 * @returns Object with detailed statistics
 */
export function getFunctionStatistics(
  dir: string,
  options?: Options
): {
  average: number
  total: number
  min: number
  max: number
} {
  const { traverseExtensions } = options || {
    traverseExtensions: {
      ts: true,
      tsx: true,
      js: true,
      jsx: true,
      mjs: true,
    },
  }

  const allFiles = walk(dir, traverseExtensions)
  const lengths = allFiles.flatMap((file) => getFunctionLines(file))

  if (lengths.length === 0) {
    return { average: 0, total: 0, min: 0, max: 0 }
  }

  const total = lengths.reduce((a, b) => a + b, 0)
  const average = total / lengths.length
  const min = Math.min(...lengths)
  const max = Math.max(...lengths)

  return {
    average,
    total,
    min,
    max,
  }
}
