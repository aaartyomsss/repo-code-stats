export type TraverseExtensions = {
    ts: boolean;
    tsx: boolean;
    js: boolean;
    jsx: boolean;
};
/**
 * Recursively walks through a directory and returns all files matching the specified extensions
 * @param dir - Directory to start traversal from
 * @param traverseExtensions - Extensions to include in the search
 * @returns Array of file paths
 */
export declare function walk(dir: string, traverseExtensions?: TraverseExtensions): string[];
//# sourceMappingURL=fileWalker.d.ts.map