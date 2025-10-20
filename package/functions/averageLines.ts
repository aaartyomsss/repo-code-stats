import ts from "typescript"
import fs from "fs"
import { walk, TraverseExtensions } from "../utils/fileWalker"

type Options = {
  traverseExtensions?: TraverseExtensions
}

/**
 * Analyzes a file and extracts the number of lines for each function
 * @param filePath - Path to the file to analyze
 * @param ignoreComments - Whether to exclude comment lines from the count (default: true)
 * @param ignoreEmptyLines - Whether to exclude empty lines from the count (default: true)
 * @returns Array of line counts for each function in the file
 */
export function getFunctionLines(
  filePath: string,
  ignoreComments: boolean = true,
  ignoreEmptyLines: boolean = true
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

      // Always use custom counting to handle comments and empty lines
      const lineCount = countFunctionalLines(
        sourceText,
        node,
        source,
        ignoreComments,
        ignoreEmptyLines
      )

      functions.push(lineCount)
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return functions
}

function countFunctionalLines(
  sourceText: string,
  node: ts.Node,
  _source: ts.SourceFile,
  ignoreComments: boolean = true,
  ignoreEmptyLines: boolean = true
): number {
  const startPos = node.getStart()
  const endPos = node.getEnd()
  const functionText = sourceText.substring(startPos, endPos)
  const lines = functionText.split("\n")

  let functionableLines = 0
  let inBlockComment = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines if requested
    if (ignoreEmptyLines && !trimmed) continue

    // If not ignoring comments, count all non-empty lines (if ignoreEmptyLines is true)
    if (!ignoreComments) {
      functionableLines++
      continue
    }

    // Handle block comments
    if (inBlockComment) {
      if (trimmed.includes("*/")) {
        inBlockComment = false
        // Check if there's code after the closing comment
        const afterComment = trimmed.substring(trimmed.indexOf("*/") + 2).trim()
        if (afterComment && !afterComment.startsWith("//")) {
          functionableLines++
        }
      }
      continue
    }

    // Check for block comment start
    if (trimmed.includes("/*")) {
      const beforeComment = trimmed.substring(0, trimmed.indexOf("/*")).trim()
      if (beforeComment) {
        functionableLines++
      }
      if (!trimmed.includes("*/")) {
        inBlockComment = true
      }
      continue
    }

    // Skip single-line comments
    if (trimmed.startsWith("//")) continue

    functionableLines++
  }

  return functionableLines
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
  const totalNumberOfFunctions = lengths.length
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
  totalNumberOfFunctions: number
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
    return { average: 0, total: 0, min: 0, max: 0, totalNumberOfFunctions: 0 }
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
    totalNumberOfFunctions: lengths.length,
  }
}
