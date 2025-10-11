# Repo code stats

This library is being built to provide some insights on the code quality in the project.

It currently supports:

- Average number of lines per method

Upcoming features:

- Improve method analysis functionality
- Bloater detection (user defined value)
- Average number of methods per class
- Coupling analysis
- CLI tool

## How to use

```ts
import { averageLinesPerFunction } from "repo-code-stats"

/**
 * Where ./src - starting directory of traversal
 * Options - define what extensions to include in analysis (ts, tsx, js, jsx)[default ts/ tsx]
 */
averageLinesPerFunction("./src", { traverseExtensions: { ts: true, js: true } })
```
