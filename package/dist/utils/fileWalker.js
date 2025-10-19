"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = walk;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Recursively walks through a directory and returns all files matching the specified extensions
 * @param dir - Directory to start traversal from
 * @param traverseExtensions - Extensions to include in the search
 * @returns Array of file paths
 */
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
//# sourceMappingURL=fileWalker.js.map