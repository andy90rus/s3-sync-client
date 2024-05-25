"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMonitor = void 0;
const node_events_1 = require("node:events");
class TransferMonitor extends node_events_1.EventEmitter {
    transferredObjectCount = 0;
    totalObjectCount = 0;
    transferredDataSize = 0;
    totalDataSize = 0;
    constructor() {
        super();
        this.on('metadata', this.setMetadata.bind(this));
        this.on('size', this.updateDataSize.bind(this));
        this.on('object', this.updateObjectCount.bind(this));
    }
    setMetadata(totalDataSize, totalObjectCount) {
        this.totalDataSize = totalDataSize;
        this.totalObjectCount = totalObjectCount;
    }
    updateDataSize(size) {
        this.transferredDataSize += size;
        this.emit('progress', this.getStatus());
    }
    updateObjectCount(count = 1) {
        this.transferredObjectCount += count;
        this.emit('progress', this.getStatus());
    }
    getStatus() {
        return {
            size: {
                current: this.transferredDataSize,
                total: this.totalDataSize,
            },
            count: {
                current: this.transferredObjectCount,
                total: this.totalObjectCount,
            },
        };
    }
}
exports.TransferMonitor = TransferMonitor;
exports.default = TransferMonitor;
//# sourceMappingURL=TransferMonitor.js.map