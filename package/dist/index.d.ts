export { averageLinesPerFunction, getFunctionStatistics, } from "./functions/averageLines";
export { getTotalLinesOfCode, getTotalLinesOfCodeMultiple, } from "./functions/totalLinesOfCode";
export { walk, type TraverseExtensions } from "./utils/fileWalker";
export type Options = {
    traverseExtensions?: {
        ts: boolean;
        tsx: boolean;
        js: boolean;
        jsx: boolean;
    };
};
//# sourceMappingURL=index.d.ts.map