"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketObject = void 0;
const SyncObject_1 = require("./SyncObject");
class BucketObject extends SyncObject_1.SyncObject {
    bucket;
    key;
    constructor(options) {
        super(options);
        this.bucket = options.bucket;
        this.key = options.key;
    }
}
exports.BucketObject = BucketObject;
//# sourceMappingURL=BucketObject.js.map