"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLocalObjectsCommand = void 0;
const async_1 = require("../helpers/async");
const constants_1 = require("./constants");
const UploadLocalObjectCommand_1 = require("./UploadLocalObjectCommand");
const CreateMultipartLocalObjectUploadCommand_1 = require("./CreateMultipartLocalObjectUploadCommand");
const UploadLocalObjectPartCommand_1 = require("./UploadLocalObjectPartCommand");
const CompleteMultipartLocalObjectCommand_1 = require("./CompleteMultipartLocalObjectCommand");
class UploadLocalObjectsCommand {
    localObjects;
    bucket;
    abortSignal;
    commandInput;
    monitor;
    maxConcurrentTransfers;
    partSize;
    constructor(input) {
        this.localObjects = input.localObjects;
        this.bucket = input.bucket;
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
        this.maxConcurrentTransfers =
            input.maxConcurrentTransfers ?? constants_1.DEFAULT_MAX_CONCURRENT_TRANSFERS;
        this.partSize = input.partSize ?? constants_1.DEFAULT_PART_SIZE;
    }
    async execute(client) {
        if (this.monitor) {
            const totalDataSize = this.localObjects.reduce((total, localObject) => total + localObject.size, 0);
            this.monitor.emit('metadata', totalDataSize, this.localObjects.length);
        }
        const uploadOps = [];
        this.localObjects.forEach((localObject) => {
            if (localObject.size > this.partSize) {
                uploadOps.push(...this.deferMultipartUpload(client, localObject));
            }
            else {
                uploadOps.push(this.deferDirectUpload(client, localObject));
            }
        });
        await (0, async_1.asyncMap)(uploadOps, this.maxConcurrentTransfers, async (uploadOp) => uploadOp());
    }
    deferDirectUpload(client, localObject) {
        return async () => {
            const command = new UploadLocalObjectCommand_1.UploadLocalObjectCommand({
                localObject,
                bucket: this.bucket,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
            });
            await command.execute(client);
        };
    }
    deferMultipartUpload(client, localObject) {
        const deferredCommands = [];
        const createMultipartUploadCommand = new Promise((resolve) => {
            deferredCommands.push(async () => {
                const command = new CreateMultipartLocalObjectUploadCommand_1.CreateMultipartLocalObjectUploadCommand({
                    localObject,
                    bucket: this.bucket,
                    commandInput: this.commandInput,
                });
                resolve(command.execute(client));
            });
        });
        const partOffsets = [];
        for (let i = 0; i < localObject.size; i += this.partSize) {
            partOffsets.push({
                start: i,
                end: Math.min(i + this.partSize - 1, localObject.size - 1),
            });
        }
        const uploadPartCommands = Promise.all(partOffsets.map((partOffset, index) => new Promise((resolve) => {
            deferredCommands.push(async () => {
                const command = new UploadLocalObjectPartCommand_1.UploadLocalObjectPartCommand({
                    localObject,
                    startOffset: partOffset.start,
                    endOffset: partOffset.end,
                    partNumber: index + 1,
                    uploadId: await createMultipartUploadCommand,
                    bucket: this.bucket,
                    abortSignal: this.abortSignal,
                    monitor: this.monitor,
                });
                resolve(command.execute(client));
            });
        })));
        deferredCommands.push(async () => {
            const command = new CompleteMultipartLocalObjectCommand_1.CompleteMultipartLocalObjectCommand({
                localObject,
                bucket: this.bucket,
                uploadId: await createMultipartUploadCommand,
                parts: await uploadPartCommands,
            });
            await command.execute(client);
        });
        return deferredCommands;
    }
}
exports.UploadLocalObjectsCommand = UploadLocalObjectsCommand;
//# sourceMappingURL=UploadLocalObjectsCommand.js.map