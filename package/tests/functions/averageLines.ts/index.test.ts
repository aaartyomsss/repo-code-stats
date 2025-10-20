import { describe, expect, it } from "vitest"
import {
  getFunctionLines,
  averageLinesPerFunction,
  getFunctionStatistics,
} from "../../../functions/averageLines"
import path from "path"

describe("getFunctionLines", () => {
  it("gets correct line counts for function", () => {
    const lines = getFunctionLines(path.join(__dirname, "./testDir/fileOne.ts"))
    expect(lines).toEqual([3])
  })

  it("gets correct line counts for function with comments", () => {
    const lines = getFunctionLines(path.join(__dirname, "./testDir/fileTwo.ts"))
    expect(lines).toEqual([4])
  })

  it("gets correct line counts including comments", () => {
    const lines = getFunctionLines(
      path.join(__dirname, "./testDir/fileTwo.ts"),
      false
    )
    expect(lines).toEqual([5])
  })

  it("gets correct line counts for multiple functions", () => {
    const lines = getFunctionLines(
      path.join(__dirname, "./testDir/fileThree.ts")
    )
    expect(lines).toEqual([3, 3])
  })
})

describe("averageLinesPerFunction in directory", () => {
  it("calculates average lines given file name", () => {
    const dirPath = path.join(__dirname, "./testDir")
    const avg = averageLinesPerFunction(dirPath)
    expect(avg).toBe(3.25)
  })
})

describe("getFunctionStatistics in directory", () => {
  it("gets correct function statistics", () => {
    const dirPath = path.join(__dirname, "./testDir")
    const stats = getFunctionStatistics(dirPath)
    expect(stats).toEqual({
      total: 13,
      average: 3.25,
      min: 3,
      max: 4,
      totalNumberOfFunctions: 4,
    })
  })
})
