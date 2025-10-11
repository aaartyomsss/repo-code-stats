"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.averageLinesPerFunction = averageLinesPerFunction;
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function walk(dir, traverseExtensions) {
    let files = [];
    for (const entry of fs_1.default.readdirSync(dir)) {
        const full = path_1.default.join(dir, entry);
        if (fs_1.default.statSync(full).isDirectory()) {
            files = files.concat(walk(full, traverseExtensions));
        }
        else {
            const shouldInclude = traverseExtensions
                ? Object.entries(traverseExtensions).some(([ext, enabled]) => enabled && full.endsWith(`.${ext}`))
                : full.endsWith(".ts") || full.endsWith(".tsx");
            if (shouldInclude) {
                files.push(full);
            }
        }
    }
    return files;
}
/**
 *
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal, by default only .ts and .tsx files are considered
 */
function averageLinesPerFunction(dir, options) {
    const { traverseExtensions } = options;
    const allFiles = walk(dir, traverseExtensions);
    const lengths = allFiles.flatMap(getFunctionLines);
    const avg = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
    console.log(`Average lines per function/method: ${avg.toFixed(2)} (${lengths.length} total)`);
}
