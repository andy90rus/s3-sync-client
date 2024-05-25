"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadBucketObjectsCommand = void 0;
const async_1 = require("../helpers/async");
const constants_1 = require("./constants");
const DownloadBucketObjectCommand_1 = require("./DownloadBucketObjectCommand");
class DownloadBucketObjectsCommand {
    bucketObjects;
    localDir;
    abortSignal;
    commandInput;
    monitor;
    maxConcurrentTransfers;
    constructor(input) {
        this.bucketObjects = input.bucketObjects;
        this.localDir = input.localDir;
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
            const command = new DownloadBucketObjectCommand_1.DownloadBucketObjectCommand({
                bucketObject,
                localDir: this.localDir,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
            });
            await command.execute(client);
        });
    }
}
exports.DownloadBucketObjectsCommand = DownloadBucketObjectsCommand;
//# sourceMappingURL=DownloadBucketObjectsCommand.js.map