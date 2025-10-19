"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalLinesOfCode = getTotalLinesOfCode;
exports.getTotalLinesOfCodeMultiple = getTotalLinesOfCodeMultiple;
const fs_1 = __importDefault(require("fs"));
/**
 * Counts the total lines of code in a file
 * @param filePath - Path to the file to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count (default: true)
 * @param excludeComments - Whether to exclude comment-only lines from count (default: true)
 * @returns Number of lines of code
 */
function getTotalLinesOfCode(filePath, excludeEmptyLines = true, excludeComments = true) {
    try {
        const content = fs_1.default.readFileSync(filePath, "utf8");
        const lines = content.split("\n");
        let totalLines = 0;
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Skip empty lines if requested
            if (excludeEmptyLines && trimmedLine === "") {
                continue;
            }
            // Skip comment-only lines if requested
            if (excludeComments && isCommentOnlyLine(trimmedLine)) {
                continue;
            }
            totalLines++;
        }
        return totalLines;
    }
    catch (error) {
        throw new Error(`Failed to read file ${filePath}: ${error}`);
    }
}
/**
 * Checks if a line contains only comments
 * @param line - The trimmed line to check
 * @returns true if the line is a comment-only line
 */
function isCommentOnlyLine(line) {
    // Single line comments
    if (line.startsWith("//") || line.startsWith("#") || line.startsWith("*")) {
        return true;
    }
    // Multi-line comment start/end
    if (line.startsWith("/*") || line.startsWith("*/") || line === "*") {
        return true;
    }
    // JSDoc comments
    if (line.startsWith("/**") || line.startsWith("* ")) {
        return true;
    }
    return false;
}
/**
 * Gets total lines of code for multiple files
 * @param filePaths - Array of file paths to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count
 * @param excludeComments - Whether to exclude comment-only lines from count
 * @returns Object with individual file counts and total
 */
function getTotalLinesOfCodeMultiple(filePaths, excludeEmptyLines = true, excludeComments = true) {
    const files = {};
    let total = 0;
    for (const filePath of filePaths) {
        const lines = getTotalLinesOfCode(filePath, excludeEmptyLines, excludeComments);
        files[filePath] = lines;
        total += lines;
    }
    return { files, total };
}
//# sourceMappingURL=totalLinesOfCode.js.map