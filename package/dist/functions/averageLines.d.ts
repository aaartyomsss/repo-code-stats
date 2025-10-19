import { TraverseExtensions } from "../utils/fileWalker";
type Options = {
    traverseExtensions?: TraverseExtensions;
};
/**
 * Calculates the average lines per function in a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal, by default only .ts and .tsx files are considered
 */
export declare function averageLinesPerFunction(dir: string, options?: Options): number;
/**
 * Gets detailed function statistics for a directory
 * @param dir - Starting directory of traversal
 * @param options - Options for traversal
 * @returns Object with detailed statistics
 */
export declare function getFunctionStatistics(dir: string, options?: Options): {
    average: number;
    total: number;
    min: number;
    max: number;
    functions: number[];
};
export {};
//# sourceMappingURL=averageLines.d.ts.map