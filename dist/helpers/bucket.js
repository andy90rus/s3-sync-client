"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrefix = void 0;
function parsePrefix(bucketPrefix) {
    const [bucket, ...prefixTokens] = bucketPrefix.split('/');
    const prefix = prefixTokens.join('/');
    return { bucket, prefix };
}
exports.parsePrefix = parsePrefix;
//# sourceMappingURL=bucket.js.map