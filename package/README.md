# Repo code stats

This library is being built to provide some insights on the code quality in the project.

## Features

- **Average number of lines per method** - Analyze function/method complexity
- **Total lines of code** - Count lines in individual files or entire directories
- **File traversal utilities** - Walk through directory structures with customizable file filtering
- **Detailed function statistics** - Get min, max, average, and total function sizes

## Upcoming features

- Improve method analysis functionality
- Bloater detection (user defined value)
- Average number of methods per class
- Coupling analysis
- CLI tool

## API Reference

### `averageLinesPerFunction(dir, options)`

Calculates the average lines per function in a directory.

```ts
import { averageLinesPerFunction } from "repo-code-stats"

averageLinesPerFunction("./src", {
  traverseExtensions: { ts: true, js: true, tsx: true, jsx: false },
})
```

### `getTotalLinesOfCode(filePath, excludeEmptyLines?, excludeComments?)`

Counts the total lines of code in a single file.

```ts
import { getTotalLinesOfCode } from "repo-code-stats"

// Count all lines
const totalLines = getTotalLinesOfCode("./src/myFile.ts")

// Count only code lines (exclude empty lines and comments)
const codeLines = getTotalLinesOfCode("./src/myFile.ts", true, true)
```

### `getTotalLinesOfCodeMultiple(filePaths, excludeEmptyLines?, excludeComments?)`

Counts the total lines of code across multiple files.

```ts
import { getTotalLinesOfCodeMultiple, walk } from "repo-code-stats"

// Get all TypeScript files in a directory
const files = walk("./src", { ts: true, tsx: true, js: false, jsx: false })

// Count lines across all files
const result = getTotalLinesOfCodeMultiple(files)
console.log(`Total lines: ${result.total}`)
console.log("Per file:", result.files)
```

### `walk(dir, traverseExtensions?)`

Recursively walks through a directory and returns all files matching the specified extensions.

```ts
import { walk } from "repo-code-stats"

const files = walk("./src", {
  ts: true,
  tsx: true,
  js: false,
  jsx: false,
})
```

### `getFunctionStatistics(dir, options?)`

Gets detailed function statistics for a directory.

```ts
import { getFunctionStatistics } from "repo-code-stats"

const stats = getFunctionStatistics("./src", {
  traverseExtensions: { ts: true, js: true },
})

console.log(`Average: ${stats.average}`)
console.log(`Total functions: ${stats.functions.length}`)
console.log(`Min lines: ${stats.min}`)
console.log(`Max lines: ${stats.max}`)
```

## Options

### TraverseExtensions

```ts
type TraverseExtensions = {
  ts: boolean // Include .ts files
  tsx: boolean // Include .tsx files
  js: boolean // Include .js files
  jsx: boolean // Include .jsx files
}
```

Default: `{ ts: true, tsx: true, js: false, jsx: false }`
