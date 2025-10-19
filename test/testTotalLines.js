// Test script to verify the new total lines of code functionality
const {
  getTotalLinesOfCode,
  getTotalLinesOfCodeMultiple,
  walk,
} = require("../package")

async function testTotalLines() {
  try {
    console.log("=== Testing Total Lines of Code Functionality ===\n")

    // Test 1: Single file line count
    console.log("Test 1: Counting lines in func.js")
    const lines = getTotalLinesOfCode("./test/src/func.js")
    console.log(`Total lines (including empty/comments): ${lines}`)

    const codeOnlyLines = getTotalLinesOfCode("./test/src/func.js", true, true)
    console.log(`Code-only lines: ${codeOnlyLines}\n`)

    // Test 2: Multiple files
    console.log("Test 2: Walking directory and counting all files")
    const allFiles = walk("./test/src", {
      js: true,
      ts: true,
      tsx: false,
      jsx: false,
    })
    console.log("Found files:", allFiles)

    if (allFiles.length > 0) {
      const result = getTotalLinesOfCodeMultiple(allFiles)
      console.log(`Total lines across all files: ${result.total}`)
      console.log("Lines per file:")
      Object.entries(result.files).forEach(([file, lines]) => {
        console.log(`  ${file}: ${lines} lines`)
      })
    }

    console.log("\n=== Tests completed successfully! ===")
  } catch (error) {
    console.error("Test failed:", error.message)
  }
}

testTotalLines()
