"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = exports.getTotalLinesOfCodeMultiple = exports.getTotalLinesOfCode = exports.getFunctionStatistics = exports.averageLinesPerFunction = void 0;
// Main entry point for repo-code-stats package
var averageLines_1 = require("./functions/averageLines");
Object.defineProperty(exports, "averageLinesPerFunction", { enumerable: true, get: function () { return averageLines_1.averageLinesPerFunction; } });
Object.defineProperty(exports, "getFunctionStatistics", { enumerable: true, get: function () { return averageLines_1.getFunctionStatistics; } });
var totalLinesOfCode_1 = require("./functions/totalLinesOfCode");
Object.defineProperty(exports, "getTotalLinesOfCode", { enumerable: true, get: function () { return totalLinesOfCode_1.getTotalLinesOfCode; } });
Object.defineProperty(exports, "getTotalLinesOfCodeMultiple", { enumerable: true, get: function () { return totalLinesOfCode_1.getTotalLinesOfCodeMultiple; } });
var fileWalker_1 = require("./utils/fileWalker");
Object.defineProperty(exports, "walk", { enumerable: true, get: function () { return fileWalker_1.walk; } });
//# sourceMappingURL=index.js.map