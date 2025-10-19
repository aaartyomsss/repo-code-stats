import ts from "typescript"
import fs from "fs"
import { walk, TraverseExtensions } from "../utils/fileWalker"

type Options = {
  traverseExtensions?: TraverseExtensions
}

/**
 * Analyzes a file and extracts the number of lines for each function
 * @param filePath - Path to the file to analyze
 * @returns Array of line counts for each function in the file
 */
function getFunctionLines(filePath: string): number[] {
  const source = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, "utf8"),
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
      functions.push(end - start + 1)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return functions
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
    traverseExtensions: { ts: true, tsx: true, js: false, jsx: false },
  }

  const allFiles = walk(dir, traverseExtensions)
  const lengths = allFiles.flatMap(getFunctionLines)
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
  functions: number[]
} {
  const { traverseExtensions } = options || {
    traverseExtensions: { ts: true, tsx: true, js: false, jsx: false },
  }

  const allFiles = walk(dir, traverseExtensions)
  const lengths = allFiles.flatMap(getFunctionLines)

  if (lengths.length === 0) {
    return { average: 0, total: 0, min: 0, max: 0, functions: [] }
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
    functions: lengths,
  }
}
