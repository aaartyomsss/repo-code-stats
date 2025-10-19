import {
  averageLinesPerFunction,
  getTotalLinesOfCode,
  getTotalLinesOfCodeMultiple,
  walk,
} from "repo-code-stats"

// Test average lines per function
averageLinesPerFunction("./src", {
  traverseExtensions: { ts: true, js: true },
})

// Test total lines of code for a single file
try {
  const lines = getTotalLinesOfCode("./src/func.js")
  console.log(`Total lines of code in func.js: ${lines}`)
} catch (error) {
  console.error("Error counting lines:", error.message)
}

// Test total lines of code for multiple files
try {
  const allFiles = walk("./src", { ts: true, js: true, tsx: false, jsx: false })
  const result = getTotalLinesOfCodeMultiple(allFiles)
  console.log(`Total lines of code across all files: ${result.total}`)
  console.log("Lines per file:", result.files)
} catch (error) {
  console.error("Error counting total lines:", error.message)
}
