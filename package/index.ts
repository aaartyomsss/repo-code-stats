// Main entry point for repo-code-stats package
export {
  averageLinesPerFunction,
  getFunctionStatistics,
} from "./functions/averageLines"
export { getTotalLinesOfCodeInDirecotry } from "./functions/totalLinesOfCode"
export { walk, type TraverseExtensions } from "./utils/fileWalker"

// Re-export for backward compatibility
export type Options = {
  traverseExtensions?: {
    ts: boolean
    tsx: boolean
    js: boolean
    jsx: boolean
    mjs: boolean
  }
}
