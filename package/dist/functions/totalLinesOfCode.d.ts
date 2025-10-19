/**
 * Counts the total lines of code in a file
 * @param filePath - Path to the file to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count (default: true)
 * @param excludeComments - Whether to exclude comment-only lines from count (default: true)
 * @returns Number of lines of code
 */
export declare function getTotalLinesOfCode(filePath: string, excludeEmptyLines?: boolean, excludeComments?: boolean): number;
/**
 * Gets total lines of code for multiple files
 * @param filePaths - Array of file paths to analyze
 * @param excludeEmptyLines - Whether to exclude empty lines from count
 * @param excludeComments - Whether to exclude comment-only lines from count
 * @returns Object with individual file counts and total
 */
export declare function getTotalLinesOfCodeMultiple(filePaths: string[], excludeEmptyLines?: boolean, excludeComments?: boolean): {
    files: Record<string, number>;
    total: number;
};
//# sourceMappingURL=totalLinesOfCode.d.ts.map