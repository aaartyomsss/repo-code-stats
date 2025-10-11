import ts from "typescript"
import fs from "fs"
import path from "path"

type Options = {
  traverseExtensions?: {
    ts: boolean
    tsx: boolean
    js: boolean
    jsx: boolean
  }
}

function getFunctionLines(filePath: string) {
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

function walk(
  dir: string,
  traverseExtensions: Options["traverseExtensions"]
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

/**
 *
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal, by default only .ts and .tsx files are considered
 */
export function averageLinesPerFunction(dir: string, options?: Options) {
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
}
