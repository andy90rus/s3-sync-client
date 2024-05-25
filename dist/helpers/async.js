"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMap = void 0;
async function asyncMap(iterable, limit, asyncFn) {
    const results = [];
    let currentIndex = limit;
    await Promise.all(iterable.slice(0, limit).map(async (item, i) => {
        results[i] = await asyncFn(item, i);
        while (currentIndex < iterable.length) {
            currentIndex += 1;
            results[currentIndex - 1] = await asyncFn(iterable[currentIndex - 1], currentIndex - 1);
        }
    }));
    return results;
}
exports.asyncMap = asyncMap;
//# sourceMappingURL=async.js.map