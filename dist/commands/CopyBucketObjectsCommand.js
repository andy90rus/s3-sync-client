"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyBucketObjectsCommand = void 0;
const async_1 = require("../helpers/async");
const constants_1 = require("./constants");
const CopyBucketObjectCommand_1 = require("./CopyBucketObjectCommand");
class CopyBucketObjectsCommand {
    bucketObjects;
    targetBucket;
    abortSignal;
    commandInput;
    monitor;
    maxConcurrentTransfers;
    constructor(input) {
        this.bucketObjects = input.bucketObjects;
        this.targetBucket = input.targetBucket;
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
        this.maxConcurrentTransfers =
            input.maxConcurrentTransfers ?? constants_1.DEFAULT_MAX_CONCURRENT_TRANSFERS;
    }
    async execute(client) {
        if (this.monitor) {
            const totalDataSize = this.bucketObjects.reduce((total, bucketObject) => total + bucketObject.size, 0);
            this.monitor.emit('metadata', totalDataSize, this.bucketObjects.length);
        }
        await (0, async_1.asyncMap)(this.bucketObjects, this.maxConcurrentTransfers, async (bucketObject) => {
            const command = new CopyBucketObjectCommand_1.CopyBucketObjectCommand({
                bucketObject,
                targetBucket: this.targetBucket,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
            });
            await command.execute(client);
        });
    }
}
exports.CopyBucketObjectsCommand = CopyBucketObjectsCommand;
//# sourceMappingURL=CopyBucketObjectsCommand.js.map