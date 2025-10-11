import { averageLinesPerFunction } from "repo-code-stats"

averageLinesPerFunction("./src", {
  traverseExtensions: { ts: true, js: true },
})
