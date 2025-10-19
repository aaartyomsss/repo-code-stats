"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.averageLinesPerFunction = averageLinesPerFunction;
exports.getFunctionStatistics = getFunctionStatistics;
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const fileWalker_1 = require("../utils/fileWalker");
/**
 * Analyzes a file and extracts the number of lines for each function
 * @param filePath - Path to the file to analyze
 * @returns Array of line counts for each function in the file
 */
function getFunctionLines(filePath) {
    const source = typescript_1.default.createSourceFile(filePath, fs_1.default.readFileSync(filePath, "utf8"), typescript_1.default.ScriptTarget.ESNext, true);
    const functions = [];
    function visit(node) {
        if (typescript_1.default.isFunctionDeclaration(node) ||
            typescript_1.default.isMethodDeclaration(node) ||
            typescript_1.default.isArrowFunction(node) ||
            typescript_1.default.isFunctionExpression(node)) {
            const start = source.getLineAndCharacterOfPosition(node.getStart()).line;
            const end = source.getLineAndCharacterOfPosition(node.getEnd()).line;
            functions.push(end - start + 1);
        }
        typescript_1.default.forEachChild(node, visit);
    }
    visit(source);
    return functions;
}
/**
 * Calculates the average lines per function in a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal, by default only .ts and .tsx files are considered
 */
function averageLinesPerFunction(dir, options) {
    const { traverseExtensions } = options || {
        traverseExtensions: { ts: true, tsx: true, js: false, jsx: false },
    };
    const allFiles = (0, fileWalker_1.walk)(dir, traverseExtensions);
    const lengths = allFiles.flatMap(getFunctionLines);
    const avg = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
    console.log(`Average lines per function/method: ${avg.toFixed(2)} (${lengths.length} total)`);
    return avg;
}
/**
 * Gets detailed function statistics for a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal
 * @returns Object with detailed statistics
 */
function getFunctionStatistics(dir, options) {
    const { traverseExtensions } = options || {
        traverseExtensions: { ts: true, tsx: true, js: false, jsx: false },
    };
    const allFiles = (0, fileWalker_1.walk)(dir, traverseExtensions);
    const lengths = allFiles.flatMap(getFunctionLines);
    if (lengths.length === 0) {
        return { average: 0, total: 0, min: 0, max: 0, functions: [] };
    }
    const total = lengths.reduce((a, b) => a + b, 0);
    const average = total / lengths.length;
    const min = Math.min(...lengths);
    const max = Math.max(...lengths);
    return {
        average,
        total,
        min,
        max,
        functions: lengths,
    };
}
//# sourceMappingURL=averageLines.js.map