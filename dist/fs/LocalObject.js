"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalObject = void 0;
const SyncObject_1 = require("./SyncObject");
class LocalObject extends SyncObject_1.SyncObject {
    path;
    constructor(options) {
        super(options);
        this.path = options.path;
    }
}
exports.LocalObject = LocalObject;
//# sourceMappingURL=LocalObject.js.map