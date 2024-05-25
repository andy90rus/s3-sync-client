"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyBucketObjectCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const Command_1 = require("./Command");
class CopyBucketObjectCommand {
    bucketObject;
    targetBucket;
    abortSignal;
    commandInput;
    monitor;
    constructor(input) {
        this.bucketObject = input.bucketObject;
        this.targetBucket = input.targetBucket;
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
    }
    async execute(client) {
        const commandInput = (0, Command_1.mergeInput)({
            Bucket: this.targetBucket,
            Key: this.bucketObject.id,
            CopySource: encodeURI(`${this.bucketObject.bucket}/${this.bucketObject.key}`),
        }, this.commandInput);
        await client.send(new client_s3_1.CopyObjectCommand(commandInput), {
            abortSignal: this.abortSignal,
        });
        if (this.monitor) {
            this.monitor.emit('size', this.bucketObject.size);
            this.monitor.emit('object');
        }
    }
}
exports.CopyBucketObjectCommand = CopyBucketObjectCommand;
//# sourceMappingURL=CopyBucketObjectCommand.js.map