import { describe, expect, it } from "vitest"
import {
  getTotalLinesOfCode,
  getTotalLinesOfCodeInDirectory,
} from "../../../functions/totalLinesOfCode"
import path from "path"

describe("getTotalLinesOfCode", () => {
  it("Should get correct LOC with default params", () => {
    const total = getTotalLinesOfCode(
      path.join(__dirname, "./testDir/fileOne.ts")
    )
    expect(total).toBe(2)
  })

  it("Should get correct LOC including empty lines", () => {
    const total = getTotalLinesOfCode(
      path.join(__dirname, "./testDir/fileOne.ts"),
      false
    )
    expect(total).toBe(3)
  })

  it("Should get correct LOC including comments", () => {
    const total = getTotalLinesOfCode(
      path.join(__dirname, "./testDir/fileOne.ts"),
      true,
      false
    )
    expect(total).toBe(3)
  })

  it("Should get correct LOC including empty lines and comments", () => {
    const total = getTotalLinesOfCode(
      path.join(__dirname, "./testDir/fileOne.ts"),
      false,
      false
    )
    expect(total).toBe(4)
  })
})

describe("getTotalLinesOfCodeInDirectory", () => {
  it("should get correct LOC for all files in directory with default params", () => {
    const total = getTotalLinesOfCodeInDirectory(
      path.join(__dirname, "./testDir")
    )
    expect(total.total).toBe(5)
  })

  it("should get correct LOC for all files in directory including empty lines", () => {
    const total = getTotalLinesOfCodeInDirectory(
      path.join(__dirname, "./testDir"),
      { excludeEmptyLines: false }
    )
    expect(total.total).toBe(8)
  })

  it("should get correct LOC for all files in directory including comments", () => {
    const total = getTotalLinesOfCodeInDirectory(
      path.join(__dirname, "./testDir"),
      { excludeComments: false }
    )
    expect(total.total).toBe(7)
  })
})
